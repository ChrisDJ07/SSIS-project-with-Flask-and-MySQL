import { confirmWindow, showAlert } from './UI.js'
import { deleteField, old_code } from './actions.js'

// Add actionListeners to delete buttons
document.querySelectorAll('.delete-data').forEach(button => {
    button.addEventListener('click', function (event) {
        deleteField(event, 'course');
    });
});

const submitBtn = document.querySelector("#submitFormBtn");
submitBtn.addEventListener('click', function () {
    const mode = document.querySelector(".mode-label").textContent;
    // uhm, these are basically doing the same thing???
    // but if it ain't broke...
    if (mode === 'ADD') {
        const code = document.querySelector("#course-code").value;
        const course_name = document.querySelector("#course-name").value;
        const college_code = document.querySelector("#college").value;
        addCourse(code, course_name, college_code);
    }
    else if (mode === 'EDIT') {
        const new_code = document.getElementById("course-code").value;
        const new_name = document.getElementById("course-name").value;
        let new_college_code = document.getElementById("college").value;
        editCourse(old_code, new_code, new_name, new_college_code);
    }
});

// Verify College input before submit
function verifyCourse(code, course_name, college_code) {
    code = code.trim();
    course_name = course_name.trim();

    if (code.length < 1) {
        return 'Course Code cannot be empty.';
    }
    else if (code.indexOf(" ") != -1) {
        return 'Course Code cannot contain spaces.';
    }
    else if (!(/^[A-Za-z]+$/.test(code))) {
        return 'Course Code cannot contain numbers.';
    }

    if (course_name.length < 1) {
        return 'Course Name cannot be empty.';
    }
    else if (!(/^[A-Za-z\s]+$/.test(course_name))) {
        return 'Course Name cannot contain numbers.';
    }

    if (college_code == "") {
        return 'Please select a college.'
    }
    return 'ok';
}
// Add college to the database
function addCourse(code, college_name, college_code) {
    const status = verifyCourse(code, college_name, college_code);
    if (status === 'ok') {
        document.querySelector(".error-window").classList.add("hide");
        document.getElementById('mainForm').submit();
    }
    else {
        showAlert(status);
    }
}
// Update selected college
async function editCourse(old_code, new_code, new_name, new_college_code) {
    const status = verifyCourse(new_code, new_name, new_college_code);
    const confirm_status = await confirmWindow('edit');
    if (status === 'ok' && confirm_status == 'proceed') {
        document.querySelector(".error-window").classList.add("hide");

        fetch('update-field', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('input[name="csrf_token"]').value
            },
            body: JSON.stringify({
                type: 'course',
                old_code: old_code,
                new_code: new_code,
                new_name: new_name,
                new_college_code: new_college_code
            }),
        }).then((_res) => {
            if (_res.ok) {
                window.location.href = 'courses';  // Redirect to the colleges page on success
            } else {
                showAlert("Failed to update course.");  // Handle any error responses
            }
        }).catch((error) => {
            console.error('Error:', error);
            showAlert("An error occurred.");
        });
    } else if (status != 'ok') {
        showAlert(status);  // Show validation error
    }
}