const axios = require('axios');

export default axios.create({
    baseURL:'https://mysterious-river-61775.herokuapp.com',
    // baseURL: 'http://localhost:3000',
    headers: {"Access-Control-Allow-Origin": "*"}
});

// export const baseURL='http://localhost:8000'

// export const serverbaseURL='http://localhost:3000'

export const baseURL='https://szycietozycie.firebaseapp.com/'

export const serverbaseURL='https://mysterious-river-61775.herokuapp.com'

