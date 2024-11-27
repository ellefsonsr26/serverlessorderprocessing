const API_URL = "https://7ljjqvmj5k.execute-api.us-east-1.amazonaws.com/Dev";

// Event listener for order lookup
document.getElementById("order-lookup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const confirmationNumber = document.getElementById("confirmation-number-input").value;

    if (!confirmationNumber) {
        alert("Please enter a confirmation number.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/Orderlookup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ confirmation_number: confirmationNumber }),
        });

        if (!response.ok) {
            throw new Error("Order not found or could not be retrieved.");
        }

        const orderData = await response.json();

        // Populate order details
        document.getElementById("order-confirmation").textContent = orderData.confirmation_number;
        document.getElementById("order-shipping").textContent = `${orderData.shipping_option.type} ($${orderData.shipping_option.price})`;
        document.getElementById("order-address").textContent = `${orderData.shipping_address.address}, ${orderData.shipping_address.city}, ${orderData.shipping_address.state} - ${orderData.shipping_address.zipcode}`;
        document.getElementById("order-total").textContent = orderData.total.toFixed(2);

        // Populate order items
        const itemsTableBody = document.getElementById("order-items-table").querySelector("tbody");
        itemsTableBody.innerHTML = ""; // Clear existing rows

        orderData.products.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.product_name}</td>
                <td>${item.quantity}</td>
                <td>$${item.product_price.toFixed(2)}</td>
                <td>$${item.total_price.toFixed(2)}</td>
            `;
            itemsTableBody.appendChild(row);
        });

        // Show the order details container
        document.getElementById("order-details").style.display = "block";
        document.getElementById("order-error").style.display = "none";
    } catch (error) {
        console.error("Error fetching order:", error);
        document.getElementById("order-error").textContent = error.message;
        document.getElementById("order-error").style.display = "block";
        document.getElementById("order-details").style.display = "none";
    }
});
