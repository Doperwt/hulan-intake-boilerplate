import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {loginUser} from "../services/api.service";

type Props = {
    match: any,
    history: any,
    location: any
};

interface State {
    username: string
    password: string
    isLoading: boolean
}

class Login extends Component<Props, State> {
    state = {
        username: '',
        password: '',
        isLoading: false
    }

    login() {
        const {history} = this.props;
        this.setState({...this.state, isLoading: true})
        loginUser({username: this.state.username, password: this.state.password})
            .then(() => {
                this.setState({...this.state, isLoading: false});
                history.push('/home')
            })
            .catch(err => {
                this.setState({...this.state, isLoading: false});
                console.log(err);
            });
    }

    handleLoginChange(e: {target:{value: string}}, type: string) {
        if(type === 'username') {
            this.setState({...this.state, username: e.target.value})
        } else {
            this.setState({...this.state, password: e.target.value})
        }
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center', height: '100vh'}}>
                <p>username:</p>
                <input type="text" onChange={e => this.handleLoginChange(e, 'username')} value=""/>
                <p>password:</p>
                <input type="password" onChange={e => this.handleLoginChange(e, 'password')} value=""/>
                <button onClick={this.login.bind(this)}>Login</button>
            </div>
        );
    }
}
export default withRouter(Login);
