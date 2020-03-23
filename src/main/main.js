import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";

import HomePage from '../pages/page-hompage';
import ProductPage from '../pages/page-product';
import Search from '../pages/page-search';
import SingUpPage from '../pages/page-singup';
import LoginPage from '../pages/page-login';
import LogoutPage from '../pages/page-logout';
import PagePayment from '../pages/page-payment';
import PagePanelClient from '../pages/page-painel-client';

import Header from '../components/header';
import Footer from '../components/footer';
import FooterMobile from '../components/footer-mobile';
import Menu from '../components/menu';
import ScrollTop from '../core/scrollTop';

export default class Main extends React.Component {
    constructor(props){
        super(props);
        this.openCloseMenu = this.openCloseMenu.bind(this);
        this.addToBasket = this.addToBasket.bind(this);
        this.removeFromBasket = this.removeFromBasket.bind(this);
        const basket = JSON.parse(localStorage.getItem("basket_gs")) ? JSON.parse(localStorage.getItem("basket_gs")).basket : [];
        this.state = {
            menuOpened : false,
            basket
        }
    }
    async removeFromBasket(id){
        let { basket } = this.state;
        basket = basket.filter(it=> it.id !== id);
        localStorage.setItem('basket_gs', JSON.stringify({basket}));
        this.setState({
            ...this.state,
            basket
        });
    }
    addToBasket(item, amount){
        item.amount = amount;
        let basket = this.state.basket;
        basket.push(item);
        localStorage.setItem('basket_gs', JSON.stringify({basket}));
        this.setState({
            ...this.state,
            basket
        });
        window.location = '/cliente/meupainel/cesta'
    }
    openCloseMenu(){
        this.setState(
            {
                ...this.state,
                menuOpened : !this.state.menuOpened
            }
        );
    }
    
    render(){
        return(
            <div className="main">
                <Header />
                <div className="pages">
                    <Switch>
                        <Route exact path='/' component={()=>(<HomePage />)} />
                        <Route path='/produto/:id' component={()=>(<ProductPage handlerAddToBasket={this.addToBasket} />)} />
                        <Route path='/buscar' component={()=>(<Search />)} />
                        <Route path='/cliente/cadastro' component={()=>(<SingUpPage />)} />
                        <Route path='/cliente/login' component={()=>(<LoginPage />)} />
                        <Route path='/cliente/sair' component={()=>(<LogoutPage />)} />
                        <Route path='/cliente/meupainel*' component={()=>(<PagePanelClient handlerRemoveItemBasket={this.removeFromBasket} basket={this.state.basket} />)} />
                        <Route path='/pagamento' component={()=>(<PagePayment basket={this.state.basket} />)} />
                        <Route path='*' exact={true} component={()=>(<HomePage />)} />
                    </Switch>
                </div>

                <FooterMobile openCloseMenu={this.openCloseMenu} menuOpened={this.state.menuOpened} basketAmount={this.state.basket.length} />
                <Footer />
                <Menu opened={this.state.menuOpened} openCloseMenu={this.openCloseMenu} basketAmount={this.state.basket.length} />
                <ScrollTop />
            </div>
            )
    }
}