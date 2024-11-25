document.addEventListener("DOMContentLoaded", () => {
    const placeOrderButton = document.getElementById("place-order-button");

    if (placeOrderButton) {
        placeOrderButton.addEventListener("click", async (event) => {
            event.preventDefault(); // Prevent form submission

            const shippingOption = document.querySelector('input[name="shipping"]:checked');
            const cardNumber = document.getElementById("card-number").value;
            const expiryDate = document.getElementById("expiry-date").value;
            const cvv = document.getElementById("cvv").value;

            const address = document.getElementById("address").value;
            const city = document.getElementById("city").value;
            const state = document.getElementById("state").value;
            const zipcode = document.getElementById("zipcode").value;

            // Ensure all fields are filled out
            if (!address || !city || !state || !zipcode || !cardNumber || !expiryDate || !cvv) {
                alert("Please fill out all required fields.");
                return;
            }

            try {
                const userId = sessionStorage.getItem("user_id");
                if (!userId) {
                    throw new Error("User is not logged in.");
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
                        type: shippingOption.value,
                        price: parseFloat(shippingOption.dataset.price),
                    },
                    shipping_address: {
                        address,
                        city,
                        state,
                        zipcode,
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
                alert(`Order placed successfully! Confirmation Number: ${finalizeData.confirmation_number}`);
                window.location.href = "https://dsuse8fg02nie.cloudfront.net/pages/services.html"; // Redirect back to orders page
            } catch (error) {
                console.error("Error placing order:", error);
                alert(`Failed to place order. ${error.message}`);
            }
        });
    }
});
