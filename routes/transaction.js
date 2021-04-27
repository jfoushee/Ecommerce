const config = require('./database.js');
const sql = require('mssql/msnodesqlv8');
const stripe = require('stripe')('sk_test_51ILwrhHu4EPSqOXWMClppYzJzdsg3oLgyfQ1aWRdt5q7EmQT6xEWmWXZpoPVxMa4kbPTcH9wWvvJCl0XQni3hpau00aIcKyCGJ');
const YOUR_DOMAIN = 'http://localhost:5000';

async function newTransaction(amount, quantity, productID, merchant_prnID, address1, address2, zipCode, payPalID, payerEmail, payer_prnID) {
  try {
      // make sure that any items are correctly URL encoded in the connection string
      await sql.connect(config)
      const result = await sql.query`INSERT INTO tblTransaction(trnAmount, trnQuantity, trnProductID, trnMerchant_prnID, trnAddress1, trnAddress2, trnZipCode, trnPayPalID, trnPayerEmail, trnPayer_prnID, trnDateCreated)
                                     SELECT ${amount}, ${quantity}, ${productID}, ${merchant_prnID}, ${address1}, ${address2}, ${zipCode}, ${payPalID}, ${payerEmail}, ${payer_prnID}, getDate()`// where id = ${value}`
  } catch (err) {
      // ... error checks
      console.log(err)
  }
}

async function stripeCheckout(cart) {
  return await buildStripeItems(cart).then(item => createStripeSession(item))
};

async function createStripeSession(item) {
  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    payment_method_types: ['card'],
    line_items: item,
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success`,
    cancel_url: `${YOUR_DOMAIN}/fail`,
  });
  return session.id;
}

async function buildStripeItems(cart) {
  let item = []
  for (i = 0; i < cart.items.length; i++) {
    item.push(
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: cart.items[i].Name,
            images: ['http://placehold.it/900x350'] //cart.items[i].image
          },
          // unit_amount: cart.items[i].price.toString().split('.')[0],
          unit_amount_decimal: Number.parseFloat(cart.items[i].price).toFixed(2).toString().replace('.', '')
        },
        quantity: cart.items[i].quantity
      }
    )
  }
  return item;
}

// newTransaction(.01, 1, null, null, 'test street', null, 12345, 78278, 'email@email.com', null)

module.exports = {newTransaction: newTransaction,
                  stripeCheckout: stripeCheckout}