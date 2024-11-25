const API_URL = "https://p1ur4uzfyg.execute-api.us-east-1.amazonaws.com/dev";
const CART_URL = "https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartdisplay"; // Retrieve cart API URL

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

        // Step 1: Retrieve Cart Details
        const cartResponse = await fetch(`${CART_URL}/${userId}`);
        if (!cartResponse.ok) {
            throw new Error("Failed to retrieve cart details.");
        }

        const cartData = await cartResponse.json();
        const orderItems = cartData.products.map((product) => ({
            name: product.product_name,
            quantity: product.quantity,
            price: product.product_price,
            subtotal: product.product_price * product.quantity,
        }));

        const itemsTotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
        const totalPrice = itemsTotal + shippingDetails.price;

        console.log("Retrieved cart details:", orderItems);
        console.log("Total price:", totalPrice);

        // Step 2: Validate and Deduct Stock
        const validateResponse = await fetch(`${API_URL}/Validateanddeduct`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId }),
        });

        if (!validateResponse.ok) {
            const errorData = await validateResponse.json();
            throw new Error(`Stock validation failed: ${errorData.message || "Unknown error"}`);
        }

        // Step 3: Finalize Order
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

        // Step 4: Send Email Notification
        const emailPayload = {
            user_email: userEmail,
            order_confirmation: finalizeData.confirmation_number,
            shipping_details: shippingDetails,
            shipping_address: shippingAddress,
            order_items: orderItems, // Include order items
            total_price: totalPrice, // Include total price
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
