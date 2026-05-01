package middleware

import (
	"net/http"
)

func RequireRole(role string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims := GetClaims(r)
		if claims == nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		if claims.Role != role {
			http.Error(w, "forbidden: insufficient role", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}
