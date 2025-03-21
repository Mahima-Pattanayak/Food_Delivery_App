document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('orderSearch');
    const orderCards = document.querySelectorAll('.order-card');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();

        orderCards.forEach(card => {
            const orderId = card.getAttribute('data-order-id').toLowerCase();
            if (orderId.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});