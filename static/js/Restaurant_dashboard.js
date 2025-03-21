// Define toggleSidebar in global scope
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger');
    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px';
        hamburger.classList.remove('active');
    } else {
        sidebar.style.left = '0px';
        hamburger.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Chart initialization
    const donutCtx = document.getElementById('donutChart').getContext('2d');
    const donutChart = new Chart(donutCtx, {
        type: 'doughnut',
        data: {
            labels: ['Successful', 'Failed', 'Pending'],
            datasets: [{
                data: [70, 20, 10],
                backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
                borderColor: ['#28a745', '#dc3545', '#ffc107'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
    
    const stockPriceCtx = document.getElementById('stockPriceChart').getContext('2d');
    const stockPriceChart = new Chart(stockPriceCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Item Price',
                data: [150, 200, 180, 210, 250],
                borderColor: '#007bff',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
    
    const ipoPerformanceCtx = document.getElementById('ipoPerformanceChart').getContext('2d');
    const ipoPerformanceChart = new Chart(ipoPerformanceCtx, {
        type: 'bar',
        data: {
            labels: ['IPO1', 'IPO2', 'IPO3', 'IPO4'],
            datasets: [{
                label: 'Performance',
                data: [90, 65, 75, 85],
                backgroundColor: '#ffc107',
                borderColor: '#ffc107',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
    
    const volumeCtx = document.getElementById('volumeChart').getContext('2d');
    const volumeChart = new Chart(volumeCtx, {
        type: 'radar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Volume',
                data: [200, 150, 180, 220, 250],
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });

    // Sidebar functionality
    const sidebarLinks = document.querySelectorAll('.sidebar .menu ul li a');
    const mainContent = document.getElementById('mainContent');

    const sections = {
        dashboard: `<h1>Reports Section</h1><p>This is the reports section.</p>`,
        'manage-menu': `<h1>Admin Notifications </h1><p>Here you can get notifications.</p>`,
        'sales-insights': `<h1>Sales Insights</h1><p>View insights on your sales data.</p>`,
        'customer-insights': `<h1>Customer Insights</h1><p>Analyze customer feedback and data.</p>`,
        'Top-Selling-Items': `<h1>Top Selling Items</h1><p>Analyze customer feedback and data.</p>`,
        'sales-trends': `<iframe src="${appUrls.salesTrends}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'reports': `<iframe src="${appUrls.reports}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'admin-notifications': `<iframe src="${appUrls.adminNotifications}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'customer-insights': `<iframe src="${appUrls.feedbackAnalysis}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'menu-management': `<iframe src="${appUrls.admin}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'order-management': `<iframe src="${appUrls.orderManagement}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'unassigned-orders': `<iframe src="${appUrls.unassignedOrders}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'performance-metrics': `<iframe src="${appUrls.performanceMetrics}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'order-overview': `<iframe src="${appUrls.orderOverview}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'delivery-agents': `<iframe src="${appUrls.staffList}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'reported-issues': `<iframe src="${appUrls.issuesReported}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'logout': () => { window.location.href = appUrls.logout; }
    };

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            console.log(`Section clicked: ${section}`);
            if (sections[section]) {
                mainContent.innerHTML = sections[section];
            } else {
                console.error(`No content defined for section: ${section}`);
            }
        });
    });
});