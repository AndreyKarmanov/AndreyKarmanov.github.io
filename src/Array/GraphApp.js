// How do I want to graph this?
// Datastructure that holds the entire matrix. 
// Something that can traverse the matrix & add extra onto it, such as highlight and stuff
// Something that can visualize the matrix, with highlights and a grid pattern, also provides the input for the previous class (options, wall drawing and stuff like that)


// ok no this is better
// matrix class that holds the actual grid, along with the status of the block (type { wall : starting : ending : none }, highlighted { checked : path : none })
// a class that can find a path and highlight the best path & the way it is found, calling a visual update.
// a component that visualizes options (size { small : medium : large}, algo { DFS : BFS : djikstras : A* }, colours { dark : light }) and reset / start search.
// a component that visualizes a matrix, aswell as getting input/drawing the walls. 
// a component to tie in the previous two components and supply them with the matrix & trigger actions based on the options.

// matrix class
// do I use a grid or do I use a linked thing?
import PriorityQueue from "priorityqueue";
import React from "react";
class Square {
    constructor(x, y, highlight = 'empty') {
        this.x = x;
        this.y = y;
        this.highlight = highlight;
        this.explored = false;
        this.passable = true;
        this.previous = null;
        this.distance = Infinity;
    };

    clicked() {
        if (this.highlight === 'wall') {
            this.highlight = 'empty';
        } else if (this.highlight === 'empty') {
            this.highlight = 'wall';
        };
    };
};

class Matrix {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.grid = [];
        this.create_cols(x, y);
        // [1, 1], [-1, -1], [-1, 1], [1, -1]
        this.DIRECTIONS = [[0, 1], [0, -1], [-1, 0], [1, 0]];
    };

    solved(square) {
        if (square && square.x === this.x - 2 && square.y === this.y - 2) {
            square.explored = true;
            return true;
        };
        return this.grid[this.x - 2][this.y - 2].explored;
    };

    create_cols(x, y) {
        for (let col = 0; col < x; col++) {
            this.grid.push(this.create_col(col, y));
        };
        this.grid[1][1].highlight = 'start';
        this.grid[this.x - 2][this.y - 2].highlight = 'end';
    };

    create_col(x, y) {
        let col = [];
        for (let row = 0; row < y; row++) {
            col.push(new Square(x, row, 'empty'));
        };
        return col;
    };

    inbounds(x, y) {
        return 0 <= x && x < this.x && 0 <= y && y < this.y;
    };

    *children(square) {
        let x, y = null;
        for (let dir of this.DIRECTIONS) {
            if (this.inbounds((x = square.x - dir[0]), (y = square.y - dir[1]))) {
                yield this.grid[x][y];
            };
        };
    };
};


class GraphOptions extends React.PureComponent {
    render() {
        return (
            <div className="row w-100" style={{ margin: "0 0" }}>
                <div className="col-6 mt-2">
                    <select className="form-select" disabled={this.props.searching} onChange={this.props.updateSearch} value={this.props.search}>
                        <option value="DFS">Depth First Search</option>
                        <option value="BFS">Breadth First Search</option>
                        <option value="A*">A star Search</option>
                        <option value="DJI">Djikstras</option>
                    </select>
                </div>
                <div className="col-6">
                    <label htmlFor="rangeSelect" className="form-label">Grid Size: {["Small", "Medium", "Large", "X-Large"][this.props.size]}</label>
                    <input type="range" className="form-range" id="rangeSelect" disabled={this.props.searching} min="0" max="3" step="1" defaultValue={this.props.size} onInput={(e) => this.props.updateSize(e.target.value)} />
                </div>
                <hr className="mt-4" />
                <button id="sort" className={"btn btn-success" + (this.props.searching ? ' disabled' : ' ')} onClick={this.props.startSearch}>{this.props.sorting ? 'Sorting' : 'Sort'}</button>
            </div>
        );
    };
};

class RenderMatrix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mouseActive: false
        };
    };
    render() {
        return (
            <div className="container h-100 d-flex flex-row align-items-stretch GridSquares mt-3 mb-3">
                {this.props.matrix.grid.map((col, idx) =>
                    <div className="d-flex flex-column w-100 h-100" key={idx}>
                        {col.map((square, idy) => <div className={"GridSquare shadow-sm border rounded " + square.highlight} key={idy}
                            onMouseOver={(e) => {
                                if (e.buttons) {
                                    square.clicked()
                                    this.forceUpdate();
                                };
                            }}
                            onMouseDown={() => {
                                square.clicked()
                                this.forceUpdate();
                            }}
                        />)}
                    </div>
                )}
            </div>
        );
    };
};

class GraphApp extends React.Component {
    constructor(props) {
        super(props);
        this.SIZES = [[10, 5], [16, 8], [24, 12], [32, 16]]
        this.state = {
            search: 'DFS',
            searching: false,
            size: 1,
            matrix: new Matrix(16, 8)
        };

        this.updateSearch = this.updateSearch.bind(this);
        this.updateSize = this.updateSize.bind(this);
        this.startSearch = this.startSearch.bind(this);
        this.DFS = this.DFS.bind(this);

    };

    updateSize(value) {
        this.setState({
            size: value,
            matrix: new Matrix(...this.SIZES[value])
        });
    };

    updateSearch(e) {
        this.setState({
            search: e.target.value
        });
    };

    async startSearch() {
        this.setState({
            searching: true
        });
        await this.DFS(this.state.matrix.grid[1][1]);

        this.setState({
            searching: false
        });
    };

    slowRender() {
        return new Promise((resolve) => {
            this.forceUpdate();
            setTimeout(() => {
                resolve();
            }, 150);
        });
    };
    async Dijkstras(square) {
        const numericCompare = (a, b) => (a.distance > b.distance ? 1 : a.distance < b.distance ? -1 : 0);
        const PQ = new PriorityQueue({numericCompare});
        square.distance = 0;
        PQ.push(square);
        while (PQ.length > 0 && !this.state.matrix.solved()) {
            square = PQ.pop();
            if (this.state.matrix.solved(square)) {
                return;
            };
            if (square.x !== 1 && square.y !== 1) {
                square.highlight = 'searched';
            }
            square.explored = true;
            let currDist = square.distance + 1;
            await this.slowRender();
            for (let vertex of this.state.matrix.children(square)) {
                if (vertex.highlight === "empty") {
                    if (currDist < vertex.distance) {
                        vertex.distance = currDist;
                        vertex.previous = square;
                        PQ.push(vertex);
                    }
                } else if (this.state.matrix.solved(vertex)) {
                    vertex.previous = square;
                    let sizing = this.SIZES[this.state.size];
                    square = this.state.matrix.grid[sizing[0] - 2][sizing[1] - 2];
                    let previous = square.previous;
                    while (previous) {
                        await this.slowRender();
                        previous.highlight = "Path";
                        previous = previous.previous;
                    };
                    this.state.matrix.grid[1][1].highlight = "start";
                    return;
                };
            }
        }

    }

    async DFS(square) {
        for (let vertex of [...this.state.matrix.children(square)]) {
            if (this.state.matrix.solved(vertex)) {
                return;
            };
            if (vertex.highlight === 'empty') {
                vertex.highlight = 'searched';
                await this.slowRender();
                await this.DFS(vertex);
            };
        };
    };

    render() {
        return (
            <div className="list-group shadow-lg border rounded">
                <div className="bg-light list-group-item">
                    <div className="container-fluid">
                        <GraphOptions search={this.state.search} searching={this.state.searching} size={this.state.size} startSearch={this.startSearch} updateSearch={this.updateSearch} updateSize={this.updateSize} />
                    </div>
                </div>
                <div className="list-group-item">
                    <div className="container bottom">
                        <RenderMatrix matrix={this.state.matrix} />
                    </div>
                </div>
            </div>
        );
    };
};

export default GraphApp;