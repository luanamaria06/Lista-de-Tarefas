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

// Função para obter tarefas feitas do localStorage
function getCompletedTasks() {
    return JSON.parse(localStorage.getItem('completedTasks')) || [];
}

// Função para salvar tarefas feitas no localStorage
function saveCompletedTasks(completedTasks) {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

// Função para marcar uma tarefa como feita
function completeTask(taskId) {
    let tasks = getTasks();
    const taskToComplete = tasks.find(task => task.id === taskId);

    if (taskToComplete) {
        // Adiciona a tarefa na lista de feitas
        const completedTasks = getCompletedTasks();
        completedTasks.push({ ...taskToComplete, completedAt: new Date().toLocaleString() });
        saveCompletedTasks(completedTasks);

        // Remove a tarefa da lista principal
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks(tasks);

        renderTasks(); // Atualiza a lista principal
        renderCompletedTasks(); // Atualiza a lista de feitas
    }
}

// Função para renderizar tarefas feitas
function renderCompletedTasks() {
    const completedTasksListElement = document.getElementById('completedTasksList');
    const completedTasks = getCompletedTasks();

    completedTasksListElement.innerHTML = ''; // Limpa a lista atual

    completedTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = `${task.name} (Concluída em: ${task.completedAt})`;
        completedTasksListElement.appendChild(taskItem);
    });
}

// Atualiza a renderização da lista principal para incluir o botão "Marcar como Feita"
function renderTasks() {
    const taskListElement = document.getElementById('taskList');
    const tasks = getTasks();

    taskListElement.innerHTML = ''; // Limpa a lista atual

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.name;

        // Botão "Marcar como Feita"
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Feita';
        completeButton.onclick = () => completeTask(task.id);

        // Botão de exclusão
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = () => deleteTask(task.id);

        taskItem.appendChild(completeButton);
        taskItem.appendChild(deleteButton);
        taskListElement.appendChild(taskItem);
    });
}

// Renderiza as tarefas ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    renderCompletedTasks();
});

// Renderiza as tarefas concluídas com botão de exclusão
function renderCompletedTasks() {
    const completedTasksListElement = document.getElementById('completedTasksList');
    const completedTasks = getCompletedTasks();

    completedTasksListElement.innerHTML = ''; // Limpa a lista atual

    completedTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = `${task.name} (Concluída em: ${task.completedAt})`;

        // Botão de exclusão
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Ícone de lixeira
        deleteButton.onclick = () => deleteCompletedTask(task.id);

        taskItem.appendChild(deleteButton);
        completedTasksListElement.appendChild(taskItem);
    });
}

// Exclui uma tarefa concluída
function deleteCompletedTask(taskId) {
    let completedTasks = getCompletedTasks();

    // Filtra para remover a tarefa pelo ID
    completedTasks = completedTasks.filter(task => task.id !== taskId);
    saveCompletedTasks(completedTasks); // Salva a lista atualizada

    renderCompletedTasks(); // Atualiza a lista de tarefas concluídas
}

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
        name: taskName,
        createdAt: new Date().toLocaleString() // Adiciona data/hora de criação
    };
    
    tasks.push(newTask); // Adiciona a nova tarefa à lista
    saveTasks(tasks);    // Salva as tarefas no localStorage
    renderTasks();       // Atualiza a visualização das tarefas
    taskInput.value = ''; // Limpa o campo de entrada
}

function deleteTask(taskId) {
    let tasks = getTasks();
    const taskToDelete = tasks.find(task => task.id === taskId);

    if (taskToDelete) {
        const deletedTasks = getDeletedTasks();
        deletedTasks.push({ 
            ...taskToDelete, 
            deletedAt: new Date().toLocaleString() // Adiciona data/hora de exclusão
        });
        saveDeletedTasks(deletedTasks);

        // Remove a tarefa da lista principal
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks(tasks);

        renderTasks(); // Atualiza a visualização
    }
}

function renderTasks() {
    const taskListElement = document.getElementById('taskList');
    const tasks = getTasks();

    taskListElement.innerHTML = ''; // Limpa a lista atual

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = `${task.name} (Criada em: ${task.createdAt})`;

        // Botão "Marcar como Feita"
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Feita';
        completeButton.onclick = () => completeTask(task.id);

        // Botão de exclusão
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = () => deleteTask(task.id);

        taskItem.appendChild(completeButton);
        taskItem.appendChild(deleteButton);
        taskListElement.appendChild(taskItem);
    });
}

function renderDeletedTasks() {
    const deletedTasksListElement = document.getElementById('deletedTasksList');
    const deletedTasks = getDeletedTasks();

    deletedTasksListElement.innerHTML = ''; // Limpa a lista atual

    deletedTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = `${task.name} (Criada em: ${task.createdAt}, Excluída em: ${task.deletedAt})`;

        // Botão de restauração
        const restoreButton = document.createElement('button');
        restoreButton.textContent = 'Restaurar';
        restoreButton.onclick = () => restoreTask(task.id);

        taskItem.appendChild(restoreButton);
        deletedTasksListElement.appendChild(taskItem);
    });
}

document.getElementById('taskInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') { // Verifica se a tecla pressionada é o Enter
        addTask(); // Chama a função para adicionar a tarefa
    }
});
