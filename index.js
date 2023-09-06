const cart = document.querySelector("#cart");

document.querySelector("#btn-cart-open").addEventListener("click", () => {
  cart.classList.add("open");
});

document.querySelector(".close-cart").addEventListener("click", () => {
  cart.classList.remove("open");
  const modal = new bootstrap.Modal("#cart-modal");
  modal.hide();
});
