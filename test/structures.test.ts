import { test } from "node:test";
import assert from "node:assert/strict";
import { Stack, Queue, LinkedList, BinarySearchTree, MinHeap, MaxHeap } from "../src/index";

test("Stack: LIFO behaviour", () => {
  const s = Stack.from([1, 2, 3]);
  assert.equal(s.size, 3);
  assert.equal(s.peek(), 3);
  assert.equal(s.pop(), 3);
  assert.equal(s.pop(), 2);
  assert.deepEqual(s.toArray(), [1]);
  s.pop();
  assert.equal(s.pop(), undefined);
  assert.ok(s.isEmpty());
});

test("Stack: print output", () => {
  const s = Stack.from([10, 200]);
  assert.equal(s.toString(), ["┌─────┐", "│ 200 │ ← top", "├─────┤", "│ 10  │", "└─────┘"].join("\n"));
  assert.equal(new Stack().toString(), "(empty stack)");
});

test("Queue: FIFO behaviour", () => {
  const q = Queue.from(["a", "b", "c"]);
  assert.equal(q.dequeue(), "a");
  assert.equal(q.peek(), "b");
  q.enqueue("d");
  assert.deepEqual(q.toArray(), ["b", "c", "d"]);
  assert.equal(
    q.toString(),
    ["        ┌─────┬─────┬─────┐", 'front → │ "b" │ "c" │ "d" │ ← rear', "        └─────┴─────┴─────┘"].join("\n")
  );
  q.clear();
  assert.equal(q.dequeue(), undefined);
});

test("LinkedList: append, prepend, insertAt, get", () => {
  const l = new LinkedList<number>();
  l.append(2).append(3).prepend(1).insertAt(1, 99);
  assert.deepEqual(l.toArray(), [1, 99, 2, 3]);
  assert.equal(l.get(1), 99);
  assert.equal(l.get(10), undefined);
  assert.throws(() => l.insertAt(10, 5), RangeError);
});

test("LinkedList: remove and removeAt keep tail correct", () => {
  const l = LinkedList.from([1, 2, 3]);
  assert.equal(l.removeAt(2), 3);
  l.append(4);
  assert.deepEqual(l.toArray(), [1, 2, 4]);
  assert.ok(l.remove(1));
  assert.ok(!l.remove(42));
  assert.deepEqual(l.toArray(), [2, 4]);
  l.removeAt(0); l.removeAt(0);
  l.append(7);
  assert.deepEqual(l.toArray(), [7]);
});

test("LinkedList: reverse", () => {
  const l = LinkedList.from([1, 2, 3, 4]).reverse();
  assert.deepEqual(l.toArray(), [4, 3, 2, 1]);
  l.append(0);
  assert.deepEqual(l.toArray(), [4, 3, 2, 1, 0]);
  assert.equal(LinkedList.from([1, 22]).toString(), [
    "       ┌───┐   ┌────┐",
    "HEAD → │ 1 │ → │ 22 │ → null",
    "       └───┘   └────┘",
  ].join("\n"));
  assert.equal(new LinkedList().toString(), "HEAD → null");
});

const sample = () => BinarySearchTree.from([50, 30, 70, 20, 40, 60, 80]);

test("BST: traversals", () => {
  const t = sample();
  assert.deepEqual(t.inorder(), [20, 30, 40, 50, 60, 70, 80]);
  assert.deepEqual(t.preorder(), [50, 30, 20, 40, 70, 60, 80]);
  assert.deepEqual(t.postorder(), [20, 40, 30, 60, 80, 70, 50]);
  assert.deepEqual(t.levelOrder(), [50, 30, 70, 20, 40, 60, 80]);
});

test("BST: search, min, max, height, duplicates", () => {
  const t = sample();
  assert.ok(t.contains(60));
  assert.ok(!t.contains(65));
  assert.equal(t.min(), 20);
  assert.equal(t.max(), 80);
  assert.equal(t.height(), 2);
  assert.equal(t.insert(50), false);
  assert.equal(t.size, 7);
  assert.equal(new BinarySearchTree<number>().height(), -1);
});

test("BST: remove leaf, one child, two children, root", () => {
  const t = sample();
  assert.ok(t.remove(20));
  assert.ok(t.remove(30));
  assert.deepEqual(t.inorder(), [40, 50, 60, 70, 80]);
  assert.ok(t.remove(50));
  assert.deepEqual(t.inorder(), [40, 60, 70, 80]);
  assert.equal(t.size, 4);
  assert.ok(!t.remove(999));
  assert.equal(t.size, 4);
});

test("BST: print output", () => {
  const t = BinarySearchTree.from([50, 30, 70, 40]);
  assert.equal(t.toString(), ["   50", " ┌──┴──┐", "30    70", " └┐", " 40"].join("\n"));
  assert.equal(
    t.toString({ style: "indent" }),
    ["50", "├── L: 30", "│   └── R: 40", "└── R: 70"].join("\n")
  );
  assert.equal(new BinarySearchTree().toString(), "(empty)");
});

test("BST: custom comparator", () => {
  const t = new BinarySearchTree<{ id: number }>((a, b) => a.id - b.id);
  t.insert({ id: 2 }); t.insert({ id: 1 }); t.insert({ id: 3 });
  assert.deepEqual(t.inorder().map((x) => x.id), [1, 2, 3]);
});

test("MinHeap / MaxHeap ordering", () => {
  const min = MinHeap.from([5, 3, 8, 1, 9, 2]);
  assert.equal(min.peek(), 1);
  assert.deepEqual(min.toSortedArray(), [1, 2, 3, 5, 8, 9]);
  assert.equal(min.size, 6);

  const max = MaxHeap.from([5, 3, 8, 1, 9, 2]);
  assert.equal(max.pop(), 9);
  assert.equal(max.pop(), 8);
  assert.equal(max.peek(), 5);
});

test("Heap: random data pops in sorted order", () => {
  const data = Array.from({ length: 200 }, () => Math.floor(Math.random() * 1000));
  const h = MinHeap.from(data);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.pop()!);
  assert.deepEqual(out, [...data].sort((a, b) => a - b));
});

test("Heap: print and custom comparator", () => {
  const h = MinHeap.from([1, 2, 3]);
  assert.equal(h.toString(), ["  1", "┌─┴─┐", "2   3", "", "array: [1, 2, 3]"].join("\n"));
  assert.equal(new MinHeap().toString(), "(empty)");
  const byLen = new MinHeap<string>((a, b) => a.length - b.length);
  byLen.push("ccc").push("a").push("bb");
  assert.equal(byLen.pop(), "a");
  assert.equal(new MinHeap().pop(), undefined);
});

test("BST: toArray and iteration are sorted", () => {
  const t = BinarySearchTree.from([3, 1, 2]);
  assert.deepEqual(t.toArray(), [1, 2, 3]);
  assert.deepEqual([...t], [1, 2, 3]);
});

test("BST diagram: every level shows its values left-to-right, no stray characters", () => {
  for (let round = 0; round < 200; round++) {
    const vals = Array.from({ length: 1 + Math.floor(Math.random() * 30) }, () => Math.floor(Math.random() * 2000) - 500);
    const t = BinarySearchTree.from(vals);
    // reference: group values by depth, left to right
    type N = { v: number; l?: N; r?: N };
    let root: N | undefined;
    for (const v of vals) {
      if (!root) { root = { v }; continue; }
      let c = root;
      for (;;) {
        if (v === c.v) break;
        const k = v < c.v ? "l" : "r";
        if (!c[k]) { c[k] = { v }; break; }
        c = c[k]!;
      }
    }
    const levels: number[][] = [];
    const walk = (n: N | undefined, d: number) => { if (!n) return; (levels[d] ??= []).push(n.v); walk(n.l, d + 1); walk(n.r, d + 1); };
    walk(root, 0);
    const rows = t.toString().split("\n");
    levels.forEach((expected, d) => {
      assert.deepEqual(rows[d * 2].trim().split(/\s+/).map(Number), expected);
    });
    assert.equal(rows.length, levels.length * 2 - 1);
    assert.ok(rows.every((r) => r === r.trimEnd()));
  }
});
