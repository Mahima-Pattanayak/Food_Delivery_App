document.addEventListener('DOMContentLoaded', () => {
    const orderId = window.location.pathname.split('/').pop(); // Get order_id from URL
    const agentDetailsContainer = document.getElementById('agent-info');

    async function fetchAgentDetails(orderId) {
        try {
            const response = await fetch(`/get-delivery-agent/${orderId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch delivery agent details');
            }

            const agentDetails = await response.json();

            // Check if the response contains an error
            if (agentDetails.error) {
                agentDetailsContainer.innerHTML = `<p class="error-message">${agentDetails.message}</p>`;
            } else {
                agentDetailsContainer.innerHTML = `
                    <p><span class="highlight">Agent ID:</span> ${agentDetails.Delivery_Agent_ID || "N/A"}</p>
                    <p><span class="highlight">Name:</span> ${agentDetails.Name || "N/A"}</p>
                    <p><span class="highlight">Email:</span> ${agentDetails.Email || "N/A"}</p>
                    <p><span class="highlight">Phone Number:</span> ${agentDetails["Phone Number"] || "N/A"}</p>
                `;
            }
        } catch (error) {
            agentDetailsContainer.innerHTML = `<p>Error loading agent details: ${error.message}</p>`;
        }
    }

    // Fetch and display the agent details
    fetchAgentDetails(orderId);
});