# IgnitionMotors

IgnitionMotors e uma aplicacao web fullstack para anuncios de veiculos. O projeto funciona como uma vitrine onde usuarios podem cadastrar, pesquisar, filtrar, visualizar, editar e excluir seus proprios anuncios.

## Tecnologias

### Frontend

- Angular
- TypeScript
- SCSS
- Vercel para deploy

### Backend

- Java 21
- Spring Boot
- Spring Security com JWT
- Spring Data JPA
- PostgreSQL
- Docker
- Render para deploy

## Estrutura

```txt
IgnitionMotors/
  api/                 # Backend Spring Boot
    Dockerfile
    pom.xml
    src/

  web/
    ignitionWeb/       # Frontend Angular
      package.json
      angular.json
      src/
```

## Deploy

### Frontend

O frontend esta publicado na Vercel.

```txt
Root Directory: web/ignitionWeb
Build Command: npm run build
Output Directory: dist/ignition-web/browser
```

### Backend

O backend esta preparado para deploy no Render usando Docker.

```txt
Root Directory: api
Runtime: Docker
```

O Render usa o arquivo:

```txt
api/Dockerfile
```

### Banco de dados

O banco usado em producao e PostgreSQL no Render.

Variaveis de ambiente necessarias no servico da API:

```txt
SPRING_DATASOURCE_URL=jdbc:postgresql://HOST:PORT/DATABASE?sslmode=require
SPRING_DATASOURCE_USERNAME=usuario
SPRING_DATASOURCE_PASSWORD=senha
JWT_SECRET=chave-secreta-para-token-jwt
CORS_ALLOWED_ORIGINS=http://localhost:4200,https://seu-front.vercel.app
```

## Rodando localmente

### Pre-requisitos

- Node.js e npm
- Java 21
- Maven
- PostgreSQL

### Backend

Crie um banco PostgreSQL local chamado `ignitionmotors` ou configure as variaveis de ambiente para apontar para outro banco.

Valores padrao usados localmente:

```txt
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/ignitionmotors
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
JWT_SECRET=minha-chave-secreta-e-super-segura-do-ignition-motors
CORS_ALLOWED_ORIGINS=http://localhost:4200
```

Para iniciar a API:

```bash
cd api
mvn spring-boot:run
```

A API ficara disponivel em:

```txt
http://localhost:8080
```

### Frontend

```bash
cd web/ignitionWeb
npm install
npm start
```

O frontend ficara disponivel em:

```txt
http://localhost:4200
```

## Docker

Para gerar a imagem Docker da API:

```bash
cd api
docker build -t ignitionmotors-api .
```

Para rodar a imagem, informe as variaveis de ambiente:

```bash
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL="jdbc:postgresql://host.docker.internal:5432/ignitionmotors" \
  -e SPRING_DATASOURCE_USERNAME="postgres" \
  -e SPRING_DATASOURCE_PASSWORD="postgres" \
  -e JWT_SECRET="minha-chave-local" \
  -e CORS_ALLOWED_ORIGINS="http://localhost:4200" \
  ignitionmotors-api
```

## Funcionalidades

- Cadastro e login de usuarios
- Autenticacao com JWT
- Listagem de veiculos
- Busca por marca e modelo
- Filtros por marca, ano, preco, quilometragem e potencia
- Cadastro de anuncios com imagens
- Edicao e exclusao apenas pelo criador do anuncio
- Perfil com informacoes do usuario e suas postagens
- Alteracao de senha pelo perfil

## Autor

Caio Barbieri

Projeto desenvolvido para fins academicos.
