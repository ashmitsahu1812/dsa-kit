import { str } from "./utils";

/** LIFO stack. push/pop/peek are all O(1). */
export class Stack<T> implements Iterable<T> {
  private items: T[] = [];

  static from<T>(values: Iterable<T>): Stack<T> {
    const s = new Stack<T>();
    for (const v of values) s.push(v);
    return s;
  }

  get size(): number { return this.items.length; }
  isEmpty(): boolean { return this.items.length === 0; }

  push(value: T): this { this.items.push(value); return this; }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
  clear(): void { this.items = []; }

  /** Bottom to top. */
  toArray(): T[] { return [...this.items]; }

  /** Iterates from top to bottom (pop order). */
  *[Symbol.iterator](): Iterator<T> {
    for (let i = this.items.length - 1; i >= 0; i--) yield this.items[i];
  }

  toString(): string {
    if (this.isEmpty()) return "(empty stack)";
    const cells = [...this].map(str);
    const w = Math.max(...cells.map((c) => c.length)) + 2;
    const center = (c: string): string => {
      const pad = w - c.length;
      const l = Math.floor(pad / 2);
      return " ".repeat(l) + c + " ".repeat(pad - l);
    };
    const bar = "─".repeat(w);
    const lines = [`┌${bar}┐`];
    cells.forEach((c, i) => {
      lines.push(`│${center(c)}│${i === 0 ? " ← top" : ""}`);
      lines.push(i === cells.length - 1 ? `└${bar}┘` : `├${bar}┤`);
    });
    return lines.join("\n");
  }

  print(): void { console.log(this.toString()); }
}
