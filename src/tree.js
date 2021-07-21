import React, { createRef } from 'react';
import Xarrow from "react-xarrows";
import Draggable from 'react-draggable';
import Node from './Node.js'
class Tree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: []
        };
        this.nextID = 0;
        this.root = createRef();
        this.binary = props.binary ? true : true;
        this.addChild = this.addChild.bind(this);
        this.addBtn = props.addBtn;
        this.valueSetter = props.valueSetter;
    };

    componentDidMount() {
        this.addBtn.classList.remove('disabled');
        this.addBtn.onclick = this.addNew
    };

    addChild(node) {
        return (
            <Node key={this.nextID++} id={this.nextID++} parent={node} binary={this.binary} val={this.valueSetter} addChild={this.addChild} />
        );
    };

    iterChildrenRender() {
        let allNodes = [this.root]
        let current = 0;
        do {
            let parent = allNodes[current++]
            for (const child in parent.children()) {
                if (child) {
                    allNodes.push(child);
                }
            };
        } while (current < allNodes.length);
        return (
            <div>
                {allNodes.map((node) => {
                    return (
                        <Draggable key={this.nextID++} onDrag={this.forceUpdate} onStop={this.forceUpdate}>
                            {node}
                        </Draggable>
                    );
                })}
                {allNodes.map((node) => {
                    return (
                        <Xarrow key={this.nextID++} start={node.getParent().id} end={node.id} headSize={2}/>
                    );
                })}
            </div>
        );
    };

    render() {
        return this.iterChildrenRender()
        return (
            <div>
                {/* {this.state.nodes.map((val, i) => {
                    return (
                        <Draggable key={i} onDrag={this.reRender} onStop={this.reRender}>
                            <div key={i} id={i} className="draggable">
                                {val}
                            </div>
                        </Draggable>
                    );
                })}
                {this.state.nodes.map((val, i) => {
                    return (
                        <Xarrow key={i} start={String(this.parent(i))} end={String(i)} headSize={2} />
                    );
                })} */}
                <Node key={this.nextID++} id={this.nextID++} val={this.valueSetter.value} parent={null} binary={this.binary} addChild={this.addChild} ref={this.root} />
            </div>
        );
    };
};

export default Tree;