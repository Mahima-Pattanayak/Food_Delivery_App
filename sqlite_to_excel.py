import os
import sqlite3
import pandas as pd

def export_all_tables_to_excel(db_path, excel_file_path):
    try:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(excel_file_path), exist_ok=True)

        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Get the list of all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()

        # Create a Pandas Excel writer using openpyxl
        with pd.ExcelWriter(excel_file_path, engine='openpyxl') as writer:
            for table_name_tuple in tables:
                table_name = table_name_tuple[0]
                # Read data from the table
                df = pd.read_sql_query(f'SELECT * FROM {table_name}', conn)
                # Write DataFrame to a new sheet in the Excel file
                df.to_excel(writer, sheet_name=table_name, index=False)

        # Close the database connection
        conn.close()
        print(f'Data successfully written to {excel_file_path}')
    except sqlite3.Error as e:
        print(f'An error occurred: {str(e)}')

if __name__ == "__main__":
    db_path = 'C:/Users/gokul/OneDrive/Documents/Infosys_SpringBoard_Project_Team1 Backup 08-01-2025/Infosys_SpringBoard_Project_Team1/hifi_eats/Infosys-Springboard-Team1/existing_database.db'
    
    # Updated path to a different directory with known permissions
    excel_file_path = 'C:/data/all_tables_data.xlsx'

    export_all_tables_to_excel(db_path, excel_file_path)


