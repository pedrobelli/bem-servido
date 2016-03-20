# Bem Servido

##Dependências do Sistema

Realizar [cadastro](https://github.com/join?source=header-home) no GitHub e [adicionar](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/) uma chave SSH em sua conta;

[Download](https://git-for-windows.github.io/) e instalação do Git Bash;

[Download](https://nodejs.org/en/download/) e instalação do Node (versão 4.2.4 ou acima);

[Download](http://dev.mysql.com/downloads/mysql/) e [instalação](https://dev.mysql.com/doc/refman/5.5/en/installing.html) do mysql ou [MySQL Workbench](https://dev.mysql.com/doc/refman/5.5/en/installing.html);

Executar comandos da raiz do diretório:
  - Clonar o repositório;
  - Para configuração do git:
    - `git config --global user.name "Seu Nome"`;
    - `git config --global user.email seu_email@example.com`;
    - `git config --global pull.rebase true`.  
  - Para setup do projeto:
    - `npm install` && `bower install`.

##Configuração

#### Configuração da base de dados

Criar base de dados para o projeto com o nome `bemservido_development` e no caminho .env configurar o usuário e senha do root de seu mysql:

  - `MYSQL_USER=seu_usuario`
  - `MYSQL_PASS=sua_senha`

##Rodando Server

 - `nodemon server.js`
