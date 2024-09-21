
const editBtn = document.querySelector(".edit-data");
editBtn.addEventListener("click", show_sidebar);

const details_cover = document.querySelector(".overlay-cover");
const sideDetails = document.querySelector(".content");
const closePanelBtn = document.querySelector(".close-panel-btn");
closePanelBtn.addEventListener("click", confirmClose)
details_cover.addEventListener("click", confirmClose);

const discardBtn = document.querySelector(".discard-button");
discardBtn.addEventListener("click", close_sidebar)

const keepEditBtn = document.querySelector(".keep-edit-btn");
keepEditBtn.addEventListener("click", closeConfirmDialog);


// Functions
function show_sidebar() {
    sideDetails.style = "transform: translate(-30vw, 0);";
    details_cover.classList.toggle("hide");
}

function close_sidebar() {
    // Close the sidebar
    sideDetails.style = "transform: translate(0, 0);";
    details_cover.classList.toggle("hide");

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
    closeConfirmDialog();
}

function expandForm(element) {
    const allForms = document.querySelectorAll(".form-text");
    allForms.forEach(function (form) {
        if (form.id !== element && form.querySelector(".inputText").value.trim() == "") {
            // Collapse all other forms
            form.querySelector(".inputText").classList.add("hide");
            form.querySelector("label").style.top = "10px";
            form.querySelector("label").style.fontSize = "1em";
        }
    });

    const input = element.querySelector("input");
    input.classList.remove("hide");
    input.focus();
    element.querySelector("label").style = "top: 0px; font-size: 0.8em;";
    event.stopPropagation();
}

//collapse form if clicked outside
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

// Show alert when closing window
const alertElement = document.getElementById('alert');
const overlayElement = document.getElementById('alert-overlay');
function confirmClose() {
    // Remove the hidden class to make the elements visible
    alertElement.classList.remove('hide');
    overlayElement.classList.remove('hide');

    // Use a short timeout to allow the browser to render the initial state
    setTimeout(() => {
        alertElement.style.transform = "translate(0, 10vh)";
        alertElement.style.transition = "transform 0.3s";
    }, 10);
}

function closeConfirmDialog() {
    alertElement.classList.add('hide');
    alertElement.style.transform = "translate(0, -10vh)";
    overlayElement.classList.add('hide');
}
