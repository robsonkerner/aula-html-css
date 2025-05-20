// Array para armazenar as tarefas na memória durante a execução
let tarefas = [];

// Seleciona elementos do HTML pelo ID para manipular depois
const form = document.getElementById('taskForm');          // Formulário de criação de tarefa
const lista = document.getElementById('taskList');          // UL onde as tarefas serão listadas
const themeBtn = document.getElementById('toggleTheme');    // Botão para alternar tema claro/escuro
const exportBtn = document.getElementById('exportTasks');   // Botão para exportar tarefas em arquivo
const importBtn = document.getElementById('importTasks');   // Botão para abrir seletor de arquivo para importar
const importFile = document.getElementById('importFile');   // Input tipo file escondido para importar arquivo JSON

// Evento que escuta o clique no botão de tema
themeBtn.addEventListener('click', () => {
    // Alterna a classe 'dark' no body, ativando/desativando o modo escuro via CSS
    document.body.classList.toggle('dark');
});

// Evento que escuta o envio do formulário (quando o usuário cria uma tarefa)
form.addEventListener('submit', e => {
    e.preventDefault(); // Evita que o formulário recarregue a página (comportamento padrão)

    // Pega os valores dos campos do formulário
    const titulo = document.getElementById('taskTitle').value;
    const data = document.getElementById('taskDate').value;
    const cor = document.getElementById('taskColor').value;

    // Cria um objeto tarefa com ID único (timestamp), dados do formulário e status inicial (não concluída)
    const nova = {
        id: Date.now(),
        titulo,
        dataEntrega: data,
        cor,
        concluida: false
    };

    // Adiciona a nova tarefa ao array tarefas
    tarefas.push(nova);

    // Reseta os campos do formulário para vazio, preparando para nova entrada
    form.reset();

    // Atualiza a lista visível chamando a função de renderização
    renderizar();
});

// Função para renderizar (atualizar) a lista de tarefas na tela
function renderizar() {
    // Limpa o conteúdo atual da lista para evitar duplicação
    lista.innerHTML = '';

    // Percorre todas as tarefas do array
    tarefas.forEach(tarefa => {
        // Cria um elemento <li> para representar a tarefa
        const li = document.createElement('li');

        // Define a cor da borda esquerda do <li> com base na cor escolhida da tarefa
        li.style.borderLeftColor = tarefa.cor;

        // Se a tarefa estiver marcada como concluída, adiciona uma classe CSS para alterar o estilo (ex: riscado)
        if (tarefa.concluida) li.classList.add('completed');

        // Define o conteúdo interno do <li>, com título, data de entrega e botões de ação
        li.innerHTML = `
      <div>
        <strong>${tarefa.titulo}</strong><br/>
        <small>Entrega: ${tarefa.dataEntrega}</small>
      </div>
      <div class="task-actions">
        <button onclick="marcar(${tarefa.id})">✔</button>  <!-- Botão para marcar/desmarcar como concluída -->
        <button onclick="excluir(${tarefa.id})">🗑</button>  <!-- Botão para excluir a tarefa -->
      </div>
    `;

        // Adiciona o <li> criado dentro da lista no DOM
        lista.appendChild(li);
    });
}

// Função que marca ou desmarca uma tarefa como concluída
function marcar(id) {
    // Encontra a tarefa no array que possui o ID passado como parâmetro
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        // Alterna o status 'concluida' (se estava true vira false, se estava false vira true)
        tarefa.concluida = !tarefa.concluida;
        // Atualiza a lista na tela
        renderizar();
    }
}

// Função que exclui uma tarefa do array e atualiza a lista na tela
function excluir(id) {
    // Filtra o array removendo a tarefa cujo id é igual ao passado, retornando um novo array sem ela
    tarefas = tarefas.filter(t => t.id !== id);
    // Atualiza a lista na tela
    renderizar();
}

// Evento de clique no botão de exportar tarefas
exportBtn.addEventListener('click', () => {
    // Cria um Blob (arquivo em memória) com os dados das tarefas convertidos para JSON formatado
    const blob = new Blob([JSON.stringify(tarefas, null, 2)], { type: 'application/json' });

    // Gera uma URL temporária para o Blob, para ser usada no link para download
    const url = URL.createObjectURL(blob);

    // Cria dinamicamente um elemento <a> para disparar o download
    const a = document.createElement('a');
    a.href = url;                 // Link para o arquivo Blob
    a.download = 'tarefas.json';  // Nome do arquivo que será salvo
    a.click();                   // Simula o clique para iniciar o download

    // Libera a URL criada para o Blob para evitar vazamento de memória
    URL.revokeObjectURL(url);
});

// Evento de clique no botão de importar tarefas
importBtn.addEventListener('click', () => {
    // Abre o seletor de arquivos oculto para o usuário escolher um arquivo JSON
    importFile.click();
});

// Evento disparado quando um arquivo é selecionado no input file
importFile.addEventListener('change', e => {
    // Pega o arquivo selecionado (primeiro arquivo da lista)
    const file = e.target.files[0];
    if (!file) return; // Se não tiver arquivo, sai da função

    // Cria um FileReader para ler o conteúdo do arquivo selecionado
    const reader = new FileReader();

    // Quando o arquivo terminar de ser lido com sucesso, executa essa função
    reader.onload = event => {
        try {
            // Tenta fazer o parse do conteúdo do arquivo para um objeto JS
            const dados = JSON.parse(event.target.result);

            // Verifica se o conteúdo é um array (esperado)
            if (Array.isArray(dados)) {
                // Atualiza o array tarefas com os dados importados
                tarefas = dados;
                // Atualiza a lista na tela
                renderizar();
            } else {
                // Se o arquivo não for um array, avisa o usuário que o formato é inválido
                alert("Formato de arquivo inválido.");
            }
        } catch {
            // Se der erro ao fazer parse (ex: JSON inválido), avisa o usuário
            alert("Erro ao importar. Verifique o arquivo.");
        }
    };

    // Inicia a leitura do arquivo como texto
    reader.readAsText(file);
});
