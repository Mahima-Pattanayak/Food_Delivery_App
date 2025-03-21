// Global variables
let currentEditId = null;
    
// Fetch and populate categories in the dropdown
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        const categorySelect = document.getElementById('category');

        // Clear existing options
        categorySelect.innerHTML = '<option value="" disabled selected>Select a category</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.CategoryID;
            option.textContent = category.CategoryName;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        alert('⚠️ Failed to load categories');
    }
}

// Fetch and populate menu items as cards
async function loadMenuItems() {
    try {
        const response = await fetch('/api/menu_items');
        const menuItems = await response.json();
        const container = document.getElementById('menuItemsContainer');
        container.innerHTML = ''; // Clear existing cards

        menuItems.forEach(item => {
            const card = document.createElement('div');
            card.className = "menu-card";

            card.innerHTML = `
                <img src="${item.ImageURL}" alt="${item.Name}" class="w-full h-40 object-cover rounded-t-lg">
                <div class="p-4">
                    <h3 class="text-lg font-bold text-orange-600">${item.Name}</h3>
                    <p class="text-sm text-gray-600 mb-2">${item.Description}</p>
                    <p class="text-sm font-semibold text-gray-800">$${item.Price.toFixed(2)}</p>
                    <p class="text-xs text-gray-500">Category: ${item.CategoryName || 'Uncategorized'}</p>
                    <div class="mt-4 flex justify-between">
                        <button onclick="editMenuItem(${item.MenuItemID})" 
                            class="text-sm text-orange-500 hover:underline">✏️ Edit</button>
                        <button onclick="deleteMenuItem(${item.MenuItemID})" 
                            class="text-sm text-red-500 hover:underline">🗑️ Delete</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading menu items:', error);
        alert('⚠️ Failed to load menu items');
    }
}

// Edit menu item
async function editMenuItem(id) {
    try {
        const response = await fetch('/api/menu_items');
        const menuItems = await response.json();
        const item = menuItems.find(item => item.MenuItemID === id);

        if (item) {
            currentEditId = id;
            document.getElementById('menuItemId').value = id;
            document.getElementById('name').value = item.Name;
            document.getElementById('description').value = item.Description;
            document.getElementById('price').value = item.Price;
            document.getElementById('category').value = item.CategoryID;
            document.getElementById('imageUrl').value = item.ImageURL;
            document.getElementById('availabilityStatus').checked = item.AvailabilityStatus === 1;

            document.getElementById('saveButton').textContent = 'Update Menu Item';
        }
    } catch (error) {
        console.error('Error editing menu item:', error);
        alert('⚠️ Failed to edit menu item');
    }
}

// Delete menu item
async function deleteMenuItem(id) {
    try {
        const response = await fetch(`/api/menu_items/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadMenuItems();
            alert('✔️ Menu item deleted successfully');
        } else {
            throw new Error('Failed to delete');
        }
    } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('⚠️ Failed to delete menu item');
    }
}

// Handle form submission
document.getElementById('menuItemForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = {
        MenuItemID: currentEditId,
        Name: document.getElementById('name').value,
        Description: document.getElementById('description').value,
        Price: parseFloat(document.getElementById('price').value),
        CategoryID: parseInt(document.getElementById('category').value),
        ImageURL: document.getElementById('imageUrl').value,
        AvailabilityStatus: document.getElementById('availabilityStatus').checked ? 1 : 0
    };

    try {
        const response = await fetch('/api/menu_items', {
            method: currentEditId ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            loadMenuItems();
            alert(`✔️ Menu item ${currentEditId ? 'updated' : 'added'} successfully`);
            clearForm();
        } else {
            throw new Error('Failed to save');
        }
    } catch (error) {
        console.error('Error saving menu item:', error);
        alert('⚠️ Failed to save menu item');
    }
});

// Clear form
function clearForm() {
    currentEditId = null;
    document.getElementById('menuItemForm').reset();
    document.getElementById('saveButton').textContent = 'Save Menu Item';
}

// Clear form on button click
document.getElementById('clearButton').addEventListener('click', clearForm);

// Export menu items as PDF
document.getElementById('exportButton').addEventListener('click', async function () {
    try {
        const response = await fetch('/api/export_menu_items', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'menu_items.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            throw new Error('Failed to export menu items');
        }
    } catch (error) {
        console.error('Error exporting menu items:', error);
        alert('⚠️ Failed to export menu items');
    }
});

// Initialize data on page load
window.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadMenuItems();
});