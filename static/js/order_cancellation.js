document.addEventListener("DOMContentLoaded", () => {
    const summaryButton = document.querySelector(".summary-button");
 
    // Redirect to Home Page
    summaryButton.addEventListener("click", () => {
        alert("Redirecting to Home Page...");
        redirectToHome();
    });
 });
 