import React, { FC } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {createMuiTheme, ThemeProvider} from "@material-ui/core";
import {common} from "@material-ui/core/colors/";

import "./App.css"

import Navigation from "./components/navigation";
import Login from "./pages/login";
import Home from "./pages/home";
import Beers from "./pages/beers";
import Brewers from "./pages/brewers";
import BeerEdit from "./pages/beerEdit";
import BrewerEdit from "./pages/brewerEdit";
import BrewerNew from "./pages/brewerNew";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#d2d2d2',
        },
        secondary: {
            main: common['black'],
        },
    },
});

export const App: FC = () => {

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Navigation/>
                <Switch>
                    <Route exact path={"/"}>
                        <Home/>
                    </Route>
                    <Route path={"/login"}>
                        <Login/>
                    </Route>
                    <Route exact path={"/brewers"}>
                        <Brewers/>
                    </Route>
                    <Route exact path={"/brewers/new"}>
                        <BrewerNew />
                    </Route>
                    <Route path={"/brewers/:id"}>
                        <BrewerEdit />
                    </Route>
                    <Route exact path={"/beers"}>
                        <Beers/>
                    </Route>
                    <Route path={"/beers/:id"}>
                        <BeerEdit/>
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}
