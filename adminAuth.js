// adminAuth.js

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the ID token from session storage
    const idToken = sessionStorage.getItem("id_token");

    if (!idToken) {
        console.error("No ID token found. Redirecting to Not Authorized page.");
        window.location.href = "pages/notAuthorized.html";
        return;
    }

    // Decode the ID token
    const decodedToken = jwt_decode(idToken);
    console.log("Decoded Token:", decodedToken);

    // Check if the user belongs to the "ADMIN" group
    const userGroups = decodedToken["cognito:groups"] || [];
    console.log("User Groups:", userGroups);

    if (!userGroups.includes("ADMIN")) {
        console.warn("User is not authorized. Redirecting to Not Authorized page.");
        window.location.href = "pages/notAuthorized.html";
        return;
    }

    console.log("User authorized. Access to admin page granted.");
});
