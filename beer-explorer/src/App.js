import './App.css';
import ViewSelector from './components/ViewSelector'
import DataForm from './components/DataForm'
import { useState } from "react";
import React from 'react';
import { column_defs } from './data-defs';

function App() {
  const [ data, setData ] = useState()

  return (
    <div className="App">
    <h1>Beer Explorer</h1>
    <ViewSelector data={data} column_defs={column_defs}/>
    <DataForm setData={setData} column_defs={column_defs}/>
    </div>
  );}

export default App;
