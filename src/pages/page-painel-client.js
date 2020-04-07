import React from 'react';
import { Link } from "react-router-dom";
import { getAllClientData } from '../main/server-requests';
import SingUpPage from './page-singup';
import ListClientShops from '../components/list-client-shops';
import PageClientBasket from './page-client-basket';
import PageClientShops from './page-client-shops';
import '../styles/page-painelclient.css';

export default class PagePanelClient extends React.Component {
    state = {
        page: window.location.pathname.split('/')[window.location.pathname.split('/').length - 1],
        clientData: null
    }
    constructor(props) {
        super(props);
        this.updatePage = this.updatePage.bind(this);
        this.getAllClientData();
    }
    async getAllClientData() {
        const data = await getAllClientData();
        if (data === false && this.state.page !== "cesta") {
            window.location = '/cliente/login'
        }
        await this.setState({
            ...this.state,
            clientData: data["user-data"]
        });
    }
    async updatePage(page) {
        await this.setState({
            ...this.state,
            page
        });
        await this.getAllClientData();
    }
    render() {
        return (
            <div className="page-painel-client">
                <div className="menu-painel-client">
                    <ul>
                        <Link to='/cliente/meupainel/dados' onClick={() => this.updatePage("dados")}>
                            <li style={{ fontWeight: (this.state.page === "dados" || this.state.page === "meupainel" || this.state.page === "") ? 'bold' : 'normal' }}>
                                Meus dados
                            </li>
                        </Link>
                        <Link to='/cliente/meupainel/cesta' onClick={() => this.updatePage("cesta")}>
                            <li style={{ fontWeight: (this.state.page === "cesta") ? 'bold' : 'normal' }}>
                                Minha cesta
                            </li>
                        </Link>
                        <Link to='/cliente/meupainel/compras' onClick={() => this.updatePage("compras")}>
                            <li style={{ fontWeight: (this.state.page === "compras") ? 'bold' : 'normal' }}>
                                Minhas compras
                            </li>
                        </Link>
                        <Link to='/cliente/sair'>
                            <li>
                                Sair
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className="content-painel-client">
                    {this.getPage()}

                </div>
            </div>
        )
    }

    getPage() {
        let ret = null;
        if (this.state.clientData === null) return;
        console.log(this.state.page);
        switch (this.state.page) {
            case "compras": ret = <ListClientShops idClient={this.state.clientData.id} />;
                break;
            case "cesta": ret = <PageClientBasket basket={this.props.basket} clientData={this.state.clientData} handlerRemoveItemBasket={this.props.handlerRemoveItemBasket} />;
                break;
            default: ret = this.state.page.length > 11 ? <PageClientShops /> : <SingUpPage isEdit={true} data={this.state.clientData} />;
                break;
        }
        return ret;
    }
}