const API_URL = "https://p1ur4uzfyg.execute-api.us-east-1.amazonaws.com/dev";

// Event listener for placing the order
document.getElementById("place-order-button").addEventListener("click", async () => {
    const shippingOption = document.querySelector('input[name="shipping-option"]:checked').value;
    const cardNumber = document.getElementById("card-number").value;
    const expiryDate = document.getElementById("expiry-date").value;
    const cvv = document.getElementById("cvv").value;

    // Ensure payment fields are filled out
    if (!cardNumber || !expiryDate || !cvv) {
        alert("Please fill out all payment information.");
        return;
    }

    try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) {
            throw new Error("User is not logged in.");
        }

        // Prepare the payload for the FinalizeOrder Lambda
        const payload = {
            user_id: userId,
            shipping_option: shippingOption,
            payment_info: {
                card_number: cardNumber,
                expiry_date: expiryDate,
                cvv: cvv,
            },
        };

        const response = await fetch(`${API_URL}/FinalizeOrder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("Failed to place the order.");
        }

        const responseData = await response.json();
        console.log("Order placed successfully:", responseData);

        // Display the confirmation message and number
        document.getElementById("confirmation-number").textContent = responseData.confirmation_number;
        document.getElementById("confirmation-message").style.display = "block";

        // Hide the place order section
        document.getElementById("place-order-button").style.display = "none";
        document.getElementById("shipping-options").style.display = "none";
        document.getElementById("payment-info").style.display = "none";
    } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
    }
});

// Event listener for navigating back to the orders page
document.getElementById("back-to-orders-button").addEventListener("click", () => {
    window.location.href = `${API_URL}/orders`; // Adjust route if necessary
});
