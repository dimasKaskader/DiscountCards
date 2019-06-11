from .models import *
from django.db import connection


def get_sum_per_industry(user_id):
    result = User.objects.raw('call spending_per_industry(%s);', [user_id])
    return result


'''
def get_sum_per_industry(user_id):
    result = User.objects.raw('select max(user.id) as id, max(industry.title) as industry, sum(price) as price, \
    sum(price*discount) as discount from user \
    inner join user_history_purchases on user.id = user_history_purchases.id_user \
    inner join company on user_history_purchases.id_company = company.id \
    inner join industry on company.id_industry = industry.id \
    where user.id=%s \
    group by industry.id;', [user_id])
    return result'''


def dictfetchall(cursor):
    """Return all rows from a cursor as a dict"""
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]


def put_last_to_previous(res10):
    if len(res10) > 1:
        res10[-2]['amount'] += 1
        res10[-2]['spent_to'] = res10[-1]['spent_to']
        res10[-2]['cost'] += res10[-1]['cost']
        res10.pop()


def get_clients_for_push(industry_id, company_id, spent_from, spent_to):
    users = User.objects.raw('call clients_for_push(%s, %s, %s, %s);', [industry_id, company_id, spent_from, spent_to])
    return users


def get_clients_in_industry(industry_id):
    with connection.cursor() as cursor:
        cursor.callproc('clients_in_industry', [industry_id, None, True, 10])
        res10 = dictfetchall(cursor)
        cursor.nextset()
        cursor.callproc('clients_in_industry', [industry_id, None, False, 100])
        res100 = dictfetchall(cursor)
    put_last_to_previous(res10)
    put_last_to_previous(res100)
    return {'10': res10, '100': res100}


def get_clients_in_company(company_id):
    with connection.cursor() as cursor:
        cursor.callproc('clients_in_industry', [None, company_id, True, 10])
        res10 = dictfetchall(cursor)
        cursor.nextset()
        cursor.callproc('clients_in_industry', [None, company_id, False, 100])
        res100 = dictfetchall(cursor)
    put_last_to_previous(res10)
    put_last_to_previous(res100)
    return {'10': res10, '100': res100}


def get_company_history_purchases(company_id, period):
    with connection.cursor() as cursor:
        if period == 'month':
            period = 30
        elif period == 'year':
            period = 365
        else:
            period = 7
        cursor.callproc('company_history_purchases', [company_id, period])
        sums = dictfetchall(cursor)
    return sums
