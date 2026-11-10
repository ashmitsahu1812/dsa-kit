export type Comparator<T> = (a: T, b: T) => number;

export const defaultCompare = <T>(a: T, b: T): number =>
  a < b ? -1 : a > b ? 1 : 0;

export const str = (v: unknown): string =>
  typeof v === "string" ? JSON.stringify(v) : String(v);

/**
 * Renders any binary tree sideways-indented, e.g.
 *   50
 *   ├── L: 30
 *   │   └── R: 40
 *   └── R: 70
 */
export function renderBinaryTree<N>(
  root: N | null,
  label: (n: N) => string,
  left: (n: N) => N | null,
  right: (n: N) => N | null
): string {
  if (root === null) return "(empty)";
  const lines: string[] = [label(root)];
  const walk = (node: N, prefix: string): void => {
    const kids: Array<[string, N]> = [];
    const l = left(node);
    const r = right(node);
    if (l !== null) kids.push(["L", l]);
    if (r !== null) kids.push(["R", r]);
    kids.forEach(([side, child], i) => {
      const last = i === kids.length - 1;
      lines.push(`${prefix}${last ? "└── " : "├── "}${side}: ${label(child)}`);
      walk(child, prefix + (last ? "    " : "│   "));
    });
  };
  walk(root, "");
  return lines.join("\n");
}

export interface PrintOptions {
  /**
   * "tree"   (default) centered diagram with branch lines
   * "indent" compact sideways layout, better for large/deep trees
   */
  style?: "tree" | "indent";
}

interface Block { lines: string[]; width: number; root: number }

/**
 * Renders a binary tree as a centered diagram:
 *        50
 *    ┌────┴────┐
 *    30        70
 */
export function renderTreeDiagram<N>(
  root: N | null,
  label: (n: N) => string,
  left: (n: N) => N | null,
  right: (n: N) => N | null
): string {
  if (root === null) return "(empty)";

  const build = (node: N): Block => {
    const text = label(node);
    const half = Math.floor(text.length / 2);
    const l = left(node);
    const r = right(node);
    if (l === null && r === null) return { lines: [text], width: text.length, root: half };

    let body: string[];
    let bodyWidth: number;
    let connStart: number;
    let conn: string;
    let center: number;

    if (l !== null && r !== null) {
      const lb = build(l);
      const rb = build(r);
      const gap = 3;
      const off = lb.width + gap;
      const lroot = lb.root;
      const rroot = off + rb.root;
      const h = Math.max(lb.lines.length, rb.lines.length);
      body = [];
      for (let i = 0; i < h; i++) {
        body.push((lb.lines[i] ?? "").padEnd(lb.width) + " ".repeat(gap) + (rb.lines[i] ?? ""));
      }
      bodyWidth = off + rb.width;
      center = Math.floor((lroot + rroot) / 2);
      const chars = ("┌" + "─".repeat(rroot - lroot - 1) + "┐").split("");
      chars[center - lroot] = "┴";
      conn = chars.join("");
      connStart = lroot;
    } else if (l !== null) {
      const b = build(l);
      body = b.lines; bodyWidth = b.width;
      conn = "┌┘"; connStart = b.root; center = b.root + 1;
    } else {
      const b = build(r as N);
      body = b.lines; bodyWidth = b.width;
      conn = "└┐"; connStart = b.root - 1; center = b.root - 1;
    }

    // Shift right if the label or connector would start left of column 0.
    const start = center - half;
    const shift = Math.max(0, -Math.min(start, connStart));
    const pad = " ".repeat(shift);
    const labelRow = " ".repeat(start + shift) + text;
    const connRow = " ".repeat(connStart + shift) + conn;
    return {
      lines: [labelRow, connRow, ...body.map((ln) => pad + ln)],
      width: Math.max(bodyWidth + shift, start + shift + text.length),
      root: center + shift,
    };
  };

  return build(root).lines.map((ln) => ln.trimEnd()).join("\n");
}

export function renderTree<N>(
  root: N | null,
  label: (n: N) => string,
  left: (n: N) => N | null,
  right: (n: N) => N | null,
  options: PrintOptions = {}
): string {
  return options.style === "indent"
    ? renderBinaryTree(root, label, left, right)
    : renderTreeDiagram(root, label, left, right);
}
