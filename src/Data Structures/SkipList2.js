import React from 'react';
import Xarrow, { Xwrapper } from 'react-xarrows';
import { highlightClass } from './General';

var nextID = 0;
class Item {
    constructor(value) {
        this.value = value;
    };
};

class SkipNode {
    constructor(item, next = null, below = null, index = null, highlight = 0) {
        this.item = item;
        this.next = next;
        this.below = below;
        this.index = index;
        this.highlight = highlight;
        this.id = nextID++;
        this.arrowID = nextID++;

        // above is only needed to ease rendering. Not necessary for a basic skiplist.
        this.above = null;
    }
};

export class SkipList {
    constructor(onUpdate = () => { }) {
        this.onUpdate = onUpdate;

        // topright is only needed to ease rendering. Not necessary for a basic skiplist.
        this.topRight = new SkipNode(new Item(Infinity), null, null, 1)

        this.topLeft = new SkipNode(new Item(-Infinity), this.topRight, null, 0);
        this.len = 2;
        this.h = 0;

    };

    *iterCol(bottom) {
        while (bottom) {
            yield bottom;
            bottom = bottom.above;
        };
    };

    *iterRows() {
        let node = this.topLeft;
        while (node) {
            yield node;
            node = node.below;
        };
    };

    *iterAfter(node) {
        while (node) {
            yield node;
            node = node.next;
        };
    };

    printRow(startNode) {
        console.log([...this.iterAfter(startNode)].map((node) => node.item.value));
    };

    printAll() {
        let leftNode = this.topLeft;
        while (leftNode) {
            this.printRow(leftNode);
            leftNode = leftNode.below;
        };
    };

    animate(node, highlight) {
        return new Promise((resolve) => {
            setTimeout(() => {
                node.highlight = highlight;
                this.onUpdate();
                node.highlight = 0;
                resolve();
            }, 150);
        });
    };

    async findPreviousNodes(value) {
        let node = this.topLeft;
        let previousNodes = [];
        while (true) {
            await this.animate(node, 2);
            if (node.next.item.value > value) {
                previousNodes.push(node);
                if (node.below) {
                    node = node.below
                } else {
                    return previousNodes;
                };
            } else {
                node = node.next;
            };
        };
    };

    delAfter(previous, node) {
        previous.next = node.next;
    };

    async delValue(value) {
        let previous = await this.findPreviousNodes(value, true);
        for (let node of previous) {
            if (node.next.value === value) {
                this.delAfter(node, node.next);
                await this.animate(node, 2);
                this.onUpdate();
            };
        };
    };

    async addAfter(previous, newNode) {
        newNode.next = previous.next;
        previous.next = newNode;
        newNode.index = previous.index + 1;
        await this.animate(newNode, 1);
    };

    async insertOrdered(value) {
        let previous = await this.findPreviousNodes(value);
        let h = 1;
        let previousNode = previous[previous.length - h];
        let belowNode = null;
        let item = new Item(value);
        this.len++;
        let runt = () => {
            let p = Math.random();
            console.log(p, p > 0.5);
            console.log(p, p > 0.5);
            return p > 0.5;
        }

        do {
            let newNode = new SkipNode(item, previousNode.next, belowNode, previous.next, 0)
            if (belowNode) {
                belowNode.above = newNode;
            };
            await this.addAfter(previousNode, belowNode = newNode);
            if (h == this.h + 1) {
                this.h++;

                let newTopRight = new SkipNode(new Item(Infinity), null, this.topRight, this.len - 1)
                let newTopLeft = new SkipNode(new Item(-Infinity), newTopRight, this.topLeft, 0);

                this.topRight.above = newTopRight;
                this.topLeft.above = newTopLeft;

                this.topRight = newTopRight;
                this.topLeft = newTopLeft;

                previous.splice(0, 0, this.topLeft);
            };
            previousNode = previous[previous.length - ++h];

        } while (runt());
    };
};

class SkipListVisualizer extends React.Component {

    constructor(props) {
        super(props);
        this.toSymbol = this.toSymbol.bind(this);
    };

    toSymbol(value) {
        if (value === Infinity) {
            return "∞";
        } else if (value === -Infinity) {
            return "-∞";
        } else {
            return value;
        };
    };

    renderCol(bottomNode) {
        let column = [...this.props.structure.iterCol(bottomNode)];
        // make thte unused arrows opacity at 50% or something.
        return (
            <div className="d-flex flex-column-reverse m-2">
                <Xwrapper>
                    {column.map((node) => {
                        return (
                            <div className={"SkipNode border rounded m-3 p-2 text-center fs-6 " + highlightClass[node.highlight]} id={node.id} key={node.id}>
                                {this.toSymbol(node.item.value)}
                            </div>
                        );
                    })}
                    {column.map((node) => {
                        if (node.next) {
                            return (
                                <Xarrow start={String(node.id)} end={String(node.next.id)} key={nextID++} headSize={4} />
                            );
                        } else {
                            return null;
                        };

                    })}
                    {column.map((node) => {
                        if (node.below) {
                            return (
                                <Xarrow start={String(node.id)} end={String(node.below.id)} key={nextID++} headSize={4} />
                            );
                        } else {
                            return null;
                        };

                    })}

                </Xwrapper>
            </div>

        );
    };

    render() {
        let bottomLeft = this.props.structure.topLeft;
        while (bottomLeft.below) {
            bottomLeft = bottomLeft.below;
        };

        return (
            <div className="d-flex flex-row">
                {[...this.props.structure.iterAfter(bottomLeft)].map((bottomNode) => {
                    return this.renderCol(bottomNode)
                })}
            </div>
        );
    };
};

export default SkipListVisualizer;