import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";
import GraphApp from "./Array/GraphApp.js";
import SortingApp from './BarSorting/App.js';
import DataStructures from "./Data Structures/DataStructures.js";
import TreeApp from './TreeApp.js'

class SinglePage extends Component {
    render() {
        return (
            <HashRouter>
                <br />
                <div className="bg-light list-group-item">
                    <div className="container-fluid">
                        <ul>
                            <li>
                                <NavLink to='/Sorting'>
                                    Sorting
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='/Trees'>
                                    Trees
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='/DataStructures'>
                                    Data Structures
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='/GraphSearchBasic'>
                                    GraphApp
                                </NavLink>
                            </li>
                            <li>
                                TODO:
                                <ul>
                                    <li>
                                        Skip lists visualizer
                                    </li>
                                    <li>
                                        various BST visualizer
                                    </li>
                                    <li>
                                        pathfinding algos
                                    </li>
                                    <li>
                                        codewars
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
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