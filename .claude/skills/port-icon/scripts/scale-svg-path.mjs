#!/usr/bin/env node

/**
 * Scale SVG path data by a numeric factor.
 *
 * Usage:
 *   node scripts/scale-svg-path.mjs <path-d> <factor>
 *   node scripts/scale-svg-path.mjs <path-d> <from> <to>
 *
 * Examples:
 *   node scripts/scale-svg-path.mjs "M16,2c7,0,14,6,14,14Z" 0.625
 *   node scripts/scale-svg-path.mjs "M16,2c7,0,14,6,14,14Z" 32 20
 *
 * Arc commands (A/a) are handled correctly — only radii and endpoint
 * coordinates are scaled; flags and rotation are preserved.
 */

const COMMANDS = new Set("MmLlHhVvCcSsQqTtAaZz".split(""))

function tokenize(d) {
  const tokens = []
  let i = 0

  while (i < d.length) {
    const ch = d[i]

    if (ch === " " || ch === ",") {
      i++
      continue
    }

    if (COMMANDS.has(ch)) {
      tokens.push(ch)
      i++
      continue
    }

    // parse a number (handles optional leading minus, decimals, and 1e-3 notation)
    let start = i
    if (d[i] === "-" || d[i] === "+") i++
    let hasDot = false
    while (i < d.length) {
      if (d[i] >= "0" && d[i] <= "9") {
        i++
        continue
      }
      if (d[i] === "." && !hasDot) {
        hasDot = true
        i++
        continue
      }
      break
    }
    if (i < d.length && (d[i] === "e" || d[i] === "E")) {
      i++
      if (i < d.length && (d[i] === "-" || d[i] === "+")) i++
      while (i < d.length && d[i] >= "0" && d[i] <= "9") i++
    }

    if (i === start) {
      i++
      continue
    }

    tokens.push(parseFloat(d.slice(start, i)))
  }

  return tokens
}

// How many numeric args each command consumes per "repeat group"
// and which indices within that group are scalable.
// For arcs: 7 args — scale indices 0,1,5,6 (rx, ry, x, y); skip 2,3,4 (rotation, flags)
const CMD_META = {
  M: { count: 2, scale: [0, 1] },
  m: { count: 2, scale: [0, 1] },
  L: { count: 2, scale: [0, 1] },
  l: { count: 2, scale: [0, 1] },
  H: { count: 1, scale: [0] },
  h: { count: 1, scale: [0] },
  V: { count: 1, scale: [0] },
  v: { count: 1, scale: [0] },
  C: { count: 6, scale: [0, 1, 2, 3, 4, 5] },
  c: { count: 6, scale: [0, 1, 2, 3, 4, 5] },
  S: { count: 4, scale: [0, 1, 2, 3] },
  s: { count: 4, scale: [0, 1, 2, 3] },
  Q: { count: 4, scale: [0, 1, 2, 3] },
  q: { count: 4, scale: [0, 1, 2, 3] },
  T: { count: 2, scale: [0, 1] },
  t: { count: 2, scale: [0, 1] },
  A: { count: 7, scale: [0, 1, 5, 6] },
  a: { count: 7, scale: [0, 1, 5, 6] },
  Z: { count: 0, scale: [] },
  z: { count: 0, scale: [] },
}

function round(n) {
  return parseFloat(n.toFixed(2))
}

function formatNum(n) {
  return parseFloat(n.toFixed(2)).toString()
}

function scalePath(d, factor) {
  const tokens = tokenize(d)
  let out = ""
  let i = 0
  let lastWasNumber = false

  function appendNum(n) {
    const s = formatNum(n)
    // need separator if previous token was also a number
    // a leading minus acts as implicit separator
    if (lastWasNumber && !s.startsWith("-")) {
      out += ","
    }
    out += s
    lastWasNumber = true
  }

  while (i < tokens.length) {
    const token = tokens[i]

    if (typeof token === "string") {
      const cmd = token
      const meta = CMD_META[cmd]
      out += cmd
      lastWasNumber = false
      i++

      if (!meta || meta.count === 0) continue

      while (i < tokens.length && typeof tokens[i] === "number") {
        const group = tokens.slice(i, i + meta.count)
        if (group.length < meta.count) break

        for (let j = 0; j < group.length; j++) {
          const val = meta.scale.includes(j) ? round(group[j] * factor) : group[j]
          appendNum(val)
        }
        i += meta.count
      }
    } else {
      appendNum(round(token * factor))
      i++
    }
  }

  return out
}

// ── CLI ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)

if (args.length < 2 || args.length > 3) {
  console.error("Usage: scale-svg-path.mjs <path-d> <factor>")
  console.error("       scale-svg-path.mjs <path-d> <from-size> <to-size>")
  process.exit(1)
}

const pathD = args[0]
const factor = args.length === 3 ? Number(args[2]) / Number(args[1]) : Number(args[1])

if (Number.isNaN(factor) || factor === 0) {
  console.error("Error: invalid scale factor")
  process.exit(1)
}

console.log(scalePath(pathD, factor))
