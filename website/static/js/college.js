import { confirmWindow, showAlert } from './UI.js'
import { deleteField, old_code } from './actions.js'

// Add actionListeners to delete buttons
document.querySelectorAll('.delete-data').forEach(button => {
    button.addEventListener('click', function (event) {
        deleteField(event, 'college');
    });
});

const submitBtn = document.querySelector("#submitFormBtn");
submitBtn.addEventListener('click', function () {
    const mode = document.querySelector(".mode-label").textContent;
    if (mode === 'ADD') {
        const code = document.querySelector("#college-code").value;
        const college_name = document.querySelector("#college-name").value;
        addCollege(code, college_name);
    }
    else if (mode === 'EDIT') {
        const new_code = document.getElementById("college-code").value;
        const new_name = document.getElementById("college-name").value;
        console.log(`${old_code} ${new_code} ${new_name}`);
        editCollege(old_code, new_code, new_name);
    }
});

// Verify College input before submit
function verifyCollege(code, college_name) {
    code = code.trim();
    college_name = college_name.trim();

    if (code.length < 1) {
        return 'College Code cannot be empty.';
    }
    else if (code.indexOf(" ") != -1) {
        return 'College Code cannot contain spaces.';
    }
    else if (!(/^[A-Za-z]+$/.test(code))) {
        return 'College Code can\'t contain numbers and symbols.';
    }

    if (college_name.length < 1) {
        return 'College Name cannot be empty.';
    }
    else if (!(/^[A-Za-z\s]+$/.test(college_name))) {
        return 'College Name can\'t contain numbers and symbols.';
    }
    return 'ok';
}
// Add college to the database
function addCollege(code, college_name) {
    const status = verifyCollege(code, college_name);
    if (status === 'ok') {
        document.querySelector(".error-window").classList.add("hide");
        document.getElementById('mainForm').submit();
    }
    else {
        showAlert(status);
    }
}
// Update selected college
async function editCollege(old_code, new_code, new_name) {
    const status = verifyCollege(new_code, new_name);
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
                type: 'college',
                old_code: old_code,
                new_code: new_code,
                new_name: new_name
            }),
        }).then((_res) => {
            if (_res.ok) {
                window.location.href = 'colleges';  // Redirect to the colleges page on success
            } else {
                showAlert("Failed to update college.");  // Handle any error responses
            }
        }).catch((error) => {
            console.error('Error:', error);
            showAlert("An error occurred.");
        });
    } else if (status != 'ok') {
        showAlert(status);  // Show validation error
    }
}