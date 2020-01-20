import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

import { Pane } from 'evergreen-ui';
import { Router } from './router';
import { SideMenu, Node, PrivateKey } from './components';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <SideMenu width={400} />

        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Pane width={1000}>
            <PrivateKey />
            <Node />
            <Router />
          </Pane>
        </Pane>
      </BrowserRouter>
    </div>
  );
}

export default App;
