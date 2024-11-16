// Import the jwt-decode library
const adminPageUrl = "pages/admin.html"; // The restricted page for admins

function showAdminLink() {
    // Extract ID token from the URL fragment (implicit grant flow)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = hashParams.get('id_token');

    if (!idToken) {
        console.error("No ID token found. User might not be logged in.");
        return;
    }

    // Decode the token to retrieve user information
    console.log("Hash Parameters:", window.location.hash);
    console.log("ID Token:", idToken);
    const decodedToken = jwt_decode(idToken);
    console.log("Decoded Token:", decodedToken);
    console.log("User Groups:", decodedToken["cognito:groups"]);

    // Check for Admin group membership
    const userGroups = decodedToken['cognito:groups'] || [];
    if (userGroups.includes('ADMIN')) {
        // Create the Admin link and add it to the navbar
        const adminLink = document.createElement("a");
        adminLink.href = adminPageUrl;
        adminLink.textContent = "Admin Page";

        const navbar = document.getElementById("navbar");
        navbar.appendChild(adminLink);
    }
}
// Execute on page load
window.onload = showAdminLink;
