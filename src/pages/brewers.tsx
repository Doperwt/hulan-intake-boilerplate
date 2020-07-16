import React, {Component} from "react";
import {withRouter} from "react-router-dom";

import Brewer from "../components/brewer";
import {BrewerDto} from "../models";
import {Grid, Button} from "@material-ui/core";
import {getBrewers} from "../services/brewers.service";

type Props = {
    match: any,
    history: any,
    location: any
};

interface State {
    brewers: Array<BrewerDto>,
    isLoading: boolean,
    hasError: boolean,
    hasLoaded: boolean
}

class Brewers extends Component<Props, State> {
    state = {brewers:[], isLoading: false, hasError: false, hasLoaded: false};

    componentDidMount() {
        const { isLoading, hasError, hasLoaded} = this.state;

        if (!isLoading && !hasError && !hasLoaded) {
            this.setState({...this.state, isLoading: true}, () => {
                getBrewers()
                    .then(response => {
                        this.setState({...this.state, brewers: response, isLoading: false, hasLoaded: true});
                    })
                    .catch(err => {
                        console.log(err);
                        this.setState({...this.state,
                            brewers: [],
                            hasError: true,
                            isLoading: false})
                    })
            })
        }
    }
    toNewBrewer() {
        const {history} = this.props;
        history.push("brewers/new");
    }
    render() {
        const {brewers} = this.state;
        return (
            <div style={{flexGrow:1}}>
                <h1>Brouwerijen</h1>
                <Button variant="contained" style={{position: "absolute", top: "80px", right:"20px"}} onClick={this.toNewBrewer.bind(this)}>+</Button>
                <Grid container spacing={3}>
                    { brewers.length !== 0 ?
                        brewers.map((brewer: BrewerDto) => <Brewer key={brewer.id as string} brewer={brewer}/>) :
                        <div>Loading...</div>
                    }
                </Grid>
            </div>
        )
    }
}

export default withRouter(Brewers);
