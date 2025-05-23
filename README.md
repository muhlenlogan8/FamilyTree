# FamilyTree

Using react flow for tree stuff

Using zustand for state management (undo/redo ideally)

Using yjs & websockets for shared collaboration

Node generation computing logic ideas

maybe start at any node and try and go through entire line and set it to gen = 0 but keep storage of all preds and succ of that line then go to preds and do the same setting gen to -1 and keep doing this then do the same backwards setting gen to 1 for that first row of succ and so on. Then say we have gens -2, -1, 0, 1 we just add 2 to each so its 0, 1, 2, 3 so its normalized with 0 gen being highest row and 3 being lowest then make y coordinate based on this.

