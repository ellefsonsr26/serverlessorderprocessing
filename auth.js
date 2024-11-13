document.addEventListener("DOMContentLoaded", function () {
    checkUserSession();
});

function checkUserSession() {
    const idToken = sessionStorage.getItem("id_token");
    if (idToken) {
        const username = parseUsernameFromIdToken(idToken);
        displayUserInfo(username);
    } else {
        showLoginButton();
    }
}

function parseUsernameFromIdToken(idToken) {
    const payloadBase64 = idToken.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return payload["cognito:username"] || payload["preferred_username"] || payload["email"];
}

function displayUserInfo(username) {
    document.getElementById('username-display').innerText = `Hello, ${username}`;
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('login-button').style.display = 'none';
    document.getElementById('logout-button').style.display = 'inline';
}

function showLoginButton() {
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('login-button').style.display = 'inline';
    document.getElementById('logout-button').style.display = 'none';
}

function redirectToLogin() {
    const cognitoLoginUrl = "https://s3verification.auth.us-east-1.amazoncognito.com/login?client_id=dn60bjb6uq8osji8j5bghlkpt&response_type=token&scope=email+openid+profile&redirect_uri=" + encodeURIComponent(window.location.href);
    window.location.href = cognitoLoginUrl;
}

function logout() {
    sessionStorage.removeItem("id_token");
    sessionStorage.removeItem("access_token");
    const cognitoLogoutUrl = "https://s3verification.auth.us-east-1.amazoncognito.com/logout?client_id=dn60bjb6uq8osji8j5bghlkpt&redirect_uri=https://dsuse8fg02nie.cloudfront.net/index.html";
    window.location.href = cognitoLogoutUrl;
}
