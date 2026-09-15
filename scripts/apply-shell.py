#!/usr/bin/env python3
"""
Sync shared shell partials into all HTML pages.

Source of truth:
  partials/site-header.html
  partials/site-footer.html
  partials/login-card-member.html
  partials/learn-task-reward-modal.html
  partials/learn-task-start-modal.html
  partials/course-reviews-panel.html
  partials/course-review-modal.html

Usage:
  python3 scripts/apply-shell.py
  python3 scripts/apply-shell.py --check
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PARTIALS = ROOT / "partials"

PAGE_NAV: dict[str, str | None] = {
    "index.html": "home",
    "talent-plan.html": "home",
    "cert.html": "cert",
    "member.html": "member",
    "topic-courses.html": "member",
    "cert-courses.html": "member",
    "camps.html": None,
    "profile.html": None,
    "course.html": None,
    "course-pack.html": None,
    "order.html": None,
    "order-pack.html": None,
    "coupon-claim.html": None,
    "ai-exam.html": "ai-exam",
    "competition-zone.html": "enterprise",
}

NAV_KEYS = (
    "home",
    "exam",
    "community",
    "cert",
    "member",
    "download",
    "eco",
    "enterprise",
    "ai-exam",
)

HEADER_RE = re.compile(r"<header class=\"site-header\">.*?</header>", re.S)
FOOTER_RE = re.compile(r"<footer class=\"site-footer\">.*?</footer>", re.S)
LOGIN_CARD_RE = re.compile(
    r"(?:<aside class=\"login-card login-card--(?:guest|member)\".*?</aside>\s*)+",
    re.S,
)
AUTH_GATE_RE = re.compile(
    r'\s*<script[^>]*\ssrc=["\']js/auth-gate\.js["\'][^>]*>\s*</script>', re.I
)
AUTH_MODAL_BLOCK_RE = re.compile(
    r'\n\s*<div class="auth-modal"[\s\S]*?(?=\n\s*<script src="js/site\.js")',
    re.I,
)
SITE_JS_TAG = '  <script src="js/site.js" defer></script>'
REWARD_MODAL_PAGES = frozenset({"profile.html", "member.html"})
REWARD_MODAL_RE = re.compile(
    r'\n    <div class="(?:learn-task-reward-modal|member-lt-reward-modal)"[\s\S]*?\n    </div>\n',
    re.S,
)
START_MODAL_RE = re.compile(
    r'\n    <div class="learn-task-start-modal"[\s\S]*?\n    </div>\n',
    re.S,
)
SITE_JS_RE = re.compile(
    r'\s*<script[^>]*\ssrc=["\']js/site\.js["\'][^>]*>\s*</script>', re.I
)
COURSE_REVIEW_PAGES = frozenset({"course.html", "course-pack.html"})
COURSE_REVIEWS_PANEL_RE = re.compile(
    r'<div class="course-reviews" data-course-reviews>[\s\S]*?'
    r'<p class="course-reviews__empty"[^>]*>暂无符合条件的评价</p>\s*</div>',
    re.S,
)
COURSE_REVIEW_MODAL_RE = re.compile(
    r'\n    <div class="course-review-modal" id="course-review-modal" hidden>[\s\S]*?\n    </div>\n',
    re.S,
)


def render_header(active: str | None) -> str:
    tpl = (PARTIALS / "site-header.html").read_text(encoding="utf-8")
    for key in NAV_KEYS:
        token = f"{{{{ACTIVE_{key}}}}}"
        tpl = tpl.replace(token, " is-active" if active == key else "")

    if active:
        pattern = (
            rf'(<a class="nav-list__link is-active" href="[^"]*" data-nav="{re.escape(active)}")'
        )
        tpl = re.sub(pattern, r'\1 aria-current="page"', tpl, count=1)

    return tpl.rstrip() + "\n"


def apply_learn_task_modals(text: str, page_name: str) -> str:
    if page_name not in REWARD_MODAL_PAGES:
        return text

    start_modal = (PARTIALS / "learn-task-start-modal.html").read_text(encoding="utf-8").rstrip()
    reward_modal = (PARTIALS / "learn-task-reward-modal.html").read_text(encoding="utf-8").rstrip()
    modals = f"\n{start_modal}\n\n{reward_modal}\n"
    text = START_MODAL_RE.sub("", text)
    text = REWARD_MODAL_RE.sub("", text)

    if page_name == "profile.html":
        anchor = '\n    <div class="invoice-modal"'
        if anchor not in text:
            print("skip profile.html: no invoice-modal anchor", file=sys.stderr)
            return text
        return text.replace(anchor, f"\n{modals}{anchor}", 1)

    anchor = "  </div>\n  <script>"
    if anchor not in text:
        print("skip member.html: no page-close anchor", file=sys.stderr)
        return text
    return text.replace(anchor, f"\n{modals}  </div>\n  <script>", 1)


def apply_reward_modal(text: str, page_name: str) -> str:
    return apply_learn_task_modals(text, page_name)


def apply_course_reviews(text: str, page_name: str) -> str:
    if page_name not in COURSE_REVIEW_PAGES:
        return text

    panel = (PARTIALS / "course-reviews-panel.html").read_text(encoding="utf-8").rstrip()
    modal = (PARTIALS / "course-review-modal.html").read_text(encoding="utf-8").rstrip()

    if not COURSE_REVIEWS_PANEL_RE.search(text):
        print(f"skip {page_name}: no course-reviews panel", file=sys.stderr)
    else:
        text = COURSE_REVIEWS_PANEL_RE.sub(panel, text, count=1)

    if not COURSE_REVIEW_MODAL_RE.search(text):
        print(f"skip {page_name}: no course-review modal", file=sys.stderr)
    else:
        text = COURSE_REVIEW_MODAL_RE.sub(f"\n{modal}\n", text, count=1)

    return text


def strip_auth_artifacts(text: str) -> str:
    text = AUTH_GATE_RE.sub("", text)
    text = AUTH_MODAL_BLOCK_RE.sub("\n", text)
    return text


def apply_page(path: Path, check_only: bool = False) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text
    active = PAGE_NAV.get(path.name)

    header = render_header(active)
    footer = (PARTIALS / "site-footer.html").read_text(encoding="utf-8").rstrip() + "\n"
    login = (
        (PARTIALS / "login-card-member.html").read_text(encoding="utf-8").rstrip() + "\n"
    )

    if not HEADER_RE.search(text):
        print(f"skip {path.name}: no site-header", file=sys.stderr)
        return False
    if not FOOTER_RE.search(text):
        print(f"skip {path.name}: no site-footer", file=sys.stderr)
        return False

    text = HEADER_RE.sub(header.rstrip(), text, count=1)
    text = FOOTER_RE.sub(footer.rstrip(), text, count=1)

    if LOGIN_CARD_RE.search(text):
        text = LOGIN_CARD_RE.sub(login.rstrip(), text, count=1)

    text = strip_auth_artifacts(text)
    text = apply_reward_modal(text, path.name)
    text = apply_course_reviews(text, path.name)

    if SITE_JS_RE.search(text):
        text = SITE_JS_RE.sub(f"\n{SITE_JS_TAG}", text, count=1)
    elif "</body>" in text:
        text = text.replace("</body>", f"{SITE_JS_TAG}\n</body>", 1)

    if text != original:
        if check_only:
            print(f"drift: {path.name}")
            return True
        path.write_text(text, encoding="utf-8")
        print(f"updated: {path.name}")
        return True

    print(f"ok: {path.name}")
    return False


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="Check that HTML matches partials without writing",
    )
    args = parser.parse_args()

    required = (
        "site-header.html",
        "site-footer.html",
        "login-card-member.html",
        "learn-task-reward-modal.html",
        "learn-task-start-modal.html",
        "course-reviews-panel.html",
        "course-review-modal.html",
    )
    missing = [p for p in required if not (PARTIALS / p).exists()]
    if missing:
        print(f"missing partials: {missing}", file=sys.stderr)
        return 2

    changed = False
    for name in sorted(PAGE_NAV):
        path = ROOT / name
        if not path.exists():
            print(f"missing page: {name}", file=sys.stderr)
            continue
        if apply_page(path, check_only=args.check):
            changed = True

    if args.check and changed:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
