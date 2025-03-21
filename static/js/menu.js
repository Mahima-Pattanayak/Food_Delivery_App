let allMenuItems = [];
let categories = [];
let dietaryPreferences = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchDietaryPreferences();
  fetchMenuItems();

  document
    .getElementById("apply-filters")
    .addEventListener("click", applyFilters);
  document
    .getElementById("search-input")
    .addEventListener("input", applyFilters);
  document
    .getElementById("sort-select")
    .addEventListener("change", applyFilters);
});

// Fetch and render categories
async function fetchCategories() {
  const response = await fetch("/api/categories");
  categories = await response.json();
  const categoryFilters = document.getElementById("category-filters");
  categories.forEach((category) => {
    categoryFilters.innerHTML += `
            <div class="filter-group">
                <label>
                    <input type="checkbox" name="category" value="${category.CategoryID}">
                    ${category.CategoryName}
                </label>
            </div>
        `;
  });
}

// Fetch and render dietary preferences
async function fetchDietaryPreferences() {
  const response = await fetch("/api/dietary_preferences");
  dietaryPreferences = await response.json();
  const preferenceFilters = document.getElementById(
    "dietary-preference-filters"
  );
  dietaryPreferences.forEach((preference) => {
    preferenceFilters.innerHTML += `
            <div class="filter-group">
                <label>
                    <input type="checkbox" name="preference" value="${preference.PreferenceID}">
                    ${preference.PreferenceName}
                </label>
            </div>
        `;
  });
}

// Fetch and render menu items with user ID handling
async function fetchMenuItems() {
  const userId = window.location.pathname.split("/").pop(); // Extract user ID from URL
  try {
    const response = await fetch(`/api/menu_items/${userId}`);
    const data = await response.json();

    if (data.error) {
      console.error("Error fetching menu items:", data.error);
      alert("Failed to fetch menu items.");
    } else {
      allMenuItems = data.menu_items; // Backend response assumed to send `menu_items`
      renderMenuItems(allMenuItems);
      updateCartCountFromServer(); // Update cart count on initial load
    }
  } catch (error) {
    console.error("Error during menu item fetch:", error);
  }
}

// Render menu items
function renderMenuItems(menuItems) {
  const menuItemsContainer = document.getElementById("menu-items-container");
  menuItemsContainer.innerHTML = ""; // Clear previous content

  menuItems.forEach((item) => {
    menuItemsContainer.innerHTML += `
            <div class="menu-item">
                <img src="${
                  item.image_url
                }" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p class="price">$${item.price.toFixed(2)}</p>
                <p class="category">${item.category || "Uncategorized"}</p>
                <p class="dietary-preferences">${
                  item.dietary_preferences || "No specific preferences"
                }</p>
                <div class="quantity">
                    <button type="button" class="add-to-cart-btn" data-item-id="${item.id}" data-price="${item.price}">Add to cart</button>
                </div>
            </div>
        `;
  });

  // Reattach event listeners after rendering
  addCartEventListeners();
}


// Apply filters to menu items
function applyFilters() {
  const selectedCategories = Array.from(
      document.querySelectorAll('input[name="category"]:checked')
  ).map((el) => el.value);
  const selectedPreferences = Array.from(
      document.querySelectorAll('input[name="preference"]:checked')
  ).map((el) => el.value);
  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  const sortOption = document.getElementById("sort-select").value;

  console.log("Selected categories:", selectedCategories);
  console.log("Selected preferences:", selectedPreferences);
  console.log("Search term:", searchTerm);

  let filteredItems = allMenuItems.filter((item) => {
      const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(item.CategoryID.toString());
      const matchesPreference =
          selectedPreferences.length === 0 ||
          (item.dietary_preferences &&
              selectedPreferences.every((pref) =>
                  item.dietary_preferences.includes(pref)
              ));
      const matchesSearch =
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesPreference && matchesSearch;
  });

  console.log("Filtered items before sorting:", filteredItems);

  // Sort the filtered items
  filteredItems.sort((a, b) => {
      switch (sortOption) {
          case "name-asc":
              return a.name.localeCompare(b.name);
          case "name-desc":
              return b.name.localeCompare(a.name);
          case "price-asc":
              return a.price - b.price;
          case "price-desc":
              return b.price - a.price;
          default:
              return 0;
      }
  });

  console.log("Filtered items after sorting:", filteredItems);

  renderMenuItems(filteredItems);
}

// Update cart count display in the UI
function updateCartCount(cartCount = 0) {
  document.querySelector(".order-selection .total").textContent = `Added Items: ${cartCount}`;
}

// Fetch cart count from the server
async function updateCartCountFromServer() {
  const userId = document.querySelector("#order-selection").dataset.userId; // Extract userId from the data attribute
  try {
    const response = await fetch(`/cart/count/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch cart count");
    const countData = await response.json();
    updateCartCount(countData.count); // Dynamically update the cart count in the UI
  } catch (error) {
    console.error("Error fetching cart count:", error);
  }
}

// Add event listeners to all "Add to cart" buttons
function addCartEventListeners() {
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent default behavior

      const itemId = button.getAttribute("data-item-id");
      const price = parseFloat(button.getAttribute("data-price"));

      // Log the item ID and price being sent
      console.log("Item ID:", itemId, "Price:", price);

      if (!itemId || isNaN(price)) {
        alert("Invalid item data. Please refresh the page.");
        return;
      }

      try {
        const userId = window.location.pathname.split("/").pop(); // Extract user ID from URL
        console.log("User ID extracted from URL:", userId);

        const response = await fetch(`/api/menu_items/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            item_id: itemId,
            price: price,
            quantity: 1,
          }),
        });

        const data = await response.json();
        console.log("Server Response:", data); // Log the response from the backend

        if (response.ok) {
          alert("Item added successfully!");
          await updateCartCountFromServer(); // Fetch and update cart count immediately
        } else {
          console.error("Error adding item to cart:", data.error);
          alert(data.error || "Failed to add item to cart");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to add item to cart");
      }
    });
  });
}


