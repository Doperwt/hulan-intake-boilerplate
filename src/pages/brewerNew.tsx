import React, {Component} from "react";
import {withStyles} from "@material-ui/styles";
import {withRouter} from "react-router-dom";
import {
    Card,
    CardContent,
    TextField,
    CardActions,
    NativeSelect
} from "@material-ui/core";
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
    deleteConfirmed: boolean
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
            beers: [], selectedBeer: "0", loadingState: LoadingState.INITIAL, deleteConfirmed: false};
    }

    getBeers() {
        return this.setState({...this.state, loadingState: LoadingState.LOADING},
            () => getBeers()
                .then(result => {
                    this.setState({...this.state, beers: result, loadingState: LoadingState.LOADED, selectedBeer: result[0] && result[0].id});
                })
                .catch(err => {
                    console.log(err);
                    this.setState({...this.state, loadingState: LoadingState.ERROR});
                })
        );
    }

    handleNameChange(e: {target:{value:string}}) {
        this.setState({...this.state, brewer: {...this.state.brewer, name: e.target.value}})
    }

    handleRemoveBeerChange(removeBeerId: string) {
        const {brewer} = this.state;
        this.setState({...this.state, brewer: {...brewer, beerIds: brewer.beerIds.filter(beerId => beerId !== removeBeerId)}})
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
                selectedBeer: newSelectedBeer ? newSelectedBeer.id : ""})
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

    componentDidMount() {
        this.getBeers();
    }

    render() {
        const {brewer, beers, selectedBeer} = this.state;
        const {classes} = this.props;
        const unlinkedBeers = beers.filter(beer => brewer.beerIds.filter(beerId => beerId === beer.id).length === 0);
        console.log(brewer);
        return (
            <Card>
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
                             <span onClick={() => this.handleRemoveBeerChange(beerId)}>X</span>
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
                        <span onClick={this.addBeer.bind(this)}>+</span>
                    </div>
                </CardContent>
                <CardActions className={classes.action} onClick={this.submitChanges.bind(this)}>
                    <span className={classes.button}>Opslaan</span>
                </CardActions>
            </Card>
        );
    }
}
// eslint-disable-next-line
export default withStyles(styles)(withRouter(BrewerNew));
