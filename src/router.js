import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";
import GraphApp from "./Array/GraphApp2.js";
import SortingApp from './BarSorting/App.js';
import DataStructures from "./Data Structures/DataStructures.js";
import TreeApp from './Trees (bad)/TreeApp.js'
import Introduction from "./eyecandy/introduction.js";

class SinglePage extends Component {
    render() {
        return (
            <HashRouter>
                <Introduction />
                <br />
                <div className="list-group list-group-item shadow-lg border rounded">
                    <h2 className="text-center">Projects</h2>
                    <hr/>
                    <ul className="nav justify-content-center">
                        <li className="nav-item mx-1">
                            <NavLink to='/Sorting'>
                                <button type="button" className="btn btn-outline-primary">
                                    Sorting Visual
                                </button>
                            </NavLink>
                        </li>
                        <li className="nav-item mx-1">
                            <NavLink to='/DataStructures'>
                                <button type="button" className="btn btn-outline-primary">
                                    Skip List Visual
                                </button>
                            </NavLink>
                        </li>
                        <li className="nav-item mx-1">
                            <NavLink to='/GraphSearchBasic'>
                                <button type="button" className="btn btn-outline-primary">
                                    Maze Solver
                                </button>
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <br />
                <Route path='/Sorting' component={SortingApp} />
                <Route path='/Trees' component={TreeApp} />
                <Route path='/DataStructures' component={DataStructures} />
                <Route path='/GraphSearchBasic' component={GraphApp} />
            </HashRouter>
        );
    };
};

export default SinglePage;