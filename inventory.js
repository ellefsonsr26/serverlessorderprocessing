const apiBaseUrl = 'https://ioifpro2m0.execute-api.us-east-1.amazonaws.com/Dev';

async function fetchStock() {
  try {
    const response = await fetch(`${apiBaseUrl}/Stock`); // Adjusted path
    if (!response.ok) throw new Error('Failed to fetch stock levels');
    const products = await response.json();

    const stockContainer = document.getElementById('stock-container');
    stockContainer.innerHTML = products.map(product => `
      <div class="product">
        <img src="${product.image_url}" alt="${product.product_name}" class="product-image">
        <h3>${product.product_name}</h3>
        <p>${product.description}</p>
        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Stock Level:</strong> ${product.stock_level}</p>
        <input type="number" id="stock-${product.product_id}" placeholder="Enter stock change">
        <button onclick="updateStock(${product.product_id})">Update Stock</button>
      </div>
    `).join('');
  } catch (error) {
    document.getElementById('error-container').textContent = error.message;
  }
}

async function updateStock(productId) {
  const stockChange = document.getElementById(`stock-${productId}`).value;
  if (!stockChange) {
    alert('Please enter a stock change value');
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/Stock/update`, { // Adjusted path
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productId,
        change: parseInt(stockChange, 10),
        reason: 'Manual update',
        notes: 'Updated via interface'
      })
    });
    if (!response.ok) throw new Error('Failed to update stock');
    alert('Stock updated successfully');
    fetchStock(); // Refresh stock levels
  } catch (error) {
    alert(error.message);
  }
}

window.onload = fetchStock;
