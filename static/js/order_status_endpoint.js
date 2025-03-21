document.addEventListener("DOMContentLoaded", () => {
    const orderId = window.location.pathname.split('/').pop();

    // Create cancel order modal
    const modalHtml = `
        <div id="cancelOrderModal" class="modal">
            <div class="modal-content">
                <h2>Cancel Order</h2>
                <p style="padding-top : 10px" >Reason for cancelling this order:</p>
                <textarea id="cancellationReason" rows="4" placeholder="Enter cancellation reason..." required></textarea>
                <div class="modal-buttons">
                    <button id="confirmCancel" class="confirm-btn">Update Status</button>
                    <button id="closeModal" class="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Add modal styles
    const modalStyles = `
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        .modal-content {
            background-color: white;
            margin: 15% auto;
            padding: 20px;
            border-radius: 5px;
            width: 50%;
            max-width: 500px;
        }
        .modal textarea {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
        }
        .modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 15px;
        }
        .confirm-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        .cancel-btn {
            background-color: #ff3b30;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = modalStyles;
    document.head.appendChild(styleSheet);

    // Handle status update
    const statusSelect = document.getElementById('orderStatus');
    const updateButton = document.querySelector('.update-status');
    const trackingSection = document.getElementById('orderTracking');

    // Modal elements
    const modal = document.getElementById('cancelOrderModal');
    const closeBtn = document.getElementById('closeModal');
    const confirmBtn = document.getElementById('confirmCancel');
    const reasonTextarea = document.getElementById('cancellationReason');

    if (statusSelect && updateButton) {
        updateButton.addEventListener('click', async () => {
            if (statusSelect.value === 'cancelled') {
                modal.style.display = 'block';
                return;
            }

            await updateOrderStatus();
        });
    }

    // Close modal on cancel button click
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        statusSelect.value = statusSelect.getAttribute('data-previous-value') || statusSelect.value;
    });

    // Handle confirmation of cancellation
    confirmBtn.addEventListener('click', async () => {
        const reason = reasonTextarea.value.trim();
        if (!reason) {
            alert('Please provide a reason for cancellation');
            return;
        }
        await updateOrderStatus(reason);
        modal.style.display = 'none';
    });

    // Store previous value when status changes
    statusSelect.addEventListener('change', function() {
        this.setAttribute('data-previous-value', this.value);
    });

    // Update order status function
    async function updateOrderStatus(cancellationReason = null) {
        updateButton.disabled = true;
        updateButton.textContent = 'Updating...';
        
        try {
            const response = await fetch(`/admin/order/${orderId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    order_id: orderId, 
                    status: statusSelect.value,
                    cancellation_reason: cancellationReason 
                })
            });

            const data = await response.json();
            if (data.success) {
                if (statusSelect.value === 'cancelled' && trackingSection) {
                    trackingSection.style.display = 'none';
                }
                alert(data.message);
                window.location.reload();
            } else {
                alert('Failed to update status: ' + data.message);
                window.location.reload();
            }
        } catch (error) {
            alert('Error updating status: ' + error);
            window.location.reload();
        } finally {
            updateButton.disabled = false;
            updateButton.textContent = 'Update Status';
        }
    }

    // Handle agent reassignment
    const reassignButton = document.querySelector('.reassign-button');

    if (reassignButton) {
        reassignButton.addEventListener('click', async () => {
            reassignButton.disabled = true;
            reassignButton.textContent = 'Loading...';
            try {
                const response = await fetch('/api/available-agents');
                const agents = await response.json();

                if (agents && agents.length > 0) {
                    createAgentSelectModal(agents);
                } else {
                    alert('No agents available for reassignment.');
                }
            } catch (error) {
                alert('Error loading available agents: ' + error);
            } finally {
                reassignButton.disabled = false;
                reassignButton.textContent = 'Reassign Agent';
            }
        });
    }

    function createAgentSelectModal(agents) {
        // Get the container where the table will be displayed
        const container = document.getElementById('deliveryAgentDetails');

        // Remove any existing table (to avoid duplicating it)
        const existingTable = document.querySelector('.agent-table');
        if (existingTable) {
            existingTable.remove();
        }

        // Create a table element
        const table = document.createElement('table');
        table.className = 'agent-table';

        // Add table header
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Agent ID</th>
                    <th>Agent Name</th>
                    <th>Status</th>
                    <th>Order Count</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${agents.map(agent => `
                    <tr>
                        <td>${agent.id}</td>
                        <td>${agent.name}</td>
                        <td>${agent.status}</td>
                        <td>${agent.order_count}</td>
                        <td><button class="assign-button" data-agent-id="${agent.id}">Assign</button></td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        // Append the table below the Reassign button
        container.appendChild(table);

        // Add event listeners for the Assign buttons
        const assignButtons = document.querySelectorAll('.assign-button');
        assignButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const agentId = button.getAttribute('data-agent-id');
                try {
                    const response = await fetch('/api/reassign-agent', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ order_id: orderId, agent_id: agentId }),
                    });

                    const data = await response.json();
                    if (data.success) {
                        alert('Agent reassigned successfully');
                        window.location.reload(); // Reload the page to reflect changes
                    } else {
                        alert('Failed to reassign agent: ' + data.message);
                    }
                } catch (error) {
                    alert('Error reassigning agent: ' + error);
                }
            });
        });
    }

    // Create agent table styles
    const agentTableStyles = `
        .agent-table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 20px;
        }
        .agent-table th, .agent-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }
        .agent-table th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .assign-button {
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .assign-button:hover {
            background-color: #45a049;
        }
    `;

    // Append the agent table styles
    const agentStyleSheet = document.createElement("style");
    agentStyleSheet.innerText = agentTableStyles;
    document.head.appendChild(agentStyleSheet);
});