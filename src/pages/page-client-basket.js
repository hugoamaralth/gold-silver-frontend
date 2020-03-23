import React from 'react';
import '../styles/page-clientbasket.css';
import ItemBaket from '../components/item-basket';
import { Link } from 'react-router-dom';
export default class PageClientBasket extends React.Component {
    constructor(props) {
        super(props);
    }

    makeBasketLines() {
        let ret = [];
        let organize = {};
        this.props.basket.map(it => {
            if (organize[it.id] === undefined || organize[it.id] === null) {
                organize[it.id] = it;
                organize[it.id].amount = 1;
            } else {
                organize[it.id].amount++;
            }
        });
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
        this.props.basket.map(it => {
            total += parseFloat(it.price);
        });
        return this.formatMoney(total);
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
                <div className="buttons">
                    <Link to="/buscar">
                        <button>Continuar Comprando</button>
                    </Link>
                    <Link to="/pagamento">
                        <button className="finished">Finalizar compras</button>
                    </Link>
                </div>
            </div>
        );
    }
}