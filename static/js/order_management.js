let currentPage = 1;
const initialPerPage = 20;
const subsequentPerPage = 100;

// Function to fetch orders from backend
async function fetchOrders(searchQuery = '', filters = {}, page = 1) {
    try {
        let url = `/api/orders?page=${page}&per_page=${page === 1 ? initialPerPage : subsequentPerPage}`;
        if (searchQuery) {
            url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (filters.status) {
            url += `&status=${encodeURIComponent(filters.status)}`;
        }
        if (filters.sortPrice) {
            url += '&sort=true';
        }

        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { orders: [], total_count: 0, has_more: false };
    }
}

// Function to create order row HTML
function createOrderRow(order) {
    const statusMapping = {
        'pending' : 'Pending',  
        'preparing': 'Preparing',
        'cancelled': 'Cancelled',
        'in_progress': 'Progress',
        'delivered': 'Delivered',
        'out_for_delivery': 'Out for Delivery'
    };
    const cleanedStatus = order.status.toLowerCase().replace(/\s+/g, '_'); // Normalize the status
    const displayStatus = statusMapping[cleanedStatus] || order.status;

    // Debug logs
    console.log("Backend Status:", order.status);
    console.log("Mapped Class:", `status-${cleanedStatus}`);

    return `
        <tr>
            <td>
                <div class="customer-info">
                    <img src="/static/images/customer.png" alt="${order.customer_name}">
                    <div class="customer-details">
                        <div class="customer-name">${order.customer_name}</div>
                        <div class="customer-id">${order.user_id}</div>
                        <div class="customer-address">${order.address}</div>
                    </div>
                </div>
            </td>
            <td>#${order.order_id}</td>
            <td>Rs ${order.amount}</td>
            <td>
                <button class="status-badge status-${cleanedStatus}" 
                        data-order-id="${order.order_id}">${displayStatus}</button>
            </td>
        </tr>
    `;
}


// Function to render orders
async function renderOrders(searchQuery = '', filters = {}, append = false) {
    const result = await fetchOrders(searchQuery, filters, currentPage);
    const ordersList = document.getElementById('ordersList');
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    
    if (!append) {
        ordersList.innerHTML = '';
        currentPage = 1;
    }
    
    ordersList.insertAdjacentHTML('beforeend', 
        result.orders.map(order => createOrderRow(order)).join('')
    );
    
    // Show/hide "View More" button based on whether there are more orders
    viewMoreBtn.style.display = result.has_more ? 'block' : 'none';
}

// Function to get current filter states
function getCurrentFilters() {
    const filters = {};

    if (document.getElementById('delivered').checked) {
        filters.status = 'delivered';
    } else if (document.getElementById('progress').checked) {
        filters.status = 'progress';
    } else if (document.getElementById('cancelled').checked) {
        filters.status = 'cancelled';
    } else if (document.getElementById('preparing').checked) {
        filters.status = 'preparing';
    } else if (document.getElementById('pending').checked) {
        filters.status = 'pending';
    }

    filters.sortPrice = document.getElementById('sort-price').checked;

    return filters;
}

document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('status-badge')) {
        const orderId = event.target.getAttribute('data-order-id');
        console.log('Button clicked. Order ID:', orderId);
        const url = `/admin/order/${orderId}`;
        console.log('Redirecting to:', url);
        window.location.href = url;
    }
});



// Function to load more orders
async function loadMoreOrders() {
    currentPage++;
    const searchQuery = document.getElementById('searchInput').value;
    const filters = getCurrentFilters();
    await renderOrders(searchQuery, filters, true);
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    
    searchInput.addEventListener('input', (e) => {
        renderOrders(e.target.value, getCurrentFilters());
    });

    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            renderOrders(searchInput.value, getCurrentFilters());
        });
    });

    viewMoreBtn.addEventListener('click', loadMoreOrders);

    renderOrders();

// Add CSS for status badges
const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
    .status-badge {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        color: white;
        cursor: pointer;
    }
    .status-pending {
        background-color:  #800080;
    }
    .status-preparing {
        background-color: #4285f4;
    }
    .status-cancelled {
        background-color: #ea4335;
    }
    .status-completed {
        background-color: #34a853;
    }
    .status-order_confirmed {
        background-color : #fbbc05;
    }
    .status-out_for_delivery {
        background-color: #ff9800;
    }
`;
document.head.appendChild(style);
});