import mysql.connector
from mysql.connector import Error, errorcode

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
            return result, None  # No error if query succeeds
        
        connection.commit()
        rows_affected = cursor.rowcount
        return rows_affected, None  # Return rows affected, no error
    
    except Error as err:
        print(f"Database Error: {err}")
        # Add custom messages, need improvement
        # if err.errno == errorcode.ER_DUP_ENTRY:
        #     return None, "A record with that code already exists."
        # elif err.errno == errorcode.ER_BAD_DB_ERROR:
        #     return None, "The database does not exist."
        # else:
        #     return None, f"An unexpected error occurred: {err}"
        return None, err
    
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
        rows_affected, error = execute_query(query, data)
        
        if error:
            print(f"Failed to insert data: {error}")
            return None, error  # Return None and the error message
        elif rows_affected > 0:
            print("Data inserted successfully!")
            return rows_affected, None  # Return rows affected and no error
        
    @staticmethod
    def updateCollege(original_code, code, name):
        query = """
            UPDATE college
            SET college_code = %s, college_name = %s
            WHERE college_code = %s;
        """
        data = (code, name, original_code)
        rows_affected, error = execute_query(query, data)
        
        if error:
            print(f"Failed to update data: {error}")
            return None, error  # Return None and the error message
        elif rows_affected > 0:
            print("Data updated successfully!")
            return rows_affected, None  # Return rows affected and no error
        else:
            # If no rows are affected, return a message explaining that
            return None, "No rows were updated."

    @staticmethod
    def deleteCollege(code):
        query = "DELETE FROM college WHERE college_code = %s"
        data = (code,)
        rows_affected, error = execute_query(query, data)
        
        if error:
            print(f"Failed to delete data: {error}")
            return None, error  # Return None and the error message
        elif rows_affected > 0:
            print("Data deleted successfully!")
            return rows_affected, None  # Return rows affected and no error
        
    @staticmethod
    def getCollege(code):
        query = "SELECT * FROM college WHERE college_code = %s"
        data = (code,)
        result, error = execute_query(query, data, fetch=True)
        return result

    @staticmethod
    def getAllColleges():
        query = "SELECT * FROM college"
        result, error = execute_query(query, fetch=True)
        return result


class Courses:
    @staticmethod
    def addCourse(code, name, college_code):
        query = "INSERT INTO course (course_code, course_name, college_code) VALUES (%s, %s, %s)"
        data = (code, name, college_code)
        rows_affected, error = execute_query(query, data)
        
        if error:
            print(f"Failed to insert data: {error}")
            return None, error  # Return None and the error message
        elif rows_affected > 0:
            print("Data inserted successfully!")
            return rows_affected, None  # Return rows affected and no error
        
    @staticmethod
    def updateCourse(original_code, code, name, college_code):
        query = """
            UPDATE course
            SET course_code = %s, course_name = %s, college_code = %s
            WHERE course_code = %s;
        """
        data = (code, name, college_code, original_code)
        rows_affected, error = execute_query(query, data)
        
        if error:
            print(f"Failed to update data: {error}")
            return None, error  # Return None and the error message
        elif rows_affected > 0:
            print("Data updated successfully!")
            return rows_affected, None  # Return rows affected and no error
        else:
            # If no rows are affected, return a message explaining that
            return None, "No rows were updated."

    @staticmethod
    def deleteCourse(code):
        query = "DELETE FROM course WHERE course_code = %s;"
        data = (code,)
        rows_affected, error = execute_query(query, data)
        
        if error:
            print(f"Failed to delete data: {error}")
            return None, error  # Return None and the error message
        elif rows_affected > 0:
            print("Data deleted successfully!")
            return rows_affected, None  # Return rows affected and no error

    @staticmethod
    def getCourse(code):
        query = "SELECT * FROM course WHERE course_code = %s"
        data = (code,)
        result, error = execute_query(query, data, fetch=True)
        return result

    @staticmethod
    def getAllCourses():
        query = "SELECT * FROM course"
        result, error = execute_query(query, fetch=True)
        return result



class Students:
    @staticmethod
    def addStudent(id, first_name, last_name, course_code, year, gender):
        query = """
            INSERT INTO student (student_id, first_name, last_name, course_code, year_level, gender)
            VALUES (%s, %s, %s, %s, %s, %s);
        """
        data = (id, first_name, last_name, course_code, year, gender)
        print(data)
        rows_affected, error = execute_query(query, data)
        
        if error:
            print(f"Failed to insert data: {error}")
            return None, error  # Return None and the error message
        elif rows_affected > 0:
            print("Data inserted successfully!")
            return rows_affected, None  # Return rows affected and no error
        
    @staticmethod
    def updateStudent(original_id, new_id, new_first_name, new_last_name, new_course_code, new_year, new_gender):
        query = """
            UPDATE student
            SET student_id = %s, first_name = %s, last_name = %s, course_code = %s, year_level = %s, gender = %s
            WHERE student_id = %s;
        """
        data = (new_id, new_first_name, new_last_name, new_course_code, new_year, new_gender, original_id)
        print(data)
        rows_affected, error = execute_query(query, data)
        
        if error:
            print(f"Failed to update data: {error}")
            return None, error  # Return None and the error message
        elif rows_affected > 0:
            print("Data updated successfully!")
            return rows_affected, None  # Return rows affected and no error
        else:
            # If no rows are affected, return a message explaining that
            return None, "No rows were updated."

    @staticmethod
    def deleteStudent(id):
        query = "DELETE FROM student WHERE student_id = %s;"
        data = (id,)
        rows_affected, error = execute_query(query, data)
        
        if error:
            print(f"Failed to delete data: {error}")
            return None, error  # Return None and the error message
        elif rows_affected > 0:
            print("Data deleted successfully!")
            return rows_affected, None  # Return rows affected and no error

    @staticmethod
    def getStudent(id):
        query = "SELECT * FROM student WHERE student_id = %s;"
        data = (id,)
        result, error = execute_query(query, data, fetch=True)
        return result

    @staticmethod
    def getAllStudents():
        query = "SELECT * FROM student"
        result, error = execute_query(query, fetch=True)
        return result
    
    
def main():
    pass
    
if __name__ == "__main__":
    main()

