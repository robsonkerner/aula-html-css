document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tasksContainer = document.getElementById('tasksContainer');
    const taskForm = document.getElementById('taskForm');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const filterCategory = document.getElementById('filterCategory');
    const filterStatus = document.getElementById('filterStatus');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const jsonFileInput = document.getElementById('jsonFileInput');
    const toastLive = document.getElementById('liveToast');
    const toastMessage = document.getElementById('toastMessage');
    const toast = new bootstrap.Toast(toastLive);

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Initialize modal
    const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));

    // Save Task
    saveTaskBtn.addEventListener('click', function() {
        if (!taskForm.checkValidity()) {
            taskForm.classList.add('was-validated');
            return;
        }

        const taskData = {
            id: Date.now(),
            title: document.getElementById('taskTitle').value,
            category: document.getElementById('taskCategory').value,
            startDate: document.getElementById('taskStart').value,
            endDate: document.getElementById('taskEnd').value,
            color: document.getElementById('taskColor').value,
            description: document.getElementById('taskDescription').value,
            completed: false,
            image: null
        };

        const imageInput = document.getElementById('taskImage');
        if (imageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(e) {
                taskData.image = e.target.result;
                saveTaskToStorage(taskData);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            saveTaskToStorage(taskData);
        }
    });

    function saveTaskToStorage(taskData) {
        tasks.push(taskData);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        taskModal.hide();
        taskForm.reset();
        taskForm.classList.remove('was-validated');
        showToast('Tarefa criada com sucesso!');
    }

    // Render Tasks
    function renderTasks() {
        const categoryFilter = filterCategory.value;
        const statusFilter = filterStatus.value;

        const filteredTasks = tasks.filter(task => {
            if (categoryFilter !== 'all' && task.category !== categoryFilter) {
                return false;
            }

            if (statusFilter === 'pending' && task.completed) {
                return false;
            }
            if (statusFilter === 'completed' && !task.completed) {
                return false;
            }
            if (statusFilter === 'urgent' && !isTaskUrgent(task)) {
                return false;
            }

            return true;
        });

        tasksContainer.innerHTML = '';

        if (filteredTasks.length === 0) {
            tasksContainer.innerHTML = '<div class="col-12 text-center py-5"><p>Não há tarefas cadastradas! Vamos cadastrar uma?</p></div>';
            return;
        }

        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            tasksContainer.appendChild(taskElement);
        });
    }

    function createTaskElement(task) {
        const col = document.createElement('div');
        col.className = 'col';

        const isUrgent = isTaskUrgent(task);

        col.innerHTML = `
            <div class="card task-card" data-id="${task.id}">
                ${task.image ?
            `<img src="${task.image}" class="card-img-top" alt="${task.title}">` :
            `<div class="placeholder-image card-img-top">
                        <i class="bi bi-image"></i>
                    </div>`
        }
                <div class="card-body" style="border-left: 4px solid ${task.color}">
                    ${isUrgent ? '<span class="urgent-badge">Urgente</span>' : ''}
                    <span class="task-category ${task.category}">${task.category === 'aula' ? 'Aula' : 'Projeto'}</span>
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description || 'Sem descrição'}</p>
                    <p class="task-date"><strong>Início:</strong> ${formatDate(task.startDate)}</p>
                    <p class="task-date"><strong>Término:</strong> ${formatDate(task.endDate)}</p>
                    <div class="task-actions">
                        <button class="btn btn-sm ${task.completed ? 'btn-outline-secondary' : 'btn-outline-success'} toggle-complete">
                            ${task.completed ? 'Desfazer' : 'Concluir'}
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-task">Excluir</button>
                    </div>
                </div>
            </div>
        `;

        col.querySelector('.toggle-complete').addEventListener('click', function() {
            toggleTaskComplete(task.id);
        });

        col.querySelector('.delete-task').addEventListener('click', function() {
            showDeleteConfirmation(task.id);
        });

        return col;
    }

    function toggleTaskComplete(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        showToast('Status da tarefa atualizado!');
    }

    function showDeleteConfirmation(taskId) {
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
        const confirmBtn = document.getElementById('confirmDeleteBtn');

        // Remove previous event listeners to avoid duplicates
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        newConfirmBtn.onclick = function() {
            deleteTask(taskId);
            deleteModal.hide();
        };

        deleteModal.show();
    }

    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        showToast('Tarefa excluída com sucesso!');
    }

    function isTaskUrgent(task) {
        if (task.completed) return false;

        const endDate = new Date(task.endDate);
        const today = new Date();
        const oneWeekLater = new Date();
        oneWeekLater.setDate(today.getDate() + 7);

        return endDate <= oneWeekLater && endDate >= today;
    }

    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }

    function showToast(message) {
        toastMessage.textContent = message;
        toast.show();
    }

    // Export/Import
    exportBtn.addEventListener('click', function() {
        const dataStr = JSON.stringify(tasks, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'taskskampus-tarefas.json');
        linkElement.click();

        showToast('Tarefas exportadas com sucesso!');
    });

    // Import Tasks
    importBtn.addEventListener('click', function() {
        jsonFileInput.click();
    });

    jsonFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedTasks = JSON.parse(e.target.result);

                if (!Array.isArray(importedTasks)) {
                    throw new Error('Formato de arquivo inválido');
                }

                // Atualiza o modal com o número de tarefas
                document.getElementById('taskCount').textContent = importedTasks.length;

                // Configura o modal de confirmação
                const importModal = new bootstrap.Modal(document.getElementById('importConfirmModal'));
                const confirmBtn = document.getElementById('confirmImportBtn');

                // Remove event listeners anteriores
                const newConfirmBtn = confirmBtn.cloneNode(true);
                confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

                newConfirmBtn.onclick = function() {
                    tasks = importedTasks;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    renderTasks();
                    importModal.hide();
                    showToast('Tarefas importadas com sucesso!');
                    jsonFileInput.value = ''; // Limpa o input para permitir reimportação
                };

                importModal.show();

            } catch (error) {
                showToast('Erro ao importar: ' + error.message);
                jsonFileInput.value = ''; // Limpa o input mesmo em caso de erro
            }
        };
        reader.readAsText(file);
    });

    // Filters
    filterCategory.addEventListener('change', renderTasks);
    filterStatus.addEventListener('change', renderTasks);

    // Initial render
    renderTasks();
});
