/**
 * Array to store task objects.
 * @type {Array}
 */
let tasks = [];

/**
 * Identifier for the currently dragged task element.
 * @type {string|number}
 */
let currentDraggedElement;

/**
 * Stores the current task modal information.
 * @type {Array}
 */
let currentTaskModal = [];

/**
 * Initializes the task board by loading tasks from storage and updating the UI.
 * @async
 */
async function initBoard() {
    this.loggedUser = await getUserFromLocalStorage();
    if (this.loggedUser) {
        tasks = await getTasksFromDB();
        updateTasks();
    }
    else
        window.location.href = "../html/login.html";
}

/**
 * Sets up event listeners after the DOM content is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (event) {
        if (event.target.id === "cardModal" || event.target.closest("#cardModal")) {
            let isClickOnOpenTask = event.target.classList.contains("openTask") || event.target.closest(".openTask") !== null;
            if (!isClickOnOpenTask) {
                closeCardModal("cardModal-container");
            }
        }
        if (event.target.id === "addTaskModal" || event.target.closest("#addTaskModal")) {
            let isClickInsideAddTaskTemplateContent = event.target.id === "addTaskTemplateContent" || event.target.closest("#addTaskTemplateContent") !== null;
            if (!isClickInsideAddTaskTemplateContent) {
                closeCardModal("addTaskModal");
            }
        }
        if (event.target.id === "card-modal-id" || event.target.closest("#card-modal-id")) {
            let isClickInsideInEditTaskModal = event.target.id === "card-modal-content" || event.target.closest("#card-modal-content") !== null;
            if (!isClickInsideInEditTaskModal) {
                closeEditCardModal(currentTaskModal.id);
            }
        }
    });
});

/**
 * Updates the tasks displayed on the board.
 * @async
 */
async function updateTasks() {
    let sections = {
        toDo: document.getElementById("toDo"),
        inProgress: document.getElementById("inProgress"),
        feedback: document.getElementById("feedback"),
        done: document.getElementById("done"),
    };

    document.getElementById("toDo").innerHTML = "";
    document.getElementById("inProgress").innerHTML = "";
    document.getElementById("feedback").innerHTML = "";
    document.getElementById("done").innerHTML = "";

    tasks.forEach((taskData) => {        
        sections[taskData.progress].innerHTML += getCardModal(taskData);
    });
}

/**
 * Initiates the dragging of a task card.
 * @param {string|number} id - The identifier of the task being dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * Allows a drop action on a drop target, preventing the default handling.
 * @param {Event} event - The dragover event.
 */
function allowDrop(event) {
    event.preventDefault();
}

/**
 * Moves a task to a specified category/progress section.
 * @param {string} category - The category to move the task to.
 * @async
 */
async function moveTo(category) {
    let foundIndex = tasks.findIndex((task) => task.id === currentDraggedElement);

    if (foundIndex !== -1) {
        tasks[foundIndex].progress = category;
        let taskToUpdate = tasks[foundIndex];

        try {
            await updateTaskInDB(taskToUpdate);
            updateTasks();
        } catch (error) {
            console.error("Error when updating the task:", error);
        }
    } else {
        console.error("Element not found in tasks");
    }
}

/**
 * Generates HTML content for a task card.
 * @param {Object} task - The task object to generate HTML for.
 * @returns {string} The generated HTML string for the task card.
 */
function getCardModal(task) {
    let circleTemplate = getCircleTemplate(task);
    let prioSVG = getPrioSVG(task);
    let totalSubtasks = task.subtasks.length;
    let completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length;
    let progressValue = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
    let subTaskWrapperHTML = totalSubtasks > 0 ? generateTodoSubtask(progressValue, completedSubtasks, totalSubtasks) : "";
    return getTaskCardTemplate(task, subTaskWrapperHTML, circleTemplate, prioSVG);
}

/**
 * Returns the HTML string for the circle template showing assigned users' initials.
 * @param {Object} task - The task containing assignedTo data.
 * @returns {string} HTML string representing circles with initials of assigned users.
 */
function getCircleTemplate(task) {
    return task.assignedTo.map((person) => {
        let initials = person.name.split(" ").map((namePart) => namePart.charAt(0)).join("");
        let backgroundColor = person.backgroundColor ? ` style="background-color: ${person.backgroundColor};"` : "";
        return `<div class="profileBadge"${backgroundColor}>${initials}</div>`;
    }).join("");
}

/**
 * Returns the SVG HTML string based on the priority of the task.
 * @param {Object} task - The task object with a priority property.
 * @returns {string} HTML string of the SVG for the task's priority.
 */
function getPrioSVG(task) {
    switch (task.priority) {
        case "Low":
            return getPrioLowSVG();
        case "Medium":
            return getPrioMediumSVG();
        case "Urgent":
            return getPrioUrgentSVG();
        default:
            return "";
    }
}

/**
 * Filters tasks based on a search text and updates the UI to show only matching tasks.
 * @param {string} searchText - The text to filter tasks by.
 */
function handleSearchChange(searchText) {
    if (searchText.trim() === "") {
        updateTasks();
    } else {
        let filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchText.toLowerCase()) || task.description.toLowerCase().includes(searchText.toLowerCase()));
        updateFilteredTasks(filteredTasks);
    }
}

/**
 * Updates the task board with a filtered list of tasks.
 * @param {Array} filteredTasks - The tasks that match the filter criteria.
 */
function updateFilteredTasks(filteredTasks) {
    let sections = {
        toDo: document.getElementById("toDo"),
        inProgress: document.getElementById("inProgress"),
        feedback: document.getElementById("feedback"),
        done: document.getElementById("done"),
    };

    Object.keys(sections).forEach((section) => {
        sections[section].innerHTML = "";
    });

    filteredTasks.forEach((task) => {
        let taskTemplate = getCardModal(task);
        if (sections[task.progress]) {
            sections[task.progress].innerHTML += taskTemplate;
        }
    });
}

/**
 * Highlights a task card by adding a CSS class.
 * @param {string} id - The ID of the task card to highlight.
 */
function highlight(id) {
    document.getElementById(id).classList.add("contentContainerHover");
}

/**
 * Removes the highlight from a task card by removing a CSS class.
 * @param {string} id - The ID of the task card to remove the highlight from.
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove("contentContainerHover");
}

let doc;

/**
 * Closes a card modal by adding a CSS class to hide it.
 * @param {string} id - The ID of the modal to close.
 */
function closeCardModal(id) {
    document.getElementById(id).classList.add("d-none");
    document.getElementById('hidden-overflow').classList.remove('height100');
    document.getElementById("hidden-overflow").style.overflow = "scroll";
}

function closeEditCardModal(id) {
    openCardModal(id);
    document.getElementById('cardModal-container').classList.add("d-none");
    document.getElementById("hidden-overflow").style.overflow = "scroll";
}

/**
 * Prepares and displays the edit task template in a modal.
 * @async
 */
async function editTask() {
    await initTask("noProgress");
    document.getElementById("cardModal-container").innerHTML = editTaskTemplate();
    setEditValuesOfTaskModal();
    rotateIcon("nav-image-assigned");
}

/**
 * Opens a card modal by populating it with task details and disabling body scroll.
 * @param {string|number} taskId - The identifier of the task to display in the modal.
 */
function openCardModal(taskId) {
    let task = tasks.find((task) => task.id.toString() === taskId.toString());
    if (task) {
        // Setze currentTaskModal auf das ausgewählte Task-Objekt
        currentTaskModal = task;

        // Füge die Eigenschaft "selected" zu allen assignedTo-Objekten hinzu
        currentTaskModal.assignedTo.forEach((assigned) => {
            assigned.selected = true; // Markiere alle assoziierten Personen als ausgewählt
        });

        // Öffne das Modal mit den aktualisierten Daten
        document.getElementById("cardModalID").innerHTML = getTaskTemplate(task);
        document.getElementById('hidden-overflow').classList.add('height100');
    }
}


/**
 * Generates HTML for displaying assigned users in the task modal.
 * @param {Array} assignedTo - The array of assigned users for the task.
 * @returns {string} HTML string for displaying assigned users.
 */
function getAssignedToTemplate(assignedTo) {
    return assignedTo.map((person) => {
        let initials = person.name.split(" ").map((name) => name[0]).join("");
        return /*html*/ `
            <div class="assignedContact">
                <div class="nameCircleWrapper">
                    <div class="nameCircle" style="background-color: ${person.backgroundColor};">${initials}</div>
                    <p class="assignedName">${person.name}</p>
                </div>
            </div>`;
    }).join("");
}

/**
 * Generates HTML for displaying subtasks in the task modal.
 * @param {Array} subtasks - The subtasks of the task.
 * @param {string|number} taskId - The identifier of the task.
 * @returns {string} HTML string for displaying subtasks.
 */
function getSubtasksTemplate(subtasks, taskId) {    
    return subtasks.map((subtask) => {
        const isChecked = subtask.completed ? "checked" : "";
        return /*html*/ `
            <div class="subtask">
                <input class="checkbox" type="checkbox" ${isChecked} onclick="toggleSubtaskCompleted(${taskId}, ${subtask.id})"/>
                <div class="checkboxDescription">${subtask.title}</div>
            </div>`;
    }).join("");
}

/**
 * Toggles the completed state of a subtask and updates the task storage.
 * @param {string|number} taskId - The identifier of the parent task.
 * @param {string|number} subtaskId - The identifier of the subtask.
 * @async
 */
async function toggleSubtaskCompleted(taskId, subtaskId) {
    let taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
        let subtaskIndex = tasks[taskIndex].subtasks.findIndex((subtask) => subtask.id === subtaskId);
        if (subtaskIndex !== -1) {
            tasks[taskIndex].subtasks[subtaskIndex].completed = !tasks[taskIndex].subtasks[subtaskIndex].completed;
            await updateTaskInDB(tasks[taskIndex]);
            updateTasks();
        }
    }
}

/**
 * Generates the HTML template for displaying a task's details in a modal.
 * @param {Object} task - The task object to display.
 * @returns {string} The HTML template for the task's details.
 */
function getTaskTemplate(task) {
    let assignedToHtml = getAssignedToTemplate(task.assignedTo);
    let subtasksHtml = getSubtasksTemplate(task.subtasks, task.id);
    let prioSVG = getPrioSVG(task);
    currentTaskModal = task;
    return generateTaskTemplateHTML(task, assignedToHtml, subtasksHtml, prioSVG);
}

/**
 * Deletes a task from the board and updates the storage.
 * @param {string|number} taskId - The identifier of the task to delete.
 * @async
 */
async function deleteTask(taskId) {
    closeCardModal("cardModal-container");
    const task = tasks.find((task) => task.id === taskId);
    tasks = tasks.filter((task) => task.id !== taskId);
    await deleteTaskFromDB(task);
    updateTasks();
}

/**
 * Prepares and displays the add task template in a modal.
 * @param {string} progress - The initial progress state for the new task.
 * @async
 */
async function loadAddTaskTemplate(progress) {
    document.body.style.overflow = "hidden";
    document.getElementById("addTaskModalID").innerHTML = addTaskTemplate();
    await initTask(progress);
    createdFromBoard = true;
    document.getElementById("medium-button-id").classList.add("active");
    document.getElementById('hidden-overflow').classList.add('height100');
}

/**
 * Returns an array of selected (assigned) users based on the user selection in the UI.
 * @returns {Array<Object>} Array of selected users with their name and background color.
 */
function getSelectedAssigneds() {
    return this.assigneds.filter((assigned) => assigned.selected).map((assigned) => {
            return {
                // Nur IDs für bestehende Assigned-Objekte mitsenden
                ...(assigned.id && { id: parseInt(assigned.id) }),
                name: assigned.name,
                backgroundColor: assigned.backgroundColor,
            };
        });
}


/**
 * Sets the input fields in the edit task modal with the current task's data.
 */
function setEditValuesOfTaskModal() {
    document.getElementById("input-title").value = currentTaskModal.title;
    document.getElementById("textArea-description").value = currentTaskModal.description;
    document.getElementById("input-due-date").value = currentTaskModal.dueDate;
    selectAssignedPersons();
    updateAssignedItemsUI();
    //editAssignsArray();
    editSubtasksArray();
    document.getElementById("medium-button-id").classList.add("active");
}

/**
 * Saves the edited task details to storage and updates the task board UI.
 * @async
 */
async function saveEditTask() {
    let taskUpdated = false;
    let updatedTask = null;

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        if (task.id === currentTaskModal.id) {
            
            task.title = document.getElementById("input-title").value;
            task.description = document.getElementById("textArea-description").value;
            task.dueDate = document.getElementById("input-due-date").value;
            task.priority = document.querySelector(".prioButtons button.active").innerText.trim();
            task.subtasks = getUpdatedSubtasks();
            task.assignedTo = getSelectedAssigneds();
            taskUpdated = true;
            updatedTask = task;
            break;
        }
    }

    if (taskUpdated) {
        await updateTaskInDB(updatedTask); 
        tasks = await getTasksFromDB();
        updateTasks();
    }

    closeCardModal("cardModal-container");
    // document.getElementById("cardModalID").innerHTML = getTaskTemplate(updatedTask);
}

function openOrCloseCheckBoxAreaForAssigneds() {
    updateAssignedItemsUI();
    let checkBoxItems = document.getElementById("checkBoxItemsAssigned");
    rotateIcon("nav-image-assigned");
    if (checkBoxItems.innerHTML.trim() !== "") {
        checkBoxItems.innerHTML = "";
        document.body.style.overflow = "";
    }
    else {
        document.body.style.overflow = "hidden";
        checkBoxItems.innerHTML = getCheckBoxAreaTemplateForAssigned();
    }
    
}

/**
 * Prepares the assigns array for editing, reflecting the current task's assigned users.
 */
function editAssignsArray() {
    let assigns = currentTaskModal["assignedTo"];
    let assignsContainer = document.getElementById("selectedUserCircle");
    assignsContainer.innerHTML = "";

    for (let a = 0; a < assigns.length; a++) {
        const assign = assigns[a];
        let editAssign = assign["name"];
        let editColor = assign["backgroundColor"];
        let initials = editAssign.split(" ").map((editAssign) => editAssign[0]).join("");
        assignsContainer.innerHTML += `<div class="editCircleStyle">
        <div class="editprofileBadge" style="background-color:${editColor}">${initials}</div>
        `;
    }
}

/**
 * Prepares the subtasks array for editing, reflecting the current task's subtasks.
 */
function editSubtasksArray() {
    let subtasks = currentTaskModal.subtasks;
    let subtaskContainer = document.getElementById("subtasks");
    subtaskContainer.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        let editSubtask = subtask.title;
        subtaskContainer.innerHTML += generateEditSubtasksHTML(subtask.id, editSubtask, subtask.completed);
    }
}






function getUpdatedSubtasks() {
    let updatedSubtasks = [];
    let subtaskElements = document.querySelectorAll(".new-sub-task-container");

    subtaskElements.forEach((element) => {
        let subtaskId = element.getAttribute('data-id');
        let title = element.querySelector('.new-subtask-text').textContent.trim();
        let completed = element.getAttribute('data-completed') === "true"; // Lesen des Status

        if (subtaskId && !isNaN(parseInt(subtaskId, 10))) {
            updatedSubtasks.push({
                id: parseInt(subtaskId, 10),
                title: title,
                completed: completed, // Status übernehmen
            });
        } else {
            updatedSubtasks.push({
                title: title,
                completed: false, // Standardwert
            });
        }
    });

    return updatedSubtasks;
}





















/**
 * Selects assigned persons based on the current task modal's assignedTo data.
 */
function selectAssignedPersons() {
    if (currentTaskModal.assignedTo && currentTaskModal.assignedTo.length > 0) {
        currentTaskModal.assignedTo.forEach((assignedContact) => {
            let found = assigneds.find((assigned) => assigned.name.trim() === assignedContact.name.trim());
            if (found)
                found.selected = true;
        });
    }
}

/**
 * Updates the UI to reflect the current task's assigned users.
 */
function updateAssignedItemsUI() {
    currentTaskModal.assignedTo.forEach((assigned) => {
        const element = document.querySelector(`.assigned-item[data-name="${assigned.name}"]`); 
        if (element) {            
            const checkbox = element.querySelector(".checkbox");            
            if (checkbox && assigned.selected) {
                checkbox.checked = true;
                element.classList.add("active");
            } else if (checkbox) {
                checkbox.checked = false;
                element.classList.remove("active");
            }
        }
    });
    updateActiveInitialCircles();
}


