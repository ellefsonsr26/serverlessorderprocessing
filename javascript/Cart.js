// Function to update the cart icon with the total quantity
async function updateCartIcon() {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) return;

    try {
        const response = await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartdisplay/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch cart contents");

        const cart = await response.json();
        const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById("cart-count").textContent = totalQuantity;
    } catch (error) {
        console.error("Failed to update cart icon:", error);
    }
}

// Function to load the cart contents and display the cart popup
async function loadCart() {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
        alert("You must be logged in to view your cart.");
        return;
    }

    try {
        const response = await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartdisplay/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch cart contents");

        const cart = await response.json();

        // Format the cart items
        const cartItemsHtml = cart.products.map((item) => {
            const subtotal = (item.quantity * item.product_price).toFixed(2);
            return `
                <div class="cart-item">
                    <span>${item.product_name}</span>
                    <span>(${item.quantity})</span>
                    <span>$${subtotal}</span>
                </div>
            `;
        }).join("");

        // Calculate the total price
        const totalPrice = cart.products.reduce((sum, item) => sum + item.quantity * item.product_price, 0).toFixed(2);

        // Update the cart popup
        const cartContainer = document.getElementById("cart-container");
        cartContainer.innerHTML = `
            <h3>Your Cart</h3>
            ${cartItemsHtml}
            <div class="cart-total">
                <strong>Total: $${totalPrice}</strong>
            </div>
            <button onclick="proceedToCheckout()">Proceed to Checkout</button>
        `;
        cartContainer.style.display = "block";
    } catch (error) {
        console.error("Error loading cart:", error);
        alert("Failed to load cart.");
    }
}

// Function to handle the Proceed to Checkout button click
function proceedToCheckout() {
    alert("Proceeding to checkout... (You can implement this functionality)");
}

// Ensure cart icon updates on page load
window.onload = updateCartIcon;

// Event listener for the cart button click
document.getElementById("cart-button").addEventListener("click", loadCart);
