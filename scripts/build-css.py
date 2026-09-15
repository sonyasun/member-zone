#!/usr/bin/env python3
"""
Split / rebuild site CSS.

Source of truth: css/src/*.css
Built artifact:  css/styles.css  (what HTML pages link)

Usage:
  python3 scripts/build-css.py              # concat css/src → css/styles.css
  python3 scripts/build-css.py --split      # one-time: split styles.css into css/src
  python3 scripts/build-css.py --check      # exit 1 if styles.css != rebuild
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS_DIR = ROOT / "css"
SRC_DIR = CSS_DIR / "src"
OUT_FILE = CSS_DIR / "styles.css"
CORE_OUT_FILE = CSS_DIR / "styles-core.css"
MANIFEST = SRC_DIR / "manifest.txt"
MANIFEST_CORE = SRC_DIR / "manifest-core.txt"
MANIFEST_PAGES = SRC_DIR / "manifest-pages.txt"

SECTION_RE = re.compile(r"^/\* (?:——|={3,})(.+?)(?:——|={3,}) \*/\s*$")


# Known section titles → stable English module names (used by --split)
SECTION_ALIASES: dict[str, str] = {
    "Reset": "reset",
    "Button Default / Hover / Active / Disabled（伪类，单 DOM）": "button",
    "Page shell": "page-shell",
    "Site header / nav": "site-header",
    "Hero": "hero",
    "Main layout": "main-layout",
    "Section heading": "section-heading",
    "Five-dimension method": "method",
    "Feature row": "feature-row",
    "Course grid（DSL 普通课程卡 285×312）": "course-grid",
    "Assess strip": "assess-strip",
    "Side widgets": "side-widgets",
    "Footer（公共模块DSL / 分类a1简 1920×188）": "footer",
    "Home page（首页 · 102577605）": "page-home",
    "Cert page（职业考证 · 849018753）": "page-cert",
    "Responsive": "responsive",
    "课程详情页（DSL：付费课程-课程详情）": "page-course",
    "确认订单页": "page-order",
    "课程包二级详情": "page-course-pack",
    "个人中心（MasterGo 161175161）": "page-profile",
    "领取优惠券页": "page-coupon",
    "专题课程列表页": "page-topic-list",
}


def slugify(title: str) -> str:
    title = title.strip(" -=—")
    if title in SECTION_ALIASES:
        return SECTION_ALIASES[title]
    # Prefer ASCII for new unknown sections
    ascii_only = re.sub(r"[^A-Za-z0-9]+", "-", title).strip("-").lower()
    if ascii_only:
        return ascii_only[:48]
    title = re.sub(r"\s+", "-", title)
    title = re.sub(r"[^\w\u4e00-\u9fff\-]+", "", title)
    return title[:48] or "section"


def split_styles() -> None:
    text = OUT_FILE.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    SRC_DIR.mkdir(parents=True, exist_ok=True)

    # Clear old src except keep dir
    for old in SRC_DIR.glob("*.css"):
        old.unlink()

    chunks: list[tuple[str, list[str]]] = []
    current_name = "00-tokens-and-base"
    current: list[str] = []

    for line in lines:
        m = SECTION_RE.match(line.rstrip("\n"))
        if m and current:
            chunks.append((current_name, current))
            current_name = f"{len(chunks):02d}-{slugify(m.group(1))}"
            current = [line]
        else:
            current.append(line)
    if current:
        chunks.append((current_name, current))

    manifest_names: list[str] = []
    for name, body in chunks:
        filename = f"{name}.css"
        # ensure unique
        i = 2
        while filename in manifest_names:
            filename = f"{name}-{i}.css"
            i += 1
        manifest_names.append(filename)
        (SRC_DIR / filename).write_text("".join(body), encoding="utf-8")

    MANIFEST.write_text("\n".join(manifest_names) + "\n", encoding="utf-8")
    print(f"split into {len(manifest_names)} files under css/src/")


def read_manifest(path: Path) -> list[str]:
    if not path.exists():
        return []
    return [n.strip() for n in path.read_text(encoding="utf-8").splitlines() if n.strip()]


def build_from_names(names: list[str], banner: str) -> str:
    parts: list[str] = [banner]
    for name in names:
        path = SRC_DIR / name
        if not path.exists():
            raise SystemExit(f"missing {path}")
        parts.append(f"\n/* >>> {name} */\n")
        parts.append(path.read_text(encoding="utf-8").rstrip() + "\n")
    return "".join(parts)


def build_styles() -> str:
    if not MANIFEST.exists():
        raise SystemExit("css/src/manifest.txt missing — run with --split first")
    names = read_manifest(MANIFEST)
    return build_from_names(
        names,
        "/* AUTO-GENERATED: edit css/src/* then run python3 scripts/build-css.py */\n",
    )


def build_core_styles() -> str:
    names = read_manifest(MANIFEST_CORE)
    if not names:
        raise SystemExit("css/src/manifest-core.txt missing or empty")
    return build_from_names(
        names,
        "/* AUTO-GENERATED core bundle: shared shell + components (no page-specific CSS) */\n",
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--split", action="store_true", help="Split css/styles.css into css/src")
    parser.add_argument("--check", action="store_true", help="Verify styles.css matches src rebuild")
    args = parser.parse_args()

    if args.split:
        split_styles()
        # also rebuild so styles.css gains banner comment consistency? Keep original bytes on first split.
        # Rebuild after split so pages get the generated banner — optional.
        built = build_styles()
        OUT_FILE.write_text(built, encoding="utf-8")
        print(f"wrote {OUT_FILE.relative_to(ROOT)}")
        return 0

    built = build_styles()
    if args.check:
        current = OUT_FILE.read_text(encoding="utf-8")
        if current != built:
            print("css/styles.css is out of date — run python3 scripts/build-css.py", file=sys.stderr)
            return 1
        if MANIFEST_CORE.exists():
            core_built = build_core_styles()
            if CORE_OUT_FILE.read_text(encoding="utf-8") != core_built:
                print("css/styles-core.css is out of date — run python3 scripts/build-css.py", file=sys.stderr)
                return 1
        print("css/styles.css is up to date")
        return 0

    OUT_FILE.write_text(built, encoding="utf-8")
    print(f"built {OUT_FILE.relative_to(ROOT)} ({len(built)} bytes)")
    if MANIFEST_CORE.exists():
        core_built = build_core_styles()
        CORE_OUT_FILE.write_text(core_built, encoding="utf-8")
        print(f"built {CORE_OUT_FILE.relative_to(ROOT)} ({len(core_built)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
