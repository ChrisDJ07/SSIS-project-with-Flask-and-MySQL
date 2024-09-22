import mysql.connector
from mysql.connector import Error

# Global method to handle connection
def execute_query(query, data=None, fetch=False):
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="school"
        )
        cursor = connection.cursor()
        if data:
            cursor.execute(query, data)
        else:
            cursor.execute(query)
        
        if fetch:
            result = cursor.fetchall()
            return result
        
        connection.commit()
        return cursor.rowcount  # Return number of affected rows
    
    except Error as err:
        print(f"Error: {err}")
        return None
    finally:
        if cursor:
            cursor.close()
        if connection.is_connected():
            connection.close()

class Colleges:
    @staticmethod
    def addCollege(code, name):
        query = "INSERT INTO college (college_code, college_name) VALUES (%s, %s)"
        data = (code, name)
        rows_affected = execute_query(query, data)
        if rows_affected:
            print("Data inserted successfully!")
        
    @staticmethod
    def updateCollege(original_code, code, name):
        query = """
            UPDATE college
            SET college_code = %s, college_name = %s
            WHERE college_code = %s;
        """
        data = (code, name, original_code)
        rows_affected = execute_query(query, data)
        if rows_affected:
            print("Data updated successfully!")

    @staticmethod
    def deleteCollege(code):
        query = "DELETE FROM college WHERE college_code = %s"
        data = (code,)
        rows_affected = execute_query(query, data)
        if rows_affected:
            print("Data deleted successfully!")

    @staticmethod
    def getCollege(code):
        query = "SELECT * FROM college WHERE college_code = %s"
        data = (code,)
        result = execute_query(query, data, fetch=True)
        return result

    @staticmethod
    def getAllColleges():
        query = "SELECT * FROM college"
        result = execute_query(query, fetch=True)
        return result
    
    
def main():
    # Colleges.addCollege("CCS", "College of Computer Studies")
    # Colleges.addCollege("CEBA", "College of Business Administration")
    # Colleges.updateCollege("CCS", "CC", "College of Computer Studies")
    # Colleges.deleteCollege("CCS")
    # Colleges.deleteCollege("CEBA")
    # Colleges.getCollege("CCS")
    # data = Colleges.getAllColleges()
    # for row in data:
    #     print(row)
    pass
    
if __name__ == "__main__":
    main()

