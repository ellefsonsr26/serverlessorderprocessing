const API_URL = "https://p1ur4uzfyg.execute-api.us-east-1.amazonaws.com/dev";

// Event listener for placing the order
document.getElementById("place-order-button").addEventListener("click", async () => {
    const shippingOption = document.querySelector('input[name="shipping-option"]:checked').value;
    const cardNumber = document.getElementById("card-number").value;
    const expiryDate = document.getElementById("expiry-date").value;
    const cvv = document.getElementById("cvv").value;
    const shippingAddress = document.getElementById("shipping-address").value;
    const city = document.getElementById("city").value;
    const zipcode = document.getElementById("zipcode").value;
    const state = document.getElementById("state").value;

    // Ensure payment and shipping fields are filled out
    if (!cardNumber || !expiryDate || !cvv || !shippingAddress || !city || !zipcode || !state) {
        alert("Please fill out all required fields.");
        return;
    }

    try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) {
            throw new Error("User is not logged in.");
        }

        // Map shipping options to their corresponding prices
        const shippingPrices = {
            Standard: 0,
            Express: 20,
            Teleportation: 150,
        };

        const shippingPrice = shippingPrices[shippingOption];
        if (shippingPrice === undefined) {
            throw new Error("Invalid shipping option selected.");
        }

        // Step 1: Validate and Deduct Stock
        const validateResponse = await fetch(`${API_URL}/Validateanddeduct`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: userId }),
        });

        if (!validateResponse.ok) {
            const errorData = await validateResponse.json();
            throw new Error(`Stock validation failed: ${errorData.message || "Unknown error"}`);
        }

        console.log("Stock validated and deducted successfully.");

        // Step 2: Finalize Order
        const finalizePayload = {
            user_id: userId,
            shipping_option: {
                method: shippingOption,
                price: shippingPrice,
            },
            shipping_address: {
                address: shippingAddress,
                city: city,
                state: state,
                zipcode: zipcode,
            },
            payment_info: {
                card_number: cardNumber,
                expiry_date: expiryDate,
                cvv: cvv,
            },
        };

        const finalizeResponse = await fetch(`${API_URL}/Finalizeorder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(finalizePayload),
        });

        if (!finalizeResponse.ok) {
            throw new Error("Failed to finalize the order.");
        }

        const finalizeData = await finalizeResponse.json();
        console.log("Order finalized successfully:", finalizeData);

        // Step 3: Display the confirmation number
        document.getElementById("confirmation-number").textContent = finalizeData.confirmation_number;
        document.getElementById("confirmation-message").style.display = "block";

        // Hide the place order section
        document.getElementById("place-order-button").style.display = "none";
        document.getElementById("shipping-options").style.display = "none";
        document.getElementById("payment-info").style.display = "none";
        document.getElementById("shipping-info").style.display = "none";
    } catch (error) {
        console.error("Error placing order:", error);
        alert(`Failed to place order. ${error.message}`);
    }
});

// Event listener for navigating back to the orders page
document.getElementById("back-to-orders-button").addEventListener("click", () => {
    window.location.href = `https://dsuse8fg02nie.cloudfront.net/pages/services.html`; // Adjust route if necessary
});
