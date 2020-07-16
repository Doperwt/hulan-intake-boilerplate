import React, {Component} from "react";
import {Card, CardContent, Typography, CardActions, Grid} from "@material-ui/core";
import {withStyles} from "@material-ui/styles";
import {Link} from "react-router-dom";

import {BeerTypesDto, BeerDTO} from "../models/";

type Props = {
    beer: BeerDTO,
    classes: any
};

interface State {
}

const styles = {
    card: {
        minWidth: 275,
        borderRadius: 0
    },
    title: {
        fontSize: 14,
    },
    subtitle: {
        marginBottom: 12,
    },
    link: {
        background: "#000000",
        color: "#FFFFFF",
        width: "100%",
        padding: "5px",
        textDecoration: 'none'
    },
    action: {
        padding: 0
    },
    cardContent: {
        display: "flex"
    },
    beerDetails: {
        width: "80%"
    },
    imageDiv: {
        width: "20%"
    },
    image: {
        width: "100%"
    }
};

class Beer extends Component<Props, State> {

    render() {
        const {beer, classes} = this.props;
        const link = `beers/${beer.id}`;
        const beerType = BeerTypesDto[beer.type].charAt(0).toUpperCase() + BeerTypesDto[beer.type].slice(1).toLowerCase()
        return (
            <Grid item  xs={12} sm={6} md={4} lg={3}>
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                        <div className={classes.beerDetails}>
                        <Typography className={classes.title} variant="h5" component="h2">
                            {beer.name}
                        </Typography>
                        <Typography className={classes.subtitle} color="textSecondary">
                            {beerType} {beer.percentage} %
                        </Typography>
                        <Typography variant="body2" component="p">
                            {beer.description}
                        </Typography>
                        </div>
                        <div className={classes.imageDiv}>
                            <img className={classes.image} src={require("../assets/images/beer-bottle.png")} alt="bier flesje"/>
                        </div>
                    </CardContent>
                    <CardActions className={classes.action}>
                        <Link className={classes.link} to={link} style={{textAlign: "center"}}>Bewerk</Link>
                    </CardActions>
                </Card>
            </Grid>
        )
    }
}

export default withStyles(styles)(Beer);
