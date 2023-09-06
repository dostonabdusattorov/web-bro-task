const cart = document.querySelector("#cart");
const productList = document.querySelector("#product-list");
const productListSpinner = document.querySelector("#productListSpinner");
const pagination = document.querySelector("#pagination");
const categoryList = document.querySelector("#category-list");
const categoriesSpinner = document.querySelector("#categories-spinner");
const cartNumber = document.querySelector("#cart-number");
const cartList = document.querySelector("#cart-list");

const limit = 20;
let skip = 0;
let paginationCount,
  currentPage = 1;
let currentCategory = "all";

let cartItems = [];

document.querySelector("#btn-cart-open").addEventListener("click", () => {
  cart.classList.add("open");
});

document.querySelector(".close-cart").addEventListener("click", () => {
  cart.classList.remove("open");
});

const getRequestUrl = (endpoint, skip, limit = 20) => {
  return `https://dummyjson.com/${endpoint}?limit=${limit}&skip=${skip}&select=title,description,price,categories,images`;
};

const renderPagination = () => {
  pagination.innerHTML = "";
  for (let i = 1; i <= paginationCount; i++) {
    const pageItem = document.createElement("li");
    pageItem.classList.add("page-item");
    pageItem.innerHTML = `
    <a class="page-link ${i === currentPage && "active"}">${i}</a>
    `;
    pageItem.addEventListener("click", () => {
      currentPage = i;
      skip = (i - 1) * 20;

      renderProducts();
    });
    pagination.append(pageItem);
  }
};

const renderCartNumber = () => {
  cartNumber.innerHTML = cartItems.length;
};

const renderCartItems = () => {
  cartList.innerHTML = "";
  let total = 0;

  if (cartItems.length === 0) {
    cartList.innerHTML = "There is no cart items";
  } else {
    cartItems.forEach((item) => {
      total += item.product.price * item.count;
      const newItem = document.createElement("li");
      newItem.innerHTML = `
      <div><img src="${item.product.images[0]}"></div>
      <div>${item.product.title}</div>
      <div>${item.product.price.toLocaleString()}</div>
      <div class="action-area"></div>`;

      const decBtn = document.createElement("button");
      decBtn.innerHTML = "-";
      decBtn.addEventListener("click", updateCart(item.product, false));
      const count = document.createElement("div");
      count.classList.add("count");
      count.innerHTML = item.count;
      const incBtn = document.createElement("button");
      incBtn.innerHTML = "+";
      incBtn.addEventListener("click", updateCart(item.product));

      newItem.querySelector(`.action-area`).append(decBtn, count, incBtn);

      cartList.append(newItem);
    });
  }

  document.querySelector("#total-price").innerHTML = total;
};

function updateCart(product, isAdding = true) {
  return () => {
    if (isAdding) {
      if (cartItems.some((item) => item.product.id === product.id)) {
        cartItems = cartItems.map((item) => {
          if (item.product.id === product.id) {
            return {
              ...item,
              count: item.count + 1,
            };
          }

          return item;
        });
      } else {
        cartItems = [...cartItems, { count: 1, product }];
      }
    } else {
      if (cartItems.find((item) => item.product.id === product.id).count > 1) {
        cartItems = cartItems.map((item) => {
          if (item.product.id === product.id) {
            return {
              ...item,
              count: item.count - 1,
            };
          }

          return item;
        });
      } else {
        cartItems = cartItems.filter((item) => item.product.id !== product.id);
      }
    }

    renderCartNumber();
    renderCartItems();
  };
}

const renderProducts = async (isCategoryFiltered = false) => {
  productListSpinner.classList.add("d-flex");
  productListSpinner.classList.remove("d-none");
  pagination.classList.add("d-none");
  pagination.classList.remove("d-flex");
  productList.classList.add("d-none");
  productList.classList.remove("d-flex");

  const productsResponse = await fetch(
    isCategoryFiltered
      ? `https://dummyjson.com/products/category/${currentCategory}`
      : getRequestUrl("products", skip)
  );
  const { products, total } = await productsResponse.json();

  productListSpinner.classList.add("d-none");
  productListSpinner.classList.remove("d-flex");
  pagination.classList.remove("d-none");
  pagination.classList.add("d-flex");
  productList.classList.remove("d-none");
  productList.classList.add("d-flex");

  paginationCount = Math.ceil(total / 20);

  !isCategoryFiltered ? renderPagination() : (pagination.innerHTML = "");

  productList.innerHTML = "";

  products.forEach((product) => {
    const productItem = document.createElement("li");
    productItem.classList.add("m-2");
    productItem.innerHTML = `
      <div class="card">
        <img
          src="${product.images[0]}"
          class="card-img-top"
          alt="${product.title}"
        />
        <div class="card-body">
          <h2 class="card-title">${product.title}</h2>
          <p class="card-text">
            ${product.description}
          </p>
          <button class="btn btn-warning disabled">$${product.price}</button>
        </div>
      </div>`;

    const addToCartBtn = document.createElement("button");
    addToCartBtn.addEventListener("click", updateCart(product));
    addToCartBtn.classList.add("btn", "btn-primary");
    addToCartBtn.innerHTML = "Add To Cart";
    productItem.querySelector(".card-body").append(addToCartBtn);

    productList.append(productItem);
  });
};

const renderCategoriesContent = (categories) => {
  categoryList.innerHTML = "";
  categories.forEach((category) => {
    const categoryItem = document.createElement("li");
    categoryItem.classList.add(
      "category-item",
      "list-group-item",
      `${category === currentCategory ? "active" : "bg-light"}`
    );
    categoryItem.innerHTML = category;
    categoryItem.addEventListener("click", () => {
      currentCategory = category;
      renderProducts(currentCategory !== "all");
      renderCategoriesContent(categories);
    });
    categoryList.append(categoryItem);
  });
};

const renderCategories = async () => {
  categoriesSpinner.classList.remove("d-none");
  categoryList.classList.add("d-none");

  const categoriesResponse = await fetch(
    "https://dummyjson.com/products/categories"
  );
  let categories = await categoriesResponse.json();
  categories = ["all", ...categories];

  categoriesSpinner.classList.add("d-none");
  categoryList.classList.remove("d-none");

  renderCategoriesContent(categories);
};

const init = () => {
  renderProducts();
  renderCategories();
  renderCartNumber();
  renderCartItems();
};

init();
