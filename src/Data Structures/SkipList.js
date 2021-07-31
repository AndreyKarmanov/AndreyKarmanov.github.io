
import React from 'react';
import { BaseNode, highlightClass } from './General';

class Item {
    constructor(value) {
        this.value = value
    };
};
class SkipNode extends BaseNode {
    constructor(item, next = null, below = null, index = null, highlight = 0) {
        super(item.value, highlight);
        this.item = item
        this.index = index
        this.next = next;
        this.below = below;
    };
};


export class SkipList {
    constructor(update = () => { }) {
        this.update = update;
        this.topleft = new SkipNode(new Item(-Infinity), new SkipNode(new Item(Infinity), null, null, 1), null, 0, -1);
        this.h = 0;
        this.len = 2;
    };

    *iterAfter(node) {
        while (node.next !== null) {
            yield node
            node = node.next;
        };
    };

    insertAfter(prev, item, below = null) {
        for (let node of this.iterAfter(prev)) {
            node.index++;
        };
        prev.next = new SkipNode(item, prev.next, below, prev.index + 1, 1);
        this.update();
        return
    };

    insertOrdered(value) {
        let prevNodes = this.searchFor(value);
        let newItem = new Item(value)
        let h = 1
        console.log(prevNodes)
        let prevNode = prevNodes[prevNodes.length - h]
        let belowNode;
        do {
            belowNode = this.insertAfter(prevNode, newItem, belowNode);
            h++;
            if (h > this.h) {
                this.h++;
                this.topleft = new SkipNode(new Item(-Infinity), new SkipNode(new Item(Infinity)), this.topleft);
                prevNodes.splice(0, 0, this.topleft);
            };
            prevNode = prevNodes[prevNodes.length - h]
        } while (Math.random() > 0.5);
    };

    searchFor(value) {
        let node = this.topleft;
        let prevNodes = []
        while (true) {
            if (node.next.item.value > value) {
                prevNodes.push(node);
                if (node.below) {
                    node = node.below;
                } else {
                    return prevNodes;
                };
            } else {
                node = node.next;
            };
        };
    };
};

class SkipListVisualizer extends React.Component {

    render() {
        let rows = []
        let node = this.props.structure.topleft
        while (node) {
            console.log('row')
            rows.push(
                <tr>
                    {[...this.props.structure.iterAfter(node)].map((nextNode) => {
                        console.log(nextNode.item.value, 'item')
                        return (
                            <td> {nextNode.item.value} </td>
                        );
                    })}
                </tr>
            );
            node = node.below;
        };

        return (
            <table className="table ">
                {rows}
            </table>
        );
    };
};


export default SkipListVisualizer;
