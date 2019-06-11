from django.conf import settings
from django.contrib.auth.hashers import check_password
from .models import UserWeb, UserPhone


class WebUserBackend:

    def authenticate(self, request, email=None, phone_number=None, password=None):
        user_phone = None
        if email is None:
            if phone_number is not None:
                user_phone = UserPhone.objects.get(phone_number=phone_number)
            elif email is None:
                raise ValueError('Both email and phone cannot be None')

        try:
            if user_phone is not None:
                user = UserWeb.objects.get(id=user_phone.id)
            else:
                user = UserWeb.objects.get(email=email)
        except UserWeb.DoesNotExist:
            return None

        pwd_valid = user.check_password(password)
        if pwd_valid:
            return user
        return None

    def get_user(self, user_id):
        try:
            return UserWeb.objects.get(pk=user_id)
        except UserWeb.DoesNotExist:
            return None
