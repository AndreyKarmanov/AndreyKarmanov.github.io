import React from 'react';
import Draggable from 'react-draggable';
import Xarrow from 'react-xarrows/lib';

var nextID = 0
class Tree {

    constructor() {
        this.root = null;
        this.size = null;
    };

    children(node) {
        let out = [];
        if (node.leftChild) {
            out.push(node.leftChild);
        };
        if (node.rightChild) {
            out.push(node.rightChild);
        };
        // boolean(node.leftChild) ? out.push(node.leftChild) : null;
        // boolean(node.rightChild) ? out.push(node.rightChild) : null;
        return out;
    };

    *iterAll(node) {
        if (!node) {
            return;
        };
        yield node;
        for (let child of this.children(node)) {
            for (let out of this.iterAll(child)) {
                yield out;
            };
        };
    };

    getNodes(node) {
        return [...this.iterAll(node)]
    };

    addLeft(node, value) {
        if (!node.leftChild) {
            this.size++;
            node.leftChild = new Node(value, node);
            return node.leftChild;
        };
    };

    addRight(node, value) {
        if (!node.rightChild) {
            this.size++;
            node.rightChild = new Node(value, node);
            return node.rightChild;
        };
    };

    updateNode(node, value) {
        node.value = value;
    };
};

class Node {
    constructor(value, parent) {
        this.parent = parent;
        this.value = value;
        this.leftChild = null;
        this.rightChild = null;
        this.id = nextID++;
    };
};


class RenderNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "New value"
        };
        this.hovered = false;
        this.addchildren = this.addchildren.bind(this);
    };

    addchildren() {
        return (
            <div className="AddChildButtons">
                {!this.props.left && this.hovered ? <button onClick={this.dragged ? null : this.props.addLeft} className="btn btn-info" style={{ position: 'absolute', marginLeft: '0px' }}>Left</button> : false}
                {!this.props.right && this.hovered ? <button onClick={this.dragged ? null : this.props.addRight} className="btn btn-info right" style={{ position: 'absolute', left: '50%' }}>Right</button> : false}
            </div>
        );
    };

    render() {
        return (
            <Draggable onDrag={() => { this.props.updateAll(); this.dragged = true }} onStop={() => { this.props.updateAll(); this.dragged = false }}>
                <div className="Node" id={this.props.id} onMouseOver={() => { this.hovered = true; this.forceUpdate(); }} onMouseLeave={() => { this.hovered = false; this.forceUpdate(); }}>
                    <input value={this.props.value} onInput={(e) => { this.props.updateValue(e.target.value) }} />
                    {this.addchildren()}
                </div>
            </Draggable>
        );
    };
};

class RenderTree extends React.Component {
    constructor(props) {
        super(props);
        this.tree = new Tree();
    };


    render() {
        return (
            <div style={{ height: "100%" }}>
                {
                    this.tree.root ? null : <button onClick={() => { this.tree.root = new Node('xx', null); this.forceUpdate(); }}>Add Root</button>
                }
                {this.tree.getNodes(this.tree.root).map((node) => {
                    return (
                        <RenderNode addLeft={() => { this.tree.addLeft(node, "New Value"); this.forceUpdate(); }} addRight={() => { this.tree.addRight(node, "New Value"); this.forceUpdate(); }}
                            key={node.id} id={node.id} updateAll={() => this.forceUpdate()}
                            updateValue={(value) => { this.tree.updateNode(node, value); this.forceUpdate(); }} value={node.value}
                            right={node.rightChild} left={node.leftChild}
                        />
                    );
                })}
                {
                    this.tree.getNodes(this.tree.root).map((node) => {
                        if (node.parent) {
                            return (<Xarrow key={node.id} start={String(node.parent.id)} end={String(node.id)} />)
                        }
                        return null;
                    })
                }
            </div>
        );
    };
};


export default RenderTree;

