import React from 'react';

import { doLogin } from '../main/server-requests';
import Loader from '../components/loader';
import '../styles/page-login.css';

export default class LoginPage extends React.Component {
    state = {
        email: '',
        pass: '',
        msgUser: ''
    }
    constructor(props) {
        super(props);
        this.changeInputValue = this.changeInputValue.bind(this);
        this.doLogin = this.doLogin.bind(this);
    }

    changeInputValue(e, state) {
        this.setState({
            ...this.state,
            [state]: e.target.value
        })
    }

    async doLogin() {
        this.setState({
            ...this.state,
            isLoading: true
        })
        if(this.state.email.length < 5){
            this.setState({
                ...this.state,
                msgUser: 'Insira seu email.',
                isLoading: false
            });
            return;
        }
        if(this.state.pass.length < 5){
            this.setState({
                ...this.state,
                msgUser: 'Insira sua senha.',
                isLoading: false
            });
            return;
        }
        const login = await doLogin(this.state);
        if(!login.data){
            this.setState({
                ...this.state,
                msgUser: 'Email e/ou senha inválido(s).',
                isLoading: false
            });
            return;
        }

        localStorage.setItem("token", login.data);
        await this.setState({
            ...this.state,
            msgUser: '',
            isLoading: false
        });

        window.location = '/';
    }


    render() {
        return (
            <div className="content-login">
                <h2>
                    Faça o login.
                </h2>
                <div className="inputs">
                    <label>
                        Email:
                        <input type="text" onChange={e => { this.changeInputValue(e, "email") }} value={this.state.email} />
                    </label>
                    <label>
                        Senha:
                        <input type="password" onChange={e => { this.changeInputValue(e, "pass") }} value={this.state.pass} />
                    </label>
                    <div className="msgs-user" style={{ display: (this.state.msgUser.length > 0) ? 'block' : 'none' }}>
                        {this.state.msgUser}
                    </div>
                    <button onClick={this.doLogin}>
                        Logar
                    </button>
                </div>
                <Loader isLoading={this.state.isLoading} />
            </div>
        )
    }
}