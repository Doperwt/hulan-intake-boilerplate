import React, {Component} from "react";
import {Grid, NativeSelect} from "@material-ui/core";

import Beer from "../components/beer";

import {BeerDTO} from "../models";
import {BeerTypesArray} from "../models/";
import {getBeers} from "../services/beers.service";

type Props = {
};

interface State {
    beers: Array<BeerDTO>,
    selectedBeerType: number,
    isLoading: boolean,
    hasError: boolean,
    hasLoaded: boolean
}

export default class Beers extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {beers: [], selectedBeerType: BeerTypesArray.length, isLoading: false, hasError: false, hasLoaded: false};
    }

    filterBeers(e: { target:{value: string} }) {
        this.setState({...this.state, selectedBeerType: parseInt(e.target.value)});
    }

    componentDidMount() {
        const { isLoading, hasError, hasLoaded} = this.state;

        if (!isLoading && !hasError && !hasLoaded) {
            this.setState({...this.state, isLoading: true}, () => {
                getBeers()
                    .then(response => {
                        this.setState({...this.state, beers: response, isLoading: false, hasLoaded: true});
                    })
                    .catch(err => {
                        console.log(err);
                        this.setState({...this.state,
                            beers: [],
                            hasError: true,
                            isLoading: false})
                    })
            })
        }
    }

    render() {
        const {beers, selectedBeerType} = this.state;
        const menuBeerTypesArray = [...BeerTypesArray, 'Alle'];
        const filteredBeers = beers.filter(beer => beer.type === selectedBeerType || selectedBeerType === (menuBeerTypesArray.length - 1));
        return (
            <div style={{flexGrow:1}}>
                <h1>Bieren</h1>
                <NativeSelect
                    value={selectedBeerType}
                    onChange={e => this.filterBeers(e)}
                    name="name"
                    inputProps={{
                        id: 'name-native-error',
                    }}

                >
                    {menuBeerTypesArray.map((beerType,i) =>
                        <option value={i} key={i}>{beerType.charAt(0).toUpperCase() + beerType.slice(1).toLowerCase()}</option>
                    )}
                </NativeSelect>
                <Grid container spacing={3}>
                    {filteredBeers.map(beer => <Beer key={beer.id} beer={beer}/>)}
                </Grid>
            </div>
        )
    }
}
