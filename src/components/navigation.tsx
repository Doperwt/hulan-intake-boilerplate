import React, {Component} from "react";
import {withStyles} from "@material-ui/styles";
import {Link, withRouter} from "react-router-dom";

import {isAuthenticated} from "../services/api.service";

type Props = {
    classes: any,
    match: any,
    history: any,
    location: any
};

interface State {
}

const styles = {
    link: {
        color: "#FFFFFF",
        width: "100%",
        padding: "5px",
        textDecoration: 'none',
        fontFamily: 'Roboto'
    },
    bar: {
        background: "#000000",
        display: "flex"
    }
}

class Navigation extends Component<Props, State> {
    logOut() {
        localStorage.clear();
        this.props.history.push('login')
    }

    render() {
        const {classes} = this.props;
        const authenticated = isAuthenticated();
        return (
            <div className={classes.bar}>
                <Link to={'/'} className={classes.link}>Home</Link>
                { authenticated ? <Link className={classes.link} to={'/beers'} >Bieren</Link>: undefined }
                { authenticated ? <Link className={classes.link} to={'/brewers'}>Brouwerijen</Link>: undefined }
                { !authenticated ?
                    <Link className={classes.link} to={'/login'}>Login</Link> :
                    <span className={classes.link} onClick={this.logOut.bind(this)}>Logout</span>
                }
            </div>
        )
    }
}

export default withStyles(styles)(withRouter(Navigation));
