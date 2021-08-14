function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Informações de exibição do produto
function getObjectInfo(productInfo) {
  const productObject = {
    sku: productInfo.id,
    name: productInfo.title,
    image: productInfo.thumbnail,
    salePrice: productInfo.price,
  };
  return productObject;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Obtém itens da API através do ID
const getItemsFromApiWithID = (event) => {
  const idItem = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
  .then((data) => data.json())
  .then((response) => {
    const cartItems = document.querySelector('.cart__items');
    const itens = getObjectInfo(response);
    cartItems.appendChild(createCartItemElement(itens));
  });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', getItemsFromApiWithID);
  }
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Obter todos os produtos da API de busca específica
function getProductsFromApi() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((data) => data.json())
  .then((itemObj) => itemObj.results)
  .then((products) => products.forEach((element) => {
    const itemsSection = document.querySelector('.items');
    const product = getObjectInfo(element);
    itemsSection.appendChild(createProductItemElement(product));
  }));
}

function eraseCart() {
  const buttonEmptyCart = document.querySelector('.empty-cart');
  const orderedList = document.querySelector('.cart__items');
  buttonEmptyCart.addEventListener('click', () => {
    orderedList.innerHTML = '';
  });
}

window.onload = () => {
  getProductsFromApi();
  eraseCart();
};
