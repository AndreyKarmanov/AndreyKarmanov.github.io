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

import React, { Children } from 'react';
import Draggable from 'react-draggable';
class Node extends React.Component {
    constructor(props) {
        super(props);
        this.setState({
            parent: props.parent,
            leftChild: null,
            rightChild: null,
            value: props.value
        });
        this.forceUpdate = this.forceUpdate.bind(this);
        this.hovered = false;
    };

    addchildren() {
        return (
            <div className="AddChildButtons">
                {this.leftChild ? <button onClick={this.addLeft}>Add Left</button> : null}
                {this.rightChild ? <button onClick={this.addRight}>Add Right</button> : null}
            </div>
        );
    };

    render() {
        return (
            <Draggable onDrag={this.forceUpdate} onStop={this.forceUpdate}>
                <div className="Node" onMouseOver={() => { this.hovered = true }} onMouseLeave={() => { this.hovered = false }}>
                    <p>{this.value}</p>
                    {this.hovered ? this.addchildren() : null}
                </div>
            </Draggable>
        );
    };
};

class BinaryTree extends React.Component {
    constructor(props) {
        super(props);
        this.root = null;
        this.nextID = 0;
    };

    addRoot() {
        this.root = <Node key={this.nextID++}/> 
    };

    render() {
        let emptyRender;
        if (this.root === null) {
            emptyRender = (
                <button onClick={this.addRoot()}>Add Root</button>
            );
        };

        return (
            <div>
                {emptyRender}
            </div>
        );
    };
};

export default BinaryTree;