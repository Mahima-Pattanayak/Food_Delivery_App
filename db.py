import sqlite3

conn = sqlite3.connect('existing_database.db')
cursor = conn.cursor()
cursor.execute('INSERT INTO Issues (order_id, issue_type, description) VALUES (1, "Traffic Delay", "Due to traffic order is not delivered yet")')
cursor.execute('INSERT INTO Issues (order_id, issue_type, description) VALUES (16, "Customer Not Available", "Order not delivered")')
cursor.execute('INSERT INTO Issues (order_id, issue_type, description) VALUES (100, "Wrong Address", "In the provided address no customer")')
conn.commit()
conn.close()