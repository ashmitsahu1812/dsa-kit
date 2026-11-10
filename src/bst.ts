import { Comparator, PrintOptions, defaultCompare, renderTree, str } from "./utils";
import { Queue } from "./queue";

export class TreeNode<T> {
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;
  constructor(public value: T) {}
}

/** Binary search tree. Duplicates are ignored. Not self-balancing. */
export class BinarySearchTree<T> implements Iterable<T> {
  private root: TreeNode<T> | null = null;
  private count = 0;

  constructor(private compare: Comparator<T> = defaultCompare) {}

  static from<T>(values: Iterable<T>, compare?: Comparator<T>): BinarySearchTree<T> {
    const t = new BinarySearchTree<T>(compare);
    for (const v of values) t.insert(v);
    return t;
  }

  get size(): number { return this.count; }
  isEmpty(): boolean { return this.count === 0; }

  /** Returns true if inserted, false if the value already existed. */
  insert(value: T): boolean {
    const node = new TreeNode(value);
    if (!this.root) { this.root = node; this.count++; return true; }
    let cur = this.root;
    for (;;) {
      const c = this.compare(value, cur.value);
      if (c === 0) return false;
      const side = c < 0 ? "left" : "right";
      if (!cur[side]) { cur[side] = node; this.count++; return true; }
      cur = cur[side]!;
    }
  }

  contains(value: T): boolean {
    let cur = this.root;
    while (cur) {
      const c = this.compare(value, cur.value);
      if (c === 0) return true;
      cur = c < 0 ? cur.left : cur.right;
    }
    return false;
  }

  min(): T | undefined {
    if (!this.root) return undefined;
    let cur = this.root;
    while (cur.left) cur = cur.left;
    return cur.value;
  }

  max(): T | undefined {
    if (!this.root) return undefined;
    let cur = this.root;
    while (cur.right) cur = cur.right;
    return cur.value;
  }

  /** Height in edges. Empty tree is -1, single node is 0. */
  height(): number {
    const h = (n: TreeNode<T> | null): number => (n ? 1 + Math.max(h(n.left), h(n.right)) : -1);
    return h(this.root);
  }

  /** Returns true if the value was found and removed. */
  remove(value: T): boolean {
    const before = this.count;
    this.root = this.removeNode(this.root, value);
    return this.count < before;
  }

  clear(): void { this.root = null; this.count = 0; }

  /** Sorted order (same as inorder). */
  toArray(): T[] { return this.inorder(); }

  /** Iterates in sorted order. */
  [Symbol.iterator](): Iterator<T> { return this.inorder()[Symbol.iterator](); }

  /** Left, Root, Right. For a BST this gives sorted order. */
  inorder(): T[] {
    const out: T[] = [];
    const go = (n: TreeNode<T> | null): void => { if (n) { go(n.left); out.push(n.value); go(n.right); } };
    go(this.root);
    return out;
  }

  /** Root, Left, Right */
  preorder(): T[] {
    const out: T[] = [];
    const go = (n: TreeNode<T> | null): void => { if (n) { out.push(n.value); go(n.left); go(n.right); } };
    go(this.root);
    return out;
  }

  /** Left, Right, Root */
  postorder(): T[] {
    const out: T[] = [];
    const go = (n: TreeNode<T> | null): void => { if (n) { go(n.left); go(n.right); out.push(n.value); } };
    go(this.root);
    return out;
  }

  /** Breadth-first, level by level. */
  levelOrder(): T[] {
    const out: T[] = [];
    if (!this.root) return out;
    const q = new Queue<TreeNode<T>>();
    q.enqueue(this.root);
    while (!q.isEmpty()) {
      const n = q.dequeue()!;
      out.push(n.value);
      if (n.left) q.enqueue(n.left);
      if (n.right) q.enqueue(n.right);
    }
    return out;
  }

  toString(options?: PrintOptions): string {
    return renderTree<TreeNode<T>>(this.root, (n) => str(n.value), (n) => n.left, (n) => n.right, options);
  }

  print(options?: PrintOptions): void { console.log(this.toString(options)); }

  private removeNode(node: TreeNode<T> | null, value: T): TreeNode<T> | null {
    if (!node) return null;
    const c = this.compare(value, node.value);
    if (c < 0) { node.left = this.removeNode(node.left, value); return node; }
    if (c > 0) { node.right = this.removeNode(node.right, value); return node; }
    this.count--;
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    // Two children: replace with in-order successor (smallest in right subtree)
    let succ = node.right;
    while (succ.left) succ = succ.left;
    node.value = succ.value;
    this.count++; // compensate: the recursive call below decrements again
    node.right = this.removeNode(node.right, succ.value);
    return node;
  }
}
