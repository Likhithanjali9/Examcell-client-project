from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count

from .models import Batch, Subject, Marks, ExamStatus


@api_view(["GET"])
#@permission_classes([IsAuthenticated])
def analytics_dashboard(request):

    batch_data = []
    semester_data = []
    subject_data = []

    active_batches = Batch.objects.filter(status="Active")

    for batch in active_batches:

        subjects = Subject.objects.filter(
            regulation=batch.batch_id,
            level=batch.current_level
        )

        total_subjects = subjects.count()
        completed_subjects = 0

        for subject in subjects:

            marks_qs = Marks.objects.filter(
                enrollment__batch=batch,
                enrollment__subject=subject
            )

            total_records = marks_qs.count()
            filled_records = 0

            for m in marks_qs:
                subject_type = m.enrollment.subject.subject_type

                if subject_type == "THEORY":
                    if m.est and m.est > 0:
                        filled_records += 1

                elif subject_type in ["LAB", "PROJECT", "ELECTIVE"]:
                    if m.internal and m.external:
                        filled_records += 1

                elif subject_type == "INTERNSHIP":
                    if m.external:
                        filled_records += 1

            percent = round(
                (filled_records / total_records) * 100, 2
            ) if total_records else 0
            if percent > 100:
                percent = 100

            is_completed = percent == 100

            if is_completed:
                completed_subjects += 1

            subject_data.append({
                "batch_id": batch.batch_id,
                "semester": subject.semester,
                "subject_code": subject.code,
                "subject_name": subject.name,
                "branch": subject.branch,
                "completion_percent": percent,
                "is_completed": is_completed
            })

        overall_percent = round(
            (completed_subjects / total_subjects) * 100, 2
        ) if total_subjects else 0

        batch_data.append({
            "batch_id": batch.batch_id,
            "level": batch.current_level,
            "overall_completion_percent": overall_percent,
            "total_subjects": total_subjects,
            "completed_subjects": completed_subjects,
            "is_fully_completed": overall_percent == 100
        })

    return Response({
        "batch_level": batch_data,
        "semester_level": semester_data,
        "subject_level": subject_data
    })