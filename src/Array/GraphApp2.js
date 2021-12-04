import binary_heap from "./BinaryHeap.js";
import React from "react";

class Square {
    constructor(x, y, highlight = 'empty', distanceFromEnd = 0) {

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

        // Astar
        this.distanceFromEnd = distanceFromEnd;
    };

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

    setEmpty() {
        this.passable = true;
        this.highlight = "empty";
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

    // Accessors.
    inbounds(x, y) {
        return 0 <= x && x < this.x && 0 <= y && y < this.y;
    };

    *children(squareX, squareY) {
        let x, y = null;
        for (let dir of this.DIRECTIONS) {
            if (this.inbounds((x = squareX - dir[0]), (y = squareY - dir[1]))) {
                yield this.grid[x][y];
            };
        };
    };

    starting() {
        return this.grid[1][1];
    };

    ending() {
        return this.grid[this.x - 2][this.y - 2];
    };

    randRange(a, b) {
        return parseInt(a + Math.random() * (b - a));
    };

    distanceTo(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };

    // Mutators
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
            col.push(new Square(x, row, 'empty', this.distanceTo(x, row, this.x - 1, this.y - 1)));
        };
        return col;
    };

    resetMaze() {
        for (let col = 0; col < this.x; col++) {
            for (let row = 0; row < this.y; row++) {
                let square = this.grid[col][row];
                if (square.passable && !square.isEnd && !square.isStart) {
                    square.highlight = 'empty';
                };
                square.explored = false;
                square.distance = Infinity;
                square.previous = null;
            };
        };
    };

    // Maze generation
    numPassableAround(x, y, swap = false) {
        if (swap) {
            [x, y] = [y, x];
        };

        let count = 0;
        for (let neighboor of this.children(x, y)) {
            if (neighboor.passable) {
                count++;
            };
        };
        return count;
    };

    gen_maze() {
        this.gen_maze_recur(1, 1, this.x - 2, this.y - 2);
        this.wallBox(0, 0, this.x - 1, this.y - 1);
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


    // try making prims algo because you actually red the steps on wikipedia instead of not reading
    //
    async gen_maze_recur(x1, y1, x2, y2) {
        if (x2 - x1 > 1 && y2 - y1 > 1) {
            let xMid, yMid = 0;

            if (x2 - x1 > 11 && y2 - y1 > 11) {
                xMid = x1 + Math.floor((x2 - x1) / 2);
                yMid = y1 + Math.floor((y2 - y1) / 2);

            } else {
                xMid = this.randRange(x1 + 1, x2 - 1);
                yMid = this.randRange(y1 + 1, y2 - 1);
            };

            for (let x = x1; x <= x2; x++) {
                this.grid[x][yMid].setWall();
            };
            for (let y = y1; y <= y2; y++) {
                this.grid[xMid][y].setWall();
            };
            this.gen_maze_recur(x1, y1, xMid - 1, yMid - 1);
            this.gen_maze_recur(x1, yMid + 1, xMid - 1, y2);
            this.gen_maze_recur(xMid + 1, y1, x2, yMid - 1);
            this.gen_maze_recur(xMid + 1, yMid + 1, x2, y2);

            switch (this.randRange(0, 3)) {
                case 0:
                    this.createSpaceOnLine(xMid + 1, x2, yMid, false);
                    this.createSpaceOnLine(x1, xMid - 1, yMid, false);
                    this.createSpaceOnLine(yMid + 1, y2, xMid, true);
                    break;
                case 1:
                    this.createSpaceOnLine(y1, yMid - 1, xMid, true);
                    this.createSpaceOnLine(x1, xMid - 1, yMid, false);
                    this.createSpaceOnLine(yMid + 1, y2, xMid, true);
                    break;
                case 2:
                    this.createSpaceOnLine(y1, yMid - 1, xMid, true);
                    this.createSpaceOnLine(xMid + 1, x2, yMid, false);
                    this.createSpaceOnLine(yMid + 1, y2, xMid, true);
                    break;
                case 3:
                    this.createSpaceOnLine(y1, yMid - 1, xMid, true);
                    this.createSpaceOnLine(xMid + 1, x2, yMid, false);
                    this.createSpaceOnLine(x1, xMid - 1, yMid, false);
                    break;
                default:
                    break;
            };
        };
    };

    createSpaceOnLine(fromCord, toCord, staleCord, modifIsY) {
        let possible = [];
        for (; fromCord <= toCord; fromCord++) {
            if (this.numPassableAround(fromCord, staleCord, modifIsY) > 1) {
                possible.push(fromCord);
            };
        };
        if (possible.length > 0) {
            if (modifIsY) {
                this.grid[staleCord][possible[this.randRange(0, possible.length)]].setEmpty();
            } else {
                this.grid[possible[this.randRange(0, possible.length)]][staleCord].setEmpty();
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
                        <option value="BFS" disabled={true}>Breadth First Search</option>
                        <option value="ASTAR">A star Search</option>
                        <option value="DIJ">Djikstras</option>
                    </select>
                </div>
                <div className="col-6">
                    <label htmlFor="rangeSelect" className="form-label"> Grid Size: {["Small", "Medium", "Large", "X-Large Square"][this.props.size]}</label>
                    <input type="range" className="form-range" id="rangeSelect" disabled={this.props.searching} min="0" max="3" step="1" defaultValue={this.props.size} onInput={(e) => this.props.updateSize(e.target.value)} />
                </div>
                <hr className="mt-4" />
                <div className="col-3">
                    <button className={"w-100 btn btn-success" + (this.props.searching ? ' disabled' : ' ')} onClick={() => { this.props.updateSize(this.props.size) }}>New Maze</button>
                </div>
                <div className="col-3">
                    <button className={"w-100 btn btn-success" + (this.props.searching ? ' disabled' : ' ')} onClick={this.props.resetMaze}>Reset Maze</button>
                </div>
                <div className="col-6">
                    <button className={"w-100 btn btn-success" + (this.props.searching ? ' disabled' : ' ')} onClick={this.props.startSearch}>{this.props.sorting ? 'Searching...' : 'Search'}</button>
                </div>
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
                                }}/>
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
        this.SIZES = [[16, 8], [24, 12], [48, 24], [48, 48]];
        this.state = {
            search: 'ASTAR',
            searching: false,
            size: 1,
            matrix: new Matrix(24, 12)
        };



        this.updateSearch = this.updateSearch.bind(this);
        this.updateSize = this.updateSize.bind(this);
        this.startSearch = this.startSearch.bind(this);
        this.searchDFS = this.searchDFS.bind(this);
        this.searchAstar = this.searchAstar.bind(this);
        this.searchDijkstras = this.searchDijkstras.bind(this);
        this.resetMaze = this.resetMaze.bind(this);

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

    resetMaze() {
        this.state.matrix.resetMaze();
        this.forceUpdate();
    };

    slowRender() {
        return new Promise((resolve) => {
            this.forceUpdate();
            setTimeout(() => {
                resolve();
            }, 5);
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
        for (let vertex of this.state.matrix.children(square.x, square.y)) {
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
 
    async searchAstar(square) {
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
                for (let vertex of [...this.state.matrix.children(square.x, square.y)]) {
                    // if the square is not a wall, isn't explored, and the new distance is shorter.
                    if (vertex.passable && !vertex.explored && square.distance + 2 < vertex.distance) {
                        vertex.distance = square.distance + 1;
                        vertex.previous = square;
                        PQ.enqueue(-vertex.distanceFromEnd, vertex);
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
                for (let vertex of [...this.state.matrix.children(square.x, square.y)]) {
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
                        <GraphOptions search={this.state.search} searching={this.state.searching} size={this.state.size} resetMaze={this.resetMaze} startSearch={this.startSearch} updateSearch={this.updateSearch} updateSize={this.updateSize} />
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