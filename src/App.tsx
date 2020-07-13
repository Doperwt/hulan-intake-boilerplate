import React, { FC } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Login from "./login/login";
import Home from "./home/home";

export const App: FC = () => {

    return (
        <Router>
            <Switch>
                <Route exact path={"/"}>
                    <Home/>
                </Route>
                <Route path={"/login"}>
                    <Login/>
                </Route>
            </Switch>
        </Router>
    );
}
