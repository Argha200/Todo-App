function addTask() {
    const taskText = document.getElementById('taskInput').value.trim();
    if (taskText !== '') {
        let tasks = localStorage.getItem('tasks');
        if (!tasks) {
            tasks = [];
        } else {
            tasks = JSON.parse(tasks);
        }
        tasks.push({ text: taskText, status: 'To Do' });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        document.getElementById('taskInput').value = '';
        populateTaskTable();
        alert('Task added successfully!');
    } else {
        alert('Please enter a task before adding!');
    }
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    populateTaskTable();
    alert('Task deleted successfully!');
}

function openEditModal(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const task = tasks[index];
    document.getElementById('editTaskInput').value = task.text;
    document.getElementById('editStatusSelect').value = task.status;
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('saveEditBtn').onclick = function () {
        const updatedTaskText = document.getElementById('editTaskInput').value.trim();
        const updatedStatus = document.getElementById('editStatusSelect').value.trim();
        if (updatedTaskText !== '' && updatedStatus !== '') {
            tasks[index].text = updatedTaskText;
            tasks[index].status = updatedStatus;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            populateTaskTable();
            document.getElementById('editModal').style.display = 'none';
        } else {
            alert('Please enter both task and status.');
        }
    };
}

function populateTaskTable() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const tableBody = document.getElementById('taskTableBody');
    const emptyMessage = document.getElementById('empty-message');
    tableBody.innerHTML = '';
    if (tasks && tasks.length > 0) {
        tasks.forEach((task, index) => {
            const row = document.createElement('tr');
            const numberCell = document.createElement('td');
            numberCell.textContent = index + 1;
            row.appendChild(numberCell);
            const nameCell = document.createElement('td');
            nameCell.textContent = task.text;
            row.appendChild(nameCell);
            const statusCell = document.createElement('td');
            const statusSpan = document.createElement('span');
            if (task.status === 'To Do') {
                statusSpan.classList.add('status-badge', 'todo');
            } else if (task.status === 'In Progress') {
                statusSpan.classList.add('status-badge', 'in-progress');
            } else if (task.status === 'Completed') {
                statusSpan.classList.add('status-badge', 'completed');
            }
            statusSpan.textContent = task.status;
            statusCell.appendChild(statusSpan);
            row.appendChild(statusCell);
            const editCell = document.createElement('td');
            const editIcon = document.createElement('i');
            editIcon.classList.add('fa', 'fa-edit');
            editIcon.onclick = function () {
                openEditModal(index);
            };
            editCell.appendChild(editIcon);
            row.appendChild(editCell);
            const deleteCell = document.createElement('td');
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fa', 'fa-trash-o');
            deleteIcon.onclick = function () {
                deleteTask(index);
            };
            deleteCell.appendChild(deleteIcon);
            row.appendChild(deleteCell);
            tableBody.appendChild(row);
        });
        emptyMessage.style.display = 'none';
    } else {
        emptyMessage.style.display = 'block';
    }
}

// Attach event listener for delete icon click using event delegation
document.getElementById('taskTableBody').addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('fa-trash-o')) {
        const row = event.target.closest('tr');
        const rowIndex = Array.from(row.parentNode.children).indexOf(row);
        deleteTask(rowIndex);
    }
});

// Close the modal when the close button or outside modal area is clicked
document.addEventListener('click', function (event) {
    const modal = document.getElementById('editModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    if (event.target === modal || event.target === closeBtn) {
        modal.style.display = 'none';
    }
});

// Call the function to populate the task table on page load
populateTaskTable();
