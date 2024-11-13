// Run this code when the page loads
document.addEventListener("DOMContentLoaded", function () {
    checkUserSession();
    storeTokenFromUrl(); // Parse tokens from URL on page load
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
        displayUserInfo(username); // Display username and logout button if authenticated
    } else {
        showLoginButton(); // Show login button if not authenticated
    }
}

function parseUsernameFromIdToken(idToken) {
    // Decode the ID token (JWT format) to extract the username
    const payloadBase64 = idToken.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return payload["cognito:username"] || payload["preferred_username"] || payload["email"];
}

function displayUserInfo(username) {
    // Display the username and show the logout button
    document.getElementById('username-display').innerText = `Hello, ${username}`;
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('login-button').style.display = 'none';
    document.getElementById('logout-button').style.display = 'inline';
}

function showLoginButton() {
    // Show the login button if the user is not logged in
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('login-button').style.display = 'inline';
    document.getElementById('logout-button').style.display = 'none';
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
    const cognitoLogoutUrl = "https://s3verification.auth.us-east-1.amazoncognito.com/logout?client_id=dn60bjb6uq8osji8j5bghlkpt&redirect_uri=https://dsuse8fg02nie.cloudfront.net/logout-success.html";
    window.location.href = cognitoLogoutUrl;
}
