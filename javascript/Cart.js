document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.getElementById("cart-button");
  const cartPopup = document.getElementById("cart-popup");
  const closeCartButton = document.getElementById("close-cart");
  const cartItemsList = document.getElementById("cart-items");
  const cartTotalValue = document.getElementById("cart-total-value");

  const userId = sessionStorage.getItem("user_id");
  if (!userId) {
    console.error("User ID not found in session storage.");
    return;
  }

  // Toggle cart popup
  cartButton.addEventListener("click", async () => {
    if (cartPopup.classList.contains("visible")) {
      cartPopup.classList.remove("visible");
    } else {
      await loadCart();
      cartPopup.classList.add("visible");
    }
  });

  closeCartButton.addEventListener("click", () => {
    cartPopup.classList.remove("visible");
  });

  // Load cart from API using GET
  async function loadCart() {
    try {
      const response = await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartdisplay/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch cart.");

      const cart = await response.json();
      renderCart(cart);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }

  // Render cart items in popup
  function renderCart(cart) {
    cartItemsList.innerHTML = ""; // Clear existing items
    cart.products.forEach((product) => {
      const item = document.createElement("li");
      item.innerHTML = `
        <span>${product.product_name} (${product.quantity})</span>
        <span>$${product.total_price.toFixed(2)}</span>
      `;
      cartItemsList.appendChild(item);
    });

    // Update total
    cartTotalValue.textContent = cart.total.toFixed(2);
    updateCartIcon(cart.products.length);
  }

  // Update cart icon count
  function updateCartIcon(itemCount) {
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = itemCount;
  }

  // Initial update for cart count
  loadCart();
});
