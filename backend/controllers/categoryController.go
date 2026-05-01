package controllers

import (
	"encoding/json"
	"net/http"

	"ED/config"
	"ED/models"
)

// create category

func CreateCategory(w http.ResponseWriter, r *http.Request) {
	var category models.Category
	if err := json.NewDecoder(r.Body).Decode(&category); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := config.DB.Create(&category).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(category)
}

// get categories

func GetCategories(w http.ResponseWriter, r *http.Request) {
	var categories []models.Category
	config.DB.Preload("Tasks").Find(&categories)
	json.NewEncoder(w).Encode(categories)
}
