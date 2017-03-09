import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Bar} from './charts/ChartComponents';

const data = [
    {count: 465, key: "CIABE", rev: 234324324},
    {count: 124, key: "CIABT", rev: 353255},
    {count: 555, key: "CIAB1", rev: 6346437},
    {count: 318, key: "CIAB2", rev: 6826222},
    {count: 412, key: "CIAB3", rev: 123246},
    {count: 275, key: "CIAB4", rev: 346346},
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save sdfdsfdsf
        </p>
          <Bar data={data} height={window.innerHeight} width={window.innerWidth} dep={"r"}
               xTitle={"XTitle"} yTitle={"YTitle"} sortLimit={"All"}/>
      </div>
    );
  }
}

export default App;
