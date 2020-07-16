import React, {Component} from "react";
import {withStyles} from "@material-ui/styles";
import {withRouter} from "react-router-dom";
import {Card, CardActions, CardContent, NativeSelect, TextField, Snackbar, Button} from "@material-ui/core";

import {FlexDirectionProperty, TextAlignProperty} from "csstype";

import {LoadingState, BrewerDto, BeerDTO} from "../models";
import {getBeers} from "../services/beers.service";
import {addBrewer} from "../services/brewers.service";

type Props = {
    classes: any,
    match: any,
    history: any,
    location: any
}

interface State {
    brewer: BrewerDto,
    beers: Array<BeerDTO>,
    loadingState: LoadingState,
    selectedBeer: string
    snackbarOpen: boolean,
    snackbarMessage: string
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column" as FlexDirectionProperty,
        alignItems: "center"
    },
    card: {
        maxWidth: "500px",
        width: "100%"
    },
    cardContent: {
        display: "flex",
        flexDirection: "column" as FlexDirectionProperty
    },
    button: {
        background: "#000000",
        color: "#FFFFFF",
        width: "100%",
        padding: "5px",
        textDecoration: 'none',
        textAlign: "center" as TextAlignProperty
    },
    beer: {
        display: "flex"
    },
    even: {
        background: "#CCCCCC"
    }
}

class BrewerNew extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {brewer: {city: "", id:"1", name: "", beerIds: []},
            beers: [], selectedBeer: "0", loadingState: LoadingState.INITIAL,
            snackbarMessage: "", snackbarOpen: false};
    }

    getBeers() {
        return this.setState({...this.state, loadingState: LoadingState.LOADING},
            () => getBeers()
                .then(result => {
                    this.setState({...this.state, beers: result, loadingState: LoadingState.LOADED, selectedBeer: result[0] && result[0].id});
                })
                .catch(err => {
                    console.log(err);
                    this.setState({...this.state, loadingState: LoadingState.ERROR,
                        snackbarOpen: true, snackbarMessage: "Error loading beers"});
                })
        );
    }

    handleNameChange(e: {target:{value:string}}) {
        this.setState({...this.state, brewer: {...this.state.brewer, name: e.target.value}})
    }

    handleRemoveBeerChange(removeBeerId: string) {
        const {brewer} = this.state;
        this.setState({...this.state,
            brewer: {...brewer, beerIds: brewer.beerIds.filter(beerId => beerId !== removeBeerId)},
            snackbarOpen: true, snackbarMessage: "Bier verwijderd van brouwerij"
        })
    }

    selectBeer(e: {target:{value:string}}) {
        this.setState({...this.state, selectedBeer:  e.target.value})
    }

    addBeer() {
        const {brewer, selectedBeer, beers} = this.state;
        const hasBeer = brewer.beerIds.filter(beerId => beerId === selectedBeer).length !== 0;
        const newSelectedBeer = beers.filter(beer => selectedBeer !== beer.id  && brewer.beerIds.filter(beerId => beerId === beer.id).length === 0 )[0]
        if(selectedBeer !== "" && !hasBeer) {
            this.setState({...this.state,
                brewer: {...brewer, beerIds: [...brewer.beerIds, selectedBeer]},
                selectedBeer: newSelectedBeer ? newSelectedBeer.id : "",
                snackbarOpen: true, snackbarMessage: "Bier toegevoegd aan brouwerij"})
        }
    }

    handledCityChange(e: {target:{value:string}}) {
        this.setState({...this.state, brewer: {...this.state.brewer, city: e.target.value}})
    }

    submitChanges() {
        const {brewer} = this.state;
        const {history} = this.props;
        this.setState({...this.state, loadingState: LoadingState.LOADING}, () =>
            addBrewer(brewer)
                .then(result => history.push(result.id))
        );
    }

    handleClose(event: any, reason: string) {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ ...this.state, snackbarOpen: false });
    }
    componentDidMount() {
        this.getBeers();
    }

    render() {
        const {brewer, beers, selectedBeer, snackbarOpen, snackbarMessage} = this.state;
        const {classes} = this.props;
        const unlinkedBeers = beers.filter(beer => brewer.beerIds.filter(beerId => beerId === beer.id).length === 0);

        return (
            <div className={classes.container}>
                <h1>Brouwerij aanpassen</h1>
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                        <TextField
                            required
                            id="beer-name"
                            label="Naam"
                            defaultValue={brewer.name}
                            variant="filled"
                            onChange={e => this.handleNameChange(e)}
                        />

                        <TextField
                            required
                            id="beer=percentage"
                            label="Stad"
                            defaultValue={brewer.city}
                            variant="filled"
                            onChange={e => this.handledCityChange(e)}
                        />
                        {brewer.beerIds.length !== 0 ?
                            brewer.beerIds.map((beerId, i) =>
                                <span key={beerId} className={ i%2!==0 ? classes.even : undefined } style={{display:"flex", justifyContent:"space-between"}}>
                                 <span  > {beers.find(beer => beer.id === beerId)?.name}</span>
                                 <Button onClick={() => this.handleRemoveBeerChange(beerId)}>X</Button>
                             </span>) :
                            undefined }
                        <div>
                            <NativeSelect
                                value={selectedBeer}
                                onChange={(e) => this.selectBeer(e)}
                                name="name"
                                inputProps={{
                                    id: 'name-native-error',
                                }}
                            >BrewerNew
                                {unlinkedBeers.map((beer) =>
                                    <option value={beer.id} key={beer.id}>{beer.name}</option>
                                )}
                            </NativeSelect>
                            <Button variant="contained" onClick={this.addBeer.bind(this)}>+</Button>
                        </div>
                    </CardContent>
                    <CardActions className={classes.action} onClick={this.submitChanges.bind(this)}>
                        <span className={classes.button}>Opslaan</span>
                    </CardActions>
                    <Snackbar
                        anchorOrigin={{ vertical: "bottom", horizontal:"center" }}
                        open={snackbarOpen}
                        onClose={this.handleClose.bind(this)}
                        message={snackbarMessage}
                        autoHideDuration={4000}
                        key="snack-bar"
                    />
                </Card>
            </div>
        );
    }
}
// eslint-disable-next-line
export default withStyles(styles)(withRouter(BrewerNew));
