document.addEventListener("DOMContentLoaded", () => {
    const summaryButton = document.querySelector(".summary-button");

    // Redirect to Order Summary Page
    summaryButton.addEventListener("click", () => {
        summary();
        // Add logic here for redirection, e.g.:
        //window.location.href = "order-summary.html";
    });
    function summary(){
        window.location.href = "/order-summary/${orderId}";
    }
});
