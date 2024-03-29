import React, { createRef } from 'react';
import Draggable from 'react-draggable';
import SkipListVisualizer, { SkipList } from './SkipList2.js';

class DataStructureInterface extends React.PureComponent {
    constructor(props) {
        super(props);
        this.inputValue = createRef();
        this.deleteValue = createRef();
    };

    render() {
        return (
            <div className="row w-100">
                <div className="col-6 mt-2">
                    <select id="sortSelect" className="form-select" onChange={(e) => this.props.structureChange(e)} value={this.props.structureValue}>
                        <option value="Lists" disabled={true}>Lists:</option>
                        <option value="list" disabled={true}>ArrayList</option>
                        <option value="array" disabled={true}>Array</option>
                        <option value="linked list" disabled={true}>Doubly Linked</option>
                        <option value="skiplist">Skip List</option>
                        <option value="Trees" disabled={true}>Trees:</option>
                        <option value="redblack" disabled={true}>Red Black</option>
                        <option value="avl" disabled={true}>AVL</option>
                        <option value="splay" disabled={true}>Splay</option>
                    </select>
                </div>
                <hr className="mt-4" />
                <div className="col-4 mt-2">
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" ref={this.inputValue} />
                        <button className="btn btn-success" onClick={() => { this.props.addValue(this.inputValue.current.value); this.inputValue.current.value = ''; }}>Insert Value</button>
                    </div>
                </div>
                <div className="col-4 mt-2">
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" ref={this.deleteValue} />
                        <button className="btn btn-danger" onClick={() => { this.props.delValue(this.deleteValue.current.value); this.deleteValue.current.value = ''; }}>Delete Value</button>
                    </div>
                </div>
                {/* <div className="col-2 mt-2">
                    <button className="btn btn-danger" onClick={this.props.clearStructure}>Clear All</button>
                </div> */}
            </div>
        );
    };
};
class DataStructuresApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            structure: 'skiplist'
        };

        this.clearStructure = this.clearStructure.bind(this);
        this.updateStructure = this.updateStructure.bind(this);
        this.addValue = this.addValue.bind(this);
        this.delValue = this.delValue.bind(this);
        this.animate = this.animate.bind(this);
        this.skiplist = new SkipList(this.animate)

    };

    componentDidMount() {
        // this.skiplist.insertOrdered(1);
        // this.skiplist.insertOrdered(2);
        // this.skiplist.insertOrdered(3);
    };

    animate() {
        this.forceUpdate()
    };

    updateStructure(e) {
        this.setState({
            structure: e.target.value
        });
    };

    clearStructure() {
        console.log('delete all');
    };

    addValue(value) {
        if (value !== '') {
            if (!isNaN(value)) {
                value = Number(value)
            };
            console.log(value);
            this.skiplist.insertOrdered(value);
            this.forceUpdate();
        };
    };

    delValue(value) {
        if (value) {
            console.log('del value; ', value);
            this.skiplist.delValue(value);
        };
    };

    render() {
        return (
            <div className="h-100">
                <div className="list-group shadow-lg border rounded h-75">
                    <div className="bg-light list-group-item">
                        <div className="container-fluid">
                            <DataStructureInterface structureChange={this.updateStructure} structureValue={this.state.structure} addValue={this.addValue} delValue={this.delValue} clearStructure={this.clearStructure} />
                        </div>
                    </div>
                    <div className="list-group-item h-100 overflow-hidden">
                        <Draggable>
                            <div>
                                <SkipListVisualizer structure={this.skiplist} className="draggable" />
                            </div>
                        </Draggable>

                    </div>
                </div>
            </div>

        );
    };
};

export default DataStructuresApp;