// Replace with your actual API Gateway URL
const apiUrl = 'https://s517yim8jj.execute-api.us-east-1.amazonaws.com/Dev/FetchProducts';

async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
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
                .map(product => `
                    <div class="product">
                        <img src="${product.image_url}" alt="${product.product_name}" class="product-image">
                        <h3>${product.product_name}</h3>
                        <p>${product.description}</p>
                        <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                    </div>
                `)
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

// Fetch products when the page loads
window.onload = fetchProducts;
