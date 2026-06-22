# 🔥 IgnitionMotors

**IgnitionMotors** é uma aplicação web de marketplace de veículos, desenvolvida como projeto fullstack com Angular no frontend e Spring Boot no backend. A plataforma permite que usuários anunciem, pesquisem e visualizem veículos à venda de forma intuitiva e moderna.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Como Executar](#como-executar)
- [Funcionalidades](#funcionalidades)
- [Contribuição](#contribuição)

---

## Sobre o Projeto

O IgnitionMotors nasceu como um projeto acadêmico de Análise e Desenvolvimento de Sistemas, com o objetivo de simular um marketplace real de compra e venda de veículos. A aplicação conta com uma interface responsiva e um backend RESTful com persistência em banco de dados relacional.

---

## Tecnologias Utilizadas

### Frontend
- [Angular](https://angular.io/) — Framework SPA para construção da interface
- TypeScript
- SCSS — Estilização modular e responsiva
- HTML5

### Backend
- [Java](https://www.java.com/) com [Spring Boot](https://spring.io/projects/spring-boot) — API REST
- Spring Data JPA — Camada de persistência
- Spring Web MVC — Controladores REST
- [MySQL](https://www.mysql.com/) — Banco de dados relacional

---

## Estrutura do Projeto

```
IgnitionMotors/
├── api/                  # Backend Spring Boot
│   └── src/
│       ├── main/
│       │   ├── java/     # Código-fonte Java (controllers, services, repositories)
│       │   └── resources/
│       │       └── application.properties
│       └── test/
│
└── web/
    └── ignitionWeb/      # Frontend Angular
        ├── src/
        │   ├── app/      # Componentes, serviços e módulos
        │   ├── assets/
        │   └── environments/
        ├── angular.json
        └── package.json
```

---

## Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (v18+) e npm
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
- [Java JDK](https://adoptium.net/) (17+)
- [Maven](https://maven.apache.org/)
- [MySQL](https://www.mysql.com/) (v8+)

---

## Como Executar

### 1. Clonar o repositório

```bash
git clone https://github.com/CaioTBarbieri/IgnitionMotors.git
cd IgnitionMotors
```

### 2. Configurar o banco de dados

Crie o banco de dados no MySQL:

```sql
CREATE DATABASE ignitionmotors;
```

Edite o arquivo `api/src/main/resources/application.properties` com suas credenciais:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ignitionmotors
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
```

### 3. Executar o Backend

```bash
cd api
mvn spring-boot:run
```

> A API estará disponível em: `http://localhost:8080`

### 4. Executar o Frontend

```bash
cd web/ignitionWeb
npm install
ng serve
```

> A aplicação estará disponível em: `http://localhost:4200`

---

## Funcionalidades

- 🚗 Listagem de veículos disponíveis
- 🔍 Busca e filtragem de anúncios
- 📄 Visualização detalhada de cada veículo
- 📝 Cadastro de novos anúncios
- 🎨 Interface responsiva com design moderno

---

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Commit suas alterações (`git commit -m 'feat: adiciona minha feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

## Autor

**Caio Barbieri**  
Estudante de Análise e Desenvolvimento de Sistemas  
[GitHub](https://github.com/CaioTBarbieri)

---

> Projeto desenvolvido para fins acadêmicos.
