import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faUserCircle, faEnvelope, faHome, faUser, faUserPlus, faFilter, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { isLoged } from "../main/server-requests";

import '../styles/menu.css';


import SearchBox from '../components/search-box';
import Logo from '../components/logo';

export default class Menu extends React.Component {

    state = {
        loged: false
    }

    constructor(props) {
        super(props);
        this.checkLoged();
    }

    async checkLoged() {
        const loged = await isLoged();
        if (loged) {
            this.setState({
                loged: true
            })
        }
    }

    render() {
        return (
            <div className={`menu ${this.props.opened ? '' : 'closed'}`}>
                <div className="content">
                    <Link to='/' onClick={this.props.openCloseMenu}>
                        <Logo />
                    </Link>
                    <SearchBox />
                    <ul>
                        <li>
                            <Link to='/' onClick={this.props.openCloseMenu}>
                                <FontAwesomeIcon icon={faHome} />
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to='/buscar' onClick={this.props.openCloseMenu}>
                                <FontAwesomeIcon icon={faFilter} />
                                Filtrar produtos
                            </Link>
                        </li>
                        <li>
                            <Link to='/cliente/meupainel/cesta' onClick={this.props.openCloseMenu}>
                                <FontAwesomeIcon icon={faShoppingBasket} />
                                Minha cesta
                                <span className="fa-layers-counter">
                                    {this.props.basketAmount}
                                </span>
                            </Link>
                        </li>

                        {this.tagsUser()}
                    </ul>
                </div>
            </div>
        );
    }

    tagsUser() {
        if (this.state.loged) {
            return (
                <section>
                    {/* <li>
                        <FontAwesomeIcon icon={faEnvelope} />
                        Mensagens
                        <span className="fa-layers-counter">
                            0
                        </span>
                    </li> */}
                    <li>
                    <Link to='/cliente/meupainel' onClick={this.props.openCloseMenu}>
                        <FontAwesomeIcon icon={faUserCircle} />
                        Meu painel
                    </Link>
                   </li>
                    <li>
                        <Link to='/cliente/sair' onClick={this.props.openCloseMenu}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        Sair
                    </Link>
                    </li>
                </section>
            )
        } else {
            return (
                <section>
                    <li>
                        <Link to='/cliente/cadastro' onClick={this.props.openCloseMenu}>
                            <FontAwesomeIcon icon={faUserPlus} />
                    Cadastre-se
                </Link>
                    </li>
                    <li>
                        <Link to='/cliente/login' onClick={this.props.openCloseMenu}>
                            <FontAwesomeIcon icon={faUser} />
                        Login
                    </Link>
                    </li>
                </section>
            )
        }
    }
}