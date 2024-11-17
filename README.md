### Wallet.io 💸

# Para rodar o projeto, siga estes passos:

- Instale o mySQL Workbench
- Crie um banco de dados chamado "wallet_io" em sua máquina
  ```
  CREATE DATABASE wallet_io;
  ```
- Instale o Node na sua máquina (Preferencialmente a versão 18 para evitar bugs)
- Clone o repositório para uma pasta
- Crie um arquivo .env com a mesma estrutura do exemplo (.env.example), substituindo todos os placeholders por valores reais que correspondem a realidade
- Instale as dependências do projeto
  ```
  npm i
  ```
- Execute o projeto em modo de desenvolvimento
  ```
  npm run start-dev
  ```

<b>❗Aviso: O projeto executa migrations automaticamente então quando a aplicação iniciar, o banco já estará em sua máquina. </b>

  <br>

# Para experimentar os endpoints, siga estes passos:

- Primeiramente, acesse o endpoint de login (utilizando a porta que corresponde à sua realidade): localhost:3000/api/google/auth
- Se você for redirecionado para localhost:3000/home, deu tudo certo. Quando você acessar outras rotas da aplicação, já estará logado e sua sessão, ativa.
- Para experimentar o usuário logado, acesse: localhost:3000/api/status Esta página exibirá as informações do seu cadastro.
- Para deslogar, use: localhost:3000/api/google/logout

  # Boa sorte 💸
