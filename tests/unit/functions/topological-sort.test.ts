import { it, expect, describe } from 'vitest';
import type { Connection, Node } from '@/generated/prisma/client';
import { topologicalSort } from '@/inngest/utils';

const createNode = (id: string): Node => {
    return {
        id,
    } as Node
};

const createConnection = (fromNodeId: string, toNodeId: string): Connection =>{
    return {
        fromNodeId,
        toNodeId,
    } as Connection;
};

describe("topologicalSort", () => {

    it("returns all nodes where there's no connections", () => {
        const nodes = [
            createNode("A"),
            createNode("B"),
            createNode("C")
        ]

        const result = topologicalSort(nodes, []);

        expect(result.map((node) => node.id)).toEqual(["A", "B", "C"])
    });

    it("returns nodes in dependency order", () => {
        const nodes = [
            createNode("C"),
            createNode("A"),
            createNode("B")
        ];

        const connections = [
            createConnection("A", "B"),
            createConnection("B", "C")
        ];

        const result = topologicalSort(nodes, connections);

        expect(result.map((node) => node.id)).toEqual(["A", "B", "C"])
    });

    it("places a node before all nodes that depends on it", () => {

        const nodes = [
            createNode("A"),
            createNode("C"),
            createNode("B"),
        ];

        const connections = [
            createConnection("A", "B"),
            createConnection("A", "C")
        ];

        const result = topologicalSort(nodes, connections);
        const ids = result.map((node) => node.id);

        expect(ids).toHaveLength(3);

        expect(ids.indexOf("A")).toBeLessThan(ids.indexOf("B"));
        expect(ids.indexOf("A")).toBeLessThan(ids.indexOf("C"));
    });

    it("throws when a workflow contains a cycle", () => {
        const nodes = [
            createNode("A"),
            createNode("B"),
            createNode("C"),
        ];

        const connections = [
            createConnection("A", "B"),
            createConnection("B", "C"),
            createConnection("C", "A"),
        ];

        expect(() => {
            topologicalSort(nodes, connections)
        }).toThrow("Workflow contains a cycle")
    });

    it("disconnected node should return first two and keep last", () => {
        const nodes = [
            createNode("A"),
            createNode("C"),
            createNode("B"),
        ];

        const connections = [
            createConnection("A", "B")
        ];

        const result = topologicalSort(nodes, connections);
        const ids = result.map((node) => node.id);

        expect(ids).toHaveLength(3);
        expect(ids).toContain("A");
        expect(ids).toContain("B");
        expect(ids).toContain("C");

        expect(ids.indexOf("A")).toBeLessThan(ids.indexOf("B"));

    })
})