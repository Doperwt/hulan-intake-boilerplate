import React, {Component} from "react";
import {Card, CardActions, CardContent, Grid, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import {withStyles} from "@material-ui/styles";

import {BrewerDto} from "../models/";

type Props = {
    brewer: BrewerDto,
    classes: any
}

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
    }
}

class Brewer extends Component<Props, State> {
    render() {
        const {brewer, classes} = this.props;
        const link = `brewers/${brewer.id}`;
        return (
            <Grid item  xs={12} sm={6} md={4} lg={3}>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} variant="h5" component="h2">
                            {brewer.name}
                        </Typography>
                        <Typography variant="body2" component="p">
                            {brewer.city}
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.action}>
                        <Link className={classes.link} to={link} style={{textAlign: "center"}}>Bewerk</Link>
                    </CardActions>
                </Card>
            </Grid>
        )
    }
}

export default withStyles(styles)(Brewer);
