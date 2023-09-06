const cart = document.querySelector("#cart");
const productList = document.querySelector("#product-list");
const spinner = document.querySelector("#spinner");
const pagination = document.querySelector("#pagination");

const limit = 20;
let skip = 0;
let paginationCount,
  currentPage = 1;

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

const renderProducts = async () => {
  spinner.classList.add("d-flex");
  spinner.classList.remove("d-none");

  const productsResponse = await fetch(getRequestUrl("products", skip));
  const { products, total } = await productsResponse.json();

  spinner.classList.add("d-none");
  spinner.classList.remove("d-flex");

  paginationCount = Math.ceil(total / 20);

  renderPagination();

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

const init = () => {
  renderProducts();
  renderPagination();
};

init();
