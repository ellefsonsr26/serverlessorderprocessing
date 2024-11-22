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
                            <button onclick="addToCart(${product.product_id}, ${price.toFixed(2)})">Add to Cart</button>
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

async function addToCart(productId, quantity) {
    const userId = sessionStorage.getItem("user_id"); // Retrieve user_id from session storage
    if (!userId) {
        alert("You must be logged in to add items to the cart.");
        return;
    }

    try {
        const response = await fetch("https://your-api-gateway-url/Cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, product_id: productId, quantity }),
        });

        if (!response.ok) throw new Error("Failed to add item to cart");
        alert("Item added to cart successfully");
        updateCartIcon(); // Refresh the cart count
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Failed to add item to cart. Please try again.");
    }
}


// Fetch products when the page loads
window.onload = fetchProducts;
