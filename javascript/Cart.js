// Update the cart icon with the total quantity of items
async function updateCartIcon() {
    const userId = sessionStorage.getItem("user_id");
    console.log("User ID from session storage (cart update):", userId);

    if (!userId) {
        console.warn("User ID not found in session storage. Cannot update cart icon.");
        return;
    }

    try {
        const response = await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartdisplay/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("id_token")}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch cart contents");
        }

        const cart = await response.json();
        console.log("Cart data:", cart);

        const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById("cart-count").textContent = totalQuantity;
    } catch (error) {
        console.error("Failed to update cart icon:", error);
    }
}

// Load the cart contents and display them in a popup
async function loadCart() {
    const userId = sessionStorage.getItem("user_id");
    console.log("User ID from session storage (cart load):", userId);

    if (!userId) {
        alert("You must be logged in to view the cart.");
        return;
    }

    try {
        const response = await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartdisplay/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("id_token")}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch cart contents");
        }

        const cart = await response.json();
        console.log("Cart contents:", cart);

        const cartItems = cart.products.map(item => `
            <div class="cart-item">
                <p><strong>${item.product_name}</strong></p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.product_price.toFixed(2)}</p>
                <p>Total: $${(item.quantity * item.product_price).toFixed(2)}</p>
            </div>
        `).join("");

        const cartPopup = document.getElementById("cart-popup");
        if (cartPopup) {
            cartPopup.innerHTML = `
                <div class="cart-contents">
                    <h3>Your Cart</h3>
                    ${cartItems || "<p>Your cart is empty.</p>"}
                    <button onclick="checkout()">Proceed to Checkout</button>
                </div>
            `;
            cartPopup.style.display = "block";
        }
    } catch (error) {
        console.error("Error loading cart:", error);
        alert("Failed to load cart contents.");
    }
}

// Close the cart popup
function closeCartPopup() {
    const cartPopup = document.getElementById("cart-popup");
    if (cartPopup) {
        cartPopup.style.display = "none";
    }
}

// Proceed to checkout (placeholder functionality)
function checkout() {
    alert("Checkout functionality coming soon!");
    closeCartPopup();
}

// Event listener for cart button click
document.getElementById("cart-button").addEventListener("click", loadCart);

// Ensure cart icon updates on page load
window.onload = updateCartIcon;
