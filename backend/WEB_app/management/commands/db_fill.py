from WEB_app.models import *
import random
import datetime
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            '--industry_id'
        )
        parser.add_argument(
            '--industry_title'
        )
        parser.add_argument(
            '--company_id'
        )
        parser.add_argument(
            '--company_title'
        )

    @staticmethod
    def get_or_create_company(industry):
        companies = Company.objects.filter(id_industry=industry)
        if len(companies) > 0:
            company = companies[0]
        else:
            user = User(first_name='', last_name='', reg_date='2019-03-16')
            user.save()
            company = Company.objects.create(id=user, title='', logo='', icon='', description='', balance=0,
                                   city=City.objects.get(pk=1), id_industry=industry)
        return company

    def handle(self, *args, **options):
        industry_title = options['industry_title']
        if industry_title:
            industries = Industry.objects.filter(title=industry_title)
            if len(industries) > 0:
                industry = industries[0]
            else:
                industry = Industry.objects.create(title=industry_title)
            company = self.get_or_create_company(industry)

        industry_id = options['industry_id']
        if industry_id:
            companies = Company.objects.filter(id_industry=industry_id)
            if len(companies) > 0:
                company = companies[0]
            else:
                self.stdout.write("Incorrect industry_id", ending='')
                return

        company_id = options['company_id']
        if company_id:
            try:
                company = Company.objects.get(pk=company_id)
            except Company.DoesNotExist:
                self.stdout.write("Incorrect company_id", ending='')
                return

        company_title = options['company_title']
        if company_title:
            try:
                company = Company.objects.get(title=company_title)
            except Company.DoesNotExist:
                self.stdout.write("Incorrect company_title", ending='')
                return

        try:
            cashier = Cashier.objects.get(pk=1)
        except Cashier.DoesNotExist:
            user = User(first_name='', last_name='', reg_date='2019-03-16')
            user.save()
            cashier = Cashier.objects.create(id_user=user, id_company=company)

        for i in range(1000):
            user = User(first_name='', last_name='', reg_date='2019-03-16')
            user.save()
            normal_val = -1
            while normal_val < 0 or normal_val > 10000:
                normal_val = random.normalvariate(500, 3000)
            UserHistoryPurchases(id_user=user,
                                 id_company=company,
                                 id_cashier=cashier,
                                 purchase_time=datetime.datetime.now() - datetime.timedelta(days=random.randint(0, 30)),
                                 price=normal_val,
                                 user_balance=100 + 0.01 * i,
                                 company_balance=1000 - 0.01 * i).save()
