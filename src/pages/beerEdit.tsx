import React, {Component} from "react";
import {withStyles} from "@material-ui/styles";
import {withRouter} from "react-router-dom";
import {
    Card,
    CardContent,
    FormControl,
    InputLabel,
    NativeSelect,
    TextField,
    CardActions
} from "@material-ui/core";
import {FlexDirectionProperty} from "csstype";

import {BeerDTO, BeerTypesArray, LoadingState} from "../models";
import {editBeer, getBeer} from "../services/beers.service";
type Props = {
    classes: any,
    match: any,
    history: any,
    location: any
}

interface State {
    beer: BeerDTO,
    loadingState: LoadingState
}

const styles = {
    cardContent: {
        display: "flex",
        flexDirection: "column" as FlexDirectionProperty
    },
    link: {
        background: "#000000",
        color: "#FFFFFF",
        width: "100%",
        padding: "5px",
        textDecoration: 'none'
    }
}

class BeerEdit extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {beer: {description: "not loaded", id:"1", percentage: 0, type: 0, name: ""}, loadingState: LoadingState.INITIAL};
    }

    getBeer(beerId: string) {
        return this.setState({...this.state, loadingState: LoadingState.LOADING},
            () => getBeer(beerId)
                .then(result => this.setState({beer: result, loadingState: LoadingState.LOADED}))
                .catch(err => {
                    console.log(err);
                    this.setState({...this.state, loadingState: LoadingState.ERROR});
                })
        );
    }

    handleChangeBeerType(e: {target:{value:string}}) {
        this.setState({...this.state, beer: {...this.state.beer, type: parseInt(e.target.value)}})
    }

    handleNameChange(e: {target:{value:string}}) {
        this.setState({...this.state, beer: {...this.state.beer, name: e.target.value}})
    }

    handledDescriptionChange(e: {target:{value:string}}) {
        this.setState({...this.state, beer: {...this.state.beer, description: e.target.value}})
    }
    handledPercentageChange(e: {target:{value:string}}) {
        this.setState({...this.state, beer: {...this.state.beer, percentage: parseInt(e.target.value)}})
    }

    submitChanges() {
        const {beer} = this.state;
        this.setState({...this.state, loadingState: LoadingState.LOADING}, () =>
            editBeer(beer)
                .then(result => this.setState({...this.state, loadingState: LoadingState.LOADED, beer: result}))
        );
    }

    componentDidMount() {
        const {match} = this.props;
        this.getBeer(match.params.id)
    }

    render() {
        const {beer, loadingState} = this.state;
        const {classes} = this.props;

        return (
            <Card>
                {loadingState === LoadingState.LOADED ?
                    <CardContent className={classes.cardContent}>
                        <TextField
                            required
                            id="beer-name"
                            label="Naam"
                            defaultValue={beer.name}
                            variant="filled"
                            onChange={e => this.handleNameChange(e)}
                        />
                        <div>

                            <FormControl className={classes.formControl} variant="filled">
                                <InputLabel htmlFor="name-native-error">Bier soort</InputLabel>
                                <NativeSelect
                                    value={beer.type}
                                    onChange={(e) => this.handleChangeBeerType(e)}
                                    name="name"
                                    inputProps={{
                                        id: 'name-native-error',
                                    }}
                                >
                                    {BeerTypesArray.map((beerType, index) =>
                                        <option value={index} key={index}>{beerType}</option>
                                    )}
                                </NativeSelect>
                            </FormControl>
                            <TextField
                                required
                                id="beer=percentage"
                                label="Percentage"
                                defaultValue={beer.percentage}
                                variant="filled"
                                onChange={e => this.handledPercentageChange(e)}
                            />
                        </div>
                        <TextField
                            required
                            id="beer-description"
                            label="Bescrhijving"
                            multiline
                            rows={10}
                            defaultValue={beer.description}
                            variant="filled"
                            onChange={e => this.handledDescriptionChange(e)}
                        />
                    </CardContent>
                    : 'not loaded'}
                <CardActions className={classes.action}>
                    <span className={classes.link} onClick={this.submitChanges.bind(this)} style={{textAlign: "center"}}>Opslaan</span>
                </CardActions>
            </Card>
        );
    }
}

export default withStyles(styles)(withRouter(BeerEdit));
