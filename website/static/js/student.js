import { confirmWindow, showAlert } from './UI.js'
import { deleteField, old_code, old_photo } from './actions.js'

// Add actionListeners to delete buttons
document.querySelectorAll('.delete-data').forEach(button => {
    button.addEventListener('click', function (event) {
        deleteField(event, 'student');
    });
});

const submitBtn = document.querySelector("#submitFormBtn");
submitBtn.addEventListener('click', function () {
    const mode = document.querySelector(".mode-label").textContent;
    if (mode === 'ADD') {
        const id = document.querySelector("#student-id").value;
        const first_name = document.querySelector("#first-name").value;
        const last_name = document.querySelector("#last-name").value;
        const course_code = document.querySelector("#courses").value;
        let year = document.querySelector('input[name="year"]:checked'); // Select the checked radio button
        if (!year) {
            year = 'none'; // Set to none if no selected
        }
        const gender = document.querySelector("#gender").value;

        // if (document.getElementById('file-upload').value == '') {
        //     showAlert("Please enter a Student Photo.");
        // }
        // else {
        //     addStudent(id, first_name, last_name, course_code, year, gender);
        // }

        addStudent(id, first_name, last_name, course_code, year, gender);
    }
    else if (mode === 'EDIT') {
        const id = document.querySelector("#student-id").value;
        const first_name = document.querySelector("#first-name").value;
        const last_name = document.querySelector("#last-name").value;
        const course_code = document.querySelector("#courses").value;
        let new_year = document.querySelector('input[name="year"]:checked').value; // Select the checked radio button
        new_year = Number(new_year);
        const gender = document.querySelector("#gender").value;
        console.log(gender);

        if (document.getElementById('file-upload').value == '') {
            console.log("old photo");

            editStudent(old_code, id, first_name, last_name, course_code, new_year, gender, old_photo);
        }
        else {
            console.log("new photo");

            // handle update-photo
            const formData = new FormData();
            const file = fileInput.files[0];
            const csrfToken = document.getElementById('csrf_token').value;
            let new_photo = '';

            if (file) {
                formData.append('file', file);
                formData.append('id', id);
                formData.append('csrf_token', csrfToken);

                fetch('/update-photo', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        new_photo = data.new_photo;
                        console.log(new_photo);
                        editStudent(old_code, id, first_name, last_name, course_code, new_year, gender, new_photo);
                    })
                    .catch(error => {
                        window.location.reload()
                        console.error('Error:', error);
                    });
            }
        }
    }
});

// Verify College input before submit
function verifyStudent(id, first_name, last_name, course_code, year, gender) {
    id = id.trim();
    first_name = first_name.trim();
    last_name = last_name.trim();

    if (id.length < 1) {
        return 'Student Id cannot be empty.';
    }
    else if (id.indexOf(" ") != -1) {
        return 'Student Id cannot contain spaces.';
    }
    else if (!(/20[0-9]{2}-[0-9]{4}/.test(id)) || !(/^(?=[0-9]*-?[0-9]*$)(\d+(-\d+))?$/.test(id))) {
        return 'Please enter a valid Id (20XX-XXXX).'
    }
    else if (!(/20[0-9]{2}-[0-9]{4}/.test(id))) {
        return 'Please enter a valid Id (20XX-XXXX).'
    }

    if (first_name.length < 1) {
        return 'First Name cannot be empty.';
    }
    else if (!(/^[A-Za-z\s]+$/.test(first_name))) {
        return 'First Name can\'t contain numbers and symbols.';
    }

    if (last_name.length < 1) {
        return 'Last Name cannot be empty.';
    }
    else if (!(/^[A-Za-z\s]+$/.test(last_name))) {
        return 'Last Name can\'t contain numbers and symbols.';
    }

    if (course_code == "") {
        return 'Please select a course.'
    }

    if (year == 'none') {
        return 'Please select a year.'
    }

    if (gender == "") {
        return 'Please select a gender.'
    }

    if (document.getElementById('file-upload').value != '') {
        const fileInput = document.getElementById('file-upload');
        const file = fileInput.files[0]
        if (file) {
            const maxSizeBytes = 5 * 1024 * 1024;

            if (file.size > maxSizeBytes) {
                fileInput.value = ''
                return 'File exceeds 5mb'
            }
        }

        return 'ok';
    }

    return 'ok';
}
// Add student to the database
function addStudent(id, first_name, last_name, course_code, year, gender, photo_url) {
    const status = verifyStudent(id, first_name, last_name, course_code, year, gender, photo_url);
    if (status === 'ok') {
        document.querySelector(".error-window").classList.add("hide");
        document.getElementById('mainForm').submit();
    }
    else {
        showAlert(status);
    }
}
// Update selected college
async function editStudent(old_code, new_id, new_first_name, new_last_name, new_course_code, new_year, new_gender, new_photo) {
    const status = verifyStudent(new_id, new_first_name, new_last_name, new_course_code, new_year, new_gender);
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
                type: 'student',
                old_code: old_code,
                new_id: new_id,
                new_first_name: new_first_name,
                new_last_name: new_last_name,
                new_course_code: new_course_code,
                new_year: new_year,
                new_gender: new_gender,
                new_photo: new_photo
            }),
        }).then((_res) => {
            if (_res.ok) {
                window.location.href = '/';  // Redirect to the colleges page on success
            } else {
                window.location.reload()
                showAlert("Failed to update student.");  // Handle any error responses
            }
        }).catch((error) => {
            console.error('Error:', error);
            showAlert("An error occurred.");
        });
    } else if (status != 'ok') {
        showAlert(status);  // Show validation error
    }
}