// Replace with your actual API Gateway URL for fetching products and adding to the cart
const fetchApiUrl = 'https://s517yim8jj.execute-api.us-east-1.amazonaws.com/Dev/FetchProducts';
const cartApiUrl = 'https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartadd'; // Replace with your cart API URL

async function fetchProducts() {
    try {
        const response = await fetch(fetchApiUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const products = await response.json();
        console.log("Fetched products:", products);

        // Sort products into categories
        const categories = {
            Pizza: [],
            Wings: [],
            Breadsticks: []
        };

        products.forEach(product => {
            console.log(`Processing product: ${product.product_name}, Category: ${product.category}`);
            if (categories[product.category]) {
                categories[product.category].push(product);
            } else {
                console.warn(`Unknown category "${product.category}" found in product:`, product);
            }
        });

        // Display products by category
        Object.keys(categories).forEach(category => {
            const container = document.getElementById(`category-${category.toLowerCase()}`);
            if (!container) {
                console.error(`Container for category "${category}" not found`);
                return;
            }
            container.innerHTML = categories[category]
                .map(product => {
                    const price = parseFloat(product.price) || 0; // Ensure price is a valid number
                    return `
                        <div class="product">
                            <img src="${product.image_url}" alt="${product.product_name}" class="product-image">
                            <h3>${product.product_name}</h3>
                            <p>${product.description}</p>
                            <p><strong>Price:</strong> $${price.toFixed(2)}</p>
                            <input type="number" id="quantity-${product.product_id}" placeholder="Quantity" min="1">
                            <button onclick="addToCart('${product.product_id}', '${product.product_name}', ${price.toFixed(2)})">
                                Add to Cart
                            </button>
                        </div>
                    `;
                })
                .join("");
        });
    } catch (error) {
        console.error("Failed to fetch products:", error);

        // Display error message on the page
        const errorContainer = document.getElementById("error-container");
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="error-message">
                    <p>There was an issue fetching the products. Please try again later.</p>
                </div>
            `;
        }
    }
}

async function addToCart(productId, productName, productPrice) {
    const userId = sessionStorage.getItem("user_id");
    console.log("User ID from session storage:", userId);

    if (!userId) {
        alert("You must be logged in to add items to the cart.");
        return;
    }

    const quantity = parseInt(document.getElementById(`quantity-${productId}`).value, 10);
    console.log("Quantity to add:", quantity);

    if (isNaN(quantity) || quantity < 1) {
        alert("Please enter a valid quantity.");
        return;
    }

    try {
        const response = await fetch(cartApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("id_token")}`,
            },
            body: JSON.stringify({
                user_id: userId,
                product_id: productId,
                quantity: quantity,
                product_name: productName,
                product_price: productPrice,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to add item to cart");
        }

        const result = await response.json();
        console.log("Add to cart result:", result);
        alert("Item added to cart!");

        // Update the cart icon count
        if (typeof updateCartIcon === "function") {
            updateCartIcon(); // Call the function from cart.js
        } else {
            console.warn("updateCartIcon function not found.");
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Failed to add item to cart.");
    }
}

// Fetch products when the page loads
window.onload = fetchProducts;
