class GraphNode {
    constructor(data) {
        this.neighbors = []
        this.data = data
    }

    colorNode(colors) {
        const colorsToTry = [...colors]

        for (const node of this.neighbors) {
            removeFirst(colorsToTry, node.data.color)
        }

        if (colorsToTry.length > 0) {
            this.data.color = randomItem(colorsToTry)
        } else {
            // give up and use a random color
            this.data.color = randomItem(colors)
        }
    }
}

class Graph {
    constructor(nodes) {
        this.nodes = nodes.flat(Infinity)
    }

    colorNodes(colors) {
        // try to color every node
        for (const node of this.nodes) {
            node.colorNode(colors)
        }

        // toggle colors until k-coloring is satisfied so that no two neighboring nodes have the some color
        // TODO: I have never seen this issue arise with palettes of size 3 and greater
    }
}
