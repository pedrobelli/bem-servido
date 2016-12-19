# Bem Servido

## Dependências do Sistema

Copie o conteúdo deste arquivo e cole em um editor de mark down para uma melhor leitura como o : http://dillinger.io/

[Download](https://nodejs.org/en/download/) e instalação do Node (versão 4.2.4 ou acima);

[Download](http://dev.mysql.com/downloads/mysql/) e [instalação](https://dev.mysql.com/doc/refman/5.5/en/installing.html) do mysql ou [MySQL Workbench](https://dev.mysql.com/doc/refman/5.5/en/installing.html);

  - Executar comandos da raiz do diretório:
    - `npm install -g bower`;
    - `npm install -g nodemon`;
    - `npm install` && `bower install`.

## Configuração

#### Configuração da base de dados

Criar base de dados para o projeto com o nome `bemservido_development` e no arquivo .env configurar o usuário e senha do root de seu mysql:

  - `MYSQL_USER=seu_usuario`;
  - `MYSQL_PASS=sua_senha`.

## Rodando Server

  - `nodemon server drop seed` para realizar uma carga de dados no sistema (é necessário usar este comando ao rodar o sistema pela primeira vez);
    - Os usuários do teste1@gmail.com ao teste4@gmail.com são clientes;
    - Os usuários do teste5@gmail.com ao teste8@gmail.com são profissionais;
    - A senha de todos os usuários é: `123456`;
    - Caso ocorra algum erro ao logar com algum destes usuários, rodar novamente o comando a cima! Caso duas pessoas rodem "ao mesmo   tempo" os dados guardados na nuvem também serão atualizados e os clientes e profissionais cadastrados no db local perdem sua   referência de usuário e senha para login.
  - `nodemon server` para levantar o servidor do sistema.
