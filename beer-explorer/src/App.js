import './App.css';
import ViewSelector from './components/ViewSelector'
import DataForm from './components/DataForm'
import { useState } from "react";
import React from 'react';

function App() {
  const [ data, setData ] = useState()

  return (
    <div className="App">
    <h1>Beer Explorer</h1>
    <ViewSelector data={data}/>
    <DataForm setData={setData}/>
    </div>
  );}

export default App;
