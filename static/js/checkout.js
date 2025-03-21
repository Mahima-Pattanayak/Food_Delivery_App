document.addEventListener('DOMContentLoaded', function() {
    const addressForm = document.getElementById('checkoutForm');  
    const newLocationInput = document.getElementById('delivery_location');
    const validateButton = document.getElementById('validateButton');
    const orderNoteTextarea = document.getElementById('order-note');
    
    // List of accepted pincodes
    const available_pincodes = [743376, 743329, 743363, 743355, 743611, 743337, 743502, 743372, 743384, 743387];
    
    // Check for availability message on page load
    function checkAvailability() {
        const messageElement = document.getElementById('backend-message');
        const message = messageElement ? messageElement.getAttribute('data-message') : '';
        if (message && message.includes('following items are not available')) {
            alert(message);
            return false;
        }
        return true;
    }

    // Run availability check on page load
    checkAvailability();

    // Function to show errors
    function showError(message) {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }

    // Validate location function - returns boolean without showing alert for success
    function validateLocation(silent = false) {
        const address = newLocationInput.value;
        const pincodeMatch = address.match(/\b\d{6}\b/);

        if (!pincodeMatch) {
            showError("No valid pincode found in the address.");
            return false;
        }

        const pincode = parseInt(pincodeMatch[0], 10);
        if (!available_pincodes.includes(pincode)) {
            showError("Sorry, delivery is not available in this area.");
            return false;
        }

        if (!silent) {
            alert("Delivery location is valid!");
        }
        return true;
    }

    // Add click handler for validate button
    if (validateButton) {
        validateButton.addEventListener('click', () => validateLocation(false));
    }

    // Handle form submission
    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted'); // Debug log

            if (!checkAvailability()) {
                return;
            }

            const formData = new FormData(addressForm);

            // Log form data for debugging
            console.log('Form Data:', Object.fromEntries(formData.entries()));
            
            // Validate delivery location
            const deliveryLocation = formData.get('delivery_location').trim();
            if (!deliveryLocation) {
                showError('Please enter a delivery location');
                return;
            }
            if (!validateLocation(true)) {
                return;
            }

            // Add order note to form data
            const orderNote = orderNoteTextarea.value.trim() || 'EMPTY';  // Default to 'EMPTY' if not filled
            formData.append('order_note', orderNote);
            
            // Get the current URL
            const currentUrl = window.location.href;
            console.log('Submitting to:', currentUrl); // Debug log

            // Submit the form
            fetch(currentUrl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Response data:', data);
                if (data.status === 'success' && data.redirect_url) {
                    window.location.href = data.redirect_url;
                } else {
                    showError('An error occurred while processing your order');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('An error occurred while processing your order. Please try again.');
            });
        });
    }
});

const button = document.getElementById('add-discount-btn');
const container = document.getElementById('discount-container');

button.addEventListener('click', () => {
    if (container.style.visibility === 'hidden' || !container.style.visibility) {
        container.style.visibility = 'visible';
        container.style.opacity = '1';
    } else {
        container.style.visibility = 'hidden';
        container.style.opacity = '0';
    }
});



document.getElementById("validate-coupon-btn").addEventListener("click", function () {
    const couponCode = document.getElementById("coupon-code").value.trim();
    
    if (!couponCode) {
        alert("Please enter a coupon code.");
        return;
    }
    
    // Show loading state
    const validateButton = this;
    validateButton.disabled = true;
    validateButton.textContent = "Validating...";
    
    fetch("/coupons", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({ 
            coupon_code: couponCode, 
            total_price: TOTAL_PRICE 
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const discountAmount = TOTAL_PRICE - data.discounted_price;
            
            // Update the total payment section
            const totalPaymentUl = document.querySelector(".total-payment ul");
            
           
            
            // Add new discount lines
            totalPaymentUl.insertAdjacentHTML('beforeend', `
                <li><strong>Discount:</strong> <span>-$${discountAmount.toFixed(2)}</span></li>
                <li><strong>Final Price:</strong> <span>$${data.discounted_price.toFixed(2)}</span></li>
            `);
            
            alert("Coupon applied successfully!");
        } else {
            alert(data.message || "Invalid coupon code");
        }
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Error validating coupon. Please try again.");
    })
    .finally(() => {
        // Reset button state
        validateButton.disabled = false;
        validateButton.textContent = "Validate";
    });
});