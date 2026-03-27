from rest_framework.permissions import BasePermission

class IsCOE(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "coe"

class IsFaculty(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "faculty"