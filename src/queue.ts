import { LinkedList } from "./linked-list";
import { str } from "./utils";

/** FIFO queue backed by a linked list, so enqueue and dequeue are both O(1). */
export class Queue<T> implements Iterable<T> {
  private list = new LinkedList<T>();

  static from<T>(values: Iterable<T>): Queue<T> {
    const q = new Queue<T>();
    for (const v of values) q.enqueue(v);
    return q;
  }

  get size(): number { return this.list.size; }
  isEmpty(): boolean { return this.list.isEmpty(); }

  enqueue(value: T): this { this.list.append(value); return this; }
  dequeue(): T | undefined { return this.list.removeAt(0); }
  peek(): T | undefined { return this.list.get(0); }
  clear(): void { this.list.clear(); }
  toArray(): T[] { return this.list.toArray(); }

  [Symbol.iterator](): Iterator<T> { return this.list[Symbol.iterator](); }

  toString(): string {
    if (this.isEmpty()) return "(empty queue)";
    const cells = this.toArray().map((v) => ` ${str(v)} `);
    const row = (l: string, m: string, r: string): string =>
      l + cells.map((c) => "─".repeat(c.length)).join(m) + r;
    const prefix = "front → ";
    const pad = " ".repeat(prefix.length);
    return [
      pad + row("┌", "┬", "┐"),
      prefix + "│" + cells.join("│") + "│ ← rear",
      pad + row("└", "┴", "┘"),
    ].join("\n");
  }

  print(): void { console.log(this.toString()); }
}
