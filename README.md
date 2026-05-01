# Personal Productivity App

## Project Description
**Personal Productivity App** is a web application for managing personal tasks.

Features: 

• Add Tasks — create new tasks through an easy-to-use form.

• View Task List — display all tasks with their current status.

• Edit Tasks — modify task title, description, category, or completion status.

• Delete Tasks — remove completed or unnecessary tasks.

• Users — view all registered users and the number of tasks assigned to each.

• Categories — display task categories and the number of related tasks.

## Technologies Used

**Backend:** Go (Golang), GORM, PostgreSQL

**Frontend:** React, React Router, Axios, Bootstrap

## Project Structure
**Backend/**

        ├── main.go              "Application Entry Point"

        ├── models/              "Data Models (Database Schemas)"

        ├── routes/              "API Routing"

        ├── controllers/         "CRUD Logic"

        ├── config/              "Database Connection"
        
        ├── env.example

        └── go.mod                "Module definition file in Go"

**env.example** - in this file we write data for connecting to the database and GROM.

```bash
PostgreSQL DSN for database/sql: DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/your_dbname?sslmode=disable

GORM DSN (can be same as DATABASE_URL): GORM_DATABASE_URL=host=localhost user=postgres password=your_password dbname=your_db_name port=5432 sslmode=disable

Which repository to use: "sql" or "gorm": REPO_DRIVER=gorm

Server port: PORT=8080
```

**Frontend/**

        ├── src/

                ├── pages/
        
                ├── App.js

                ├── index.js


## Future Plans

- Add authentication (login & register)
  
- Add notifications and reminders

## How to Run the Project
### 1. Clone the repository
```bash
git clone https://github.com/your-username/personal-productivity-app.git

cd backend

go mod tidy

go run main.go

cd frontend

npm install

npm start

The backend will run on http://localhost:8080

The frontend will run on http://localhost:3000
