// Run this code when the page loads
document.addEventListener("DOMContentLoaded", function () {
    storeTokenFromUrl(); // Parse tokens from URL on page load
    checkUserSession(); // Check if the user is logged in or not
});

function storeTokenFromUrl() {
    // Parse tokens from URL fragment and store them in sessionStorage
    const hash = window.location.hash.substring(1); // Get the URL fragment after #
    const params = new URLSearchParams(hash);
    const idToken = params.get("id_token");
    const accessToken = params.get("access_token");

    if (idToken && accessToken) {
        // Store tokens in session storage
        sessionStorage.setItem("id_token", idToken);
        sessionStorage.setItem("access_token", accessToken);
        window.location.hash = ""; // Clear the URL fragment for a cleaner URL
    }
}

function checkUserSession() {
    // Check if the user is logged in by looking for the ID token
    const idToken = sessionStorage.getItem("id_token");
    if (idToken) {
        const username = parseUsernameFromIdToken(idToken);
        if (username) {
            displayUserInfo(username); // Display username and logout button if authenticated
        } else {
            console.error("Username could not be parsed from the ID token.");
            showLoginButton(); // If username parsing fails, show login button
        }
    } else {
        showLoginButton(); // Show login button if not authenticated
    }
}

function parseUsernameFromIdToken(idToken) {
    try {
        // Decode the ID token (JWT format) to extract the username
        const payloadBase64 = idToken.split('.')[1]; // Get the payload section of the token
        const payloadJson = atob(payloadBase64); // Decode from base64
        const payload = JSON.parse(payloadJson); // Parse to JSON
        return payload["cognito:username"] || payload["preferred_username"] || payload["email"];
    } catch (error) {
        console.error("Error parsing ID token:", error);
        return null;
    }
}

function displayUserInfo(username) {
    // Display the username and show the logout button
    document.getElementById('username-display').innerText = `Hello, ${username}`;
    document.getElementById('username-display').style.display = 'inline'; // Show username
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('login-button').style.display = 'none'; // Hide login button
    document.getElementById('logout-button').style.display = 'inline'; // Show logout button
}

function showLoginButton() {
    // Show the login button if the user is not logged in
    document.getElementById('username-display').style.display = 'none'; // Hide username
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('login-button').style.display = 'inline'; // Show login button
    document.getElementById('logout-button').style.display = 'none'; // Hide logout button
}

function redirectToLogin() {
    // Redirect user to the Cognito login page
    const cognitoLoginUrl = "https://s3verification.auth.us-east-1.amazoncognito.com/login?client_id=dn60bjb6uq8osji8j5bghlkpt&response_type=token&scope=email+openid+profile&redirect_uri=" + encodeURIComponent(window.location.href);
    window.location.href = cognitoLoginUrl;
}

function logout() {
    // Clear session tokens and redirect to Cognito logout URL
    sessionStorage.removeItem("id_token");
    sessionStorage.removeItem("access_token");
    const cognitoLogoutUrl = "https://s3verification.auth.us-east-1.amazoncognito.com/logout?client_id=dn60bjb6uq8osji8j5bghlkpt&redirect_uri=https://example.com";
    window.location.href = cognitoLogoutUrl;
}
