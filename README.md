## Mapa de Acessibilidade

Este projeto contém um backend (Node.js/Express) e um frontend (React Native/Expo) para o Mapa de Acessibilidade.

---

### Como rodar o Backend

1. Acesse a pasta do backend:
	```sh
	cd backend
	```
2. Instale as dependências:
	```sh
	npm install
	```
3. Configure o arquivo `.env` conforme necessário.
4. Execute as migrações do banco de dados (se necessário):
	```sh
	npm run migrate
	```
5. Inicie o servidor:
	```sh
	npm run dev
	```
	O backend estará rodando em `http://localhost:3000` (ou porta definida no `.env`).

---

### Como rodar o Frontend

1. Acesse a pasta do frontend:
	```sh
	cd Frontend
	```
2. Instale as dependências:
	```sh
	npm install
	```
3. Inicie o projeto Expo:
	```sh
	npx expo start
	```
4. Siga as instruções do Expo para rodar no emulador Android/iOS ou no seu dispositivo físico (usando o app Expo Go).

---

### Observações
- Certifique-se de que o backend esteja rodando antes de usar o frontend.
- O frontend está configurado para consumir a API do backend localmente. Se necessário, ajuste a URL da API nos arquivos de configuração do frontend.

---

Qualquer dúvida, consulte os READMEs específicos nas pastas `backend` e `Frontend`.
