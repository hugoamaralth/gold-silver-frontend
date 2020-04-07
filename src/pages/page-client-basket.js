import React from 'react';
import '../styles/page-clientbasket.css';
import ItemBaket from '../components/item-basket';
import Messager from '../components/messager';
import { Link } from 'react-router-dom';
import Loader from '../components/loader';
import { doPayment, saveSale, isLoged } from '../main/server-requests';
export default class PageClientBasket extends React.Component {
    state = {
        msgUser: '',
        isLoading: false
    }
    basketToPayment = {};
    constructor(props) {
        super(props);
        this.doPayment = this.doPayment.bind(this);
    }

    makeBasketLines() {
        let ret = [];
        let organize = {};
        this.props.basket.forEach(it => {
            if (organize[it.id] === undefined || organize[it.id] === null) {
                organize[it.id] = it;
                organize[it.id].amount = 1;
            } else {
                organize[it.id].amount++;
            }
        });
        this.basketToPayment = organize;
        for (let it in organize) {
            ret.push(<ItemBaket removeItemBasket={this.props.handlerRemoveItemBasket} data={{ ...organize[it] }} key={organize[it].id} />);
        }
        return ret;
    }
    formatMoney(str) {
        let price = parseFloat(str).toLocaleString('pt-br', { minimumFractionDigits: 2 });
        return price
    }
    getTotal() {
        let total = 0;
        this.props.basket.forEach(it => {
            total += parseFloat(it.price);
        });
        return this.formatMoney(total);
    }
    async doPayment() {
        const loged = await isLoged();
        if (!loged) {
            this.setState({
                msgUser: 'Você precisa fazer o login para realizar o pagamento.'
            });
            return;
        }
        const request = await doPayment(this.basketToPayment, this.props.clientData);
        const code = request.data;
        window.PagSeguroLightbox(code, {
            success: async (transactionCode) => {
                const save = await saveSale(transactionCode, this.props.clientData.id);
                if(save){
                    localStorage.removeItem("basket_gs");
                    window.location = '/cliente/meupainel/compras';
                }
            },
            abort: () => {
                this.setState({
                    msgUser: 'Compra cancelada.'
                });
            }
        });
    }
    render() {
        return (
            <div className="basket-client">
                <h2>Produtos na cesta</h2>
                <table>
                    <thead>
                        <tr className="item-basket">
                            <th className="item-basket-image">

                            </th>
                            <th className="item-basket-name">
                                nome
                            </th>
                            <th className="item-basket-brand">
                                marca
                            </th>
                            <th className="item-basket-amount">
                                qntd
                            </th>
                            <th className="item-basket-unicprice">
                                valor R$
                            </th>
                            <th className="item-basket-totalprice">
                                Total R$
                            </th>
                            <th className="item-basket-remove">
                                remover
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.makeBasketLines()}
                    </tbody>
                </table>
                <div className="total">
                    Total: <b>R${this.getTotal()}</b>
                </div>
                <Messager message={this.state.msgUser} />
                <div className="buttons">
                    <Link to="/buscar">
                        <button>Continuar Comprando</button>
                    </Link>
                    <button className="finished" onClick={this.doPayment}>pagamento</button>
                </div>
                <Loader isLoading={this.state.isLoading} />
            </div>
        );
    }
}