import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router.js'

ReactDOM.render(
    <Router/>,
  document.getElementById('visualizer')
);


// reactDom.render(<Tree addBtn={sortBtn} valueSetter={rangeSelect}/>, document.getElementById('visualizer'))
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals