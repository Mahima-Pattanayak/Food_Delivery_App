// Modified JavaScript code
document.querySelector(".cart-container").addEventListener("click", async (event) => {
    const button = event.target;
    const cartItem = button.closest(".cart-item");
  
    if (button.classList.contains("increase") || button.classList.contains("decrease")) {
        const itemId = cartItem.getAttribute("data-id");
        const quantityElement = cartItem.querySelector(".quantity-value");
        const currentQuantity = parseInt(quantityElement.textContent, 10);
  
        const change = button.classList.contains("increase") ? 1 : -1;
        const newQuantity = currentQuantity + change;
  
        // Now allowing quantity to become 0
        if (newQuantity < 0) {
            alert("Invalid quantity.");
            return;
        }
  
        const result = await updateQuantityOnServer(itemId, newQuantity);
        if (result !== null) {
            if (newQuantity === 0) {
                // Remove the cart item from DOM if quantity is 0
                cartItem.remove();
            } else {
                quantityElement.textContent = result.new_quantity;
            }
            updateTotals();
            
            // If cart becomes empty, show a message
            const remainingItems = document.querySelectorAll(".cart-item");
            if (remainingItems.length === 0) {
                const cartContainer = document.querySelector(".cart-container");
                cartContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
            }
        }
    }
  });
  
  // Modified update quantity function
  async function updateQuantityOnServer(itemId, newQuantity) {
    try {
        const response = await fetch('/cart/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item_id: itemId, quantity: newQuantity }),
        });
  
        if (!response.ok) throw new Error('Failed to update quantity. Please try again.');
  
        const data = await response.json();
        return data; // Return the complete response from server
    } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity. Please try again.');
        return null;
    }
  }
  
  // Modified update totals function
  function updateTotals() {
    const cartItems = document.querySelectorAll(".cart-item");
    let totalPrice = 0;
  
    cartItems.forEach(item => {
        const price = parseFloat(item.getAttribute("data-price"));
        const quantity = parseInt(item.querySelector(".quantity-value").textContent);
        const itemTotal = price * quantity;
  
        item.querySelector(".item-total").textContent = itemTotal.toFixed(2);
        totalPrice += itemTotal;
    });
  
    const totalElement = document.getElementById("total-price");
    if (totalElement) {
        totalElement.textContent = totalPrice.toFixed(2);
    }
  }