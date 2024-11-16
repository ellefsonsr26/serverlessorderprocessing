  const apiUrl = 'https://s517yim8jj.execute-api.us-east-1.amazonaws.com/Dev/FetchProducts';

   async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Network response was not ok");
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
            }
        });

        // Display products by category
        Object.keys(categories).forEach(category => {
            const container = document.getElementById(category-${category.toLowerCase()});
            container.innerHTML = categories[category]
                .map(product => 
                    <div class="product">
                        <img src="${product.image_url}" alt="${product.product_name}" class="product-image">
                        <h3>${product.product_name}</h3>
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                    </div>
                )
                .join("");
        });
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
}

        // Fetch products when the page loads
        window.onload = fetchProducts;
