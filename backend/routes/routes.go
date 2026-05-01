package routes

import (
	"net/http"

	"ED/controllers"
	"ED/middleware"

	"github.com/gorilla/mux"
)

// пример:
func NewRouter() *mux.Router {
	r := mux.NewRouter()

	// auth
	r.HandleFunc("/api/register", controllers.Register).Methods("POST")
	r.HandleFunc("/api/login", controllers.Login).Methods("POST")

	// публичные
	r.HandleFunc("/api/categories", controllers.GetCategories).Methods("GET")
	r.HandleFunc("/api/tasks", controllers.GetTasks).Methods("GET")

	// защищённые (нужен JWT)
	authSub := r.PathPrefix("/api").Subrouter()
	authSub.Use(middleware.JWTAuth)
	authSub.HandleFunc("/tasks", controllers.CreateTask).Methods("POST")
	authSub.HandleFunc("/tasks/{id}", controllers.UpdateTask).Methods("PUT")
	authSub.HandleFunc("/tasks/{id}", controllers.GetTask).Methods("GET")
	authSub.HandleFunc("/tasks/{id}", controllers.DeleteTask).Methods("DELETE")
	authSub.HandleFunc("/categories", controllers.CreateCategory).Methods("POST")
	// пример: маршрут только для admin
	adminSub := authSub.PathPrefix("/admin").Subrouter()
	adminSub.Use(func(next http.Handler) http.Handler {
		return middleware.RequireRole("admin", next)
	})
	adminSub.HandleFunc("/users", controllers.GetUsers).Methods("GET")

	return r
}
