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
});

updateCartIcon();
// Function to load the cart data from the API and populate the cart
async function loadCart() {
    try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) {
            throw new Error("User ID not found in session storage.");
        }

        // Fetch the cart data from the API
        const response = await fetch('https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartdisplay/${userId}`);
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
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.product_name} (${item.quantity})</span>
                    <span class="cart-item-subtotal">$${itemSubtotal.toFixed(2)}</span>
                </div>
                <div class="cart-item-controls">
                    <input type="number" class="cart-item-quantity" value="${item.quantity}" min="1" data-product-id="${item.product_id}">
                    <button class="update-quantity" data-product-id="${item.product_id}">Update</button>
                    <button class="remove-item" data-product-id="${item.product_id}">Remove</button>
                </div>
            `;
            cartItems.appendChild(listItem);
        });

        // Update the total price
        cartTotalValue.textContent = totalPrice.toFixed(2);

        // Attach event listeners for update and remove buttons
        attachCartEventListeners();
    } catch (error) {
        console.error("Error loading cart:", error);
        alert("Failed to load cart. Please try again later.");
    }
}

// Attach event listeners for updating and removing items in the cart
function attachCartEventListeners() {
    const updateButtons = document.querySelectorAll(".update-quantity");
    const removeButtons = document.querySelectorAll(".remove-item");

    updateButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const productId = button.dataset.productId;
            const quantityInput = document.querySelector(`.cart-item-quantity[data-product-id="${productId}"]`);
            const newQuantity = parseInt(quantityInput.value, 10);

            if (!isNaN(newQuantity) && newQuantity > 0) {
                try {
                    await updateCartItem(productId, newQuantity);
                    await loadCart(); // Refresh the cart after updating
                } catch (error) {
                    console.error("Failed to update item quantity:", error);
                    alert("Failed to update item quantity. Please try again.");
                }
            } else {
                alert("Please enter a valid quantity.");
            }
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const productId = button.dataset.productId;

            try {
                await removeCartItem(productId);
                await loadCart(); // Refresh the cart after removing an item
            } catch (error) {
                console.error("Failed to remove item from cart:", error);
                alert("Failed to remove item from cart. Please try again.");
            }
        });
    });
}

// Function to update an item's quantity in the cart
async function updateCartItem(productId, quantity) {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
        throw new Error("User ID not found in session storage.");
    }

    const response = await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartquantity`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: userId,
            product_id: productId,
            quantity: quantity,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to update item quantity in cart.");
    }
    console.log(`Quantity updated for product ${productId}: ${quantity}`);
}

// Function to remove an item from the cart
async function removeCartItem(productId) {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
        throw new Error("User ID not found in session storage.");
    }

    const response = await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartremove`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: userId,
            product_id: productId,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to remove item from cart.");
    }
    console.log(`Item removed from cart: ${productId}`);
}
