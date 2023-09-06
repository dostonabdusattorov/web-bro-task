const cart = document.querySelector("#cart");
const productList = document.querySelector("#product-list");
const productListSpinner = document.querySelector("#productListSpinner");
const pagination = document.querySelector("#pagination");
const categoryList = document.querySelector("#category-list");
const categoriesSpinner = document.querySelector("#categories-spinner");

const limit = 20;
let skip = 0;
let paginationCount,
  currentPage = 1;
let currentCategory = "all";

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
          <div class="d-flex justify-content-between">
            <button class="btn btn-warning disabled">$${product.price}</button>
            <button id="${product.id}" class="btn btn-primary">Add to Cart</button>
          </div>
        </div>
      </div>`;

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
};

init();
