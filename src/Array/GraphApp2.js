import binary_heap from "./BinaryHeap.js";
import React from "react";

class Square {
    constructor(x, y, highlight = 'empty') {

        // For finding adjacent squares
        this.x = x;
        this.y = y;

        // Visualization
        this.highlight = highlight;

        // Denote start/end
        this.isEnd = false;
        this.isStart = false;

        // For pathfinding
        this.passable = true;
        this.explored = false;

        // Dijkstras'
        this.previous = null;
        this.distance = Infinity;
    }

    explore() {
        this.explored = true;

        if (this.isEnd) {
            return true;
        };

        if (this.passable && !this.isStart) {
            this.highlight = "searched";
        };

        return false;
    };

    clicked() {
        if (!(this.isEnd || this.isStart || this.explored)) {
            if (this.passable) {
                this.highlight = "wall";
            } else {
                this.highlight = "empty";
            };
            this.passable = !this.passable;
        };
    };

    setWall() {
        this.passable = false;
        this.highlight = "wall";
    };
};

class Matrix {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.grid = [];
        this.DIRECTIONS = [[0, -1], [1, 0], [0, 1], [-1, 0]];

        // Create initial Grid
        this.create_cols(x, y);
        this.gen_maze();
    };

    starting() {
        return this.grid[1][1];
    };

    ending() {
        return this.grid[this.x - 2][this.y - 2];
    };

    gen_maze() {
        this.wallBox(0, 0, this.x - 1, this.y - 1);
        this.gen_maze_recur(0, 0, this.x - 1, this.y - 1);
    };

    wallBox(x1, y1, x2, y2) {
        for (let row = y1; row < y2; row++) {
            this.grid[x1][row].setWall();
            this.grid[x2][row].setWall();
        };

        for (let col = x1; col <= x2; col++) {
            this.grid[col][y1].setWall();
            this.grid[col][y2].setWall();
        };
    };

    randRange(a, b) {
        return parseInt(a + Math.random() * (b - a));
    };

    async gen_maze_recur(x1, y1, x2, y2) {
        if (x2 - x1 > 2 && y2 - y1 > 2) {
            let xMid = Math.floor((x2 - x1) / 2);
            let yMid = Math.floor((y2 - y1) / 2);

            for (let x = x1; x <= x2; x++) {
                this.grid[x][yMid].setWall();
            };
            for (let y = y1; y <= y2; y++) {
                this.grid[xMid][y].setWall();
            };

            this.grid[this.randRange(x1+ 1, xMid)][yMid].clicked();
            this.grid[xMid][this.randRange(y1+ 1, yMid)].clicked();
            this.grid[this.randRange(xMid, x2 - 1)][yMid].clicked();
            this.grid[xMid][this.randRange(yMid, y2 - 1)].clicked();


            this.gen_maze_recur(x1, y1, xMid, yMid);
            this.gen_maze_recur(x1, yMid, xMid, y2);
            // this.gen_maze_recur(x1, yMid)
            // this.gen_maze_recur(x1 + 1, y1 + 1, xMid, yMid);
            // this.gen_maze_recur(x1 + 1, yMid + 1, xMid, y2);
            // this.gen_maze_recur(xMid + 1, y1 + 1, x2, yMid);
            // this.gen_maze_recur(xMid, yMid, x2, y2);
        };
    };

    create_cols(x, y) {
        for (let col = 0; col < x; col++) {
            this.grid.push(this.create_col(col, y));
        };
        this.grid[1][1].highlight = 'start';
        this.grid[1][1].isStart = true;
        this.grid[this.x - 2][this.y - 2].highlight = 'end';
        this.grid[this.x - 2][this.y - 2].isEnd = true;
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


// Rendering of the choices
class GraphOptions extends React.Component {
    render() {
        return (
            <div className="row w-100">
                <div className="col-6 mt-2">
                    <select className="form-select" disabled={this.props.searching} onChange={this.props.updateSearch} value={this.props.search}>
                        <option value="DFS">Depth First Search</option>
                        <option value="BFS">Breadth First Search</option>
                        <option value="ASTAR">A star Search</option>
                        <option value="DIJ">Djikstras</option>
                    </select>
                </div>
                <div className="col-6">
                    <label htmlFor="rangeSelect" className="form-label"> Grid Size: {["Small", "Medium", "Large", "X-Large"][this.props.size]}</label>
                    <input type="range" className="form-range" id="rangeSelect" disabled={this.props.searching} min="0" max="3" step="1" defaultValue={this.props.size} onInput={(e) => this.props.updateSize(e.target.value)} />
                </div>
                <hr className="mt-4" />
                <button className={"btn btn-success" + (this.props.searching ? ' disabled' : ' ')} onClick={this.props.startSearch}>{this.props.sorting ? 'Searching...' : 'Search'}</button>
            </div>
        );
    };
};


// Rendering of the overall.
class RenderMatrix extends React.Component {
    render() {
        return (
            <div className="container h-100 d-flex flex-row align-items-stretch mt-3 mb-3">
                {this.props.matrix.grid.map((col, idx) =>
                    <div className="d-flex flex-column flex-column-reverse w-100 h-100" key={idx}>
                        {col.map((square, idy) =>
                            <div
                                className={"GridSquare shadow-sm border rounded " + square.highlight}
                                key={idy}
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
                            />
                        )}
                    </div>
                )}
            </div>
        );
    };
};

class GraphApp extends React.Component {
    constructor(props) {
        super(props);
        this.SIZES = [[10, 5], [48, 32], [24, 12], [32, 16]];
        this.state = {
            search: 'DIJ',
            searching: false,
            size: 1,
            matrix: new Matrix(39, 39)
        };



        this.updateSearch = this.updateSearch.bind(this);
        this.updateSize = this.updateSize.bind(this);
        this.startSearch = this.startSearch.bind(this);
        this.searchDFS = this.searchDFS.bind(this);
        this.searchDijkstras = this.searchDijkstras.bind(this);

        this.SEARCHES = {
            'DFS': this.searchDFS,
            'DIJ': this.searchDijkstras,
            'BFS': this.searchBFS,
            'ASTAR': this.searchAstar
        };
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

    slowRender() {
        return new Promise((resolve) => {
            this.forceUpdate();
            setTimeout(() => {
                resolve();
            }, 75);
        });
    };

    async startSearch() {
        this.setState({
            searching: true
        });
        await this.SEARCHES[this.state.search](this.state.matrix.starting());
        this.setState({
            searching: false
        });
    };


    async searchDFS(square) {
        for (let vertex of this.state.matrix.children(square)) {
            if (vertex.passable && !vertex.explored) {
                if (vertex.explore()) {
                    return true;
                } else {
                    await this.slowRender();
                    if (await this.searchDFS(vertex)) {
                        return true;
                    };
                };
            };
        };
    };

    async searchDijkstras(square) {

        var PQ = binary_heap();
        square.distance = 0;
        PQ.enqueue(0, square);
        while (PQ.size() > 0) {
            let square = PQ.dequeue();
            // explore square, if ending then quit.
            if (square.explore()) {
                break;
            } else {
                // square.explored, therefore need a render.
                await this.slowRender();
                for (let vertex of [...this.state.matrix.children(square)]) {
                    // if the square is not a wall, isn't explored, and the new distance is shorter.
                    if (vertex.passable && !vertex.explored && square.distance + 1 < vertex.distance) {
                        vertex.distance = square.distance + 1;
                        vertex.previous = square;
                        PQ.enqueue(-(square.distance + 1), vertex);
                    };
                };
            };
        };
        // loop through the previous ones ya know. 
        square = this.state.matrix.ending().previous;
        if (!square) {
            return;
        };
        while (square.previous) {
            square.highlight = "Path";
            square = square.previous;
            await this.slowRender();
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