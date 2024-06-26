const PaytmChecksum = require('paytmchecksum');
//const PaytmChecksum = require('./PaytmChechsum.js')
const express = require('express');

const Paymentrouter = express();
const User = require('../Modal/Student');
const Entrance = require('../Modal/EntranceDetails');
const Payment = require('../Modal/PaymentD')
//production api detailscos

var mid = process.env.PAYTM_MERCHANT_ID
var key = process.env.PAYTM_MERCHANT_KEY


const paymentDetailsStore = {};
Paymentrouter.post("/apitest/payment", (req, res) => {
  const { amount, email, userid , mobile } = req.body
  const totalAmount = JSON.stringify(amount);




  var orderId = `ORDERID_${Date.now()}`
  var custId = `CUST_${Date.now()}`
  var params = {};

  /* initialize an array */
  paymentDetailsStore[orderId] = { userid };
  (params["MID"] = mid),
    (params["WEBSITE"] = "DEFAULT"),
    (params["CHANNEL_ID"] = "WEB"),
    (params["INDUSTRY_TYPE_ID"] = "Retail"),
    (params["ORDER_ID"] = orderId),
    (params["CUST_ID"] = custId),
    (params["TXN_AMOUNT"] = "1"),
    (params["CALLBACK_URL"] = "http://localhost:7786/callback"),
    (params["EMAIL"] = email),
    (params["MOBILE_NO"] = '6263382707');


  var paytmChecksum = PaytmChecksum.generateSignature(
    params,
    key
  );
  paytmChecksum
    .then(function (checksum) {
      let paytmParams = {
        ...params,
        CHECKSUMHASH: checksum,
      };
      res.json(paytmParams);
    })
    .catch(function (error) {
      console.log(error);
    });
});




Paymentrouter.post("/apitest/epravesh/payment", (req, res) => {
  const { amount ,id } = req.body
  const totalAmount = JSON.stringify(amount);



  paymentDetailsStore[orderId] = {id};
  var orderId = `ORDERID_${Date.now()}`
  var custId = `CUST_${Date.now()}`
  var params = {};

  /* initialize an array */
   paymentDetailsStore[orderId] = { id };
  (params["MID"] = mid),
    (params["WEBSITE"] = "DEFAULT"),
    (params["CHANNEL_ID"] = "WEB"),
    (params["INDUSTRY_TYPE_ID"] = "Retail"),
    (params["ORDER_ID"] = orderId),
    (params["CUST_ID"] = custId),
    (params["TXN_AMOUNT"] ="1.0"),
    (params["CALLBACK_URL"] = "http://localhost:7786/callback"),
    (params["EMAIL"] = "example@gmail.com"),
    (params["MOBILE_NO"] = '6263382707');


  var paytmChecksum = PaytmChecksum.generateSignature(
    params,
    key
  );
  paytmChecksum
    .then(function (checksum) {
      let paytmParams = {
        ...params,
        CHECKSUMHASH: checksum,
      };
      res.json(paytmParams);
    })
    .catch(function (error) {
      console.log(error);
    });
});


Paymentrouter.post("/apitest/entrancepayment", (req, res) => {
  const { amount ,id } = req.body
  const totalAmount = JSON.stringify(amount);



  paymentDetailsStore[orderId] = {id};
  var orderId = `ORDERID_${Date.now()}`
  var custId = `CUST_${Date.now()}`
  var params = {};

  /* initialize an array */
   paymentDetailsStore[orderId] = { id };
  (params["MID"] = mid),
    (params["WEBSITE"] = "DEFAULT"),
    (params["CHANNEL_ID"] = "WEB"),
    (params["INDUSTRY_TYPE_ID"] = "Retail"),
    (params["ORDER_ID"] = orderId),
    (params["CUST_ID"] = custId),
    (params["TXN_AMOUNT"] = "1"),
    (params["CALLBACK_URL"] = "http://localhost:7786/callback"),
    (params["EMAIL"] = "example@gmail.com"),
    (params["MOBILE_NO"] = '6263382707');


  var paytmChecksum = PaytmChecksum.generateSignature(
    params,
    key
  );
  paytmChecksum
    .then(function (checksum) {
      let paytmParams = {
        ...params,
        CHECKSUMHASH: checksum,
      };
      res.json(paytmParams);
    })
    .catch(function (error) {
      console.log(error);
    });
});






Paymentrouter.post('/callback', async (req, res) =>{
  try {
    console.log(req.body)
    console.log(req.body.CURRENCY, 'my code');
    const { ORDERID, RESPMSG, STATUS ,TXNID , BANKTXNID, TXNAMOUNT , PAYMENTMODE  , TXNDATE } = req.body

    var paytmChecksum = req.body.CHECKSUMHASH;
    delete req.body.CHECKSUMHASH;

    var isVerifySignature = PaytmChecksum.verifySignature(req.body, key, paytmChecksum);

    if (isVerifySignature) {
      console.log("Checksum Matched");
      if (req.body.STATUS === "TXN_SUCCESS") {

        const { id } = paymentDetailsStore[ORDERID];

        console.log(id, "in callback");

        //const student = await User.findOne({ _id: userid });
  
        const student =  await Entrance.findByIdAndUpdate(id , { $set: { isPaid:true , txnId:TXNID ,txnAmount:TXNAMOUNT,  txnDate:TXNDATE, paymentMode:PAYMENTMODE, bankTxnId:BANKTXNID } }, { new: true });

        console.log(student , "student ki detail")

       return res.redirect(`http://localhost:3000/success?orderId=${ORDERID}&txnId=${TXNID}&BankTxnId=${BANKTXNID}&paymentMode=${PAYMENTMODE}&TxDate=${TXNDATE}&Transamount=${TXNAMOUNT}&message=${RESPMSG}`);
      } else {
        return res.redirect(`http://localhost:3000/failure?orderId=${ORDERID}&message=${RESPMSG}`);
      }
    } else {
      console.log("Checksum Mismatched");
      return res.send("something went wrong")
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



Paymentrouter.post('/apitest/callback', async (req, res) => {
  try {
   // console.log(req.body)
  //  console.log(req.body.CURRENCY, 'my code');
    const { ORDERID, RESPMSG, STATUS ,TXNID , BANKTXNID, TXNAMOUNT , PAYMENTMODE  , TXNDATE } = req.body

    var paytmChecksum = req.body.CHECKSUMHASH;
    delete req.body.CHECKSUMHASH;

    var isVerifySignature = PaytmChecksum.verifySignature(req.body, key, paytmChecksum);

    if (isVerifySignature) {
      console.log("Checksum Matched");
      if (req.body.STATUS === "TXN_SUCCESS") {

        const { userid } = paymentDetailsStore[ORDERID];

        console.log(userid, "in callback");

        //const student = await User.findOne({ _id: userid });
  
        const student =  await User.findByIdAndUpdate(userid , { $set: { isPaid:true } }, { new: true });
        
     const payment = new Payment({
          orderId: ORDERID,
          txnId: TXNID,
          bankTxnId: BANKTXNID,
          paymentMode: PAYMENTMODE,
          txnDate: TXNDATE,
          txnAmount: TXNAMOUNT,
          responseMessage: RESPMSG,
          status: STATUS,
          student: student._id,
          name:student.name,
          randomId:student.randomId,
          courseName:student.courseName,
          courseType:student.courseType,
          courseBranch:student.courseBranch,
          email:student.email,
          mobile:student.mobile,
          fathersname:student.fathersname,
          mothersname:student.mothersname
        });

      await payment.save();


      // console.log(student  , "ye updated data hai student after the payment")
       return res.redirect(`https://sssutms.ac.in/success?orderId=${ORDERID}&txnId=${TXNID}&BankTxnId=${BANKTXNID}&paymentMode=${PAYMENTMODE}&TxDate=${TXNDATE}&Transamount=${TXNAMOUNT}&message=${RESPMSG}`);
      } else {
        return res.redirect(`https://sssutms.ac.in/failure?orderId=${ORDERID}&message=${RESPMSG}`);
      }
    } else {
      console.log("Checksum Mismatched");
      return res.send("something went wrong")
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = Paymentrouter