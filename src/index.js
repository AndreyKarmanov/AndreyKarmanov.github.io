import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import RenderTree from './tree3.js'

const rangeSelect = document.getElementById('rangeSelect');
const sortSelect = document.getElementById('sortSelect');
const sortBtn = document.getElementById('sort');

ReactDOM.render(
    <App rangeSelect={rangeSelect} sortSelect={sortSelect} sortBtn={sortBtn}/>,
  document.getElementById('visualizer')
);

ReactDOM.render(
    <RenderTree/>,
  document.getElementById('tree-visualizer')
);
// reactDom.render(<Tree addBtn={sortBtn} valueSetter={rangeSelect}/>, document.getElementById('visualizer'))
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals