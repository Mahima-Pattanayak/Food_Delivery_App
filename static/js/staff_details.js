document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today if not already set
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('statusDate');
    if (!dateInput.value) {
        dateInput.value = today;
    }

    // Handle back button click
    document.querySelector('.back-button').addEventListener('click', function() {
        window.history.back();
    });

    // Handle metrics button click
    document.querySelector('.metrics-button').addEventListener('click', function() {
        const staffId = window.location.pathname.split('/').pop();
        window.location.href = `/staff/${staffId}/metrics`;
    });
});

function updateMetrics() {
    const staffId = window.location.pathname.split('/').pop();
    const selectedDate = document.getElementById('statusDate').value;
    
    // Redirect to the same page with the new date parameter
    window.location.href = `/staff/${staffId}?date=${selectedDate}`;
}

// Handle date change with Enter key
document.getElementById('statusDate').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        updateMetrics();
    }
});