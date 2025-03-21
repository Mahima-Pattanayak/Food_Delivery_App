document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar');
    const tableBody = document.querySelector('tbody');
    const filterCheckboxes = document.querySelectorAll('.filter-item input[type="checkbox"]');
    const menuItems = document.querySelectorAll('.menu-item');
    const addStaffModal = document.getElementById('addStaffModal');
    const removeStaffModal = document.getElementById('removeStaffModal');
    const addStaffBtn = document.querySelector('.action-button.add');
    const removeStaffBtn = document.querySelector('.action-button.remove');
    const closeBtns = document.getElementsByClassName('close');
  
    function searchStaff(searchTerm = '') {
      const queryParams = new URLSearchParams({ q: searchTerm });
      fetch(`/api/staff/search?${queryParams}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            updateTable(data.data);
          }
        })
        .catch(error => console.error('Error:', error));
    }
  
    function filterStaff(filterType = '') {
      const queryParams = new URLSearchParams({ type: filterType });
      fetch(`/api/staff/filter?${queryParams}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            updateTable(data.data);
            console.log(data.data);
            
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error filtering staff: ' + error);
        });
    }
  
    searchInput.addEventListener('input', debounce(function(e) {
      const searchTerm = e.target.value.replace('#', '').trim();
      if (!searchTerm || /^\d+$/.test(searchTerm)) {
        searchStaff(searchTerm);
      }
    }, 300));
  
    filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        filterCheckboxes.forEach(cb => {
          if (cb !== this) cb.checked = false;
        });
        
        if (this.checked) {
          filterStaff(this.id);
        } else {
          filterStaff();
        }
      });
    });
  
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        menuItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
      });
    });
  
    addStaffBtn.onclick = function(e) {
      e.preventDefault();
      addStaffModal.style.display = "block";
    }
  
    removeStaffBtn.onclick = function(e) {
      e.preventDefault();
      removeStaffModal.style.display = "block";
    }
  
    Array.from(closeBtns).forEach(btn => {
      btn.onclick = function() {
        addStaffModal.style.display = "none";
        removeStaffModal.style.display = "none";
      }
    });
  
    window.onclick = function(event) {
      if (event.target == addStaffModal || event.target == removeStaffModal) {
        addStaffModal.style.display = "none";
        removeStaffModal.style.display = "none";
      }
    }
  
    document.getElementById('addStaffForm').onsubmit = function(e) {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('agentName').value,
        phone: document.getElementById('agentPhone').value,
        email: document.getElementById('agentEmail').value
      };
  
      fetch('/api/staff/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert(data.message);
          searchStaff();
          document.getElementById('addStaffForm').reset();
        } else {
          alert(data.message);
        }
        addStaffModal.style.display = "none";
      })
      .catch(error => {
        alert('Error adding staff: ' + error);
      });
    };
  
    document.getElementById('removeStaffForm').onsubmit = function(e) {
      e.preventDefault();
      
      const formData = {
        agent_id: document.getElementById('removeAgentId').value.replace('#', ''),
        name: document.getElementById('removeAgentName').value
      };
  
      fetch('/api/staff/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert(data.message);
          searchStaff();
          document.getElementById('removeStaffForm').reset();
        } else {
          alert(data.message);
        }
        removeStaffModal.style.display = "none";
      })
      .catch(error => {
        alert('Error removing staff: ' + error);
      });
    };
  
    function updateTable(data) {
      tableBody.innerHTML = '';
      data.forEach(staff => {
        const row = `
          <tr>
            <td><a href="/staff/${staff.id}" class="staff-name">${staff.name}</a></td>
            <td>#${staff.id}</td>
            <td>${staff.email}</td>
            <td>${staff.phone}</td>
            <td>${staff.status}</td>
          </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
      });
    }
  
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  
    // Initial load
    searchStaff();
  });

