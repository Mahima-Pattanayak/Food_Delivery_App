document.addEventListener('DOMContentLoaded', () => {
    // Attach click event to all assign buttons
    document.querySelectorAll('.assign-btn').forEach((button) => {
        button.addEventListener('click', async (event) => {
            event.preventDefault(); // Prevent default form submission
            
            const form = event.target.closest('form');
            const orderId = form.dataset.orderId; // Add a data attribute to form for order_id
            const agentId = form.dataset.agentId; // Add a data attribute to form for agent_id

            try {
                // Send the POST request
                const response = await fetch(`/assign_agent/${orderId}/${agentId}`, {
                    method: 'POST',
                });

                // Parse the JSON response
                const result = await response.json();

                if (response.ok) {
                    alert(result.message); // Show success message

                    // Dynamically remove the assigned order row from the table
                    const row = form.closest('tr');
                    row.remove();

                    // Optionally update the analytics or activity section dynamically
                    updateAnalytics();
                    addRecentActivity(orderId, agentId);
                } else {
                    alert('Error assigning agent: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while assigning the agent.');
            }
        });
    });
});

// Function to dynamically update the analytics section
function updateAnalytics() {
    const unassignedOrdersElement = document.querySelector('.analytics-item:nth-child(1) p');
    const idleAgentsElement = document.querySelector('.analytics-item:nth-child(2) p');
    const activeDeliveriesElement = document.querySelector('.analytics-item:nth-child(3) p');

    // Update counts (you may need to fetch these from the backend for accuracy)
    const unassignedOrdersCount = parseInt(unassignedOrdersElement.textContent, 10) - 1;
    const idleAgentsCount = parseInt(idleAgentsElement.textContent, 10) - 1;
    const activeDeliveriesCount = parseInt(activeDeliveriesElement.textContent, 10) + 1;

    unassignedOrdersElement.textContent = unassignedOrdersCount;
    idleAgentsElement.textContent = idleAgentsCount;
    activeDeliveriesElement.textContent = activeDeliveriesCount;
}

// Function to add the activity to the recent activities section
function addRecentActivity(orderId, agentId) {
    const recentActivitiesTable = document.querySelector('.recent-activity table tbody');

    // Create a new row for the recent activity
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${recentActivitiesTable.rows.length + 1}</td>
        <td>${orderId}</td>
        <td>${agentId}</td>
    `;

    // Append the new row to the table
    recentActivitiesTable.appendChild(newRow);
}