const axios=require('axios')
const AxiosInstancePayment = axios.create({
    headers: {'content-type': 'application/json','authorization':process.env.PAYMENT_KEY}
});

module.exports={AxiosInstancePayment}