# SendSESMailFromCSV

Enviar e-mails de nunca foi tão fácil, utilizando este repositório você poderá dsitribuir e-mails de forma rápida utilizando o SES da AWS.

## Como disparar meus e-mails?

1. Criar template de E-mail
3. Abrir o projeto no VSCode
3. Salvar a sua planilha com os e-mails no formato CSV separado por virgulas
4. Instalar os modulos da aplicação usando o comando npm i
5. Alterar o arquivo Config.js para ficar de acordo com as configurações de e-mail que você deseja - importante deixar o parametro isParallel como  false, ele é utilizando somente quando temos bases muito grandes
6. Realizar o envio do e-mail utilizando o comando npm start
