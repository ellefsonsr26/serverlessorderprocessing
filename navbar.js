(function () {
    // URL for the admin page
    const adminPageUrl = "admin.html";

    // Debugging: Log sessionStorage contents
    console.log("Session Storage:", sessionStorage);

    // Extract the ID token from session storage
    const idToken = sessionStorage.getItem("id_token");

    if (!idToken) {
        console.error("No ID token found. User might not be logged in.");
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
            adminLink.href = adminPageUrl;
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
})();
