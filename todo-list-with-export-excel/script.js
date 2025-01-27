let todos = [];

function addTodo() {
    const input = document.getElementById('todoInput');
    const todoText = input.value.trim();
    if (todoText) {
        todos.push(todoText);
        input.value = '';
        renderTodos();
    }
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    const noTask = document.getElementById('noTask');
    todoList.innerHTML = '';
    if (todos.length === 0) {
        noTask.style.display = 'block';
    } else {
        noTask.style.display = 'none';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${todo}</span><button onclick="deleteTodo(${index})">Delete</button>`;
            todoList.appendChild(li);
        });
    }
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

function exportToExcel() {
    if (todos.length === 0) {
        alert('No tasks to export!');
        return;
    }

    let table = '<table border="1"><tr><th>Task</th></tr>';
    todos.forEach(todo => {
        table += `<tr><td>${todo}</td></tr>`;
    });
    table += '</table>';

    const dataType = 'application/vnd.ms-excel';
    const blob = new Blob([table], { type: dataType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todo-list.xls';
    a.click();
    URL.revokeObjectURL(url);
}

// Initial render with no tasks
renderTodos();