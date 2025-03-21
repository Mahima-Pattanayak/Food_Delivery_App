// JavaScript for Delivery Agent Dashboard

// Highlight Active Navbar Link
document.querySelectorAll('.navbar-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.navbar-links a').forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });
  
  // Update Order Status
  const updateStatusButtons = document.querySelectorAll('.update-status-btn');
  updateStatusButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const orderCard = event.target.closest('.order-card');
      const statusElement = orderCard.querySelector('.status');
  
      const newStatus = prompt('Enter new status (new, inprogress, completed, delayed, canceled):');
      if (newStatus && ['new', 'inprogress', 'completed', 'delayed', 'canceled'].includes(newStatus.toLowerCase())) {
        statusElement.className = `status ${newStatus.toLowerCase()}`;
        statusElement.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
      } else {
        alert('Invalid status entered. Please try again.');
      }
    });
  });
  
  // Report an Issue Form Validation
  const reportForm = document.querySelector('#report-form');
  if (reportForm) {
    reportForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent actual form submission
  
      const issueDescription = document.querySelector('#issue-description').value.trim();
      if (issueDescription.length < 10) {
        alert('Please provide a more detailed issue description (at least 10 characters).');
      } else {
        alert('Thank you for reporting the issue. We will look into it shortly.');
        reportForm.reset();
      }
    });
  }
  
  // Display Stats Dynamically
  const stats = {
    totalOrders: 120,
    ordersInProgress: 45,
    completedOrders: 60,
    canceledOrders: 15,
  };
  
  const statsElements = {
    total: document.querySelector('#total-orders'),
    inProgress: document.querySelector('#orders-in-progress'),
    completed: document.querySelector('#completed-orders'),
    canceled: document.querySelector('#canceled-orders'),
  };
  
  if (statsElements.total) statsElements.total.textContent = stats.totalOrders;
  if (statsElements.inProgress) statsElements.inProgress.textContent = stats.ordersInProgress;
  if (statsElements.completed) statsElements.completed.textContent = stats.completedOrders;
  if (statsElements.canceled) statsElements.canceled.textContent = stats.canceledOrders;
  
  // Toggle Light/Dark Theme (Optional Feature)
  const themeToggleButton = document.querySelector('#theme-toggle-btn');
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      themeToggleButton.textContent = document.body.classList.contains('dark-theme') ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });
  }
  