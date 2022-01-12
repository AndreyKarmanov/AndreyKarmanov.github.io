import React, { createRef } from 'react';

class Node extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            val: props.val,
            children: props.binary ? [null, null] : []
        };
        this.parent = props.parent
        this.id = props.id
        this.binary = props.binary
        this.node = createRef();
        this.addChild = props.addChild
        this.addLeft = this.addLeft.bind(this)
    };

    children() {
        return this.state.children
    };

    getParent(){
        return this.parent
    };

    addLeft() {
        this.children[0] = this.addChild()
    };

    addRight() {
        this.children[1] = this.addChild()
    };

    render() {
        return (
            <div className="draggable"
                onMouseOver={
                    () => {
                        this.hovered = (
                            <div>
                                {this.state.children[0] ? null : <button className="addNode left btn btn-info" onClick={this.addLeft}> add left</button>}
                                {this.state.children[1] ? null : <button className="addNode right btn btn-info" onClick={this.addRight}> add right</button>}
                            </div>
                        );
                        this.forceUpdate();
                    }}
                onMouseLeave={() => { this.hovered = null; this.forceUpdate() }} ref={this.node}>
                Test222
                {this.hovered}
            </div>
        );
    };
};

export default Node;


// import React from 'react';

// class Node extends React.Component {
//     constructor(props) {
//         super(props)
//         this.document = document
//         this.node = React.createRef()
//         this.draggingStart = this.draggingStart.bind(this)
//         this.dragging = this.dragging.bind(this)
//         this.draggingStop = this.draggingStop.bind(this)
//     };

//     componentDidMount() {
//         this.node.current.onmousedown = this.draggingStart
//     };

//     draggingStart(e) {
//         e = e || window.event;
//         e.preventDefault()
//         this.document.onmousemove = this.dragging
//         this.document.onmouseup = this.draggingStop
//         this.startX = e.clientX
//         this.startY = e.clientY
//     };

//     dragging(e) {
//         e = e || window.event;
//         e.preventDefault()
//         this.node.current.style.top = this.node.current.offsetTop - (this.startY - e.clientY) + "px";
//         this.node.current.style.left = this.node.current.offsetLeft - (this.startX - e.clientX) + "px";
//         this.startX = e.clientX
//         this.startY = e.clientY
//     };

//     draggingStop() {
//         this.document.onmousemove = null
//         this.document.onmouseup = null
//     };

//     render() {
//         return (
//             <div className="draggable" ref={this.node}>
//                 Test
//             </div>
//         );
//     };
// };

// export default Node;