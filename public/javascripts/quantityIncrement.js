function getElementName(ID) {
    let element = document.getElementsByName('quantity'+ID);
    return element[0]
}

function plusIncrement(ID) {
    getElementName(ID).value = +(getElementName(ID).value) + +1 
    updateButtonEvent(ID, getElementName(ID).value)

}

function minusIncrement(ID) {
    if (getElementName(ID).value == 1) {
    }
    else {
        getElementName(ID).value = +(getElementName(ID).value) - +1 
        updateButtonEvent(ID, getElementName(ID).value)
    }

}

function updateButtonEvent(ID, quantity) {
    let element = document.getElementById('addCart'+ID)
    let array = element.onclick.toString().split(',')
    element.setAttribute('onclick',array[0].replace('function onclick(event) {','').replace(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g,'')+','+quantity+','+array[2]+','+array[3]+','+array[4].replace('}','').replace(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g,''))
}