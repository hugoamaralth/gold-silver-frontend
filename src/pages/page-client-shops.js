import React from 'react';
import { getShopData } from '../main/server-requests';
import '../styles/page-client-shops.css';

export default class PageClientShops extends React.Component {
    code = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
    state = {
        itens: [],
        feeAmount: 0
    };
    
    constructor(props) {
        super(props);
        this.getData(this.code);
    }

    async getData(code) {
        const data = await getShopData(code);
        this.setState({
            itens:data.items.item,
            feeAmount: data.feeAmount
        });
        console.log(data);
    }

    formatPrice(price){
        return price.toLocaleString('pt-br', { minimumFractionDigits: 2 });
    }

    makeItens(){
        let ret = [];
        this.state.itens.forEach((it,i) => {
            ret.push(
                <tr key={i}>
                    <td>{it.description}</td>
                    <td>{it.quantity}</td>
                    <td>{this.formatPrice(parseFloat(it.amount))}</td>
                    <td>{this.formatPrice(it.amount * it.quantity)}</td>
                </tr>
            )
        });
        return ret;
    }

    render() {
        return (
            <div className="client-shop">
                <h2>Detalhes do pedido</h2>
                <div className="itens">
                    <h4>Itens</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>nome</th>
                                <th>quantidade</th>
                                <th>valor unitário (R$)</th>
                                <th>total item (R$)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.makeItens()}
                        </tbody>
                    </table>
                </div>
                <div className="totals">
                    <div>
                        taxa pagseguro: <b>R${this.formatPrice(this.state.feeAmount)}</b>
                    </div>
                    <div>
                        total: R$55,00
                    </div>
                </div>
            </div>
        );
    }
}