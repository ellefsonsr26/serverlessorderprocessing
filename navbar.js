// URL for the admin page
const adminPageUrl = "admin.html";

// Extract the ID token from session storage
const idToken = sessionStorage.getItem("id_token");

if (!idToken) {
  console.error("No ID token found. User might not be logged in.");
  return;
}

// Decode the token to retrieve user information
const decodedToken = jwt_decode(idToken);
console.log("Decoded Token:", decodedToken);

// Check for Admin group membership
const userGroups = decodedToken["cognito:groups"] || [];
if (userGroups.includes("ADMIN")) {
  // Create the Admin link and add it to the navbar
  const adminLink = document.createElement("a");
  adminLink.href = adminPageUrl;
  adminLink.textContent = "Admin Page";

  const navbar = document.querySelector(".navbar");
  navbar.appendChild(adminLink);
}
