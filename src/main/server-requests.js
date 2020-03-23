import axios from 'axios';
import { URL_SERVER, getToken } from '../main/vars';

export async function productById(id){
    const ret = await axios.get(`${URL_SERVER}/api/product/?id=${id}`);
    ret.data[0].image = eval(ret.data[0].image);
    return ret.data[0];
}

export async function productList(amount){
    amount = amount ? amount : 0;
    const ret = await axios.get(`${URL_SERVER}/api/product/?limit=${amount}`);
    ret.data.map(p=>{
        p.image = eval(p.image);
    });
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
            allFilters += `&search=${data.filters[f]}`;
            continue;
        }
        allFilters += `&${f}=${data.filters[f]}`
    }
    let ret = await axios.get(`${URL_SERVER}/api/product/?&limit=${data.amount}${allFilters}`);
    ret.data.map(p=>{
        p.image = eval(p.image);
    });
    if(data.dataSearch){
        return makeSearchResults(ret.data);
    }

    return ret.data;
}

export async function isLoged(){
    const ret = await axios.get(`${URL_SERVER}/api/client/isLoged.php?token=${getToken()}`);
    return ret.data;
}

export async function checkEmailExists(email){
    const ret = await axios.get(`${URL_SERVER}/api/client/checkEmail.php?email=${email}`);
    return ret.data;
}

export async function getAllClientData(){
    const ret = await axios.get(`${URL_SERVER}/api/client/getAllClientData.php?token=${getToken()}`);
    return ret.data;
}

export async function doLogin(pars){
    let params = new URLSearchParams();
    for(let p in pars) {
      params.append(p,pars[p])
  }
    const ret = await axios.post(`${URL_SERVER}/api/client/login.php`, params);
    return ret;
}

export async function updateClient(pars){
    let params = new URLSearchParams();
      for(let p in pars) {
        params.append(p,pars[p])
    }
    params.append('token', getToken());
    const ret = await axios.post(`${URL_SERVER}/api/client/update.php`, params);
    return ret;
}


export async function saveClient(pars){
    let params = new URLSearchParams();
      for(let p in pars) {
        params.append(p,pars[p])
    }
    const ret = await axios.post(`${URL_SERVER}/api/client/create.php`, params);
    return ret;
}

function makeSearchResults(data){
    let brands = {};
    let categories = {};
    let prices = {
        min: 0,
        max: 0
    };
    data.forEach(prod => {
        prod.brand = prod.brand.trim().toLowerCase();
        prod.category = prod.category.trim().toLowerCase();
        if(brands[prod.brand_id] === undefined){
            brands[prod.brand_id] = 
                {
                    name: prod.brand,
                    amount: 1,
                    id: prod.brand_id
                };
        } else {
            brands[prod.brand_id] = 
                {
                    ...brands[prod.brand_id],
                    amount: brands[prod.brand_id].amount + 1
                };
        }
        if(categories[prod.category_id] === undefined){
            categories[prod.category_id] = {
                name: prod.category,
                amount: 1, 
                id: prod.category_id
            }
        } else {
            categories[prod.category_id] = {
                ...categories[prod.category_id],
                amount: categories[prod.category_id].amount + 1
            }
        }
        
        prod.price = parseFloat(prod.price);
        
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