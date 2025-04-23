const products = [
  { id: 1, name: "Акварель", price: 350, category: "краски", image: "img/аква.jpg"  },
  { id: 2, name: "Масляные краски", price: 500, category: "краски", image: "img/masl.jpg" },
  { id: 3, name: "Цветные карандаши", price: 200, category: "карандаши", image: "img/car.jpg" },
  { id: 4, name: "Альбом для рисования", price: 150, category: "бумага", image: "img/fenix.jpg" },
  { id: 5, name: "Пастель", price: 400, category: "карандаши", image: "img/acva-color.jpg" },
  { id: 6, name: "Акриловая краска'Ладога'", price: 245, category: "краски", image: "img/акр.jpg" },
  { id: 7, name: "Цветная бумага''Лео", price: 49, category: "бумага", image: "img/бум.jpg" },
  { id: 8, name: "'KOH-I-NOOR Hardtmuth' Карандаш чернографитный технический 1500 заточенный", price: 89, category: "карандаши", image: "img/граф.jpg" },
  { id: 9, name: "Краска гуашь 'VISTA-ARTISTA'", price: 889, category: "краски", image: "img/гуаш.jpg" },
  { id: 10, name: "'VISTA-ARTISTA'Чернографитный карандаш", price: 49, category: "карандаши", image: "img/кар.jpg" },
  { id: 11, name: "'Сонет'Гуашь цветная", price: 1050, category: "краски", image: "img/сонет.jpg" },
  { id: 12, name: "Тетрадь учебная 12лист", price: 16, category: "бумага", image: "img/тетр.jpg" },
  { id: 13, name: "Картон цветной 'Лео'", price: 277, category: "бумага", image: "img/цв.jpg" },
  { id: 14, name: "Карандаши Акварельные", price: 569, category: "карандаши", image: "img/цвет.jpg" },
];

let cart = getCart();

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const viewToggle = document.getElementById("viewToggle");
const mainContainer = document.getElementById("product-list");

let currentView = "grid";
let currentSort = "default";

function getCart() {
return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
localStorage.setItem("cart", JSON.stringify(cart));
}

function renderProducts(filter = "all", search = "") {
productList.innerHTML = "";

let filtered = products.filter(p =>
  (filter === "all" || p.category === filter) &&
  p.name.toLowerCase().includes(search.toLowerCase())
);

// сортировка
if (currentSort === "asc") {
  filtered.sort((a, b) => a.price - b.price);
} else if (currentSort === "desc") {
  filtered.sort((a, b) => b.price - a.price);
}

// переключение вида
productList.className = currentView + "-view";

filtered.forEach(p => {
  const card = document.createElement("div");
  card.className = "product";
  card.innerHTML = `
    <a href="product.html?id=${p.id}">
      <img src="${p.image}" alt="${p.name}" class="product-img" />
    </a>
    <h3>${p.name}</h3>
    <p>Цена: ${p.price}₽</p>
    <button onclick="addToCart(${p.id})">Добавить в корзину</button>
  `;
  productList.appendChild(card);
});
}

function addToCart(id) {
const product = products.find(p => p.id === id);
cart.push(product);
saveCart(cart);
updateCart();
}

function updateCart() {
if (!cartItems || !cartCount || !cartTotal) return;
cartItems.innerHTML = "";
let total = 0;
cart.forEach((item, index) => {
  total += item.price;
  const li = document.createElement("li");
  li.innerHTML = `${item.name} - ${item.price}₽ <button onclick="removeFromCart(${index})">×</button>`;
  cartItems.appendChild(li);
});
cartCount.textContent = cart.length;
cartTotal.textContent = `${total}₽`;
}

function removeFromCart(index) {
cart.splice(index, 1);
saveCart(cart);
updateCart();
}

function toggleCart() {
document.getElementById("cart").classList.toggle("hidden");
}

function checkout() {
if (cart.length === 0) {
  showNotification("Вы не выбрали ни одного товара!");
  return;
}
showNotification("Спасибо за заказ! ❤️");
cart = [];
saveCart(cart);
updateCart();
toggleCart();
}

if (searchInput) {
searchInput.addEventListener("input", () => {
  renderProducts(categoryFilter.value, searchInput.value);
});
}

if (categoryFilter) {
categoryFilter.addEventListener("change", () => {
  renderProducts(categoryFilter.value, searchInput.value);
});
}

if (sortFilter) {
sortFilter.addEventListener("change", () => {
  currentSort = sortFilter.value;
  renderProducts(categoryFilter.value, searchInput.value);
});
}

if (viewToggle) {
viewToggle.addEventListener("click", () => {
  currentView = currentView === "grid" ? "list" : "grid";
  viewToggle.textContent = currentView === "grid" ? "🟦 Сетка" : "📋 Список";
  renderProducts(categoryFilter.value, searchInput.value);
});
}

renderProducts();
updateCart();

  const orderForm = document.getElementById("order-form");

orderForm.addEventListener("submit", function (e) {
  e.preventDefault();

const name = document.getElementById("name").value.trim();
const phone = document.getElementById("phone").value.trim();
const address = document.getElementById("address").value.trim();

if (!name || !phone || !address) {
  showNotification("Пожалуйста, заполните все поля!");
  return;
}

if (cart.length === 0) {
  showNotification("Корзина пуста!");
  return;
}

fetch("send_order.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name,
    phone,
    address,
    cart,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      showNotification("Заказ успешно отправлен!");
      cart = [];
      saveCart(cart);
      updateCart();
      orderForm.reset();
      toggleCart();
    } else {
      showNotification("Ошибка при отправке заказа.");
    }
  })
  .catch(() => {
    showNotification("Сервер не отвечает.");
  });


  // Здесь можно отправить заказ на сервер или email
  console.log("Заказ оформлен:");
  console.log("Имя:", name);
  console.log("Телефон:", phone);
  console.log("Адрес:", address);
  console.log("Товары:", cart);

  // Очистка после заказа
  cart = [];
  saveCart(cart);
  updateCart();
  orderForm.reset();
  toggleCart();
  showNotification("Спасибо за заказ! Мы скоро свяжемся с вами.");
});

  function showNotification(message, duration = 3000) {
    const notif = document.getElementById("notification");
    notif.textContent = message;
    notif.classList.remove("hidden");
    notif.classList.add("show");
  
    setTimeout(() => {
      notif.classList.remove("show");
      notif.classList.add("hidden");
    }, duration);
  }
  // Получить корзину из localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Сохранить корзину в localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

if (sortFilter) {
  sortFilter.addEventListener("change", () => {
    currentSort = sortFilter.value;
    renderProducts(categoryFilter.value, searchInput.value);
  });
}

if (viewToggle) {
  viewToggle.addEventListener("click", () => {
    currentView = currentView === "grid" ? "list" : "grid";
    mainContainer.className = currentView + "-view";
    viewToggle.textContent = currentView === "grid" ? "🟦 Сетка" : "📋 Список";
  });
}

  
  