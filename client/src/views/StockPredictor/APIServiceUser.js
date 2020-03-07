import API from '../../services/API';;

const axios = require('axios');

const myApi = new API({ url:'https://restful-stock-api.herokuapp.com' });

const APIServiceUser = {
    fetchSearch: async(keywords) => {
        myApi.createEntity({ name: 'search' });
        return myApi.endpoints.search.getAll({ params: {keywords: keywords} })
            .then(res => res.data);
    },

    fetchCompanyInfo: async(equity) => {
        myApi.createEntity({ name: 'getinfo' });
        return myApi.endpoints.getinfo.getAll({ params: {equity: equity} })
            .then(res => res.data);
    },

    fetchCompanyHistory: async(equity, period) => {
        myApi.createEntity({ name: 'gethistory' });
        return myApi.endpoints.gethistory.getAll({ params: {equity: equity, period: period} })
            .then(res => res.data);
    },

    fetchCompanyHistoryAlpha: async(equity, func) => {
        myApi.createEntity({ name: 'gethistoryalpha' });
        return myApi.endpoints.gethistoryalpha.getAll({ params: {equity: equity, function: func} })
            .then(res => res.data);
    },

    fetchTest: async() => {
        return axios.get(myApi.url)
        .then(setTimeout(function (response) {
            console.log(response);
        }), 3000);
    }
}

export default APIServiceUser;