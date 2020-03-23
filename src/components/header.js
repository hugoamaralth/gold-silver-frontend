import React from 'react';
import { Link } from "react-router-dom";
import { isLoged } from "../main/server-requests";

import SearchBox from '../components/search-box';
import Logo from '../components/logo';

import '../styles/header.css';

export default class Header extends React.Component {
    state = {
        loged: false,
        name: ''
    }
    constructor(props) {
        super(props);
        this.checkLogin();
    }

    async checkLogin(){
        const loged = await isLoged();
        if (loged) {
            this.setState({
                loged: true,
                name: loged.name.split(" ")[0]
            })
        }
    }

    render() {
        return (
            <header className="header-site-mobile">
                <div className='top-mobile'>
                    <div>
                        <Link to='/'>
                            <Logo />
                        </Link>
                    </div>
                    <div className="welcome" style={{display: (this.state.loged) ? 'block' : 'none'}}>
                        Bem vindo, {this.state.name}!
                    </div>
                    <SearchBox />
                </div>

            </header>
        )
    }
}