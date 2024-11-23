// Ensure the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    loadCheckoutCart();
    document.getElementById("proceed-to-confirmation").addEventListener("click", proceedToConfirmation);
});

// Load and display the cart items in the checkout page
async function loadCheckoutCart() {
    try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) {
            throw new Error("User ID not found in session storage.");
        }

        // Fetch cart data
        const response = await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartdisplay/${userId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch cart: ${response.statusText}`);
        }

        const cartData = await response.json();
        const checkoutItems = document.getElementById("checkout-items");
        const checkoutTotalValue = document.getElementById("checkout-total-value");

        // Clear existing cart items
        checkoutItems.innerHTML = "";

        let totalPrice = 0;

        // Populate the table with cart items
        cartData.products.forEach(item => {
            const itemSubtotal = item.quantity * item.product_price;
            totalPrice += itemSubtotal;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.product_name}</td>
                <td>
                    <input 
                        type="number" 
                        class="cart-item-quantity" 
                        value="${item.quantity}" 
                        min="1" 
                        data-product-id="${item.product_id}" 
                    />
                </td>
                <td>$${item.product_price.toFixed(2)}</td>
                <td>$${itemSubtotal.toFixed(2)}</td>
                <td>
                    <button class="remove-item" data-product-id="${item.product_id}">🗑️</button>
                </td>
            `;
            checkoutItems.appendChild(row);
        });

        // Update total price
        checkoutTotalValue.textContent = totalPrice.toFixed(2);

        // Attach event listeners for quantity updates and remove buttons
        attachCheckoutEventListeners();
    } catch (error) {
        console.error("Failed to load checkout cart:", error);
    }
}

// Attach event listeners for cart actions
function attachCheckoutEventListeners() {
    const quantityInputs = document.querySelectorAll(".cart-item-quantity");
    const removeButtons = document.querySelectorAll(".remove-item");

    quantityInputs.forEach(input => {
        input.addEventListener("change", async () => {
            const productId = input.dataset.productId;
            const newQuantity = parseInt(input.value, 10);

            if (!isNaN(newQuantity) && newQuantity > 0) {
                try {
                    await updateCartItem(productId, newQuantity);
                    await loadCheckoutCart(); // Reload the cart after update
                } catch (error) {
                    console.error("Failed to update item quantity:", error);
                }
            } else {
                alert("Invalid quantity entered.");
            }
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const productId = button.dataset.productId;

            try {
                await removeCartItem(productId);
                await loadCheckoutCart(); // Reload the cart after removal
            } catch (error) {
                console.error("Failed to remove item:", error);
            }
        });
    });
}

// Update item quantity in the cart
async function updateCartItem(productId, quantity) {
    const userId = sessionStorage.getItem("user_id");
    await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartquantity`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, product_id: productId, quantity }),
    });
}

// Remove item from the cart
async function removeCartItem(productId) {
    const userId = sessionStorage.getItem("user_id");
    await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartremove`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, product_id: productId }),
    });
}

// Navigate back to the orders page
function goBackToOrders() {
    window.location.href = "orders.html";
}

// Proceed to the order confirmation page
function proceedToConfirmation() {
    window.location.href = "confirmation.html";
}
