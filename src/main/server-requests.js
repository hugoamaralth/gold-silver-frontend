import axios from 'axios';

//const URL_SERVER = 'http://localhost/gold-silver-backend/api/';
const URL_SERVER = 'http://eletricagoldsilver.com.br/api/';

export async function productById(id){
    const ret = await axios.get(`${URL_SERVER}product/?id=${id}`);
    return ret.data[0];
}

export async function productList(amount){
    amount = amount ? amount : 0;
    const ret = await axios.get(`${URL_SERVER}product/?limit=${amount}`);
    return shuffle(ret.data);
}

export async function productListFilter(data){
    data.amount = data.amount ? data.amount : 0;
    let allFilters = '';
    for(let f in data.filters){
        if(f === "amount" || f === "shuffle" || f === "dataSearch") continue;
        if(data.filters[f] === null) continue;
        if(f === "prices"){
            if(data.filters[f].min === 0 || data.filters[f].max === 0) continue;
            allFilters += `&priceMin=${data.filters[f].min}&priceMax=${data.filters[f].max}`; 
            continue;
        }
        if(f === "name"){
            allFilters += `&${f}__regex=/^${data.filters[f]}/i`;
            continue;
        }
        allFilters += `&${f}=${data.filters[f]}`
    }
    let ret = await axios.get(`${URL_SERVER}product/?&limit=${data.amount}${allFilters}`);

    if(data.dataSearch){
        return makeSearchResults(ret.data);
    }
    return ret.data;
}

function makeSearchResults(data){
    let brands = {};
    let categories = {};
    let prices = {
        min: 0,
        max: 0
    };
    data.forEach(prod => {
        if(brands[prod.brand] === undefined){
            brands[prod.brand] = 1;
        } else {
            brands[prod.brand]++;
        }
        if(categories[prod.category] === undefined){
            categories[prod.category] = 1;
        } else {
            categories[prod.category]++;
        }
        if(prices.min === 0){
            prices.min = prod.price;
            prices.max = prod.price;
        }
        if(prod.price > prices.max){
            prices.max = prod.price;
        }
        if(prod.price < prices.min){
            prices.min = prod.price;
        }
    });
    return {
        amount: data.length,
        brands,
        categories,
        prices,
        results: data
    };
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}