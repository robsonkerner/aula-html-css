 🧠 Git Básico – Comandos Essenciais
 
 Este guia contém os comandos Git mais utilizados, com explicações curtas e exemplos práticos para facilitar o uso no dia a dia de desenvolvimento.
 
 ---
 
 ## 📁 1. Inicializar Repositório
 
 Cria um novo repositório Git local.
 
 ```bash
 git init
 ```
 
 ---
 
 ## 📥 2. Clonar Repositório
 
 Clona um repositório remoto para sua máquina.
 
 ```bash
 git clone https://github.com/usuario/repositorio.git
 ```
 
 ---
 
 ## 📋 3. Verificar Status
 
 Exibe o estado atual dos arquivos do projeto (modificados, não rastreados, prontos para commit etc.).
 
 ```bash
 git status
 ```
 
 ---
 
 ## ➕ 4. Adicionar Arquivos
 
 Adiciona arquivos para a área de staging (preparar para commit).
 
 ```bash
 git add index.html
 ```
 
 Adicionar todos os arquivos modificados:
 
 ```bash
 git add .
 ```

Remover arquivo da Staging Area
```bash
git restore --staged nome_do_arquivo
```
Para remover todos os arquivos adicionados:
```bash
git restore --staged .
```
 ---
 
 ## 💾 5. Fazer Commit
 
 Salva as alterações no histórico local com uma mensagem.
 
 ```bash
 git commit -m "Mensagem descritiva do commit"
 ```

| Objetivo                                            | Comando                    |
| --------------------------------------------------- | -------------------------- |
| Cancelar último commit, manter alterações e staging | `git reset --soft HEAD~1`  |
| Cancelar commit, manter alterações (sem staging)    | `git reset --mixed HEAD~1` |
| Apagar commit e alterações (⚠️)                     | `git reset --hard HEAD~1`  |
| Desfazer commit com anti-commit                     | `git revert <hash>`        | 

 ---
 
 ## 🚀 6. Enviar para o Repositório Remoto
 
 Envia os commits locais para a branch remota (ex: `main` ou `master`).
 
 ```bash
 git push origin main
 ```
 
 ---
 
 ## 🔄 7. Atualizar com o Repositório Remoto
 
 Puxa as mudanças mais recentes do repositório remoto.
 
 ```bash
 git pull origin main
 ```
 
 ---
 
 ## 📜 8. Ver Histórico de Commits
 
 Mostra a lista de commits realizados no projeto.
 
 ```bash
 git log
 ```
 
 ---
 
 ## 🌿 9. Ver Branches
 
 Lista todas as branches existentes no repositório e indica em qual você está.
 
 ```bash
 git branch
 ```
 
 ---
 
 ## 🌱 10. Criar e Mudar para Nova Branch
 
 Cria uma nova branch e muda automaticamente para ela.
 
 ```bash
 git checkout -b nome-da-branch
 ```
 
 ---
 
 ## 📌 Dica Final
 
 Para manter seu repositório limpo e organizado, faça commits frequentes e use mensagens claras e objetivas.
 
 ---
 
 🛠️ **Versão:** 1.0  
 📅 **Última atualização:** Junho/2025  
 👨‍💻 **Autor:** [Seu Nome Aqui]
