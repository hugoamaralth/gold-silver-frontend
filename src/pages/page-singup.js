import React from 'react';
import InputMask from 'react-input-mask';

import { saveClient, checkEmailExists, updateClient } from '../main/server-requests';
import Loader from '../components/loader';
import '../styles/page-singup.css';

export default class SingUpPage extends React.Component {
    state = {
        client: {
            name: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
        msgUser: '',
        isLoading: false
    }

    constructor(props) {
        super(props);
        this.changeInputValue = this.changeInputValue.bind(this);
        this.validForm = this.validForm.bind(this);
    }

    componentDidMount() {
        if (this.props.data === undefined) return;
        this.updateStates();
    }

    updateStates() {
        this.setState({
            ...this.state,
            client: {
                ...this.state.client,
                name: this.props.data.name,
                lastName: this.props.data.lastName,
                email: this.props.data.email,
                phone: this.props.data.phone
            }
        });
    }

    changeInputValue(e, state) {
        this.setState({
            ...this.state,
            client: {
                ...this.state.client,
                [state]: e.target.value
            }
        })
    }

    validEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    validForm() {

        for (let prp in this.state.client) {
            if (prp === "name" || prp === "lastName") {
                if (this.state.client[prp].length < 3) {
                    this.setState({
                        ...this.state,
                        msgUser: ("O campo " + ((prp === "name") ? 'nome' : "sobrenome") + " deve ter no mínimo 3 letras.")
                    })
                    return;
                }
            }

            if (prp === "email") {
                if (!this.validEmail(this.state.client[prp])) {
                    this.setState({
                        ...this.state,
                        msgUser: "Insira um e-mail válido."
                    })
                    return;
                }
            }
            if (prp === "phone") {
                if (this.state.client[prp].length <= 12) {
                    this.setState({
                        ...this.state,
                        msgUser: "Insira um telefone válido."
                    })
                    return;
                }
            }

            if (prp === "password" && !this.props.isEdit) {
                if (this.state.client[prp].length <= 4) {
                    this.setState({
                        ...this.state,
                        msgUser: "A senha deve conter no mínimo 5 caracteres."
                    })
                    return;
                }
            }
            if (prp === "confirmPassword" && !this.props.isEdit) {
                if (this.state.client[prp] !== this.state.client.password) {
                    this.setState({
                        ...this.state,
                        msgUser: "As senhas não são iguais."
                    })
                    return;
                }
            }

            this.setState({
                ...this.state,
                msgUser: ""
            })
        }
        this.saveClient();
    }

    async saveClient() {
        this.setState({
            ...this.state,
            isLoading: true
        });


        const haveEmail = await checkEmailExists(this.state.client.email);
        if ((haveEmail && !this.props.isEdit) || (haveEmail && this.props.isEdit && this.state.client.email !== this.props.data.email)) {
            this.setState({
                ...this.state,
                isLoading: false,
                msgUser: "Esse email já esta cadastrado em nosso sistema. Por favor insira outro."
            });
            return;
        }


        if (this.props.isEdit) {
            const save = await updateClient(this.state.client)
            if(save.data.status === 1){
                this.setState({
                    ...this.state,
                    isLoading: false,
                    msgUser: "Dados atualizados com sucesso."
                });
            }
        } else {
            const save = await saveClient(this.state.client);
            if (save.data.status === 1) {
                this.setState({
                    ...this.state,
                    isLoading: false,
                    msgUser: "Cadastro realizado com sucesso. Você será redirecionado para o login."
                });
                setTimeout(() => {
                    window.location = '/cliente/login';
                }, 3500);
            }
        }
    }

    render() {
        return (
            <div className={"content-singup " + (this.props.isEdit ? 'edit' : '')}>
                <h2 style={{ display: (this.props.isEdit ? 'none' : 'block') }}>
                    Preencha o formulário abaixo para fazer o cadastro. É rápido e simples.
                </h2>
                <div className="inputs">
                    <label>
                        Nome:
                        <input type="text" onChange={e => { this.changeInputValue(e, "name") }} value={this.state.client.name} />
                    </label>
                    <label>
                        Sobrenome:
                        <input type="text" onChange={e => { this.changeInputValue(e, "lastName") }} value={this.state.client.lastName} />
                    </label>
                    <label>
                        Email:
                        <input type="text" onChange={e => { this.changeInputValue(e, "email") }} value={this.state.client.email} />
                    </label>
                    <label>
                        Telefone:
                        <InputMask mask="(99) 999999999" maskChar="" onChange={e => { this.changeInputValue(e, "phone") }} value={this.state.client.phone} />
                    </label>
                    <label style={{ display: this.props.isEdit ? 'none' : 'block' }}>
                        Senha:
                        <input type="password" onChange={e => { this.changeInputValue(e, "password") }} value={this.state.client.password} />
                    </label>
                    <label style={{ display: this.props.isEdit ? 'none' : 'block' }}>
                        Confirmar Senha:
                        <input type="password" onChange={e => { this.changeInputValue(e, "confirmPassword") }} value={this.state.client.confirmPassword} />
                    </label>
                    <div className="msgs-user" style={{ display: (this.state.msgUser.length > 0) ? 'block' : 'none' }}>
                        {this.state.msgUser}
                    </div>
                    <button onClick={this.validForm}>
                        {(this.props.isEdit ? 'Salvar' : 'Cadastrar')}
                    </button>
                </div>
                <Loader isLoading={this.state.isLoading} />
            </div>
        )
    }
}