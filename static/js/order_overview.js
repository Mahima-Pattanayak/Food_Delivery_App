// Global chart variables
let statusChart = null;
let weeklyChart = null;
let monthlyChart = null;
let yearlyChart = null;

// Chart color configurations
const chartColors = {
    'On Time': {
        border: '#32CD32',
        background: 'rgba(50, 205, 50, 0.2)'
    },
    'Slightly Delayed': {
        border: '#FFD700',
        background: 'rgba(255, 215, 0, 0.2)'
    },
    'Delayed': {
        border: '#8A2BE2',
        background: 'rgba(138, 43, 226, 0.2)'
    },
    'Over Delayed': {
        border: '#FF0000',
        background: 'rgba(255, 0, 0, 0.2)'
    }
};

// Initialize date controls
function initializeDateControls() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Set up year picker
    const yearPicker = document.getElementById('yearPicker');
    yearPicker.innerHTML = ''; // Clear existing options
    
    // Add options from current year + 1 to 2 years back
    for (let year = currentYear; year >= currentYear - 2; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) {
            option.selected = true;
        }
        yearPicker.appendChild(option);
    }
    
    // Set up month picker with last 12 months
    const monthPicker = document.getElementById('monthPicker');
    monthPicker.innerHTML = ''; // Clear existing options

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];

    // Add options for the last 12 months
    for (let i = 0; i < 12; i++) {
        const d = new Date();
        d.setMonth(currentDate.getMonth() - i);
        
        const option = document.createElement('option');
        const year = d.getFullYear();
        const monthNum = (d.getMonth() + 1).toString().padStart(2, '0');
        
        option.value = `${year}-${monthNum}`;
        option.textContent = `${months[d.getMonth()]} ${year}`;
        if (i === 0) {
            option.selected = true;
        }
        monthPicker.appendChild(option);
    }
    
    // Set up daily and weekly date pickers
    const dailyDatePicker = document.getElementById('dailyDatePicker');
    const weeklyDatePicker = document.getElementById('weeklyDatePicker');
    
    dailyDatePicker.value = currentDate.toISOString().split('T')[0];
    dailyDatePicker.max = currentDate.toISOString().split('T')[0];
    
    weeklyDatePicker.value = currentDate.toISOString().split('T')[0];
    weeklyDatePicker.max = currentDate.toISOString().split('T')[0];
}

// Fetch and update order statistics
function updateOrderStats() {
    fetch('/api/order-stats')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.green .stat-value').textContent = data.total_orders;
            document.querySelector('.pink .stat-value').textContent = data.yearly_orders;
            document.querySelector('.purple .stat-value').textContent = data.monthly_orders;
            document.querySelector('.blue .stat-value').textContent = data.daily_orders;
        })
        .catch(error => console.error('Error fetching order stats:', error));
}

// Update daily status chart
function updateDailyStatusChart(date) {
    fetch(`/api/daily-status/${date}`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('statusChart').getContext('2d');
            
            if (statusChart) {
                statusChart.destroy();
            }
            
            statusChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: data.labels,
                    datasets: [{
                        data: data.data,
                        backgroundColor: [
                            chartColors['On Time'].border,
                            chartColors['Slightly Delayed'].border,
                            chartColors['Delayed'].border,
                            chartColors['Over Delayed'].border
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Today\'s Delivery Status'}
                    }
                }
            });
        })
        .catch(error => console.error('Error updating daily status:', error));
}

// Update weekly status chart
function updateWeeklyChart(date) {
    fetch(`/api/weekly-status/${date}`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('weeklyChart').getContext('2d');
            
            // Find the maximum value in the dataset for scaling
            const maxValue = Math.max(...data.datasets.flatMap(ds => ds.data));
            const stepSize = Math.ceil(maxValue / 5); // Divide range into 5 steps
            
            if (weeklyChart) {
                weeklyChart.destroy();
            }
            
            weeklyChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: data.labels,
                    datasets: data.datasets.map((ds, index) => ({
                        label: ds.label,
                        data: ds.data,
                        borderColor: Object.values(chartColors)[index].border,
                        backgroundColor: Object.values(chartColors)[index].background,
                        fill: true
                    }))
                },
                options: {
                    scales: {
                        r: {
                            beginAtZero: true,
                            suggestedMax: maxValue + stepSize,
                            ticks: {
                                stepSize: stepSize,
                                font: {
                                    size: 12
                                }
                            },
                            pointLabels: {
                                font: {
                                    size: 16
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Weekly Delivery Status'}
                    }
                }
            });
            
            // Update week range display
            const startDate = new Date(date);
            startDate.setDate(startDate.getDate() - startDate.getDay());
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() - 6);
            
            document.getElementById('weekRange').textContent = 
                `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        })
        .catch(error => console.error('Error updating weekly status:', error));
}

// Update monthly status chart
function updateMonthlyChart(month) {
    fetch(`/api/monthly-status/${month}`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('monthlyChart').getContext('2d');
            
            if (monthlyChart) {
                monthlyChart.destroy();
            }
            
            monthlyChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: data.datasets.map((ds, index) => ({
                        label: ds.label,
                        data: ds.data,
                        borderColor: Object.values(chartColors)[index].border,
                        backgroundColor: Object.values(chartColors)[index].background,
                        tension: 0.4,
                        fill: false
                    }))
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    size: 12
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    size: 12
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'MOnthly Delivery Status'}
                    }
                }
            });
        })
        .catch(error => console.error('Error updating monthly status:', error));
}

// Update yearly status chart
function updateYearlyChart(year) {
    fetch(`/api/yearly-status/${year}`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('yearlyChart').getContext('2d');
            
            if (yearlyChart) {
                yearlyChart.destroy();
            }
            
            yearlyChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: data.datasets.map((ds, index) => ({
                        label: ds.label,
                        data: ds.data,
                        backgroundColor: Object.values(chartColors)[index].border
                    }))
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            stacked: true
                        },
                        x: {
                            stacked: true
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Yearly Delivery Status'}
                    }
                }
            });
        })
        .catch(error => console.error('Error updating yearly status:', error));
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeDateControls();
    updateOrderStats();
    
    const currentDate = new Date().toISOString().split('T')[0];
    updateDailyStatusChart(currentDate);
    updateWeeklyChart(currentDate);
    updateMonthlyChart(document.getElementById('monthPicker').value);
    updateYearlyChart(document.getElementById('yearPicker').value);
    
    // Set up event listeners for date controls
    document.getElementById('dailyDatePicker').addEventListener('change', function(e) {
        updateDailyStatusChart(e.target.value);
    });
    
    document.getElementById('weeklyDatePicker').addEventListener('change', function(e) {
        updateWeeklyChart(e.target.value);
    });
    
    document.getElementById('monthPicker').addEventListener('change', function(e) {
        updateMonthlyChart(e.target.value);
    });
    
    document.getElementById('yearPicker').addEventListener('change', function(e) {
        updateYearlyChart(e.target.value);
    });
});