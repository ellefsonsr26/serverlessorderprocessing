// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    const cartButton = document.getElementById("cart-button");
    const cartContainer = document.getElementById("cart-container");

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

    // Initial update for the cart count when the page loads
    updateCartIcon();
});

// Function to load the cart data from the API and populate the cart
async function loadCart() {
    try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) {
            throw new Error("User ID not found in session storage.");
        }

        // Fetch the cart data from the API
        const response = await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartdisplay/${userId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch cart: ${response.statusText}`);
        }

        const cartData = await response.json();
        console.log("Cart data fetched successfully:", cartData);

        const cartItems = document.getElementById("cart-items");
        const cartTotalValue = document.getElementById("cart-total-value");

        // Clear existing items in the cart popup
        cartItems.innerHTML = "";

        // Populate the cart with items
        let totalPrice = 0;
        cartData.products.forEach(item => {
            const itemSubtotal = item.quantity * item.product_price;
            totalPrice += itemSubtotal;

            // Create a list item for each cart product
            const listItem = document.createElement("li");
            listItem.className = "cart-item";
            listItem.innerHTML = `
                <span class="cart-item-name">${item.product_name}</span>
                <span class="cart-item-quantity">x${item.quantity}</span>
                <span class="cart-item-subtotal">$${itemSubtotal.toFixed(2)}</span>
            `;
            cartItems.appendChild(listItem);
        });

        // Update the total price
        cartTotalValue.textContent = totalPrice.toFixed(2);

        // Update the cart icon count
        const totalQuantity = cartData.products.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById("cart-count").textContent = totalQuantity;
    } catch (error) {
        console.error("Error loading cart:", error);
        alert("Failed to load cart. Please try again later.");
    }
}

// Function to update the cart count dynamically after adding an item
function updateCartIcon() {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
        console.error("User ID not found in session storage.");
        return;
    }

    // Fetch the cart data to update the count
    fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartdisplay/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch cart for update: ${response.statusText}`);
            }
            return response.json();
        })
        .then(cartData => {
            const totalQuantity = cartData.products.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById("cart-count").textContent = totalQuantity;
        })
        .catch(error => {
            console.error("Failed to update cart icon:", error);
        });
}
