#!/usr/bin/env node
/**
 * Traduz markdown EN→PT por parágrafos (blocos separados por linha em branco).
 * Preserva: cercas ```...```, linhas de links de referência [n]: http...
 */
import fs from "fs";
import https from "https";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function translateChunk(text) {
  const q = text.slice(0, 4500);
  const u = new URL("https://translate.googleapis.com/translate_a/single");
  u.searchParams.set("client", "gtx");
  u.searchParams.set("sl", "en");
  u.searchParams.set("tl", "pt");
  u.searchParams.set("dt", "t");
  u.searchParams.set("q", q);

  return new Promise((resolve, reject) => {
    https
      .get(u.toString(), (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          try {
            const j = JSON.parse(d);
            resolve(j[0].map((x) => x[0]).join(""));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

async function main() {
  const [, , inp, out] = process.argv;
  if (!inp || !out) {
    console.error("Uso: node translate-md-chunks.mjs <entrada> <saida>");
    process.exit(1);
  }
  const raw = fs.readFileSync(inp, "utf8");
  const outParts = [];
  let i = 0;
  const lines = raw.split("\n");
  let inFence = false;

  while (i < lines.length) {
    const line = lines[i];
    const trim = line.trim();

    if (trim.startsWith("```")) {
      inFence = !inFence;
      outParts.push(line);
      i++;
      continue;
    }
    if (inFence) {
      outParts.push(line);
      i++;
      continue;
    }

    if (trim === "" || /^\[[\d]+\]:/.test(trim)) {
      outParts.push(line);
      i++;
      continue;
    }

    const block = [];
    while (i < lines.length) {
      const L = lines[i];
      const T = L.trim();
      if (T.startsWith("```")) {
        break;
      }
      if (T === "" && block.length > 0) {
        block.push(L);
        i++;
        break;
      }
      if (/^\[[\d]+\]:/.test(T)) {
        break;
      }
      block.push(L);
      i++;
      if (block.join("\n").length > 3800) {
        break;
      }
    }

    const text = block.join("\n");
    const ttrim = text.trim();
    if (!ttrim) {
      continue;
    }

    process.stderr.write(`[${outParts.length}] ${ttrim.slice(0, 70).replace(/\n/g, " ")}…\n`);
    let pt;
    try {
      pt = await translateChunk(ttrim);
    } catch {
      pt = ttrim;
    }
    outParts.push(pt);
    await sleep(100);
  }

  fs.writeFileSync(out, outParts.join("\n"), "utf8");
  console.error("Escrito:", out);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
