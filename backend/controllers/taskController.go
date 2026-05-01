package controllers

import (
	"encoding/json"
	"net/http"
	_ "strconv"

	"ED/config"
	"ED/models"

	"github.com/gorilla/mux"
)

// create task

func CreateTask(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := config.DB.Create(&task).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(task)
}

// get all tasks

func GetTasks(w http.ResponseWriter, r *http.Request) {
	var tasks []models.Task
	config.DB.Preload("User").Preload("Category").Find(&tasks)
	json.NewEncoder(w).Encode(tasks)
}

// get one task

func GetTask(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var task models.Task
	if err := config.DB.Preload("User").Preload("Category").First(&task, id).Error; err != nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(task)
}

// update

func UpdateTask(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var task models.Task
	if err := config.DB.First(&task, id).Error; err != nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	config.DB.Save(&task)
	json.NewEncoder(w).Encode(task)
}

// delete

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	if err := config.DB.Delete(&models.Task{}, id).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
