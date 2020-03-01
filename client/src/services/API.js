const axios = require('axios')

function kebabCaseToCamel(str) {
  return str.replace( /(-\w)/g, (matches) => matches[1].toUpperCase())
}

class API {
  constructor({ url }){
    this.url = url
    this.endpoints = {}
  }
  /**
   * Create and store a single entity's endpoints
   * @param {A entity Object} entity
   */
  createEntity(entity) {
    /**
     * If there is a - in the entity.name, then change it 
     * to camelCase. E.g 
     * ```
     * myApi.createEntity({ name : 'foo-bar'})
     * myApi.endpoints.fooBar.getAll(...)
     */

    const name = kebabCaseToCamel(entity.name)
    this.endpoints[name] = this.createBasicCRUDEndpoints(entity)
  }

  createEntities(arrayOfEntity) {
    arrayOfEntity.forEach(this.createEntity.bind(this))
  }
  /**
   * Create the basic endpoints handlers for CRUD operations
   * @param {A entity Object} entity
   */
  createBasicCRUDEndpoints( { name } ) {
    var endpoints = {}

    const resourceURL = `${this.url}/${name}`

    endpoints.getAll = ({ params={}}, config={} ) => axios.get(resourceURL, { params }, config)

    endpoints.getOne = ({ id }, config={}) =>  axios.get(`${resourceURL}/${id}`, config)

    endpoints.create = (toCreate, config={}) =>  axios.post(resourceURL, toCreate, config)

    endpoints.update = (toUpdate, config={}) => axios.put(`${resourceURL}/${toUpdate.id}`, toUpdate, config)

    endpoints.patch  = ({id}, toPatch, config={}) => axios.patch(`${resourceURL}/${id}`, toPatch, config)

    endpoints.delete = ({ id }, config={}) => axios.delete(`${resourceURL}/${id}`, config)

    return endpoints

  }

}

export default API


const urls = {
    fetchUrl: '',
    apikey: '2IZ7T22DCQJIF88Y',


    // This API returns intraday time series (timestamp, open, high, low, close, volume) of the equity specified.
    intradayData: 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=demo',

    /*
    This API returns daily time series (date, daily open, daily high, 
    daily low, daily close, daily volume, daily adjusted close, and split/dividend events) of the global equity specified
    */
    historicalDataDaily: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=MSFT&apikey=demo&datatype=csv',


    /*
    This API returns weekly adjusted time series (last trading day of each week, weekly open, weekly high, 
    weekly low, weekly close, weekly adjusted close, weekly volume, weekly dividend) of the global equity specified
    */
    historicalDataWeekly: 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=MSFT&apikey=demo&datatype=csv',

    /*
    This API returns monthly adjusted time series (last trading day of each month, monthly open, monthly high, 
    monthly low, monthly close, monthly adjusted close, monthly volume, monthly dividend) of the equity specified
    */
    historicalDataMonthly: 'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=MSFT&apikey=demo&datatype=csv',

    /*
    A lightweight alternative to the time series APIs, 
    this service returns the latest price and volume information for a security of your choice.
    */
    lightWeightLatest: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo',

    /*
    We've got you covered! The Search Endpoint returns the best-matching symbols and market information based on keywords of your choice. 
    The search results also contain match scores that provide you with the full flexibility to develop your own search and filtering logic.
    */
    searchEndpoint: 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=BA&apikey=demo&datatype=csv',


    testUrl: 'https://restful-stock-api.herokuapp.com/getmsg/?name=Jacob'
}