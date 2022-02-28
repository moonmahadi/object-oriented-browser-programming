let productList = document.querySelector(".shop-content");
let total = document.querySelector(".total");
let buy = document.querySelector(".btn-buy");

let cartIcon = document.querySelector("#cart-icon");
let cartCount = document.querySelector(".cart-count");
let cartContainer = document.querySelector(".cart");
let cartContent = document.querySelector(".cart-content");
let closeCart = document.querySelector("#close-cart");

//open cart
cartIcon.addEventListener("click", function () {
    cartContainer.classList.add("active");
});
//close cart
closeCart.addEventListener("click", function () {
    cartContainer.classList.remove("active");
});

//Load products
function renderProducts() {
    //Render  products to the Page
    // fetch products
    fetch("./utils/products.json")
        .then((res) => res.json())
        .then((data) => {
            data.forEach((product) => {
                productList.innerHTML += `
            <div class="product-box">
            <img class="product-img" src="${product.image}" alt="t-shirt 1" onclick="productDetail(${product.id})" />
            <h4 class="product-title">${product.title}</h4>
            <span class="price"> €${product.price}</span>
            <i class="bx bx-shopping-bag add-cart" onclick="addToCart(${product.id})" ></i>
            </div>
            `;
            });
        });
}
renderProducts();

//product detail
function productDetail(id) {
    fetch("./utils/products.json")
        .then((res) => res.json())
        .then((data) => {
            let product = data.find((product) => product.id == id);

            let productDetail = document.querySelector(".product-detail-container");
            productDetail.style.display = "block";
            window.onclick = function (event) {
                if (event.target == productDetail) {
                    productDetail.style.display = "none";
                }
            };

            productDetail.innerHTML = `
  <div class="product-detail">
  <img src=${product.image} alt="" class="product-img" />
  <h2 class="product-title">${product.title}</h2>
  <span class="price"> €${product.price}</span>
  <i class="bx bx-shopping-bag add-cart" onclick="addToCart(${product.id})" ></i>
  </div>
  `;
        });
}

//close modal
const closeDetailModal = () => {
    let productDetail = document.querySelector(".product-detail-container");
    closeModal.addEventListener("click", function () {
        productDetail.style.display = "none";
    });
};

//Cart Array
let cart = [];
const addToCart = (id) => {
    fetch("./utils/products.json")
        .then((res) => res.json())
        .then((data) => {
            if (cart.some((item) => item.id === id)) {
                alert("Item already in cart");
            } else {
                let cartItem = data.find((item) => item.id === id);
                console.log("cartItem", cartItem);
                cart.push({ ...cartItem, quantity: 1 });
            }
            updateCart();
        });
};

//Update Cart
const updateCart = () => {
    renderCartItems();
    renderSubTotal();
};
//Display Cart Items

const renderCartItems = () => {
    cartContent.innerHTML = "";
    cart.forEach((item) => {
        cartContent.innerHTML += `
   <div class="cart-box">
   <img class="cart-img" src="${item.image}" alt="t-shirt 1" />
   <h4 class="cart-title">${item.title}</h4>
   <div class="cart-price">${item.price}</div>
   
   <div class=" btn " onclick="removeItem(${item.id})"><i class="bx bxs-trash-alt cart-remove"></i></div>
   <div class="quantities">
   <div class="btn minus" onclick="changeNumberOfQuantity('minus',${item.id})">-</div>
   <div class="number">${item.quantity}</div>
   <div class="btn plus" onclick="changeNumberOfQuantity('plus',${item.id})"">+</div>
 </div>
      </div>
        `;
    });
};

//remove item from cart
const removeItem = (id) => {
    cart = cart.filter((item) => item.id !== id);
    updateCart();
};

//Calculate and Display SubTotal
const renderSubTotal = () => {
    let totalPrice = 0,
        totalItems = 0;
    cart.forEach((item) => {
        totalPrice += item.price * item.quantity;
        totalItems += item.quantity;
    });

    total.innerHTML = `Subtotal (${totalItems} items ): €${totalPrice.toFixed(
        2
    )}`;
    cartCount.innerHTML = `${totalItems}`;
};

//change quantity of Items
const changeNumberOfQuantity = (operation, id) => {
    const item = cart.find((p) => p.id === id);
    if (operation === "minus" && item.quantity > 1) {
        item.quantity--;
    } else if (operation === "plus" && item.quantity < item.instock) {
        item.quantity++;
    }
    updateCart();
};

// clear cart
function buyButtonClicked() {
    alert("Thanks for your purchase!!!");
    cart = [];
    updateCart();
}
buy.addEventListener("click", buyButtonClicked);