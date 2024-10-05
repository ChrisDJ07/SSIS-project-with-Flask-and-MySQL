import { edit } from './actions.js'

// Adding actionListeners to data-fields
document.querySelectorAll('.edit-data').forEach(button => {
    button.addEventListener('click', edit);
});

// Adding actionListeners to form-fields
document.querySelectorAll('.form-text').forEach(field => {
    field.addEventListener('click', function (event) {
        expandForm(event, this);
    });
});

// Adding actions to other buttons
document.getElementById("alert-overlay").addEventListener('click', closeConfirmWindow);
document.querySelector(".close-alertButton").addEventListener('click', closeConfirmWindow);

// Show alert box below the form
export function showAlert(message) {
    const alert_box = document.querySelector(".error-window");
    alert_box.classList.remove("hide");
    alert_box.textContent = message;
}

export function hideAlert() {
    const alert_box = document.querySelector(".error-window");
    alert_box.classList.add("hide");
}

// General on-screen Alert Window
const alertElement = document.getElementById('alert');
const overlayElement = document.getElementById('alert-overlay');

export function confirmWindow(type) {
    const discardBtn = document.querySelector(".discard-button");
    const proceedBtn = document.querySelector(".proceed-button");

    const window_head = document.querySelector(".alert-window-header");
    const window_msg = document.querySelector(".alert-window-message");

    // Show Window
    alertElement.classList.remove('hide');
    overlayElement.classList.remove('hide');
    // Animation
    setTimeout(() => {
        alertElement.style.transform = "translate(0, 10vh)";
        alertElement.style.transition = "transform 0.3s";
    }, 10);

    // Modify alert message and buttons
    if (type == 'form') {
        // Modify Messages
        window_head.textContent = "Discard Unsaved Changes?";
        window_msg.textContent = "Closing this window will discard all your unsaved changes.";
        // Modify Buttons
        discardBtn.textContent = "Discard";
        proceedBtn.textContent = "Keep Editing";
    }
    else if (type == 'del') {
        window_head.textContent = "Delete this field?";
        window_msg.textContent = "Deleting this will remove it from the database. Are you sure?";
        discardBtn.textContent = "Cancel";
        proceedBtn.textContent = "Proceed Delete";

    }
    else if (type == 'delAll') {
        window_head.textContent = "Delete all Selected?";
        window_msg.textContent = "Proceeding will remove all selected from the database. Are you sure?";
        discardBtn.textContent = "Cancel";
        proceedBtn.textContent = "Proceed Delete";

    }
    else if (type == 'edit') {
        window_head.textContent = "Overwrite this field?";
        window_msg.textContent = "Overwriting this will update it from the database. Are you sure?";
        discardBtn.textContent = "Cancel";
        proceedBtn.textContent = "Proceed Update";

    }
    return new Promise((resolve, reject) => {
        // Reset actions to window buttons
        discardBtn.removeEventListener("click", handleDiscard);
        proceedBtn.removeEventListener("click", handleProceed);
        function handleDiscard() {
            closeConfirmWindow();
            resolve('discard');
        }

        function handleProceed() {
            closeConfirmWindow();
            resolve('proceed');
        }
        discardBtn.addEventListener("click", handleDiscard);
        proceedBtn.addEventListener("click", handleProceed);

    });
}

// Close Confirm Window
function closeConfirmWindow() {
    alertElement.classList.add('hide');
    alertElement.style.transform = "translate(0, -10vh)";
    overlayElement.classList.add('hide');
}


/*
    UI ELEMENTS
*/
const details_cover = document.querySelector(".overlay-cover");
const sideDetails = document.querySelector(".content");
const closePanelBtn = document.querySelector(".close-panel-btn");

closePanelBtn.addEventListener("click", async () => {
    const status = await confirmWindow('form');
    if (status == 'discard') {
        close_sidebar();
        hideAlert();
    }
});
details_cover.addEventListener("click", async () => {
    const status = await confirmWindow('form');
    if (status == 'discard') {
        close_sidebar();
        hideAlert();
    }
});


// Open the hidden form panel
export function show_sidebar() {
    sideDetails.style = "transform: translate(-30vw, 0);";
    details_cover.classList.remove("hide");
}

// Close the hidden form panel
function close_sidebar() {
    // Close the sidebar
    sideDetails.style = "transform: translate(0, 0);";
    details_cover.classList.add("hide");

    // Clear text inputs
    const allForms = document.querySelectorAll(".form-text .inputText");
    allForms.forEach(function (form) {
        form.value = "";
    });

    // Clear radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(function (radio) {
        radio.checked = false;
    });

    // Reset dropdowns to their default placeholder value
    const dropdowns = document.querySelectorAll('select');
    dropdowns.forEach(function (dropdown) {
        dropdown.selectedIndex = 0;  // Resets to the first option (the placeholder)
    });
    closeConfirmWindow();
}

// Expand form fields when clicked
function expandForm(event, element) {
    event.stopPropagation();
    const allForms = document.querySelectorAll(".form-text");
    allForms.forEach(function (form) {
        // Collapse all other form fields if empty
        if (form.id !== element && form.querySelector(".inputText").value.trim() == "") {
            form.querySelector(".inputText").classList.add("hide");
            form.querySelector("label").style.top = "10px";
            form.querySelector("label").style.fontSize = "1em";
        }
    });

    const input = element.querySelector("input");
    input.classList.remove("hide");
    input.focus();
    element.querySelector("label").style = "top: 0px; font-size: 0.8em;";
}

// Expand all form fields
export function expandAllForm() {
    const elements = document.querySelectorAll(".form-text");
    elements.forEach(element => {
        const input = element.querySelector("input");
        input.classList.remove("hide");
        element.querySelector("label").style = "top: 0px; font-size: 0.8em;";
    });
}

//collapse all form fields if clicked outside
document.addEventListener("click", function (event) {
    const form = document.querySelectorAll(".form-text");
    form.forEach(function (element) {
        if (!element.contains(event.target)) {
            const input = element.querySelector(".inputText");
            const label = element.querySelector("label");
            if (input.value.trim() == "") {
                input.classList.add("hide");
                label.style = "top: 10px; font-size: 1em;";
            }
        }
    });
});


// Select-all checkbox
document.querySelector('#select-all').addEventListener('change', function () {
    // Get all item checkboxes, set them to checked
    const itemCheckboxes = document.querySelectorAll('#select-item');
    itemCheckboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
    toggleDeleteSelected();
});

// Add listener to all item checkbox
document.querySelectorAll('#select-item').forEach(checkbox => {
    checkbox.addEventListener('change', toggleDeleteSelected);
});

// Show delete-selected button
export function toggleDeleteSelected() {
    const button = document.querySelector(".delete-selected-btn");
    if (countCheckedCheckboxes() > 0) {
        button.classList.remove('hide');
    }
    else {
        button.classList.add('hide');
    }
}
// count checked checkboxes on list
function countCheckedCheckboxes() {
    const checkboxes = document.querySelectorAll('#select-item');
    let count = 0;
    // Iterate over checkboxes and count the checked ones
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            count++;
        }
    });
    return count;
}

// Highlight selected Tab
const tabs = document.querySelectorAll(".navlinks li");
switch (document.title) {
    case "Students":
        tabs[0].classList.add("active");
        break;
    case "Courses":
        tabs[1].classList.add("active");
        break;
    case "Colleges":
        tabs[2].classList.add("active");
        break;

    default:
        break;
}