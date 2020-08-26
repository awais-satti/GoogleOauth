const paypal = require('paypal-rest-sdk');
const express = require('express');
const router = express.Router();

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AcCU0wqzt-DBObrlcY6coL-W-nrF8Mzj1FzXg94ijbvHycbAho3HrWDfa-HRYN18fce9OVBncNKuwVkB',
    'client_secret': 'EE0BKG-9KMWgRiywWIZCBiReQhexGblROxzsTUta2SU5esucLIKNicXCtdmpGvnh_KWYHP1UfUBybRaG'
  });

  



router.get('/pay',(req,res)=> {
    
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/payment/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "lobby entry fee",
                "sku": "001",
                "price": "25.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "25.00"
        },
        "description": "Lobby entry Fee"
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for(let i = 0;i<payment.links.length;i++ ){
            if(payment.links[i].rel === 'approval_url'){
                res.redirect(payment.links[i].href)
            }
        }
    }
});

})

router.get('/success',(req,res)=>{
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "25.00"
            }
        }]
    }
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.send('success')
        }
    });

})

router.get('/cancel',(req,res)=>{
    res.send('CANCELLED')
})








module.exports = router;