var express = require('express');
var router = express.Router();
express.static('views');
const transaction =  require('./transaction')
const shop = require('./shop')

let cart = {
  items: [],
  total: 0
}

router.get('/', function(req, res) {
    shop.productQuery(null).then(result => res.render('home', {data: result[0].recordset,
                                                               cart: req.session.cart || cart,
                                                               images: result[1].recordset
                                                              }
                                                    )
                              )
  });

router.get('/shop', function(req, res) {
  shop.productQuery(null).then(result => res.render('shop', {data: result[0].recordset,
                                                             cart: req.session.cart || cart,
                                                             images: result[1].recordset
                                                            }
                                                  )
                            )
  });

router.post('/shop', function(req, res) {
  shop.productQuery(null).then(result => res.render('shop', {data: result[0].recordset,
                                                              cart: req.session.cart || cart,
                                                              page: req.body.page,
                                                              images: result[1].recordset
                                                            }
                                                  )
                            )
  });

router.get('/admin', function(req, res) {
  shop.productQuery(null).then(() => res.render('edit', {data: results.recordset,
                                                         images: result[1].recordset}) )
})

router.post('/data', function(req, res, next) {
  try {
    transaction.newTransaction(req.body['purchase_units'][0]['amount'].value /*Total Amount*/,
                             req.body['units'] /*Quantity*/, 
                             null /*trnProductID*/,
                             null /*trnMerchant_prnID*/,
                             req.body['purchase_units'][0]['shipping'].address.address_line_1 /*address line 1*/, 
                             req.body['purchase_units'][0]['shipping'].address.address_line_2 /*address line 2*/,
                             req.body['purchase_units'][0]['shipping'].address.postal_code /*zip*/,
                             req.body['id'] /*Paypal Transaction ID*/,
                             req.body['payer'].email_address /*Payer Email*/,
                             null /*trnPayee_prnID*/);
    } catch (err) {
    console.log(err)
    }
  res.sendStatus(200);
  }
)

router.post('/product', function(req, res) {
  shop.productQuery(req.body.prdID)
  .then(result => res.render('product', {data: result[0].recordset,
                                         cart: req.session.cart || cart,
                                         images: result[1].recordset}
        ) 
      )
    }
)

router.post('/add', function(req, res) {
  if (Array.isArray(req.files.prdImage)){
    shop.addProduct(req.body.prdName, req.body.prdDescription, req.body.prdPrice, req.body.prdDetail)
    .then(prdID => req.files.prdImage.forEach((element, index) => storeImage(prdID, element, index)))
    // .then(prdID => req.files.prdImage.forEach((element, index) => element.mv('./public/images/products/' + req.files.prdImage[index].name, shop.addImage(prdID, req.files.prdImage[index].name))))
    .then(res.redirect('/dashboard/addproduct'))
  }
  else{
    shop.addProduct(req.body.prdName, req.body.prdDescription, req.body.prdPrice, req.body.prdDetail)
    .then(prdID => storeImage(prdID, req.files.prdImage, 0))
    // .then(prdID => req.files.prdImage.forEach((element, index) => element.mv('./public/images/products/' + req.files.prdImage[index].name, shop.addImage(prdID, req.files.prdImage[index].name))))
    .then(res.redirect('/dashboard/addproduct'))
  }
})

function storeImage(prdID, element, index){
  element.mv('./public/images/products/' + prdID + index +'.png');
  shop.addImage(prdID, `${prdID}` + `${index}` + '.png');
}

router.post('/cartlist', function(req, res) {
  // shop.loopCartItems(req.body).then(result => req.session.cart = JSON.stringify(result)).then(() => res.sendStatus(200));
  shop.loopCartItems(req.body).then(result => req.session.cart = result).then(() => res.sendStatus(200));
})

router.get('/cartlist', function(req, res){
  res.json(req.session.cart || cart)
})

router.get('/checkout', function(req, res){
  res.render('checkout', {cart: req.session.cart || cart,
                          images: result[1].recordset})
})

router.get('/success', function(req, res){
  res.render('success')
})

router.get('/fail', function(req, res){
  res.render('fail')
})

router.post('/stripecheckout', async (req,res) => {
  let stripeSessionID = await transaction.stripeCheckout(req.session.cart) 
  res.json(stripeSessionID)
})

router.get('/cart', function(req, res){
  res.render('cart', {cart: req.session.cart || cart,
                      images: result[1].recordset})
})

router.get('/dashboard', function(req, res){
  res.render('dashboard')
})
module.exports = router;

router.get('/dashboard/addproduct', function(req, res){
  res.render('addproduct')
})
module.exports = router;

router.get('/dashboard/productlist', function(req, res){
  shop.productQuery(null).then(result => res.render('productlist', {data: result[0].recordset,
                                                                    images: result[1].recordset}
                                                  )
                            )
  }
);


module.exports = router;