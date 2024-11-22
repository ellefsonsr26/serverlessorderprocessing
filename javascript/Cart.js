// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    const cartButton = document.getElementById("cart-button");
    const cartContainer = document.getElementById("cart-container");

    // Update cart count on page load
    updateCartIcon();

    if (cartButton) {
        cartButton.addEventListener("click", async () => {
            if (cartContainer.style.display === "none" || !cartContainer.style.display) {
                try {
                    await loadCart(); // Fetch and display the cart contents
                    cartContainer.style.display = "block"; // Show the cart popup
                } catch (error) {
                    console.error("Failed to load cart:", error);
                }
            } else {
                cartContainer.style.display = "none"; // Hide the cart popup
            }
        });
    }
});

// Function to load the cart data from the API and populate the cart
async function loadCart() {
    try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) {
            throw new Error("User ID not found in session storage.");
        }

        const response = await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartdisplay/${userId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch cart: ${response.statusText}`);
        }

        const cartData = await response.json();
        const cartItems = document.getElementById("cart-items");
        cartItems.innerHTML = ""; // Clear existing items

        let totalPrice = 0;

        cartData.products.forEach((item) => {
            const itemSubtotal = item.quantity * item.product_price;
            totalPrice += itemSubtotal;

            const listItem = document.createElement("li");
            listItem.className = "cart-item";
            listItem.innerHTML = `
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.product_name} <span class="cart-item-quantity">(${item.quantity})</span></span>
                    <span class="cart-item-subtotal">$${itemSubtotal.toFixed(2)}</span>
                </div>
            `;
            cartItems.appendChild(listItem);
        });

        // Add or update the total price section
        let totalSection = document.querySelector(".cart-total");
        if (!totalSection) {
            totalSection = document.createElement("div");
            totalSection.className = "cart-total";
            cartItems.appendChild(totalSection);
        }
        totalSection.innerHTML = `
            <span>Total:</span>
            <span>$${totalPrice.toFixed(2)}</span>
        `;

        // Remove any redundant or extra total sections
        const allCartTotals = document.querySelectorAll(".cart-total");
        if (allCartTotals.length > 1) {
            allCartTotals.forEach((section, index) => {
                if (index > 0) section.remove();
            });
        }

        // Add or update the checkout button
        let checkoutContainer = document.querySelector(".checkout-container");
        if (!checkoutContainer) {
            checkoutContainer = document.createElement("div");
            checkoutContainer.className = "checkout-container";
            cartItems.appendChild(checkoutContainer);
        }
        checkoutContainer.innerHTML = `
            <button class="checkout-button">Proceed to Checkout</button>
        `;
        checkoutContainer.querySelector(".checkout-button").addEventListener("click", () => {
            window.location.href = "checkout.html";
        });

        // Update the cart icon count
        const totalQuantity = cartData.products.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById("cart-count").textContent = totalQuantity;
    } catch (error) {
        console.error("Error loading cart:", error);
        alert("Failed to load cart. Please try again later.");
    }
}

