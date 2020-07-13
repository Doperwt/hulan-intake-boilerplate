import React, {Component} from "react";
import {Link} from "react-router-dom";

type Props = {
};

interface State {
}

export default class Home extends Component<Props, State> {
    render() {
        return (
            <div
                style={{
                    fontFamily: "sans-serif",
                    lineHeight: "1.5em",
                    maxWidth: 600,
                    padding: 20,
                    margin: "0 auto",
                }}
            >
                <h1>Hello, world!</h1>
                <p>
                    Welkom in het Hulan intake-project. Een foutloze npm start is het halve
                    werk, en zo te zien ben jij al goed op weg.
                </p>
                <p>
                    Voel je vrij om met dit project te doen wat jij denkt dat nodig is om aan
                    de opdracht te voldoen! Je bent absoluut niet beperkt tot de 'src'
                    directory.{" "}
                    <span role="img" aria-label="Knipoog emoji">
        😉
      </span>
                </p>
                <p>Niets moet, alles mag. Veel succes gewenst!</p>
                <Link to="/login">Login</Link>
            </div>
        );
    }
}
