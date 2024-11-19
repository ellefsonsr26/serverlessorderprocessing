const apiUrl = 'https://ioifpro2m0.execute-api.us-east-1.amazonaws.com/Dev'; // Base API URL

async function fetchStock() {
  try {
    const response = await fetch(`${apiUrl}/Stock`);
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
        <button onclick="showHistory(${product.product_id})">View History</button>
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
    const response = await fetch(`${apiUrl}/update`, {
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

async function showHistory(productId) {
    try {
        // Fetch history data from the API
        const response = await fetch(`${apiUrl}/history/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch history');

        const history = await response.json();

        // Get the popup and content containers
        const popup = document.getElementById('history-popup');
        const content = document.getElementById('history-content');

        if (!popup || !content) {
            throw new Error('Popup elements are missing in the HTML');
        }

        // Populate the content with history data
        content.innerHTML = `
            <h3>Change History for Product ID: ${productId}</h3>
            ${history
                .map(
                    (item) => `
                <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd;">
                    <p><strong>Date:</strong> ${new Date(item.date).toLocaleString()}</p>
                    <p><strong>Change:</strong> ${item.change}</p>
                    <p><strong>Reason:</strong> ${item.reason}</p>
                    <p><strong>Notes:</strong> ${item.notes}</p>
                </div>
            `
                )
                .join('')}
        `;

        // Show the popup
        popup.style.display = 'block';

        // Close popup event
        const closeButton = document.getElementById('close-popup');
        closeButton.onclick = () => {
            popup.style.display = 'none';
        };
    } catch (error) {
        alert(error.message);
    }
}

function closePopup() {
  const popup = document.getElementById('history-popup');
  popup.style.display = 'none';
}

// Fetch stock levels on page load
window.onload = fetchStock;
