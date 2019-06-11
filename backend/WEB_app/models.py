# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.utils import IntegrityError
from django.utils.timezone import now


class BalancePayment(models.Model):
    id_company = models.ForeignKey('Company', models.DO_NOTHING, db_column='id_company')
    payment_amount = models.FloatField()
    company_balance = models.FloatField()
    datetime = models.DateTimeField(default=now)

    class Meta:
        managed = False
        db_table = 'balance_payment'


class Cashier(models.Model):
    id_user = models.ForeignKey('User', models.DO_NOTHING, db_column='id_user')
    id_company = models.ForeignKey('Company', models.DO_NOTHING, db_column='id_company')
    is_confirmed = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = 'cashier'


class City(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=32)

    class Meta:
        managed = False
        db_table = 'city'


class Company(models.Model):
    id = models.OneToOneField('User', models.DO_NOTHING, db_column='id', primary_key=True)
    title = models.CharField(max_length=30)
    logo = models.CharField(max_length=100)
    icon = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    reg_date = models.DateField(default=now)
    balance = models.FloatField()
    id_industry = models.ForeignKey('Industry', models.DO_NOTHING, db_column='id_industry')
    city = models.ForeignKey(City, models.DO_NOTHING, db_column='city')

    class Meta:
        managed = False
        db_table = 'company'


class CityBranch(models.Model):
    id_company = models.ForeignKey('Company', models.DO_NOTHING, db_column='id_company')
    city = models.ForeignKey(City, models.DO_NOTHING, db_column='city')
    manager = models.ForeignKey('User', models.DO_NOTHING, db_column='manager', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'city_branch'


class Department(models.Model):
    id_company = models.ForeignKey(Company, models.DO_NOTHING, db_column='id_company')
    street = models.CharField(max_length=30)
    building = models.CharField(max_length=6)
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        managed = False
        db_table = 'department'


class CompanyNotification(models.Model):
    id_company = models.ForeignKey(Company, models.DO_NOTHING, db_column='id_company')
    text = models.CharField(max_length=200)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    views = models.IntegerField(default=0)
    used = models.IntegerField(default=0)
    discount = models.FloatField()
    pushes_amount = models.IntegerField()
    payment = models.FloatField()
    # id_industry = models.ForeignKey('Industry', models.DO_NOTHING, db_column='id_industry')

    class Meta:
        managed = False
        db_table = 'company_notification'


class PushNotification(models.Model):
    id_user = models.ForeignKey('User', models.DO_NOTHING, db_column='id_user')
    id_notification = models.ForeignKey(CompanyNotification, models.DO_NOTHING, db_column='id_notification')

    class Meta:
        managed = False
        db_table = 'push_notification'


class Industry(models.Model):
    title = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'industry'


class DiscountStatus(models.Model):
    id_company = models.ForeignKey(Company, models.DO_NOTHING, db_column='id_company')
    name = models.CharField(max_length=30)
    threshold_sum = models.FloatField()
    discount = models.FloatField()
    is_offer = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'discount_status'


class User(models.Model):

    def update(self, f_name=None, l_name=None, b_date=None):
        try:
            user = self
            user.first_name = f_name
            user.last_name = l_name
            user.birth_date = b_date
            user.save()
        except User.DoesNotExist:
            User.objects.create(id=self, first_name=f_name, last_name=l_name, birth_date=b_date)

    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    birth_date = models.DateField(blank=True, null=True)
    city = models.ForeignKey(City, models.DO_NOTHING, db_column='city', blank=True, null=True)
    reg_date = models.DateField(default=now)
    balance = models.FloatField(default=1000.0)

    class Meta:
        managed = False
        db_table = 'user'


class UserDiscount(models.Model):
    id_user = models.ForeignKey(User, models.DO_NOTHING, db_column='id_user')
    id_status = models.ForeignKey(DiscountStatus, models.DO_NOTHING, db_column='id_status')
    id_company = models.ForeignKey(Company, models.DO_NOTHING, db_column='id_company')

    class Meta:
        managed = False
        db_table = 'user_discount'


class UserEvent(models.Model):
    title = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'user_event'


class UserHistoryAccount(models.Model):
    id_user = models.ForeignKey(User, models.DO_NOTHING, db_column='id_user', blank=True, null=True)
    id_event = models.ForeignKey(UserEvent, models.DO_NOTHING, db_column='id_event')
    time = models.DateTimeField()
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    birth_date = models.DateField(blank=True, null=True)
    city = models.ForeignKey(City, models.DO_NOTHING, db_column='city', blank=True, null=True)
    phone_number = models.BigIntegerField()
    uuid = models.CharField(max_length=32)
    email = models.CharField(max_length=50, blank=True, null=True)
    is_superuser = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'user_history_account'


class UserHistoryPurchases(models.Model):
    id_user = models.ForeignKey(User, models.DO_NOTHING, db_column='id_user')
    id_company = models.ForeignKey(Company, models.DO_NOTHING, db_column='id_company')
    id_discount = models.ForeignKey(DiscountStatus, models.DO_NOTHING, db_column='id_discount')
    id_cashier = models.ForeignKey(Cashier, models.DO_NOTHING, db_column='id_cashier')
    purchase_time = models.DateTimeField()
    price = models.FloatField()
    user_balance = models.FloatField()
    company_balance = models.FloatField()
    push_notification = models.ForeignKey(CompanyNotification, models.DO_NOTHING, db_column='push_notification',
                                          blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_history_purchases'


class UserPhone(models.Model):
    id = models.OneToOneField(User, models.DO_NOTHING, db_column='id', primary_key=True, related_name='user_phone')
    phone_number = models.BigIntegerField()
    uuid = models.CharField(unique=True, max_length=32)
    password = models.CharField(max_length=64)
    # is_cashier = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'user_phone'


class WebUserManager(BaseUserManager):  # менеджер кастомного пользователя
    def create_user(self, password, email=None, phone_number=None):
        user_phone = None
        if phone_number is not None:
            user_phone = UserPhone.objects.get(phone_number=phone_number)
        elif email is None:
            raise ValueError('Both email and phone cannot be None')

        if user_phone is not None:
            try:
                UserWeb.objects.get(id=user_phone.id)
                raise UserWeb.MultipleObjectsReturned
            except UserWeb.DoesNotExist:
                if email is not None:
                    user = self.model(id=user_phone.id, email=email)
                else:
                    user = self.model(id=user_phone.id, email=phone_number)
        else:
            try:
                UserWeb.objects.get(email=email)
                raise IntegrityError
            except UserWeb.DoesNotExist:
                user_id = User.objects.create()

            user = self.model(id=user_id, email=email)
        user.set_password(password)

        user.save(using=self._db)

    def create_superuser(self, password, email=None, phone=None):
        if phone is None:
            if email is None:
                raise ValueError('Both email and phone cannot be None')
            phone = email
        user = self.model(email=email, phone=phone, password=password, is_superuser=True)
        user.set_password(password)
        user.save(using=self._db)


class UserWeb(AbstractBaseUser):
    id = models.OneToOneField(User, models.DO_NOTHING, db_column='id', primary_key=True, related_name='user_web')
    email = models.EmailField(unique=True, max_length=50, blank=True, null=True)
    USERNAME_FIELD = 'email'
    objects = WebUserManager()
    is_superuser = models.BooleanField(default=False)
    # is_email_confirmed = models.BooleanField(default=False)
    # is_phone_confirmed = models.BooleanField(default=False)

    class Meta:
        managed = True
        db_table = 'user_web'
