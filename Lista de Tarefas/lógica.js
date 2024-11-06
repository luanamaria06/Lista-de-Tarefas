// Função para obter tarefas do localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Função para salvar tarefas no localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para excluir uma tarefa e movê-la para a lixeira
function deleteTask(taskId) {
    let tasks = getTasks();
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    if (taskToDelete) {
        // Adiciona a tarefa excluída na lista de tarefas excluídas
        const deletedTasks = getDeletedTasks();
        deletedTasks.push(taskToDelete);
        saveDeletedTasks(deletedTasks);

        // Remove a tarefa da lista principal
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks(tasks);
        
        renderTasks(); // Atualiza a visualização
    }
}

// Função para adicionar uma nova tarefa
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskName = taskInput.value.trim();

    if (taskName === '') {
        alert('Por favor, insira uma tarefa.');
        return;
    }

    const tasks = getTasks();
    const newTask = {
        id: Date.now(), // Usar timestamp como ID único
        name: taskName
    };
    
    tasks.push(newTask); // Adiciona a nova tarefa à lista
    saveTasks(tasks);    // Salva as tarefas no localStorage
    renderTasks();       // Atualiza a visualização das tarefas
    taskInput.value = ''; // Limpa o campo de entrada
}

// Renderiza as tarefas na lista
function renderTasks() {
    const taskListElement = document.getElementById('taskList');
    const tasks = getTasks();
    
    taskListElement.innerHTML = ''; // Limpa a lista atual

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.name;
        
        // Botão de exclusão
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';// Emoji de lixeira
        deleteButton.onclick = () => deleteTask(task.id); // Adiciona o evento de clique

        taskItem.appendChild(deleteButton);
        taskListElement.appendChild(taskItem);
    });
}

// Renderiza as tarefas ao carregar a página
document.addEventListener('DOMContentLoaded', renderTasks);

// Função para obter tarefas excluídas do localStorage
function getDeletedTasks() {
    return JSON.parse(localStorage.getItem('deletedTasks')) || [];
}

// Função para salvar tarefas excluídas no localStorage
function saveDeletedTasks(deletedTasks) {
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
}

// Função para renderizar as tarefas excluídas
function renderDeletedTasks() {
    const deletedTasksListElement = document.getElementById('deletedTasksList');
    const deletedTasks = getDeletedTasks();

    deletedTasksListElement.innerHTML = ''; // Limpa a lista atual

    deletedTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.name;
        
        // Botão de restauração
        const restoreButton = document.createElement('button');
        restoreButton.textContent = 'Restaurar';
        restoreButton.onclick = () => restoreTask(task.id);

        taskItem.appendChild(restoreButton);
        deletedTasksListElement.appendChild(taskItem);
    });
}

// Função para restaurar uma tarefa excluída
function restoreTask(taskId) {
    const deletedTasks = getDeletedTasks();
    const taskIndex = deletedTasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        const tasks = getTasks();
        tasks.push(deletedTasks[taskIndex]); // Move a tarefa de volta para a lista de tarefas
        deletedTasks.splice(taskIndex, 1); // Remove a tarefa da lista de excluídas

        saveTasks(tasks); // Salva a lista atualizada de tarefas
        saveDeletedTasks(deletedTasks); // Salva a lista atualizada de tarefas excluídas

        renderTasks(); // Atualiza a visualização na página da lista
        renderDeletedTasks(); // Atualiza a visualização na página da lixeira
    }
}


// Renderiza as tarefas excluídas ao carregar a página
document.addEventListener('DOMContentLoaded', renderDeletedTasks);
