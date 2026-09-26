// ==========================================
// STUDENT DEADLINE MANAGER
// Simple JavaScript for beginners
// ==========================================


// Get saved tasks from browser
let tasks = JSON.parse(localStorage.getItem("deadlineTasks")) || [];


// ==========================================
// PAGE NAVIGATION
// ==========================================

function showSection(sectionId) {

    // Hide all sections
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active-section");
    });

    // Show selected section
    document.getElementById(sectionId).classList.add("active-section");

    // Update sidebar buttons
    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.remove("active");
    });

    // Update page title
    if (sectionId === "dashboard") {
        document.getElementById("pageTitle").textContent =
            getGreeting() + " 👋";
    }

    if (sectionId === "tasks") {
        document.getElementById("pageTitle").textContent =
            "My Tasks";
    }

    if (sectionId === "addTask") {
        document.getElementById("pageTitle").textContent =
            "Add a Deadline";
    }

    updateDisplay();
}


// ==========================================
// GREETING
// ==========================================

function getGreeting() {

    const hour = new Date().getHours();

    if (hour < 12) {
        return "Good morning";
    }

    if (hour < 18) {
        return "Good afternoon";
    }

    return "Good evening";
}


// ==========================================
// ADD NEW TASK
// ==========================================

document.getElementById("taskForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const taskName = document.getElementById("taskName").value;
    const subject = document.getElementById("subject").value;
    const dueDate = document.getElementById("dueDate").value;
    const notes = document.getElementById("notes").value;

    const priority =
        document.querySelector('input[name="priority"]:checked').value;


    const newTask = {

        id: Date.now(),

        name: taskName,

        subject: subject,

        dueDate: dueDate,

        priority: priority,

        notes: notes,

        completed: false

    };


    tasks.push(newTask);

    saveTasks();

    // Reset form
    document.getElementById("taskForm").reset();

    // Show dashboard
    showSection("dashboard");

    alert("Deadline added successfully! 🎉");
});


// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "deadlineTasks",
        JSON.stringify(tasks)
    );

}


// ==========================================
// CHECK OVERDUE
// ==========================================

function isOverdue(task) {

    if (task.completed) {
        return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const due = new Date(task.dueDate);

    return due < today;
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

}


// ==========================================
// TOGGLE TASK COMPLETION
// ==========================================

function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (task) {

        task.completed = !task.completed;

        saveTasks();

        updateDisplay();
    }

}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    updateDisplay();

}


// ==========================================
// CREATE TASK HTML
// ==========================================

function createTaskHTML(task) {

    const overdue = isOverdue(task);

    let priorityClass = "priority-low";

    if (task.priority === "High") {
        priorityClass = "priority-high";
    }

    if (task.priority === "Medium") {
        priorityClass = "priority-medium";
    }


    return `

        <div class="task ${task.completed ? "completed" : ""}">

            <button
                class="check-btn"
                onclick="toggleTask(${task.id})"
            >
                ${task.completed ? "✓" : ""}
            </button>


            <div class="task-info">

                <div class="task-title">
                    ${task.name}
                </div>

                <div class="task-meta">

                    ${task.subject}

                    •

                    <span class="${overdue ? "overdue" : ""}">
                        ${overdue ? "Overdue" : "Due " + formatDate(task.dueDate)}
                    </span>

                </div>

            </div>


            <span class="priority-tag ${priorityClass}">
                ${task.priority}
            </span>


            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
                title="Delete task"
            >
                🗑
            </button>

        </div>

    `;
}


// ==========================================
// DISPLAY TASKS
// ==========================================

function updateDisplay() {

    updateStatistics();

    displayUpcomingTasks();

    displayAllTasks();

}


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending =
        tasks.filter(task => !task.completed).length;

    const overdue =
        tasks.filter(task => isOverdue(task)).length;


    document.getElementById("totalTasks").textContent = total;

    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("overdueTasks").textContent = overdue;

}


// ==========================================
// UPCOMING TASKS
// ==========================================

function displayUpcomingTasks() {

    const container =
        document.getElementById("upcomingTasks");


    const upcoming =
        tasks
        .filter(task => !task.completed)
        .sort((a, b) =>
            new Date(a.dueDate) - new Date(b.dueDate)
        )
        .slice(0, 5);


    if (upcoming.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <div class="empty-icon">📚</div>

                <p>No upcoming deadlines.</p>

                <small>Add your first task to get started!</small>

            </div>

        `;

        return;
    }


    container.innerHTML =
        upcoming.map(createTaskHTML).join("");

}


// ==========================================
// ALL TASKS
// ==========================================

function displayAllTasks(filter = "all") {

    const container =
        document.getElementById("allTasks");


    let filteredTasks = [...tasks];


    if (filter === "pending") {

        filteredTasks =
            tasks.filter(task => !task.completed);

    }


    if (filter === "completed") {

        filteredTasks =
            tasks.filter(task => task.completed);

    }


    if (filter === "high") {

        filteredTasks =
            tasks.filter(task => task.priority === "High");

    }


    filteredTasks.sort(
        (a, b) =>
            new Date(a.dueDate) -
            new Date(b.dueDate)
    );


    if (filteredTasks.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <div class="empty-icon">✨</div>

                <p>No tasks found.</p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        filteredTasks.map(createTaskHTML).join("");

}


// ==========================================
// FILTER TASKS
// ==========================================

function filterTasks(filter, button) {

    document.querySelectorAll(".filter").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    displayAllTasks(filter);

}


// ==========================================
// INITIAL LOAD
// ==========================================

document.getElementById("pageTitle").textContent =
    getGreeting() + " 👋";

updateDisplay();