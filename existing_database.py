import sqlite3
import random
from datetime import datetime, timedelta
import bcrypt
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, 'existing_database.db')

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('existing_database.db')
cursor = conn.cursor()

# # Create tables
# cursor.executescript('''
#     CREATE TABLE IF NOT EXISTS roles (
#         role_id INTEGER PRIMARY KEY AUTOINCREMENT,
#         role_name TEXT NOT NULL UNIQUE,
#         role_description TEXT,
#         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#     );

#     CREATE TABLE IF NOT EXISTS users (
#         user_id INTEGER PRIMARY KEY AUTOINCREMENT,
#         email TEXT UNIQUE NOT NULL,
#         password_hash TEXT NOT NULL,
#         full_name TEXT,
#         phone_number TEXT,
#         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#         last_login TIMESTAMP,
#         is_active BOOLEAN DEFAULT TRUE,
#         is_admin INTEGER DEFAULT 0,
#         is_delivery_boy INTEGER DEFAULT 0,
#         role_id INTEGER,
#         FOREIGN KEY(role_id) REFERENCES roles(role_id)
#     );
                     
#     CREATE TABLE IF NOT EXISTS email_verifications (
#         verification_id INTEGER PRIMARY KEY AUTOINCREMENT,
#         user_id INTEGER,
#         verification_token TEXT,
#         sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#         verified_at TIMESTAMP,
#         status TEXT CHECK(status IN ('Pending', 'Verified')) DEFAULT 'Pending',
#         FOREIGN KEY(user_id) REFERENCES users(user_id)
#     );

#     CREATE TABLE IF NOT EXISTS Category (
#         CategoryID INTEGER PRIMARY KEY,
#         CategoryName TEXT NOT NULL,
#         Description TEXT,
#         CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
#         ModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP
#     );
                
#         CREATE TABLE IF NOT EXISTS DietaryPreferences (
#         PreferenceID INTEGER PRIMARY KEY,
#         PreferenceName TEXT NOT NULL,
#         Description TEXT,
#         CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
#         ModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP
#     );

#     CREATE TABLE IF NOT EXISTS MenuItems (
#         MenuItemID INTEGER PRIMARY KEY AUTOINCREMENT,
#         Name TEXT NOT NULL,
#         Description TEXT,
#         Price DECIMAL(10, 2) NOT NULL,
#         CategoryID INTEGER,
#         AvailabilityStatus BOOLEAN DEFAULT 1,
#         ImageURL TEXT,
#         CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
#         ModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
#         FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
#     );

#     CREATE TABLE IF NOT EXISTS MenuItemDietaryPreferences (
#         MenuItemID INTEGER PRIMARY KEY,
#         PreferenceID INTEGER,
#         FOREIGN KEY (MenuItemID) REFERENCES MenuItems(MenuItemID)
#     );

    # CREATE TABLE IF NOT EXISTS Orders (
    #     order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    #     customer_id INTEGER,
    #     total_price DECIMAL(10, 2) NOT NULL,
    #     order_status VARCHAR(50) NOT NULL,
    #     delivery_location VARCHAR(255) NOT NULL,
    #     order_date DATE DEFAULT CURRENT_DATE,
    #     order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    #     FOREIGN KEY (customer_id) REFERENCES Users(user_id)
    # );

    # CREATE TABLE IF NOT EXISTS Order_Items (
    #     order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    #     order_id INTEGER,
    #     item_id INTEGER,
    #     quantity INTEGER NOT NULL,
    #     price DECIMAL(10, 2) NOT NULL,
    #     FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    #     FOREIGN KEY (item_id) REFERENCES MenuItems(MenuItemID)
    # );

#     CREATE TABLE IF NOT EXISTS Cart (
#         cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
#         customer_id INTEGER,
#         item_id INTEGER,
#         quantity INTEGER NOT NULL,
#         price DECIMAL(10, 2) NOT NULL,
#         FOREIGN KEY (customer_id) REFERENCES Users(user_id),
#         FOREIGN KEY (item_id) REFERENCES MenuItems(MenuItemID)
#     );

#     CREATE TABLE IF NOT EXISTS Delivery_agents (
#         id INTEGER PRIMARY KEY,
#         name TEXT NOT NULL,
#         status TEXT NOT NULL,
#         FOREIGN KEY (id) REFERENCES Users(user_id),
#         FOREIGN KEY (name) REFERENCES Users(full_name)
#     );

#     CREATE TABLE IF NOT EXISTS Delivery (
#         Delivery_ID INTEGER PRIMARY KEY AUTOINCREMENT,
#         Order_ID INTEGER,
#         Delivery_Agent_ID INTEGER,
#         Status VARCHAR(50) NOT NULL,
#         Pickup_time TIMESTAMP,
#         Delivery_time TIMESTAMP,
#         FOREIGN KEY (Order_ID) REFERENCES Orders(order_id),
#         FOREIGN KEY (Delivery_Agent_ID) REFERENCES Delivery_agents(id)
#     );

#     CREATE TABLE IF NOT EXISTS Issues (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         order_id INTEGER,
#         issue_type TEXT NOT NULL,
#         description TEXT,
#         FOREIGN KEY (order_id) REFERENCES Orders(order_id)
#     );

#     CREATE TABLE Order_Note (
#         Order_Note_ID INTEGER PRIMARY KEY AUTOINCREMENT,
#         Order_ID INTEGER NOT NULL,
#         User_ID INTEGER NOT NULL,
#         Description TEXT,
#         FOREIGN KEY (Order_ID) REFERENCES Orders(order_id),
#         FOREIGN KEY (User_ID) REFERENCES Users(user_id)
#     );
    
#     CREATE TABLE IF NOT EXISTS feedback (
#     feedback_id INTEGER PRIMARY KEY,
#     order_id INTEGER,
#     customer_id INTEGER,
#     rating INTEGER,
#     comment TEXT
#     );
#     ''')

# Insert base data
cursor.executescript('''
    -- Roles
    INSERT OR IGNORE INTO Roles (role_name, role_description) VALUES
        ('admin', 'Administrator role'),
        ('delivery_boy', 'Delivery Boy role'),
        ('user', 'Regular user role');
                     
    -- Categories
    INSERT OR IGNORE INTO Category (CategoryID, CategoryName, Description) VALUES
    (1, 'Main Course', 'Primary dishes'),
    (2, 'Appetizers', 'Starters and small plates'),
    (3, 'Desserts', 'Sweet dishes and desserts'),
    (4, 'Beverages', 'Drinks and refreshments');
    
    --
    INSERT INTO DietaryPreferences (PreferenceName, Description) VALUES 
    ('Vegetarian', 'No meat, may include dairy and eggs'),
    ('Vegan', 'No animal products'),
    ('Gluten-Free', 'No gluten-containing ingredients'),
    ('Nut-Free', 'No nuts or nut-derived ingredients');
                     
    -- Menu Items
    INSERT OR IGNORE INTO MenuItems (Name, Description, Price, CategoryID, ImageURL) VALUES
    ('Pizza Margherita', 'Classic pizza with tomato, mozzarella, and basil', 200, 1, "https://kristineskitchenblog.com/wp-content/uploads/2024/07/margherita-pizza-22-2.jpg"),
    ('Caesar Salad', 'Romaine lettuce with Caesar dressing and croutons', 100, 2, "https://itsavegworldafterall.com/wp-content/uploads/2023/04/Avocado-Caesar-Salad-FI.jpg"),
    ('Chocolate Cake', 'Warm chocolate cake with a gooey center', 80, 3, "https://www.melskitchencafe.com/wp-content/uploads/2023/01/updated-lava-cakes7.jpg"),
    ('Mojito', 'Freshly brewed and chilled black tea', 50, 4, "https://uglyducklingbakery.com/wp-content/uploads/2023/07/blue-mojito.jpg");
                     
    --
    INSERT INTO MenuItemDietaryPreferences (MenuItemID, PreferenceID) VALUES 
    (1, 1),
    (2, 1),
    (3, 3),
    (4, 2);

    INSERT INTO Order_Note (Order_ID, User_ID, Description) VALUES 
    (1, 1, 'Order processed, awaiting shipment'),
    (2, 5, 'Customer requested a change in delivery address'),
    (3, 3, 'Item is out of stock, waiting for restock'),
    (4, 3, 'Discount applied to the order'),
    (5, 2, 'Order canceled by customer'),
    (6, 6, 'Ready for shipping, awaiting final confirmation'),
    (7, 1, 'Payment pending, awaiting approval'),
    (8, 6, 'Order shipped, tracking number provided'),
    (9, 5, 'Order delayed due to weather conditions'),
    (10, 3, 'Item returned by customer for a refund');
                     
    INSERT INTO feedback (feedback_id, order_id, customer_id, rating, comment) VALUES 
    (1, 1, 1, 5, "Great service and fast delivery."),
    (2, 2, 2, 4, "Product quality was good but delivery was slightly delayed."),
    (3, 3, 3, 3, "Average experience. Product was okay."),
    (4, 4, 1, 2, "Order was cancelled without notice."),
    (5, 5, 4, 5, "Very satisfied with the product and service."),
    (6, 2, 1, 5, "this is good"),
    (7, 2, 1, 5, "how its test"),
    (8, 3, 1, 5, "how its test"),
    (9, 3, 1, 5, "ok"),
    (10, 3, 1, 5, "this is good"),
    (11, 4, 2, 5, "This is good"),
    (12, 4, 2, 5, "Cricket");
''')

def get_delivery_status_and_times(order_time, is_recent_order=False):
    if is_recent_order:
        statuses = ['Assigned', 'Unassigned', 'Out for Delivery', 'Delivered on time', 'Delivered delayed', 'Cancelled']
        weights = [0.2, 0.1, 0.2, 0.2, 0.2, 0.1]
        status = random.choices(statuses, weights)[0]
    else:
        # For regular orders, determine if delivery was on time or delayed
        delivery_minutes = random.randint(20, 45)  # Random delivery time between 20-45 minutes
        status = 'Delivered on time' if delivery_minutes <= 30 else 'Delivered delayed'

    pickup_time = None
    delivery_time = None

    if status not in ['Assigned', 'Unassigned', 'Cancelled']:
        pickup_time = order_time + timedelta(minutes=random.randint(5, 10))
        
        if status in ['Delivered on time', 'Delivered delayed']:
            if status == 'Delivered on time':
                delivery_time = pickup_time + timedelta(minutes=random.randint(15, 30))
            else:
                delivery_time = pickup_time + timedelta(minutes=random.randint(31, 60))

    return status, pickup_time, delivery_time

def get_order_status(delivery_status):
    status_mapping = {
        'Assigned': 'Preparing',
        'Unassigned': 'Preparing',
        'Out for Delivery': 'Out for Delivery',
        'Delivered on time': 'Completed',
        'Delivered delayed': 'Completed',
        'Cancelled': 'Cancelled'
    }
    return status_mapping.get(delivery_status, 'Completed')

# Generate orders for the past year
start_date = datetime.now() - timedelta(days=365)
current_date = datetime.now()

order_count = 0
total_orders_needed = 17000

while start_date <= current_date and order_count < total_orders_needed:
    # Generate orders for each day
    daily_orders = random.randint(40, 50)  # Approximately 16,000 orders over 365 days
    
    for _ in range(daily_orders):
        if order_count >= total_orders_needed:
            break
            
        # Generate order time between 10 AM and 11 PM
        hour = random.randint(10, 23)
        minute = random.randint(0, 59)
        order_time = start_date.replace(hour=hour, minute=minute)
        
        # Determine if this is a recent order (among last 10)
        is_recent = order_count >= (total_orders_needed - 10)
        
        # Get delivery status and times
        delivery_status, pickup_time, delivery_time = get_delivery_status_and_times(order_time, is_recent)
        order_status = get_order_status(delivery_status)
        
        # Create order
        cursor.execute('''
            INSERT INTO Orders (
                customer_id, total_price, order_status, delivery_location, 
                order_date, order_time
            ) VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            random.randint(1, 6),
            0,  # Initial total price, will be updated later
            order_status,
            random.choice(['123 Main St, City', '456 Oak Ave, City', '789 Pine Rd, City']),
            order_time.date(),
            order_time
        ))
        
        order_id = cursor.lastrowid
        
        # Add order items with correct unit prices
        total_price = 0
        for _ in range(random.randint(1, 4)):
            cursor.execute('SELECT MenuItemID, Price FROM MenuItems ORDER BY RANDOM() LIMIT 1')
            item_id, unit_price = cursor.fetchone()
            quantity = random.randint(1, 3)
            
            cursor.execute('''
                INSERT INTO Order_Items (order_id, item_id, quantity, price)
                VALUES (?, ?, ?, ?)
            ''', (order_id, item_id, quantity, unit_price))
            
            total_price += unit_price * quantity
        
        # Update order's total price
        cursor.execute('UPDATE Orders SET total_price = ? WHERE order_id = ?', 
                      (total_price, order_id))
        
        # Create delivery record
        cursor.execute('''
            INSERT INTO Delivery (
                Order_ID, Delivery_Agent_ID, Status, 
                Pickup_time, Delivery_time
            ) VALUES (?, ?, ?, ?, ?)
        ''', (
            order_id,
            random.choice([3,4,5,6]) if delivery_status not in ['Unassigned', 'Cancelled'] else None,
            delivery_status,
            pickup_time,
            delivery_time
        ))
        
        # Add issues for delayed deliveries
        if delivery_status == 'Delivered delayed':
            cursor.execute('''
                INSERT INTO Issues (order_id, issue_type, description)
                VALUES (?, ?, ?)
            ''', (
                order_id,
                "Delivery Delay",
                "Delivery took more than 30 minutes"
            ))
        
        order_count += 1
    
    start_date += timedelta(days=1)

cursor.execute('''INSERT INTO Orders (customer_id, total_price, order_status, delivery_location)
VALUES (?, ?, ?, ?);
''',(1, 650, 'Out for Delivery', '123 Main Street, City'))

order_id = cursor.lastrowid

cursor.execute('''INSERT INTO Order_Items (order_id, item_id, quantity, price)
VALUES
(?, 1, 2, 200),
(?, 2, 1, 100);''',(order_id,order_id))

cursor.execute('''INSERT INTO Delivery (Order_ID, Delivery_Agent_ID, Status, Pickup_time, Delivery_time)
VALUES (?, ?, ?, ?, ?);''',(order_id, 1, 'Out for Delivery', '2025-01-09 12:00:00', None))

cursor.execute('''INSERT INTO Orders (customer_id, total_price, order_status, delivery_location)
VALUES (2, 386, 'Pending', '123 Main Street, City');
''')

order_id = cursor.lastrowid

cursor.execute('''INSERT INTO Order_Items (order_id, item_id, quantity, price)
VALUES
(?, 3, 2, 80),
(?, 2, 1, 100);''',(order_id,order_id))

cursor.execute('''INSERT INTO Delivery (Order_ID, Delivery_Agent_ID, Status, Pickup_time, Delivery_time)
VALUES (?, ?, ?, ?, ?);''',(order_id, None, 'Unassigned', None , None))

cursor.execute('''INSERT INTO Orders (customer_id, total_price, order_status, delivery_location)
VALUES (3, 386, 'Cancelled', '123 Main Street, City');
''')

order_id = cursor.lastrowid

cursor.execute('''INSERT INTO Order_Items (order_id, item_id, quantity, price)
VALUES
(?, 3, 2, 80),
(?, 2, 1, 100);''',(order_id,order_id))

cursor.execute('''INSERT INTO Delivery (Order_ID, Delivery_Agent_ID, Status, Pickup_time, Delivery_time)
VALUES (?, ?, ?, ?, ?);''',(order_id, 2, 'Cancelled', None , None))

cursor.execute('''INSERT INTO Orders (customer_id, total_price, order_status, delivery_location)
VALUES (3, 331, 'Preparing', '123 Main Street, City');
''')

order_id = cursor.lastrowid

cursor.execute('''INSERT INTO Order_Items (order_id, item_id, quantity, price)
VALUES
(?, 3, 2, 80),
(?, 4, 1, 50);''',(order_id,order_id))

cursor.execute('''INSERT INTO Delivery (Order_ID, Delivery_Agent_ID, Status, Pickup_time, Delivery_time)
VALUES (?, ?, ?, ?, ?);''',(order_id, 3, 'Assigned', None , None))


# Commit and close
conn.commit()
conn.close()

print(f"Database has been created and populated with orders!")

