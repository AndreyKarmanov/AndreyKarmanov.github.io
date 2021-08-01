import React from 'react';
import Xarrow from 'react-xarrows/lib';

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

    findPreviousNodes(value) {
        let node = this.topLeft;
        let previousNodes = [];
        while (true) {
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

    addAfter(previous, newNode) {
        newNode.next = previous.next;
        previous.next = newNode;
        newNode.index = previous.index + 1;
    };

    insertOrdered(value) {
        let previous = this.findPreviousNodes(value);
        let h = 1;
        let previousNode = previous[previous.length - h];
        let belowNode = null;
        let item = new Item(value);
        this.len++;

        do {
            let newNode = new SkipNode(item, previousNode.next, belowNode, previous.next, 0)
            if (belowNode) {
                belowNode.above = newNode;
            };
            this.addAfter(previousNode, belowNode = newNode);
            if (h > this.h) {
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
        } while (Math.random() > 0.5);
        this.onUpdate();
    };
};

class SkipListVisualizer extends React.Component {

    componentDidMount() {
        this.props.structure.printAll();
    };

    renderCol(bottomNode) {
        let column = [...this.props.structure.iterCol(bottomNode)];
        return (
            <div className="d-flex flex-column-reverse m-3">
                {column.map((node) => {
                    return (
                        <div className="SkipNode border rounded m-1 p-2 text-center" id={node.id} key={node.id}>{node.item.value}</div>
                    );
                })}

                {column.map((node) => {
                    if (!node.below) {
                        return null;
                    };
                    console.log(node.id, node.below.id);
                    return (
                        <Xarrow start={String(node.id)} end={String(node.below.id)} key={node.id} />
                );
                })}
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