# staff/services/marks_calculation.py

def best_of_two(m1, m2, m3):
    """
    Returns average of best 2 mids
    """
    values = [m1 or 0, m2 or 0, m3 or 0]
    return sum(sorted(values, reverse=True)[:2]) / 2


def calculate_internal(m):

    subject = m.enrollment.subject
    scheme = subject.exam_scheme

    mids = [m.mid1 or 0, m.mid2 or 0, m.mid3 or 0]
    best_two = sorted(mids, reverse=True)[:2]
    mid_sum = sum(best_two)

    if scheme == "MID20":
        # mids already out of 20
        return mid_sum

    elif scheme == "MID15_AT4":
        ats = [m.at1 or 0, m.at2 or 0, m.at3 or 0, m.at4 or 0]
        ats_avg = sum(ats) / 4 if any(ats) else 0
        return mid_sum + ats_avg

    elif scheme == "MID40":
        # mids are 40 marks each
        # best two sum out of 80
        # average to convert back to 40
        return mid_sum / 2

    else:
        return 0



def calculate_sgpa(subjects):
    total_points = 0
    total_credits = 0

    for sub in subjects:
        total_points += sub.grade_point * sub.credits
        total_credits += sub.credits

    return round(total_points / total_credits, 2) if total_credits else 0
