document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.getElementById("cart-button");
  const cartPopup = document.getElementById("cart-popup");
  const closeCartButton = document.getElementById("close-cart");
  const cartItemsList = document.getElementById("cart-items");
  const cartTotalValue = document.getElementById("cart-total-value");

// Update cart icon to display the total quantity
async function updateCartIcon() {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
        console.error("No user ID found in session storage.");
        return;
    }

    try {
        const response = await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartdisplay/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch cart");

        const cart = await response.json();
        const totalQuantity = cart.total_quantity || 0; // Use total_quantity from API
        document.getElementById("cart-count").textContent = totalQuantity; // Update cart icon
    } catch (error) {
        console.error("Error updating cart icon:", error);
    }
}

// Load cart when the button is clicked
async function loadCart() {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
        console.error("No user ID found in session storage.");
        return;
    }

    try {
        const response = await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartdisplay/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch cart");

        const cart = await response.json();
        displayCart(cart.products); // Assume this function exists to display cart items
    } catch (error) {
        console.error("Error loading cart:", error);
    }
}

// Update cart icon whenever an item is added
async function addToCart(productId, productName, productPrice, quantity) {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
        console.error("No user ID found in session storage.");
        return;
    }

    try {
        const response = await fetch("https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartadd", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: userId,
                product_id: productId,
                product_name: productName,
                product_price: productPrice,
                quantity: quantity,
            }),
        });

        if (!response.ok) throw new Error("Failed to add item to cart");
        console.log("Item added to cart successfully");

        // Update cart icon dynamically
        await updateCartIcon();
    } catch (error) {
        console.error("Error adding item to cart:", error);
    }
}

// Call `updateCartIcon` on page load
document.addEventListener("DOMContentLoaded", updateCartIcon);

// Event listener for cart button
document.getElementById("cart-button").addEventListener("click", loadCart);
