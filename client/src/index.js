import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router} from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './styles/index.css';
import { Routes } from './routes'; // where we are going to specify our routes
//import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router>
    <Routes />
  </Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
