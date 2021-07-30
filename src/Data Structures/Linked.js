import React from 'react';
import Xarrow from 'react-xarrows/lib';
var nextID = 0;
const highlightClass = {
    0 : '',
    1 : 'updated',
    2 : 'touched'
};
class BaseNode {
    constructor(value, highlight = 0) {
        // 0 == nothing
        // 1 == updated
        // 2 == compared
        this.value = value;
        this.highlight = highlight;
        this.id = nextID++;
    };
};

class LinkedNode extends BaseNode {
    constructor(next, value, highlight) {
        super(value, highlight)
        this.next = next;
    };
};

// new plan is to redo it using a settimeout and using state I thinks. 

export class Linked {
    constructor(valInserted = () => { }, valDeleted = () => { }, valChecked = () => { }) {

        // call these when performing a search or something.
        this.valInserted = valInserted;
        this.valDeleted = valDeleted;
        this.valChecked = valChecked;
        console.log(valChecked);

        this.len = 0;
        this.last = new LinkedNode(null, Infinity);
        this.first = new LinkedNode(this.last, null);
    };

    insertAfter(p, value) {
        let newNode = new LinkedNode(p.next, value, 1);
        p.next = newNode;
        this.len++;

        this.valInserted();
        newNode.highlight = 0;
    };

    async insertOrdered(value) {
        let node = this.first;
        while (node.next.value < value) {
            await new Promise((resolve)=>{
                node.next.highlight = 2;
                this.valChecked();
                setTimeout(() => {
                    resolve()
                    node.next.highlight = 0;
                }, 300);
            })
            node = node.next;
        };
        this.insertAfter(node, value);
    };

    delete(value) {
        
    };

    *iterate() {
        let node = this.first;
        while (node.next !== this.last) {
            yield node.next;
            node = node.next;
        };
    };
};

class LinkedVisualise extends React.Component {
    render() {
        return (
            <div className="container-fluid d-flex justify-content-center p-3">
                {[...this.props.structure.iterate()].map((node, index) => {
                    console.log(highlightClass[node.highlight], node.highlight)
                    return (
                        <div key={node.id} id={node.id} className={"linkedNode text-center h-50 w-100 m-3 align-self-center rounded " + highlightClass[node.highlight]}>
                            {node.value}
                        </div>
                    );
                })}
                {[...this.props.structure.iterate()].map((node, index) => {
                    if (!node.next.id){
                        return null
                    };
                    return (
                        <Xarrow key={node.id} start={String(node.id)} end={String(node.next.id)} headSize="2"/>
                    );
                })}
            </div>
        );
    };
};

export default LinkedVisualise;