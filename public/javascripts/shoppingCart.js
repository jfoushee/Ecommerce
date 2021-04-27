var cart = fetch('/cartlist').then(response => response.json()).then(data => cart = data);

function addCartItem(prdName, prdQuantity, prdPrice, prdImage, prdID){
    addElement(prdName, prdPrice, prdQuantity)
    cart.items.push({Name: prdName, quantity: prdQuantity, price: prdPrice, image: prdImage, id: prdID});
    updateCartTotal(totalCart(postCart()))
}

function deleteCartItem(itemNumber) {
    cart.items.splice(itemNumber, 1);
    deleteElement(itemNumber)
    updateCartTotal(totalCart(postCart()))
}

function totalCart(){
    let count = cart.items.length
    cart.total = 0
    for (i = 0; i < count; i++) {
        cart.total = cart.total + (cart.items[i].quantity * cart.items[i].price)
    };
    return cart.total.toFixed(2)
}

function postCart() {
    fetch('/cartlist', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(cart)
    })
}

function deleteElement(index){
    let parentElement = document.getElementById('cartList')
    parentElement.removeChild(parentElement.children[index])
    orderElement();
}

function orderElement(){
    let elements = document.getElementsByClassName('deleteCart')
    let count = elements.length
    for (i = 0; i < count; i++){
        elements[i].setAttribute('onclick', `deleteCartItem(${i})`)
    }
}

function addElement(name, price, quantity){
    let parentElement = document.getElementById('cartList');
    if (cart.items.length == 0) {
        parentElement.removeChild(parentElement.children[0])
    }
    let item = document.createElement('li');
    item.innerHTML = `<div class='media'><a href='#'><img class='mr-3' src='' alt=''></img></a><div class='media-body'><a href='#'><h4>${name}</h4><h4><span>${quantity} X $${price}</span></h4></a></div><div class='close-circle'><a onClick='deleteCartItem(0)'><i class='fa fa-times' aria-hidden='true'></a></div></div></div>`;
    parentElement.appendChild(item);
    orderElement();
}

function updateCartTotal(total){
    document.getElementById('cartTotal').innerText = total
}