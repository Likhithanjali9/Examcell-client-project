from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Batch, Student, Marks, ExamStatus
from .models import MarksHistory, Notification
from django.utils import timezone
from .models import *
from .models import Subject
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .permissions import IsCOE

@api_view(["GET"])
def dashboard_data(request):
    user = request.user

    # -------- ROLE DETECTION ----------
    role = getattr(user, "role", "coe")  # temporary fallback

    # -------- STATS ----------
    active_batches = Batch.objects.filter(status="Active")
    active_students = Student.objects.filter(batch__in=active_batches).count()

    active_exams = ExamStatus.objects.filter(
        is_active=True,
        batch__in=active_batches
    )

    from .models import Subject

    total_subjects = 0
    completed_subjects = 0

    for exam in active_exams:

        subjects = Subject.objects.filter(
            level=exam.level,
            semester=exam.semester
        )

        for subject in subjects:

            marks_qs = Marks.objects.filter(
                enrollment__batch=exam.batch,
                enrollment__semester=exam.semester,
                enrollment__subject=subject
            )

            total_students = marks_qs.count()

            filled = marks_qs.exclude(
                **{f"{exam.exam_type.lower()}": 0}
            ).count()

            total_subjects += 1

            if total_students > 0 and filled == total_students:
                completed_subjects += 1

    pending_marks = total_subjects - completed_subjects

    completed_exams_percent = round(
        (completed_subjects / total_subjects) * 100, 2
    ) if total_subjects else 0

    # -------- RECENT ACTIVITY ----------
    from staff.models import ActivityLog
    recent_logs = ActivityLog.objects.order_by("-created_at")[:20]

    recent_activity = [
        {
            "title": log.description,
            "datetime": log.created_at
        }
        for log in recent_logs
    ]

    # -------- SECTION OVERVIEW ----------

    sections = []

    levels = ["PUC1", "PUC2", "E1", "E2", "E3", "E4"]

    for lvl in levels:

        students_qs = Student.objects.filter(batch__current_level=lvl, batch__status="Active")
        total_students = students_qs.count()

        # Get active exam for this level
        active_batch = Batch.objects.filter(
            current_level=lvl,
            status="Active"
        ).first()

        exam = None

        if active_batch:
            exam = ExamStatus.objects.filter(
                batch=active_batch,
                is_active=True
            ).first()

        exam_progress = None
        branch_data = []

        if exam:
            marks_qs = Marks.objects.filter(
                enrollment__batch=active_batch,
                enrollment__semester=exam.semester
            )

            total_records = marks_qs.count()

            filled_records = marks_qs.exclude(
                **{f"{exam.exam_type.lower()}": 0}
            ).count()

            percent = round((filled_records / total_records) * 100, 2) if total_records else 0

            exam_progress = {
                "exam_type": exam.exam_type,
                "completion_percent": percent,
                "pending": total_records - filled_records
            }

            # Branch-wise distribution for Engineering
            if lvl.startswith("E"):
                branch_counts = students_qs.values("branch").annotate(count=Count("id"))

                for b in branch_counts:
                    branch_marks = marks_qs.filter(
                        enrollment__student__branch=b["branch"]
                    )

                    branch_total = branch_marks.count()
                    branch_filled = branch_marks.filter(
                        **{f"{exam.exam_type.lower()}__isnull": False}
                    ).count()

                    branch_percent = round(
                        (branch_filled / branch_total) * 100, 2
                    ) if branch_total else 0

                    branch_data.append({
                        "name": b["branch"],
                        "students": b["count"],
                        "completion_percent": branch_percent
                    })

        sections.append({
            "title": lvl,
            "sub": "Engineering" if lvl.startswith("E") else "Pre-University",
            "students": total_students,
            "exam_progress": exam_progress,
            "branch_distribution": branch_data
        })

    return Response({
        "role": role,
        "stats": {
            "total_students": active_students,
            "active_batches": Batch.objects.filter(status="Active").count(),
            "pending_marks": pending_marks,
            "completed_exams_percent": completed_exams_percent,
        },
        "recent_activity": recent_activity,
        "sections_overview": sections
    })

#------------- ACTIVATE EXAMINATION ALSO DEACTIVATION----------------
from django.shortcuts import get_object_or_404

@api_view(["POST"])
@permission_classes([IsAuthenticated, IsCOE])
def activate_exam(request):

    batch_id = request.data.get("batch")
    exam_type = request.data.get("exam_type")
    semester = request.data.get("semester")

    if not batch_id or not exam_type or not semester:
        return Response({"error": "Missing required fields"}, status=400)

    batch = get_object_or_404(Batch, batch_id=batch_id)

    # Prevent wrong semester activation
    if semester != batch.current_semester:
        return Response(
            {"error": f"Current semester is {batch.current_semester}"},
            status=400
        )

    # Deactivate existing exam
    ExamStatus.objects.filter(
        batch=batch,
        is_active=True
    ).update(is_active=False)

    # Create new active exam
    exam = ExamStatus.objects.create(
        batch=batch,
        level=batch.current_level,
        semester=semester,
        exam_type=exam_type,
        is_active=True
    )

    # Notification
    Notification.objects.create(
        title=f"{exam_type} Activated",
        message=f"{exam_type} for {batch.batch_id} ({batch.current_level} - {semester}) is now active.",
        level=batch.current_level,
        batch=batch
    )

    # Activity
    ActivityLog.objects.create(
        action_type="NOTIFICATION",
        description=f"{exam_type} activated for {batch.batch_id}",
        batch=batch,
        level=batch.current_level,
        semester=semester,
        created_by=request.user
    )

    return Response({"message": f"{exam_type} activated"})

#-------------- DEACTIVATE EXAM-------------------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated, IsCOE])
def deactivate_exam(request):

    batch_id = request.data.get("batch")

    batch = get_object_or_404(Batch, batch_id=batch_id)

    active_exam = ExamStatus.objects.filter(
        batch=batch,
        is_active=True
    ).first()

    if not active_exam:
        return Response({"error": "No active exam"}, status=400)

    active_exam.is_active = False
    active_exam.save()

    # Notification
    Notification.objects.create(
        title="Exam Deactivated",
        message=f"{active_exam.exam_type} for {batch.batch_id} has been deactivated.",
        level=batch.current_level,
        batch=batch
    )

    ActivityLog.objects.create(
        action_type="NOTIFICATION",
        description=f"{active_exam.exam_type} deactivated for {batch.batch_id}",
        batch=batch,
        level=batch.current_level,
        semester=batch.current_semester,
        created_by=request.user
    )

    return Response({"message": "Exam deactivated"})
# ------------------------- get activatin function----------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_active_exam(request, batch_id):

    exam = ExamStatus.objects.filter(
        batch__batch_id=batch_id,
        is_active=True
    ).first()

    if not exam:
        return Response({"active_exam": None})

    return Response({
        "active_exam": exam.exam_type,
        "semester": exam.semester,
        "level": exam.level
    })
#-----------------------------------------------------------------------
#                  NOTIFICATION SECTION 
#-----------------------------------------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notifications(request):

    user = request.user

    if user.role == "coe":
        notifications = Notification.objects.order_by("-created_at")[:20]
    else:
        notifications = Notification.objects.filter(
            level=user.level
        ).order_by("-created_at")[:20]

    data = [
        {
            "title": n.title,
            "message": n.message,
            "created_at": n.created_at
        }
        for n in notifications
    ]

    return Response(data)
