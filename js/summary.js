let tasks = [];
let user = [];

/**
 * Initializes the summary page by loading tasks and user data from storage, then displays task statistics and user greeting.
 * @async
 */
async function initSummary() {
    this.loggedUser = await getUserFromLocalStorage();
    this.user = this.loggedUser;

    if (this.loggedUser) {
        tasks = await getTasksFromDB();
        showAmounts();
    }
    else
        window.location.href = "../html/login.html";
}

/**
 * Determines the appropriate greeting based on the current time.
 * @returns {string} The greeting message.
 */
function getGreetingTime() {
    let actualTime = new Date();
    let time = actualTime.getHours();

    if (time >= 5 && time < 11) {
        return "Good morning";
    } else if (time >= 11 && time < 17) {
        return "Good afternoon";
    } else if (time >= 17 && time < 23) {
        return "Good evening";
    } else {
        return "Good night";
    }
}

/**
 * Calculates and displays the amount of tasks in each category, the total number of urgent tasks,
 * the earliest due date among all tasks, and sets the greeting and user name on the summary page.
 */
function showAmounts() {
    let toDos = [];
    let feedbacks = [];
    let dones = [];
    let inProgresses = [];
    let prioUrgent = [];
    let earliestDueDate = null;
    let newDate = null;

    for (let t = 0; t < tasks.length; t++) {
        const task = tasks[t];
        if (task.priority === "Urgent") 
            prioUrgent.push(task.priority);

        if (!earliestDueDate || task.dueDate < earliestDueDate) 
            earliestDueDate = task.dueDate;

        newDate = getFormattedDate(earliestDueDate);
        pushProgress(task, toDos, feedbacks, dones, inProgresses);
    }
    renderAllData(toDos, dones, feedbacks, inProgresses, prioUrgent, newDate);
}

/**
 * Formats a date string into a more readable format.
 * @param {string} earliestDueDate - The earliest due date in ISO string format.
 * @returns {string} Formatted date string.
 */
function getFormattedDate(earliestDueDate) {
    let date = new Date(earliestDueDate);
    let formattedMonth = date.toLocaleString("default", { month: "long" });
    let year = date.getFullYear();
    let day = date.getDate();
    let newDate = formattedMonth + " " + day + ", " + year;
    return newDate;
}

/**
 * Categorizes a task based on its progress status into one of the provided arrays.
 * @param {Object} task - The task object to categorize.
 * @param {Array} toDos - Array to accumulate tasks with 'toDo' progress.
 * @param {Array} feedbacks - Array to accumulate tasks with 'feedback' progress.
 * @param {Array} dones - Array to accumulate tasks with 'done' progress.
 * @param {Array} inProgresses - Array to accumulate tasks with 'inProgress' progress.
 */
function pushProgress(task, toDos, feedbacks, dones, inProgresses) {
    switch (task.progress) {
        case "toDo":
            toDos.push(task.progress);
            break;
        case "feedback":
            feedbacks.push(task.progress);
            break;
        case "done":
            dones.push(task.progress);
            break;
        case "inProgress":
            inProgresses.push(task.progress);
            break;
        default:
            break;
    }
}

/**
 * Renders task statistics and user information onto the summary page.
 * @param {Array} toDos - Array of tasks with 'toDo' progress.
 * @param {Array} dones - Array of tasks with 'done' progress.
 * @param {Array} feedbacks - Array of tasks with 'feedback' progress.
 * @param {Array} inProgresses - Array of tasks with 'inProgress' progress.
 * @param {Array} prioUrgent - Array of tasks with 'Urgent' priority.
 * @param {string} earliestDueDate - Formatted string of the earliest due date.
 */
function renderAllData(toDos, dones, feedbacks, inProgresses, prioUrgent, earliestDueDate) {
    document.getElementById("to-do-amount").innerHTML = toDos.length;
    document.getElementById("done-amount").innerHTML = dones.length;
    document.getElementById("feedback-amount").innerHTML = feedbacks.length;
    document.getElementById("progress-amount").innerHTML = inProgresses.length;
    document.getElementById("tasks-amount").innerHTML = tasks.length;
    document.getElementById("font-urgent-number").innerHTML = prioUrgent.length;
    document.getElementById("earliest-due-date").innerHTML = earliestDueDate;
    document.getElementById("greet-time").innerHTML = getGreetingTime();
    if (this.user.username) {
        document.getElementById("greet-user").innerHTML = this.user.username;
    } else {
        document.getElementById("greet-user").innerHTML = "Dear Guest";
    }
}
