import React from 'react';
import ImageGallery from 'react-image-gallery';
import BtnCart from '../components/btn-add-to-cart';
import Slider from "react-slick";
import { URL_SERVER } from "../main/vars";
import { slidersConfig } from '../core/configSliders';
import ProductShowcase from '../components/product-showcase';
import { productById, productListFilter } from '../main/server-requests';
import "react-image-gallery/styles/css/image-gallery.css";
import '../styles/page-product.css';

class ProductPage extends React.Component {
    state = {
        prod: {
            productPictures: [],
            price: '00,00',
            image: ''
        },
        relatedProds: []
    };

    id = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.setState({
            ...this.state,
            id: this.id
        })
        this.getDatas();
    }

    componentWillReceiveProps() {
        this.getDatas();
    }

    getProdImages() {
        let productPictures = [];
        this.state.prod.image.map(image => {
            productPictures.push({
                original: `${URL_SERVER}/pics/products/${image}`,
                thumbnail: `${URL_SERVER}/pics/products/${image}`
            });
        });
        this.setState({
            ...this.state,
            prod: {
                ...this.state.prod,
                productPictures
            }
        })
    }

    getDatas() {
        const id = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
        productById(id).then(data => {
            console.log(data);
            this.setState({
                ...this.state,
                prod: {
                    ...data,
                    productPictures: []
                }
            })
        })
            .then(() => {
                this.getProdImages();
            })
            .then(() => {
                productListFilter({
                    filters: {
                        category: this.state.prod.category_id,
                    },
                    shuffle: true
                }).then(data => {
                    console.log(data);
                    this.setState({
                        ...this.state,
                        relatedProds: data.filter(p => p.id !== this.id)
                    })
                })
            })
    }

    makeProducts() {
        let ret = [];
        for (let prod in this.state.relatedProds) {
            let p = this.state.relatedProds[prod];
            ret.push(<ProductShowcase prod={p} key={p.id} />);
        }
        return ret;
    }

    get slidersConfig() {
        const amount = this.state.relatedProds.length;
        if(amount === 0) return {};
        let ret = JSON.parse(JSON.stringify(slidersConfig));
        ret.slidesToShow = (ret.slidesToShow > amount) ? amount : ret.slidesToShow;
        ret.responsive.map(r => {
            r.settings.slidesToShow = (r.settings.slidesToShow > amount) ? amount : r.settings.slidesToShow;
        })
        return {
            ...ret
        }
    }

    render() {

        return (
            <div className="product-page">
                <div className="breadcrumb">
                    Home > {this.state.prod.category} > {this.state.prod.marca}
                </div>
                <div className="content-product">
                    <div className="product-photo">
                        <ImageGallery items={this.state.prod.productPictures} showPlayButton={false} />
                    </div>
                    <div className="product-description-page">
                        <h1>
                            {this.state.prod.name} <span>{this.state.prod.marca}</span>
                        </h1>
                        <BtnCart prod={this.state.prod} handlerAddToBasket={this.props.handlerAddToBasket} />
                        <p>{this.state.prod.description}</p>
                    </div>
                </div>
                <div className="relatedProducts" style={{display: (this.state.relatedProds.length > 0) ? 'block' : 'none'}}>
                    <h3>Produtos relacionados</h3>
                    <Slider {...this.slidersConfig}>
                        {this.makeProducts()}
                    </Slider>
                </div>
            </div>
        )
    }
}

export default ProductPage;