import { Comparator, PrintOptions, defaultCompare, renderTree, str } from "./utils";

/**
 * Binary heap stored in an array. Root is the element that sorts FIRST
 * according to the comparator. Use MinHeap / MaxHeap for the common cases.
 */
export class Heap<T> {
  protected data: T[] = [];

  constructor(protected compare: Comparator<T> = defaultCompare) {}

  get size(): number { return this.data.length; }
  isEmpty(): boolean { return this.data.length === 0; }
  peek(): T | undefined { return this.data[0]; }
  clear(): void { this.data = []; }

  /** O(log n) */
  push(value: T): this {
    this.data.push(value);
    this.siftUp(this.data.length - 1);
    return this;
  }

  /** Removes and returns the root. O(log n) */
  pop(): T | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  /** Raw array layout (heap order, not sorted). */
  toArray(): T[] { return [...this.data]; }

  /** Pops everything in priority order without modifying this heap. */
  toSortedArray(): T[] {
    const copy = new Heap<T>(this.compare);
    copy.data = [...this.data];
    const out: T[] = [];
    while (!copy.isEmpty()) out.push(copy.pop()!);
    return out;
  }

  /** Draws the heap as a tree, plus its array layout underneath. */
  toString(options?: PrintOptions): string {
    if (this.data.length === 0) return "(empty)";
    // Represent each array index as a node so we can reuse the tree renderer.
    const tree = renderTree<number>(
      0,
      (i) => str(this.data[i]),
      (i) => (2 * i + 1 < this.data.length ? 2 * i + 1 : null),
      (i) => (2 * i + 2 < this.data.length ? 2 * i + 2 : null),
      options
    );
    return `${tree}\n\narray: [${this.data.map(str).join(", ")}]`;
  }

  print(options?: PrintOptions): void { console.log(this.toString(options)); }

  protected siftUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.compare(this.data[i], this.data[p]) >= 0) break;
      [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
      i = p;
    }
  }

  protected siftDown(i: number): void {
    const n = this.data.length;
    for (;;) {
      const l = 2 * i + 1, r = l + 1;
      let best = i;
      if (l < n && this.compare(this.data[l], this.data[best]) < 0) best = l;
      if (r < n && this.compare(this.data[r], this.data[best]) < 0) best = r;
      if (best === i) break;
      [this.data[i], this.data[best]] = [this.data[best], this.data[i]];
      i = best;
    }
  }
}

/** Smallest element at the top. */
export class MinHeap<T> extends Heap<T> {
  constructor(compare: Comparator<T> = defaultCompare) { super(compare); }

  static from<T>(values: Iterable<T>, compare?: Comparator<T>): MinHeap<T> {
    const h = new MinHeap<T>(compare);
    for (const v of values) h.push(v);
    return h;
  }
}

/** Largest element at the top. */
export class MaxHeap<T> extends Heap<T> {
  constructor(compare: Comparator<T> = defaultCompare) {
    super((a, b) => compare(b, a));
  }

  static from<T>(values: Iterable<T>, compare?: Comparator<T>): MaxHeap<T> {
    const h = new MaxHeap<T>(compare);
    for (const v of values) h.push(v);
    return h;
  }
}
