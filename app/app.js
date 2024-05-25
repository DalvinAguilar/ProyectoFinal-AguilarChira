const listProducts = document.querySelector("#listProducts");
const itemCounter = document.querySelector("#item-counter");
const itemsList = document.querySelector("#itemList");
const itemInCart = JSON.parse(localStorage.getItem("itemscart"));
let items = [];
const cart = [];

fetch("./app/cursos.json")
  .then((response) => response.json())
  .then((dataitems) => {
    items = dataitems;
    showProducts(items);
    addItemEvent();
  });

function showProducts(cursos) {
  cursos.forEach((curso) => {
    const div = document.createElement("div");
    div.classList.add("col");
    div.innerHTML = `
        <div class="card">
            <img src="${curso.imagen}" class="card-img-top" alt="${curso.titulo}" />
            <div class="card-body">
                <h3 class="card-title">${curso.titulo}</h3>
            </div>
            <div class="d-flex justify-content-around mb-5">
                <h5><span>$</span>${curso.precio}</h5>
                <button class="btn btn-primary" id="${curso.id}">Agregar</button>
            </div>
        </div>
    `;

    listProducts.append(div);
  });
}

function addItemEvent() {
  const addItem = document.querySelectorAll(".btn");

  addItem.forEach((item) => {
    item.addEventListener("click", addToCart);
  });
}

function addToCart(e) {
  const itemId = e.currentTarget.id;
  const itemAdded = items.find((item) => item.id === itemId);
  cart.push(itemAdded);
  updateCartCounter();
  localStorage.setItem("itemscart", JSON.stringify(cart));
  showCartItems();
  updateTotalPrice();

  Toastify({
    text: "Curso agregado",
    duration: 1500,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #f7941d, #274597)",
      borderRadius: "1rem",
      fontWeight: "600",
    },
    offset: {
      x: 10,
      y: 100,
    },
    onClick: function () {},
  }).showToast();
}

function updateCartCounter() {
  let counter = cart.length;
  itemCounter.innerText = counter;
  localStorage.setItem("cartCounter", counter);
}

function showCartItems() {
  itemsList.innerHTML = "";

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("cart-wrapper");
    div.innerHTML = `
      <div class="item">
        <div class="image-item">
          <img src="${item.imagen}" alt="${item.titulo}" />
        </div>
        <div class="product-title">${item.titulo}</div>
        <div class="price">$${item.precio}</div>
        <div class="deleteItem">
          <button class="btn-delete" id="${item.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
    itemsList.appendChild(div);
  });
  const deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });
}

function loadCartFromStorage() {
  const storedCart = JSON.parse(localStorage.getItem("itemscart"));
  if (storedCart) {
    cart.push(...storedCart);
    showCartItems();
    updateCartCounter();
    updateTotalPrice();
  }
}

function removeFromCart(e) {
  const itemId = e.currentTarget.id;
  const itemIndex = cart.findIndex((item) => item.id === itemId);
  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
    updateCartCounter();
    localStorage.setItem("itemscart", JSON.stringify(cart));
    showCartItems();
    updateTotalPrice();
  }
}

function updateTotalPrice() {
  let totalPrice = 0;
  cart.forEach((item) => {
    totalPrice += item.precio;
  });
  document.querySelector("#totalPrice").innerText = totalPrice;
}

const buyButton = document.querySelector("#buyItems");
buyButton.addEventListener("click", checkOut);

function checkOut() {
  if (cart.length) {
    Swal.fire({
      title: "Compra realizada!",
      text: "Gracias por tu compra!",
      icon: "success",
    });

    cart.length = 0;
    itemsList.innerHTML = "";
    localStorage.removeItem("itemscart");
    updateCartCounter();
    updateTotalPrice();
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No has elegido ningun producto",
    });
  }
}

loadCartFromStorage();
