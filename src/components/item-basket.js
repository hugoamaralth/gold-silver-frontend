import React from 'react';
import { URL_SERVER } from '../main/vars';
import { Link } from "react-router-dom";
export default props => {
    
    return(
    <tr className="item-basket">
        <td className="item-basket-image">
            <img src={`${URL_SERVER}/pics/products/${props.data.image[0]}`} />
        </td>
        <td className="item-basket-name">
            <Link to={`/produto/${props.data.id}`}>
                {props.data.name}
            </Link>
        </td>
        <td className="item-basket-brand">
            {props.data.brand}
        </td>
        <td className="item-basket-amount">
            {props.data.amount}
        </td>
        <td className="item-basket-unicprice">
            {formatMoney(props.data.price)}
        </td>
        <td className="item-basket-totalprice">
            {totalPrice(props.data.amount, props.data.price)}
        </td>
        <td className="item-basket-remove">
            <button onClick={()=>{
                props.removeItemBasket(props.data.id);
            }}>
                remover
            </button>
        </td>
    </tr>
    )
}
function totalPrice(amount, price){
    price = parseFloat(price);
    const total = formatMoney(price * amount);
    return total;
}
function formatMoney(str){
    let price = parseFloat(str).toLocaleString('pt-br',{minimumFractionDigits:2});
    return price
}