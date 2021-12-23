import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";
import GraphApp from "./Array/GraphApp2.js";
import SortingApp from './BarSorting/App.js';
import DataStructures from "./Data Structures/DataStructures.js";
import TreeApp from './TreeApp.js'

class SinglePage extends Component {
    render() {
        return (
            <HashRouter>
                <br />
                <div className="list-group list-group-item shadow-lg border rounded">
                    <ul class="nav justify-content-center">
                        <li class="nav-item mx-1">
                            <NavLink to='/Sorting'>
                                <button type="button" class="btn btn-outline-primary">
                                    Sorting
                                </button>
                            </NavLink>
                        </li>
                        <li class="nav-item mx-1">
                            <NavLink to='/DataStructures'>
                                <button type="button" class="btn btn-outline-primary">
                                    Data Structures
                                </button>
                            </NavLink>
                        </li>
                        <li class="nav-item mx-1">
                            <NavLink to='/GraphSearchBasic'>
                                <button type="button" class="btn btn-outline-primary">
                                    GraphApp
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