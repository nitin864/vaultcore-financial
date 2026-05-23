# VaultCore Financial

A full-stack financial management and authentication system built using Spring Boot, React, PostgreSQL, and JWT Authentication.

## 🚀 Tech Stack

### Backend
- Java
- Spring Boot
- Spring Security
- JWT Authentication
- PostgreSQL
- Maven

### Frontend
- React.js
- Vite
- Axios
- React Router

---

# 📁 Project Structure

```bash
vaultcore/
├── frontend/        # React Frontend
├── src/             # Spring Boot Backend Source
├── pom.xml
├── mvnw
└── README.md
```

---

# ⚙️ Backend Setup

## 1. Clone Repository

```bash
git clone https://github.com/nitin864/vaultcore-financial.git
cd vaultcore
```

---

## 2. Configure PostgreSQL

Create database:

```sql
CREATE DATABASE vaultcore_db;
```

---

## 3. Configure application.properties

Location:

```bash
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/vaultcore_db
spring.datasource.username=postgres
spring.datasource.password=letmein

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## 4. Run Backend

Linux / Mac:

```bash
./mvnw spring-boot:run
```

Windows:

```bash
mvnw.cmd spring-boot:run
```

Backend runs on:

```bash
http://localhost:8080
```

---

# 💻 Frontend Setup

## 1. Go to frontend folder

```bash
cd frontend
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Start frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🔐 Authentication

VaultCore uses JWT Authentication with Spring Security.

Features:
- Login Authentication
- JWT Token Generation
- Role Based Authorization
- Protected Routes
- BCrypt Password Encryption

---

# 👨‍💻 Default Users

| Username | Password |
|----------|----------|
| admin | admin |
| nitin | 1234 |
| root | root |
| manager | manager |

---

# 📡 API Base URL

```bash
http://localhost:8080/api
```

---

# 🛠 Features

- JWT Authentication
- Role Based Access
- Secure Password Encryption
- REST API Architecture
- PostgreSQL Integration
- React Frontend
- Spring Security
- Responsive UI

---

# 📌 Future Improvements

- Refresh Tokens
- Docker Deployment
- CI/CD Integration
- Cloud Deployment
- Financial Analytics Dashboard
- User Profile Management

---

# 📜 License

This project is open source and available under the MIT License.

---

 
