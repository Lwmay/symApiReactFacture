import React from "react";
import ReactDOM from "react-dom";

import '../styles/app.css';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import {HashRouter, Switch, Route} from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";

console.log('Hello Webpack Encore! Edit me in assets/app.js');

const App = () => {
    return (
        <HashRouter>
            <Navbar />

            <main className="container pt-5">
                <Switch>
                    <Route path="/customers" component={CustomersPage} />
                    <Route path="/" component={HomePage} />
                </Switch>
            </main>
        </HashRouter>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);