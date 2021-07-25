// Whats the plan here???

/*
whats the plan? 
ok so basically I need to visualize the tree
how do I do that? 
I basically just need to make a linked tree class in react. 
1. Overarching tree. Has the root node saved and thats it? 
    1. no, it also has to draw the arrows/links from node to node. 
    2. meaning it has to do a tree traversal of some sort. (aswell as hold a key value for each one.)
    3. has to be able to access the children of the nodes, as well as their id. 
2. the actual nodes. 
    1. they are draggable, ie. wrapped in a <Draggable> component.
    2. store their children? yeah thats right. Probably their parents too, to ease the line drawing part. 
    3. store a value, can also update it. 
    4. also have a button to add a left or right child. 
    5. only have to return their childrent to the tree element, not provide it with updates. (well maybe just a +length one.)
*/


// NEWE NEW plan
// use an external data structure, such as a tree class. 
// then use react to render it using that data, and react modifies that instead of having react be the datastructure. 
// decouple that stuff. 

import React, { createRef } from 'react';
import Draggable from 'react-draggable';
class Node extends React.Component {
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
                {!this.state.leftChild ? <button onClick={this.props.addLeft} className="btn btn-info">Add Left</button> : false}
                {!this.state.rightChild ? <button onClick={this.props.addRight} className="btn btn-info right">Add Right</button> : false}
            </div>
        );
    };

    render() {
        return (
            <Draggable onDrag={() => this.forceUpdate} onStop={() => this.forceUpdate}>
                <div className="Node" id={this.props.id} onMouseEnter={() => { this.hovered = true; this.forceUpdate(); }} onMouseLeave={() => { this.hovered = false; this.forceUpdate(); }}>
                    <input value={this.state.value} onChange={this.valueUpdate}></input>
                    {this.hovered ? this.addchildren() : false}
                </div>
            </Draggable>
        );
    };
};

class BinaryTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            root: null,
            nodes: []
        };
        this.currID = 0;
        this.root = createRef()
        this.addRoot = this.addRoot.bind(this);
        this.forceUpdate = this.forceUpdate.bind(this);
        this.nextID = this.nextID.bind(this);
    };

    nextID() {
        return this.currID++;
    };

    addRoot() {
        this.setState({ root: <Node parent={null} key={this.nextID()} id={this.nextID() - 1} nextID={this.nextID} ref={this.root} update={this.forceUpdate} /> }, () => {
            console.log(this.state.root)
            console.log(this.root)
        });
    };

    iterChildren() {
        let node = this.root;
        let arrows = [];
        let nodes = [];
        let children = [];
        let child;
        while (children = node.Children()) {
            nodes.push(node.current.render())
            for (child in children) {
                child.render()
            }
        }
    };

    render() {
        return (
            <div>
                {this.state.root ? this.state.root : <button onClick={this.addRoot}>Add Root</button>}
            </div>
        );
    };
};

export default BinaryTree;