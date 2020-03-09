import React from 'react';
import { Link } from "react-router-dom";
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/product-showcase.css';

export default (props) => {
    let price = props.prod.price.toLocaleString('pt-br',{minimumFractionDigits:2});
    price = price.split(',');
    price[1] = (price.length > 1) ? price[1] : '00';
    price = <div>R$<span>{price[0]}</span>,{price[1]}</div>;
    return (
        <div className="item-showcase">
            <img src={props.prod.image} />
            <h4>
                {props.prod.name.trim()}
                <span>
                    {props.prod.brand.trim()}
                </span>
            </h4>
            <div className="product-description">
                <div className="price">
                    {price}
                </div>
                <Link to={`/produto/${props.prod.id}`}>
                    <button>
                        Ver produto
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                </Link>
            </div>
        </div>
    );
}