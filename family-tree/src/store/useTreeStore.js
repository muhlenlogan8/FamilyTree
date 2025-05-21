import { create } from 'zustand';

export const useTreeStore = create((set) => ({
    nodes: [],
    addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
    removeNode: (nodeId) => set((state) => ({ nodes: state.nodes.filter(node => node.id !== nodeId) })),
}));