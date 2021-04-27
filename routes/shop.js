const config = require('./database.js');
const sql = require('mssql/msnodesqlv8');

async function productQuery(prdID) {
  try {
      // make sure that any items are correctly URL encoded in the connection string
      await sql.connect(config)
      
      if (prdID == null) {
        const result = await sql.query`SELECT * FROM tblProduct`// where id = ${value}`
        const images = await sql.query`SELECT * FROM tblProductImage`
        return [result, images]
      } 
      else {
        const result = await sql.query`SELECT * FROM tblProduct WHERE prdID = ${prdID}`// where id = ${value}`
        const images = await sql.query`SELECT * FROM tblProductImage WHERE priProduct_prdID = ${prdID}`
        return [result, images]
      }
      
  } catch (err) {
      // ... error checks
      console.log(err)
  }
}

async function addProduct(name, description, price, detail, images) {
  try {
    await sql.connect(config)
    sql.query`INSERT INTO tblProduct(prdName, prdDescription, prdPrice, prdIcon)
              SELECT ${name}, ${description}, ${price}, ${images}
              INSERT INTO tblProductDetail(pddProduct_prdID, pddDetail)
              SELECT MAX(prdID), ${detail} FROM tblProduct`
    let result = await sql.query`SELECT MAX(prdID) AS prdID FROM tblProduct`
    return result.recordset[0].prdID
  }
  catch(err){
    console.error
  }
}

async function addImage(prdID, path) {
  try {
    console.log(path)
    await sql.connect(config)
    await sql.query`INSERT INTO tblProductImage (priProduct_prdID, priName)
                    SELECT ${prdID}, ${path}`
    return result.recordset
  }
  catch(err){
    console.error
  }
}

async function deleteProduct(prdID) {
  try {
    await sql.connect(config)
    await sql.query`DELETE FROM tblProductImage WHERE priProduct_prdID = ${prdID}
                    DELETE FROM tblProductDetail WHERE pddProduct_prdID = ${prdID}
                    DELETE FROM tblProduct WHERE prdID = ${prdID}`
  }
  catch(err){
    console.error
  }
}

async function changeOrdinal(prdID, direction) {
  try {
    await sql.connect(config)
    if (direction == 'up') {
      await sql.query`UPDATE tblProduct
                      SET prdOrdinal = prdOrdinal - 1
                      WHERE prdID = ${prdID}`
    }
    else if (direction == 'down') {
      await sql.query`UPDATE tblProduct
                      SET prdOrdinal = prdOrdinal + 1
                      WHERE prdID = ${prdID}`
    }
  }
  catch(err){
    console.error
  }
}

async function loopCartItems(cart) {
  for (i = 0; i < cart.items.length; i++) {
    cart.items[i].price = await priceFetch(cart.items[i].id)
  }
  totalCart(cart);
  // console.log(cart);
  return cart
}

async function priceFetch(prdID) {
  try {
      // make sure that any items are correctly URL encoded in the connection string
      await sql.connect(config)
        const result = await sql.query`SELECT prdPrice FROM tblProduct WHERE prdID = ${prdID}`
        return result.recordset[0].prdPrice
  } catch (err) {
      // ... error checks
      console.log(err)
  }
}

function totalCart(cart){
  cart.total = 0
  for (i = 0; i < cart.items.length; i++) {
      cart.total = cart.total + (cart.items[i].quantity * cart.items[i].price)
  }
};

// async function imageFetch(prdID){
//   try {
//     // make sure that any items are correctly URL encoded in the connection string
//     await sql.connect(config)
//       // const result = await sql.query`SELECT * FROM tblProductImage WHERE priProduct_prdID = ${prdID}`
//       const result = await sql.query`SELECT * FROM tblProductImage`
//       return result.recordset
// } catch (err) {
//     // ... error checks
//     console.log(err)
// }
// }


// newTransaction(.01, 1, null, null, 'test street', null, 12345, 78278, 'email@email.com', null)

module.exports = {
  productQuery: productQuery,
  addProduct: addProduct,
  addImage: addImage,
  deleteProduct: deleteProduct,
  changeOrdinal: changeOrdinal,
  priceFetch: priceFetch,
  loopCartItems: loopCartItems
}