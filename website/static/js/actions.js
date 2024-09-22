import { show_sidebar, expandAllForm, confirmWindow, showAlert } from './UI.js'

// Call this function when adding
document.querySelector(".add-data").addEventListener("click", add);
function add() {
    document.querySelector(".mode-label").textContent = "ADD";
    show_sidebar();
}

// Call this function when editing
export function edit(event) {
    document.querySelector(".mode-label").textContent = "EDIT";
    // Get the closest <li> parent of clicked
    const row = event.target.closest("li");
    // Find the table-data elements within this row
    const table_data = row.querySelectorAll(".table-data");
    const form_field = document.querySelectorAll(".inputText");

    let iterator = 0;
    table_data.forEach(data => {
        form_field[iterator].value = data.textContent.trim();  // Populate form with data
        iterator += 1;
    });

    expandAllForm();
    show_sidebar();
}

// Call this function when deleting
export async function deleteField(event, type) {
    event.stopPropagation();
    const row = event.target.closest("li");
    let id = row.querySelector(".table-data").textContent; // Get id/code since querySelector gets the 1st instance
    const status = await confirmWindow('del');
    if (status == 'proceed') {
        fetch('delete-field', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('input[name="csrf_token"]').value
            },
            body: JSON.stringify({
                type: type,
                id: id
            }),
        }).then((_res) => {
            if (_res.ok) {
                if (type == 'college') {
                    window.location.href = 'colleges';  // Redirect to page on success
                }
            } else {
                showAlert(`Failed to delete ${type}.`);  // Handle any error responses
            }
        }).catch((error) => {
            console.error('Error:', error);
            showAlert("An error occurred.");
        });
    }
}