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

// Search/filter function
document.querySelector(".search-btn").addEventListener('click', function () {
    const inputField = document.querySelector(".search-field");
    let keyword = inputField.value;
    keyword = keyword.trim().toLowerCase();

    const listItems = document.querySelectorAll('.myList li');

    if (keyword == '') {
        listItems.forEach(item => {
            item.style.display = ''; // Show all items
        });
        inputField.value = ''; //clear search field
        inputField.blur();
    }
    else {
        listItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(keyword)) {
                item.style.display = ''; // Show item/s
            } else {
                item.style.display = 'none'; // Hide item/s
            }
        });
    }
});

// Delete Selected
document.querySelector(".delete-selected-btn").addEventListener('click', async function () {
    // Array to store the values
    const selectedValues = [];
    const type = document.title.toLowerCase();

    // Iterate over checkboxes
    const checkboxes = document.querySelectorAll('#select-item');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const listItem = checkbox.closest('li');
            const code_id = listItem.querySelector('span.table-data').textContent; // Get the first .table-data value
            selectedValues.push(code_id); // Add to the array
        }
    });

    const status = await confirmWindow('delAll');
    if (status == 'proceed') {
        fetch('delete-selected', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('input[name="csrf_token"]').value
            },
            body: JSON.stringify({
                type: type,
                selectedValues: selectedValues
            }),
        }).then((_res) => {
            if (_res.ok) {
                if (type == 'colleges') {
                    window.location.href = 'colleges';  // Redirect to page on success
                }
            } else {
                flash(`Failed to delete selection.`, category = 'error');  // Handle any error responses
            }
        }).catch((error) => {
            console.error('Error:', error);
            alert("An error occurred.");
        });
    }
    console.log(selectedValues);
});
