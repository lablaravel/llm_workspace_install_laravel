#!/usr/bin/env python3
"""Traduz markdown EN→PT por blocos separados por linha em branco. Só stdlib."""
from __future__ import annotations

import json
import re
import sys
import time
import urllib.parse
import urllib.request

SLEEP = 0.12


def translate_block(text: str) -> str:
    text = text.strip()
    if not text:
        return text
    params = urllib.parse.urlencode(
        {
            "client": "gtx",
            "sl": "en",
            "tl": "pt",
            "dt": "t",
            "q": text[:4500],
        }
    )
    url = "https://translate.googleapis.com/translate_a/single?" + params
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=90) as r:
        data = json.loads(r.read().decode())
    return "".join(part[0] for part in data[0])


def main() -> None:
    if len(sys.argv) != 3:
        print("Uso: python3 translate_md_pt.py <entrada.md> <saida.md>", file=sys.stderr)
        sys.exit(1)
    inp, outp = sys.argv[1], sys.argv[2]
    with open(inp, encoding="utf-8") as f:
        lines = f.read().splitlines()

    out: list[str] = []
    i = 0
    in_fence = False

    def flush_buf(buf: list[str]) -> None:
        if not buf:
            return
        chunk = "\n".join(buf).strip()
        if not chunk:
            buf.clear()
            return
        try:
            pt = translate_block(chunk)
            print(f"… {chunk[:55].replace(chr(10), ' ')}", file=sys.stderr)
        except Exception as e:
            print(f"ERRO {e}", file=sys.stderr)
            pt = chunk
        out.extend(pt.split("\n"))
        buf.clear()
        time.sleep(SLEEP)
        with open(outp, "w", encoding="utf-8") as wf:
            wf.write("\n".join(out))

    buf: list[str] = []

    while i < len(lines):
        line = lines[i]
        st = line.strip()

        if st.startswith("```"):
            flush_buf(buf)
            in_fence = not in_fence
            out.append(line)
            i += 1
            continue

        if in_fence:
            out.append(line)
            i += 1
            continue

        if re.match(r"^\[\d+\]:", st):
            flush_buf(buf)
            out.append(line)
            i += 1
            continue

        if st == "":
            flush_buf(buf)
            out.append("")
            i += 1
            continue

        buf.append(line)
        i += 1
        if sum(len(x) + 1 for x in buf) > 3800:
            flush_buf(buf)

    flush_buf(buf)

    with open(outp, "w", encoding="utf-8") as wf:
        wf.write("\n".join(out))
    print("Concluído:", outp, file=sys.stderr)


if __name__ == "__main__":
    main()
