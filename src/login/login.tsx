import React, {Component} from "react";

type Props = {
};

interface State {
    email: string
    password: string
    isLoading: boolean
}

export default class Login extends Component<Props, State> {
    render() {
        return (
            <div>
                <input/>
                <input/>
                <button>Login</button>
            </div>
        );
    }
}
