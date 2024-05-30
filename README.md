# Food Tribe Back

## Tech stack

![TypeScript](https://img.shields.io/badge/Typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white) ![AdonisJS](https://img.shields.io/badge/AdonisJS_6-%23220052.svg?style=flat&logo=adonisjs&logoColor=white) ![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?style=flate&logo=node.js&logoColor=white)
![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?style=flat&logo=postgresql&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=flat&logo=eslint&logoColor=white) ![Bun](https://img.shields.io/badge/Bun-14151A.svg?style=flat&logo=Bun&logoColor=white)

## Requirements

- Node >= 21
- typescript
- postgresql

- Bun: https://bun.sh/
```bash
brew tap oven-sh/bun
brew install bun
```

- Foreman: https://github.com/ddollar/foreman
```bash
gem install foreman
```

## Development

- **(ℹ️ only for first setup)** Create manually your DB via psql or TablePlus
 - Open psql console: `psql postgres`
 - Create DB: `CREATE DATABASE db_name;`
 - Grant privileges to your DB: `GRANT ALL PRIVILEGES ON DATABASE db_name TO developer;`
- Run `./scripts/reset-db` to setup database and seed
- Run `./scripts/dev` to start development server

## Tools

- ESlint
- Prettier
