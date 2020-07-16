import React, {Component} from "react";
import {withStyles} from "@material-ui/styles";
import {withRouter} from "react-router-dom";
import {Card, CardActions, CardContent, NativeSelect, TextField, Snackbar, Button} from "@material-ui/core";
import {FlexDirectionProperty, TextAlignProperty} from "csstype";

import {BeerDTO, BrewerDto, LoadingState} from "../models";
import {getBeers} from "../services/beers.service";
import {deleteBrewer, editBrewer, getBrewer} from "../services/brewers.service";

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
    selectedBeer: string,
    deleteConfirmed: boolean,
    snackbarOpen: boolean,
    snackbarMessage: string
}

const styles = {
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
    delete: {
        background: "#790000",
        color: "#FFFFFF",
        width: "50%",
        padding: "5px",
        textDecoration: 'none',
        textAlign: "center" as TextAlignProperty
    },
    beer: {
      display: "flex"
    },
    even: {
        background: "#CCCCCC"
    },
    okay: {
        background: "#0baa00"
    },
    alert: {
        background: "#aa0000"
    }
}

class BrewerEdit extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {brewer: {city: "", id:"1", name: "", beerIds: []},
            beers: [], selectedBeer: "0", loadingState: LoadingState.INITIAL, deleteConfirmed: false,
            snackbarMessage: "", snackbarOpen: false};
    }

    getBeers(): Promise<Array<BeerDTO>> {
        this.setState({...this.state, loadingState: LoadingState.LOADING})
        return getBeers()
            .then(result => {
                return result;
            })
            .catch(err => {
                console.log(err);
                this.setState({...this.state, loadingState: LoadingState.ERROR, snackbarOpen: true, snackbarMessage: "Error loading beers"});
                throw Error();
            })
    }

    getBrewer(brewerId: string) {
        this.setState({...this.state, loadingState: LoadingState.LOADING},
            () => getBrewer(brewerId)
                .then(brewer => {
                    this.getBeers().then(beers => {
                        const selectedBeer = beers.filter(beer => brewer.beerIds.filter(beerId => beerId === beer.id).length === 0)[0].id;
                        console.log(brewer);
                        this.setState({...this.state, brewer: brewer, beers: beers, selectedBeer, loadingState: LoadingState.LOADED, snackbarOpen: true, snackbarMessage: "Brouwerij geladen"})
                    })
                    .catch(err => {
                        console.log(err);
                        this.setState({...this.state, brewer: brewer, loadingState: LoadingState.ERROR, snackbarOpen: true, snackbarMessage: "Fout bij laden van bieren"})
                    });
                })
                .catch(err => {
                    console.log(err);
                    this.setState({...this.state, loadingState: LoadingState.ERROR, snackbarOpen: true, snackbarMessage: "Error loading brewer"});
                })
        );
    }

    handleNameChange(e: {target:{value:string}}) {
        this.setState({...this.state, brewer: {...this.state.brewer, name: e.target.value}})
    }

    handleRemoveBeerChange(removeBeerId: string) {
        const {brewer} = this.state;
        this.setState({...this.state, brewer: {...brewer, beerIds: brewer.beerIds.filter(beerId => beerId !== removeBeerId)},
            snackbarOpen: true, snackbarMessage: "Bier verwijderd van brouwerij"})
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

    submitChanges(this: any) {
        const {brewer} = this.state;
        this.setState({...this.state, loadingState: LoadingState.LOADING}, () =>
            editBrewer(brewer)
                .then(result => this.setState({...this.state, loadingState: LoadingState.LOADED, brewer: result,
                    snackbarOpen: true, snackbarMessage: "Brouwerij bijgewerkt"}))
        );
    }

    deleteBrewer(brewerId: string) {
        const {deleteConfirmed} = this.state;
        const {history} = this.props;
        if (deleteConfirmed) {
            deleteBrewer(brewerId).then(result => {console.log(result); history.push('/brewers');})
        } else {
            this.setState({...this.state, deleteConfirmed: true})
        }
    }

    toggleDelete() {
        this.setState({...this.state, deleteConfirmed: !this.state.deleteConfirmed,
            snackbarOpen: true, snackbarMessage: !this.state.deleteConfirmed ? "Let op je gaat een brouwerij permanent verwijderen" : "okidokie"})
    }

    handleClose(event: any, reason: string) {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ ...this.state, snackbarOpen: false });
    }

    componentDidMount() {
        const {match, } = this.props;
        this.getBrewer(match.params.id);
    }

    render() {
        const {brewer, loadingState, beers, selectedBeer, deleteConfirmed, snackbarOpen, snackbarMessage} = this.state;
        const {classes} = this.props;
        const unlinkedBeers = beers.filter(beer => brewer.beerIds.filter(beerId => beerId === beer.id).length === 0);

        return (

            <Card>
                {loadingState === LoadingState.LOADED ?
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
                            >
                                {unlinkedBeers.map((beer) =>
                                    <option value={beer.id} key={beer.id}>{beer.name}</option>
                                )}
                            </NativeSelect>
                            <Button variant="contained" onClick={this.addBeer.bind(this)}>+</Button>
                        </div>
                    </CardContent>
                    : 'not loaded'}
                    <div>
                        <CardActions className={classes.action} onClick={() => this.submitChanges()}>
                            <span className={classes.button}>Opslaan</span>
                        </CardActions>
                        <CardActions className={classes.action}>
                            <span className={classes.button}  onClick={() => this.toggleDelete()}>
                            {deleteConfirmed ? "Annuleer" : "Verwijderen"}
                            </span>
                        {deleteConfirmed ? <span className={classes.delete} onClick={() => this.deleteBrewer(brewer.id)}>Bevestig</span> : undefined}
                        </CardActions>
                    </div>
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal:"center" }}
                    open={snackbarOpen}
                    onClose={this.handleClose.bind(this)}
                    message={snackbarMessage}
                    autoHideDuration={4000}
                    key="snack-bar"
                />
            </Card>
        );
    }
}

export default withStyles(styles)(withRouter(BrewerEdit));
