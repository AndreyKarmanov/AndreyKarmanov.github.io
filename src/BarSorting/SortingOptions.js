import React from "react";

class SortingOptions extends React.PureComponent {

    render() {
        return (
            <div className="row w-100" style={{ margin: "0 0" }}>
                <div className="col-6 mt-2">
                    <select id="sortSelect" className="form-select" disabled={this.props.sorting} onChange={this.props.updateSort} value={this.props.sortValue}>
                        <option value="merge">Merge Sort</option>
                        <option value="quick">Quick Sort</option>
                        <option value="heap">Heap Sort</option>
                        <option value="bubble">Bubble Sort</option>
                        <option value="insert">Insertion Sort</option>
                        <option value="selection">selection Sort</option>
                    </select>
                </div>
                <div className="col-6">
                    <label htmlFor="rangeSelect" className="form-label">Array Size</label>
                    <input type="range" className="form-range" id="rangeSelect" disabled={this.props.sorting} min="10" max="100" step="1" defaultValue={this.props.sortSize} onInput={(e) => this.props.updateSize(e.target.value)} />
                </div>
                <hr className="mt-4" />
                <button id="sort" className={"btn btn-success" + (this.props.sorting ? ' disabled' : ' ')} onClick={this.props.startSort}>{this.props.sorting ? 'Sorting': 'Sort'}</button>
            </div>
        );
    };
};


export default SortingOptions;