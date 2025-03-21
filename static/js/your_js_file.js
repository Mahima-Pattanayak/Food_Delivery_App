document.addEventListener('DOMContentLoaded', () => {
    fetch('/data/orders')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched Data:', data);  // Debugging line

            const labels = data.map(item => item.order_date);
            const values = data.map(item => item.order_count);

            // Create the chart
            const ctx = document.getElementById('orderChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Order Frequency',
                        data: values,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Order Count'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Order Date'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching order data:', error));  // Debugging line
});
