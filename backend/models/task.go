// models/task.go
package models

type Task struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`

	UserID uint `json:"user_id"`
	User   User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"user"`

	CategoryID *uint     `json:"category_id"`
	Category   *Category `gorm:"foreignKey:CategoryID;constraint:OnDelete:SET NULL" json:"category"`
}
