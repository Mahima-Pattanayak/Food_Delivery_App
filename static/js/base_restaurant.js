
// Volume Chart (Radar Chart Example)
            const volumeCtx = document.getElementById('volumeChart').getContext('2d');
            const volumeChart = new Chart(volumeCtx, {
                type: 'radar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    datasets: [{
                        label: 'Volume',
                        data: [200, 150, 180, 220, 250], // Replace with real data
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

        document.addEventListener('DOMContentLoaded', () => {
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

    const sidebarLinks = document.querySelectorAll('.sidebar .menu ul li a');
    const mainContent = document.getElementById('mainContent');

    const sections = {
        dashboard: `<h1>Reports Section</h1><p>This is the reports section.</p>`,
        'manage-menu': `<h1>Admin Notifications </h1><p>Here you can get notifications.</p>`,
        'sales-insights': `<h1>Sales Insights</h1><p>View insights on your sales data.</p>`,
        'customer-insights': `<h1>Customer Insights</h1><p>Analyze customer feedback and data.</p>`,
        'Top-Selling-Items': `<h1>Top Selling Items</h1><p>Analyze customer feedback and data.</p>`,
        'sales-trends': `<iframe src="{{ url_for('sales_trends') }}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'reports': `<iframe src="{{ url_for('reports') }}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'admin-notifications': `<iframe src="{{ url_for('admin_notifications') }}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'customer-insights': `<iframe src="{{ url_for('feedback_analysis') }}" style="width:100%; height:100vh; border:none;"></iframe>`,
        'Top-Selling-Items': `<iframe src="https://topsellingitemsgit-5s7m9ai4y33migxf7xskvh.streamlit.app/" style="width:100%; height:100vh; border:none;"></iframe>`,

        'menu-management': <iframe src="{{ url_for('admin') }}" style="width:100%; height:100vh; border:none;"></iframe>,
        'order-management': <iframe src="{{ url_for('order_management') }}" style="width:100%; height:100vh; border:none;"></iframe>,
        'unassigned-orders': <iframe src="{{ url_for('unassigned_orders') }}" style="width:100%; height:100vh; border:none;"></iframe>,
        'performance-metrics': <iframe src="{{ url_for('performance_metrics') }}" style="width:100%; height:100vh; border:none;"></iframe>,
        'order-overview': <iframe src="{{ url_for('order_overview') }}" style="width:100%; height:100vh; border:none;"></iframe>,
        'delivery-agents': <iframe src="{{ url_for('staff_list') }}" style="width:100%; height:100vh; border:none;"></iframe>,
        'reported-issues': <iframe src="{{ url_for('issues_reported') }}" style="width:100%; height:100vh; border:none;"></iframe>,
        'logout': () => { window.location.href = "{{ url_for('logout') }}"; }

};



    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            console.log(`Section clicked: ${section}`); // Debug log
            if (sections[section]) {
                mainContent.innerHTML = sections[section];
            } else {
                console.error(`No content defined for section: ${section}`);
            }
        });
    });
});