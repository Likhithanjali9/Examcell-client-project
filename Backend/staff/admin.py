from django.contrib import admin

# Register your models here.
from .models import (
    CustomUser,
    Faculty,
    Batch,
    Student,
    Subject,
    Enrollment,
    Marks,
    ExamStatus,
    ActivityLog,
    Notification,
)

admin.site.register(CustomUser)
admin.site.register(Faculty)
admin.site.register(Batch)
admin.site.register(Student)
admin.site.register(Subject)
admin.site.register(Enrollment)
admin.site.register(Marks)
admin.site.register(ExamStatus)
admin.site.register(ActivityLog)
admin.site.register(Notification)