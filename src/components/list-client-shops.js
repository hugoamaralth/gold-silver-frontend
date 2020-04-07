import React from 'react';
import '../styles/list-client-shops.css';
import { getSalesByClientId } from '../main/server-requests';
export default class ListClientShops extends React.Component {
    state = {
        sells: []
    }

    constructor(props){
        super(props);
        this.getSalesData();
        this.goToSale = this.goToSale.bind(this);
    }

    async getSalesData() {
        const sells = await getSalesByClientId(this.props.idClient);
        this.setState({
            sells
        });
    }

    treatDate(date){
        date = date.split(" ");
        let hour = date[1].split(":");
        hour = hour[0]+':'+hour[1];
        date = date[0].split("-");
        date = date[2]+"/"+date[1]+"/"+date[0];
        return date + ' - ' + hour;
    }

    goToSale(code){
        window.location = `/cliente/meupainel/${code}`;
    }

    renderSales() {
        let ret = [];
        this.state.sells.forEach((s,i) => {
            ret.push(<tr key={i}>
                <td>{this.treatDate(s.date)}</td>
                <td>
                    <button onClick={()=>{
                        this.goToSale(s.code);
                    }}>
                        detalhes
                    </button>
                </td>
            </tr>);
        });
        return ret;
    }
    render() {
        return (
            <div>
                <h1>Minhas Compras</h1>
                <table className="table-sales">
                    <thead>
                        <tr>
                            <th>
                                data da compra
                            </th>
                            <th>
                                ver detalhes
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderSales()}
                    </tbody>
                </table>
            </div>
        );
    }
}