import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


const rangeSelect = document.getElementById('rangeSelect');
const sortSelect = document.getElementById('sortSelect');
const sortBtn = document.getElementById('sort');

ReactDOM.render(
  <React.StrictMode>
    <App rangeSelect={rangeSelect} sortSelect={sortSelect} sortBtn={sortBtn}/>
  </React.StrictMode>,
  document.getElementById('visualizer')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals