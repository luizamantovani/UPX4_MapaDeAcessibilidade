# teste-crud-node-typescript

Aplicação CRUD utilizando Node.js, TypeScript, Express e Drizzle ORM com PostgreSQL.

## Funcionalidades
- CRUD completo
- Migração e seed de banco de dados
- Integração com Docker
- Segurança com Helmet e CORS
- Logger com Pino

## Requisitos
- Node.js >= 18
- Docker (opcional, para ambiente containerizado)
- PostgreSQL

## Instalação
```bash
npm install
```

## Configuração
Crie um arquivo `.env` com as variáveis de ambiente necessárias, por exemplo:
```env
DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco
```

## Scripts principais
- `npm run start` — Inicia a aplicação
- `npm run start:dev` — Inicia em modo desenvolvimento
- `npm run build` — Compila o projeto
- `npm run db:generate` — Gera a pasta drizzle com o SQL de criação de tabelas
- `npm run db:migrate` — Executa as migrações
- `npm run db:seed` — Popula o banco com dados de exemplo
- `npm run db:studio` — Abre o Drizzle Studio

## Migrações
Os arquivos de migração SQL estão em `drizzle/`. Para rodar as migrações:
```bash
npm run db:migrate
```

## Docker
Para subir o ambiente com Docker:
```bash
docker-compose up
```

## Estrutura de Pastas
```
├── src/
│   ├── index.ts
│   ├── db/
│   ├── utils/
├── drizzle/
├── docker-compose.yaml
├── package.json
├── tsconfig.json
```

## Autor
Gabriel Rodrigues
