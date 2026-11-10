import { str } from "./utils";

export class ListNode<T> {
  constructor(public value: T, public next: ListNode<T> | null = null) {}
}

/** Singly linked list with head and tail pointers. */
export class LinkedList<T> implements Iterable<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private count = 0;

  static from<T>(values: Iterable<T>): LinkedList<T> {
    const l = new LinkedList<T>();
    for (const v of values) l.append(v);
    return l;
  }

  get size(): number { return this.count; }
  isEmpty(): boolean { return this.count === 0; }

  /** O(1) */
  append(value: T): this {
    const node = new ListNode(value);
    if (this.tail) this.tail.next = node; else this.head = node;
    this.tail = node;
    this.count++;
    return this;
  }

  /** O(1) */
  prepend(value: T): this {
    const node = new ListNode(value, this.head);
    this.head = node;
    if (!this.tail) this.tail = node;
    this.count++;
    return this;
  }

  /** Insert so the new value ends up at `index`. O(n) */
  insertAt(index: number, value: T): this {
    if (index < 0 || index > this.count) throw new RangeError(`Index ${index} out of bounds`);
    if (index === 0) return this.prepend(value);
    if (index === this.count) return this.append(value);
    const prev = this.nodeAt(index - 1)!;
    prev.next = new ListNode(value, prev.next);
    this.count++;
    return this;
  }

  get(index: number): T | undefined {
    return this.nodeAt(index)?.value;
  }

  indexOf(value: T): number {
    let i = 0;
    for (const v of this) { if (v === value) return i; i++; }
    return -1;
  }

  contains(value: T): boolean { return this.indexOf(value) !== -1; }

  /** Removes and returns the value at `index`, or undefined if out of range. */
  removeAt(index: number): T | undefined {
    if (index < 0 || index >= this.count) return undefined;
    let removed: ListNode<T>;
    if (index === 0) {
      removed = this.head!;
      this.head = removed.next;
      if (!this.head) this.tail = null;
    } else {
      const prev = this.nodeAt(index - 1)!;
      removed = prev.next!;
      prev.next = removed.next;
      if (removed === this.tail) this.tail = prev;
    }
    this.count--;
    return removed.value;
  }

  /** Removes the first occurrence. Returns true if something was removed. */
  remove(value: T): boolean {
    const i = this.indexOf(value);
    if (i === -1) return false;
    this.removeAt(i);
    return true;
  }

  /** Reverses in place. O(n) */
  reverse(): this {
    let prev: ListNode<T> | null = null;
    let cur = this.head;
    this.tail = this.head;
    while (cur) {
      const next: ListNode<T> | null = cur.next;
      cur.next = prev;
      prev = cur;
      cur = next;
    }
    this.head = prev;
    return this;
  }

  clear(): void { this.head = this.tail = null; this.count = 0; }
  toArray(): T[] { return [...this]; }

  *[Symbol.iterator](): Iterator<T> {
    for (let n = this.head; n; n = n.next) yield n.value;
  }

  toString(): string {
    if (this.isEmpty()) return "HEAD → null";
    const cells = this.toArray().map((v) => ` ${str(v)} `);
    const prefix = "HEAD → ";
    const pad = " ".repeat(prefix.length);
    const box = (l: string, r: string): string =>
      cells.map((c) => l + "─".repeat(c.length) + r).join("   ");
    return [
      pad + box("┌", "┐"),
      prefix + cells.map((c) => `│${c}│`).join(" → ") + " → null",
      pad + box("└", "┘"),
    ].join("\n");
  }

  print(): void { console.log(this.toString()); }

  private nodeAt(index: number): ListNode<T> | null {
    if (index < 0 || index >= this.count) return null;
    let n = this.head!;
    for (let i = 0; i < index; i++) n = n.next!;
    return n;
  }
}
