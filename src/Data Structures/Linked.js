import React from 'react';
import Xarrow from 'react-xarrows/lib';
import { BaseNode, highlightClass } from './General.js';


class LinkedNode extends BaseNode {
    constructor(next, value, highlight) {
        super(value, highlight)
        this.next = next;
    };
};

// new plan is to redo it using a settimeout and using state I thinks. 

export class Linked {
    constructor(updateVisual = () => { }) {

        // call these when performing a search or something.
        this.updateVisual = updateVisual;

        this.len = 0;
        this.last = new LinkedNode(null, Infinity);
        this.first = new LinkedNode(this.last, null);
    };

    async insertAfter(p, value) {
        let newNode = new LinkedNode(p.next, value, 0);
        p.next = newNode;
        this.len++;

        await this.animate(newNode, 1)

        this.updateVisual();

    };

    deleteAfter(p) {
        let nextNode = p.next;
        p.next = nextNode.next;
    };

    animate(node, highlight) {
        return new Promise((resolve) => {
            node.highlight = highlight;
            this.updateVisual();
            setTimeout(() => {
                node.highlight = 0;
                this.updateVisual();
                resolve()
            }, 300);
        });
    };

    async insertOrdered(value) {
        let prev = this.first
        for (let node of this.iterate()) {
            await this.animate(node, 2);
            if (node.value > value) {
                this.insertAfter(prev, value);
                return;
            };
            prev = node;
        };
        this.insertAfter(prev, value);

    };

    delete(value) {

    };

    *iterate() {
        let node = this.first.next;
        while (node !== this.last) {
            yield node;
            node = node.next;
        };
    };
};

class LinkedVisualise extends React.Component {
    render() {
        return (
            <div className="container-fluid d-flex justify-content-center p-3">
                {[...this.props.structure.iterate()].map((node, index) => {
                    return (
                        <div key={node.id} id={node.id} className={"linkedNode text-center h-50 w-100 m-3 align-self-center rounded " + highlightClass[node.highlight]}>
                            {node.value}
                        </div>
                    );
                })}
                {[...this.props.structure.iterate()].map((node, index) => {
                    if (!node.next.id) {
                        return null
                    };
                    return (
                        <Xarrow key={node.id} start={String(node.id)} end={String(node.next.id)} headSize={2} />
                    );
                })}
            </div>
        );
    };
};

export default LinkedVisualise;