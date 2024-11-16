// Wait for the DOM to load before executing
document.addEventListener("DOMContentLoaded", () => {
    // Extract ID token from URL or session storage
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = hashParams.get("id_token") || localStorage.getItem("id_token");

    if (!idToken) {
        console.error("No ID token found. User might not be logged in.");
        return;
    }

    // Store token in local storage for persistence across pages
    localStorage.setItem("id_token", idToken);

    // Decode the token to retrieve user details
    const decodedToken = jwt_decode(idToken);
    console.log("Decoded Token:", decodedToken);

    // Display username next to logout button
    const usernameDisplay = document.getElementById("username-display");
    usernameDisplay.textContent = `Hello, ${decodedToken.email || "User"}`;
    usernameDisplay.style.display = "inline";

    // Check user group membership
    const userGroups = decodedToken["cognito:groups"] || [];
    console.log("User Groups:", userGroups);

    if (userGroups.includes("ADMIN")) {
        // Add Admin link to navbar
        const adminLink = document.createElement("a");
        adminLink.href = "pages/admin.html";
        adminLink.textContent = "Admin Page";
        document.querySelector(".navbar").appendChild(adminLink);
    }
});

// Logout function to clear token and redirect to logout
function logout() {
    localStorage.removeItem("id_token");
    window.location.href = "https://your-cognito-logout-url";
}
