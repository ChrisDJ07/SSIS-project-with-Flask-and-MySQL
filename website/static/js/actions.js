import { show_sidebar, expandAllForm, confirmWindow, showAlert, toggleDeleteSelected } from './UI.js'

// Call this function when adding
document.querySelector(".add-data").addEventListener("click", add);
function add() {
    document.querySelector(".mode-label").textContent = "ADD";
    show_sidebar();
}

// Call this function when editing
export let old_code;
export function edit(event) {
    const type = document.title.toLowerCase();
    document.querySelector(".mode-label").textContent = "EDIT";
    // Get the closest <li> parent of clicked
    const row = event.target.closest("li");
    old_code = row.querySelector("span.table-data").textContent;
    // Find the table-data elements within this row
    const form_field = document.querySelectorAll(".inputText");

    if (type == 'colleges') {
        const table_data = row.querySelectorAll(".table-data");
        let iterator = 0;
        table_data.forEach(data => {
            form_field[iterator].value = data.textContent.trim();  // Populate form with data
            iterator += 1;
        });
    }
    // Select dropdown for course college_code
    if (type == 'courses') {
        const table_data = row.querySelectorAll(".course-data");
        let iterator = 0;
        table_data.forEach(data => {
            form_field[iterator].value = data.textContent.trim();  // Populate form with data
            iterator += 1;
        });
        // Set the value of the dropdown (for College)
        const collegeDropdown = document.getElementById("college");
        const collegeValue = row.querySelector('.course-drop').textContent.trim();
        // Set the dropdown value
        for (let option of collegeDropdown.options) {
            if (option.value === collegeValue) {
                option.selected = true;
                break;
            }
        }
    }

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
                else if (type == 'course') {
                    window.location.href = 'courses';  // Redirect to page on success
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

// Add Listener to search submit
document.querySelector(".search-btn").addEventListener('click', filter);
// Add behaviour when pressing 'enter'
document.getElementById('search').addEventListener('keydown', function (event) {
    // Check if the pressed key is "Enter"
    if (event.key === "Enter") {
        event.preventDefault();  // Prevent form submission
        filter();
    }
});

// Search/filter function
function filter() {
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
    // Clear checkbox
    const checkboxes = document.querySelectorAll('#select-item');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelector('#select-all').checked = false;
    // Check for toggle delete selected
    toggleDeleteSelected();
}

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
                else if (type == 'courses') {
                    window.location.href = 'courses';  // Redirect to page on success
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


// Add listeners to column header buttons
const sort_buttons = document.querySelectorAll(".sort-button"); //Get button elements
const buttons = Array.from(sort_buttons); //Store to array
sort_buttons.forEach(button => {
    button.addEventListener('click', function () {
        sortList(buttons.indexOf(button))
    });
});

// Sort rows by column
let sort_direction = 'asc';
function sortList(column) {
    const list = document.querySelector('.myList');
    const items = list.querySelectorAll('li');

    // Convert NodeList to Array for sorting
    const itemsArray = Array.from(items);

    // Sort the array based on text content of the column
    itemsArray.sort((a, b) => {
        const itemA = a.querySelectorAll('.table-data')[column].textContent.trim();
        const itemB = b.querySelectorAll('.table-data')[column].textContent.trim();

        // Toggle sorting direction
        if (sort_direction === 'asc') {
            showSortIcon(column, sort_direction);
            return itemA.localeCompare(itemB);

        } else {
            showSortIcon(column, sort_direction);
            return itemB.localeCompare(itemA);
        }
    });

    // Append sorted items into list
    itemsArray.forEach(item => list.appendChild(item));

    // Toggle sort direction for next click
    sort_direction = sort_direction === 'asc' ? 'desc' : 'asc';
}

//Show sort icon on click
function showSortIcon(column, direction) {
    const button = document.querySelectorAll(".sort-button")[column];

    // Hide other icons
    document.querySelectorAll('.sort-button').forEach(btn => {
        if (btn.textContent == button.textContent) {
            btn.classList.remove('hidden');
        }
        else {
            btn.classList.add("hidden");
        }
    });

    if (direction === 'asc') {
        button.querySelector('i').classList.remove('fa-angle-up');
        button.querySelector('i').classList.add('fa-angle-down');
    } else {
        button.querySelector('i').classList.remove('fa-angle-down');
        button.querySelector('i').classList.add('fa-angle-up');
    }
}