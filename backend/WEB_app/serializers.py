from rest_framework import serializers
from .models import *


class UserWebSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWeb
        fields = ('email', 'is_superuser')


class UserPhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPhone
        fields = ('phone_number',)


class UserSerializer(serializers.ModelSerializer):
    user_web = UserWebSerializer(read_only=True)
    user_phone = UserPhoneSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'user_web', 'user_phone', 'first_name', 'last_name', 'birth_date', 'reg_date',
                  'city', 'balance')


class DepartmentSerializer(serializers.ModelSerializer):
    city = serializers.ReadOnlyField(source='city.title')
    city_id = serializers.ReadOnlyField(source='city.id')

    class Meta:
        model = Department
        fields = ('id', 'id_company', 'city', 'street', 'building', 'city_id')


class BranchSerializer(serializers.ModelSerializer):
    city_title = serializers.ReadOnlyField(source='city.title')

    class Meta:
        model = CityBranch
        fields = ('city', 'city_title', 'manager')


class CompanySerializer(serializers.ModelSerializer):
    industry_id = serializers.ReadOnlyField(source='id_industry.id')
    industry = serializers.ReadOnlyField(source='id_industry.title')
    # departments = DepartmentSerializer(read_only=True, many=True)

    class Meta:
        model = Company
        fields = ('id', 'title', 'logo', 'description', 'balance', 'reg_date', 'industry', 'industry_id')


class UserTest(serializers.ModelSerializer):
    departments = DepartmentSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = ('id', 'departments')


class IndustrySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = ('id', 'title')


class CashierSerializer(serializers.ModelSerializer):
    phone_number = serializers.IntegerField(source='id_user')

    class Meta:
        model = Cashier
        fields = ('id_company', 'id_user',)


class IndustryStatsSerializer(serializers.ModelSerializer):
    industry = serializers.CharField()
    price = serializers.FloatField()
    discount = serializers.FloatField()

    class Meta:
        model = User
        fields = ('id', 'industry', 'price', 'discount')


class DiscountStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = DiscountStatus
        fields = ('name', 'threshold_sum', 'discount', 'is_offer')


class CitySerializer(serializers.ModelSerializer):

    class Meta:
        model = City
        fields = ('id', 'title')


class PurchaseSerializer(serializers.ModelSerializer):
    company = serializers.ReadOnlyField(source='id_company.title')
    industry = serializers.ReadOnlyField(source='id_company.id_industry.title')
    discount = serializers.ReadOnlyField(source='id_discount.discount')
    push_discount = serializers.ReadOnlyField(source='push_notification.id_notification.discount')

    class Meta:
        model = UserHistoryPurchases
        fields = ('purchase_time', 'price', 'user_balance', 'company', 'industry', 'discount', 'push_discount')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyNotification
        fields = ('id', 'text', 'start_time', 'end_time', 'views', 'used', 'discount', 'pushes_amount')
