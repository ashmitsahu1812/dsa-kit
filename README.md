# @ashmit1812/dsa-kit

Typed, zero-dependency data structures for JavaScript and TypeScript, with **built-in terminal visualization**. Made for students learning DSA.

```bash
npm install @ashmit1812/dsa-kit
```

```ts
import { BinarySearchTree } from "@ashmit1812/dsa-kit";

const tree = BinarySearchTree.from([50, 30, 70, 20, 40, 60, 80]);
tree.print();
```

```
       50
   ┌────┴────┐
  30        70
 ┌─┴──┐    ┌─┴──┐
20   40   60   80
```

Big tree and the diagram gets too wide? Use the compact style:

```ts
tree.print({ style: "indent" });
```

```
50
├── L: 30
│   ├── L: 20
│   └── R: 40
└── R: 70
    ├── L: 60
    └── R: 80
```

## What's inside

| Structure | Highlights |
|---|---|
| `Stack<T>` | `push` `pop` `peek` (all O(1)) |
| `Queue<T>` | `enqueue` `dequeue` `peek` (all O(1)) |
| `LinkedList<T>` | `append` `prepend` `insertAt` `removeAt` `remove` `reverse` `indexOf` |
| `BinarySearchTree<T>` | `insert` `remove` `contains` `min` `max` `height`, plus `inorder` `preorder` `postorder` `levelOrder` |
| `MinHeap<T>` / `MaxHeap<T>` | `push` `pop` `peek` (O(log n)), `toSortedArray` |

Every structure has:
- `.print()` to draw it in the terminal, and `.toString()` to get the drawing as a string (trees and heaps also accept `{ style: "indent" }`)
- `.size`, `.isEmpty()`, `.clear()`, `.toArray()` (a BST returns sorted order, a heap returns its internal array layout)
- `Structure.from(iterable)` to build one from an array
- full TypeScript types, and `for...of` / spread support on Stack, Queue, LinkedList and BinarySearchTree (heaps use `toSortedArray()`)

## Examples

```ts
import { Stack, Queue, LinkedList, MinHeap } from "dsa-kit";

Stack.from([10, 20, 30]).print();
// ┌────┐
// │ 30 │ ← top
// ├────┤
// │ 20 │
// ├────┤
// │ 10 │
// └────┘

Queue.from([1, 2, 3]).print();
//         ┌───┬───┬───┐
// front → │ 1 │ 2 │ 3 │ ← rear
//         └───┴───┴───┘

LinkedList.from([1, 2, 3]).print();
//        ┌───┐   ┌───┐   ┌───┐
// HEAD → │ 1 │ → │ 2 │ → │ 3 │ → null
//        └───┘   └───┘   └───┘

MinHeap.from([5, 3, 8, 1, 9, 2]).print();
//      1
//   ┌──┴───┐
//   3      2
// ┌─┴─┐   ┌┘
// 5   9   8
//
// array: [1, 3, 2, 5, 9, 8]
```

### Custom ordering

Trees and heaps accept a comparator, just like `Array.sort`:

```ts
const heap = new MinHeap<{ name: string; priority: number }>((a, b) => a.priority - b.priority);
```

## Notes

- `BinarySearchTree` ignores duplicates and is not self-balancing, so inserting sorted data makes it a linked list. This is intentional: it's the textbook version.
- Empty `pop`/`dequeue`/`peek` return `undefined` instead of throwing.

## Contributing

Issues and PRs are welcome, especially new structures (Graph, Trie, AVL tree, Deque).

## License

MIT
