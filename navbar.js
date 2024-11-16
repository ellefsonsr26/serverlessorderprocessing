(function () {
    // Wait for the DOM to fully load before executing the script
    document.addEventListener("DOMContentLoaded", () => {
        // Debugging: Log sessionStorage contents
        console.log("Session Storage on DOMContentLoaded:", sessionStorage);

        // Extract the ID token from session storage
        const idToken = sessionStorage.getItem("id_token");

        if (!idToken) {
            console.error("No ID token found in session storage. User might not be logged in.");
            return;
        }

        console.log("Retrieved ID Token:", idToken);

        // Decode the token to retrieve user information
        try {
            const decodedToken = jwt_decode(idToken);
            console.log("Decoded Token:", decodedToken);

            // Check for Admin group membership
            const userGroups = decodedToken["cognito:groups"] || [];
            console.log("User Groups:", userGroups);

            if (userGroups.includes("ADMIN")) {
                // Create the Admin link and add it to the navbar
                const adminLink = document.createElement("a");
                adminLink.href = "pages/admin.html";
                adminLink.textContent = "Admin Page";

                const navbar = document.querySelector(".navbar");
                navbar.appendChild(adminLink);

                console.log("Admin link added to navbar.");
            } else {
                console.log("User is not in the ADMIN group.");
            }
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    });
})();
