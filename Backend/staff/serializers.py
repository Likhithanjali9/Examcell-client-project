from rest_framework import serializers
from .models import Batch, Student, Subject, Enrollment, Marks, Result



class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "student_id", "name", "course", "branch"]

class BatchSerializer(serializers.ModelSerializer):
    students = StudentSerializer(many=True, read_only=True)

    class Meta:
        model = Batch
        fields = [
            "batch_id", "name", "start_year", "end_year",
            "current_level","current_semester", "current_academic_year", "status",
            "students", "created_at",
        ]

#---------------- for edits done in batchmanagement api------------------
# serializers.py
from rest_framework import serializers
from .models import Batch

class BatchUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = [
            "name",
            "current_academic_year",
            "status",
        ]


#----------------marks entry---------------------------------------------
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = [
            "id",
            "code",
            "name",
            "credits",
            "level",
            "semester",
            "branch",
            "regulation",
            "subject_type",
            "exam_scheme",
        ]


class EnrollmentSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "semester",
            "subject",
        ]


class MarksSerializer(serializers.ModelSerializer):
    marks_id = serializers.IntegerField(source="id", read_only=True)
    student_id = serializers.CharField(source="enrollment.student.student_id", read_only=True)
    student_name = serializers.CharField(source="enrollment.student.name", read_only=True)
    branch = serializers.CharField(source="enrollment.student.branch", read_only=True)
    semester = serializers.CharField(source="enrollment.semester", read_only=True)
    subject_code = serializers.CharField(source="enrollment.subject.code", read_only=True)
    subject_name = serializers.CharField(source="enrollment.subject.name", read_only=True)
    credits = serializers.IntegerField(source="enrollment.subject.credits", read_only=True)

    entered_by = serializers.CharField(
        source="entered_by.college_email",
        read_only=True
    )

    class Meta:
        model = Marks
        fields = [
            "marks_id",

            # Student info
            "student_id",
            "student_name",
            "branch",
            "semester",

            # Subject info
            "subject_code",
            "subject_name",
            "credits",

            # Marks
            "mid1", "mid2", "mid3",
            "at1", "at2", "at3", "at4",
            "est",

            # Audit
            "entered_by",
            "updated_at",
        ]


class ResultSerializer(serializers.ModelSerializer):
    student_id = serializers.CharField(source="student.student_id", read_only=True)
    student_name = serializers.CharField(source="student.name", read_only=True)

    class Meta:
        model = Result
        fields = [
            "student_id",
            "student_name",
            "semester",
            "sgpa",
            "cgpa",
            "calculated_at",
        ]
