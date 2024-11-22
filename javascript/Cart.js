const API_BASE_URL = "https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev"; // Update with your API Gateway URL

// Fetch and display the cart
async function fetchAndDisplayCart() {
    try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) {
            console.error("User ID is missing in session storage");
            alert("You must be logged in to view the cart.");
            return;
        }

        const response = await fetch(`${API_BASE_URL}/Cartdisplay`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "user_id": userId // Pass the user ID as a header
            }
        });

        if (!response.ok) throw new Error("Failed to fetch cart");

        const cart = await response.json();
        console.log("Fetched cart:", cart);

        displayCart(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        alert("Failed to fetch cart details. Please try again.");
    }
}

// Display the cart in the popup
function displayCart(cart) {
    const cartPopup = document.getElementById("cart-popup");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = ""; // Clear existing items

    cart.products.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("cart-item");
        productElement.innerHTML = `
            <div class="cart-item-name">${product.product_name}</div>
            <div class="cart-item-quantity">Quantity: ${product.quantity}</div>
            <div class="cart-item-price">$${(product.product_price * product.quantity).toFixed(2)}</div>
        `;
        cartItems.appendChild(productElement);
    });

    cartTotal.textContent = `Total: $${cart.total.toFixed(2)}`;
    cartPopup.style.display = "block"; // Show the cart popup
}

// Close the cart popup
function closeCartPopup() {
    const cartPopup = document.getElementById("cart-popup");
    cartPopup.style.display = "none";
}

// Update the cart icon with the total quantity
async function updateCartIcon() {
    try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) {
            console.error("User ID is missing in session storage");
            return;
        }

        const response = await fetch(`${API_BASE_URL}/Cartdisplay`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "user_id": userId // Pass the user ID as a header
            }
        });

        if (!response.ok) throw new Error("Failed to fetch cart");

        const cart = await response.json();
        console.log("Cart for icon update:", cart);

        const totalItems = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById("cart-count").textContent = totalItems;
    } catch (error) {
        console.error("Error updating cart icon:", error);
    }
}

// Event listener for closing the cart popup
document.getElementById("close-cart-btn").addEventListener("click", closeCartPopup);

// Initial update of the cart icon
updateCartIcon();
