const products = [
  {id: 1, name: "Смартфон", description: "Бюджетный смартфон для универсальных задач", price: 10000},
  {id: 2, name: "Ноутбук", description: "Среднеценовой ноутбук для офисных и домашних задач", price: 40000},
  {id: 3, name: "Телевизор", description: "Хороший телевизор в full hd качестве", price: 30000},
]

const CART_KEY = 'cart'
let cart = []

function loadCart() {
  try {
    const data = localStorage.getItem(CART_KEY)
    cart = data ? JSON.parse(data): []
  } catch {
    cart = []
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

function addToCart(productId) {
  const item = cart.find(i => i.id === productId)

  if (item) {
    item.quantity++
    return
  }

  const product = products.find(i => i.id === productId)
  if (!product) return
  
  cart.push({...product, quantity: 1})
}

function changeQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId)
  if (!item) return

  item.quantity += delta
  
  if (item.quantity <= 0) {
    removeFromCart(productId)
  }
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId)
}

function clearCart() {
  cart = []
}

function renderProducts() {
  const productsElement = document.querySelector('.products')
  productsElement.innerHTML = products.map(product =>
    `
        <div class="product">
        <h3 class="product__title">${product.name}</h3>
        <p class="product__price">Цена: ${product.price} руб.</p>
        <p class="product__description">${product.description}</p>
        <button data-id="${product.id}" class="product__add-button">В корзину</button>
        </div>
    `).join('')
}

function renderCart() {
  const itemsElement = document.querySelector('.cart__items')
  const sumElement = document.querySelector('.cart__sum')
  itemsElement.innerHTML = cart.map(item => 
    `
      <div class="cart__item">
          <h3 class="cart__item-title">${item.name}</h3>
          <p class="cart__item-price">Цена: ${item.price} руб.</p>
          <p class="cart__item-quantity">Количество: ${item.quantity}</p>
          <p class="cart__item-sum">Итого: ${item.price * item.quantity} руб.</p>
          <button data-id="${item.id}" data-action="inc" class="cart__item-inc-button">+</button>
          <button data-id="${item.id}" data-action="dec" class="cart__item-dec-button">-</button>
          <button data-id="${item.id}" data-action="remove" class="cart__item-remove-button">Удалить</button>
      </div>
    `
  ).join('')

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  sumElement.textContent = `Итого: ${total} руб.`
}

function updateCart() {
  renderCart()
  saveCart()
}

document.querySelector('.products').addEventListener('click', (event) => {
  const button = event.target.closest('.product__add-button')
  if (!button) return
  
  addToCart(Number(button.dataset.id))
  updateCart()
})

document.querySelector('.cart__items').addEventListener('click', (event) => {
  const button = event.target.closest('button')
  if (!button) return

  const id = Number(button.dataset.id)
  
  switch (button.dataset.action) {
    case 'inc':
      changeQuantity(id, 1)
      break
    case 'dec':
      changeQuantity(id, -1)
      break
    case 'remove':
      removeFromCart(id)
      break
  }

  updateCart()
})

document.querySelector('.cart__remove-button').addEventListener('click', () => {
  clearCart()
  updateCart()
})

loadCart()
renderProducts()
renderCart()