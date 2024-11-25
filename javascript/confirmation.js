const API_URL = "https://p1ur4uzfyg.execute-api.us-east-1.amazonaws.com/dev";

// Event listener for placing the order
document.getElementById("place-order-button").addEventListener("click", async (e) => {
    e.preventDefault();

    const shippingOption = document.querySelector('input[name="shipping"]:checked');
    const shippingAddress = {
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        zipcode: document.getElementById("zipcode").value,
    };
    const cardNumber = document.getElementById("card-number").value;
    const expiryDate = document.getElementById("expiry-date").value;
    const cvv = document.getElementById("cvv").value;

    if (!shippingOption || !cardNumber || !expiryDate || !cvv || Object.values(shippingAddress).some((v) => !v)) {
        alert("Please fill out all fields.");
        return;
    }

    const shippingDetails = {
        type: shippingOption.value,
        price: parseFloat(shippingOption.dataset.price),
    };

    try {
        const userId = sessionStorage.getItem("user_id");
        const userEmail = sessionStorage.getItem("user_email"); // Retrieve user email from session storage

        if (!userId || !userEmail) {
            throw new Error("User is not logged in or email is missing.");
        }

        // Step 1: Validate and Deduct Stock
        const validateResponse = await fetch(`${API_URL}/Validateanddeduct`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId }),
        });

        if (!validateResponse.ok) {
            const errorData = await validateResponse.json();
            throw new Error(`Stock validation failed: ${errorData.message || "Unknown error"}`);
        }

        // Step 2: Finalize Order
        const finalizePayload = {
            user_id: userId,
            shipping_option: shippingDetails,
            shipping_address: shippingAddress,
            payment_info: { card_number: cardNumber, expiry_date: expiryDate, cvv: cvv },
        };

        const finalizeResponse = await fetch(`${API_URL}/Finalizeorder`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalizePayload),
        });

        if (!finalizeResponse.ok) {
            throw new Error("Failed to finalize the order.");
        }

        const finalizeData = await finalizeResponse.json();

        // Step 3: Send Email Notification
        const emailPayload = {
            user_email: userEmail,
            order_confirmation: finalizeData.confirmation_number,
            shipping_details: shippingDetails,
            shipping_address: shippingAddress,
            order_items: finalizeData.order_items, // Include order items from the finalize response
            total_price: finalizeData.total_price, // Include total price from the finalize response
        };

        const emailResponse = await fetch(`${API_URL}/Email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailPayload),
        });

        if (!emailResponse.ok) {
            throw new Error("Failed to send confirmation email.");
        }

        console.log("Confirmation email sent successfully.");

        // Hide the form and display the confirmation message
        document.getElementById("order-form").style.display = "none";
        const confirmationMessage = document.getElementById("confirmation-message");
        confirmationMessage.style.display = "block";
        document.getElementById("confirmation-number").textContent = finalizeData.confirmation_number;
    } catch (error) {
        console.error("Error placing order:", error);
        alert(`Failed to place order. ${error.message}`);
    }
});

// Event listener for navigating back to the orders page
document.getElementById("back-to-orders-button").addEventListener("click", () => {
    window.location.href = "https://dsuse8fg02nie.cloudfront.net/pages/services.html";
});
