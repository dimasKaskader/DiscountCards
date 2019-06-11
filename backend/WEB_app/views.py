from django.contrib import auth
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from django.http import HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db.utils import IntegrityError
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from PIL import Image
from django.utils.datastructures import MultiValueDictKeyError
from .charts_logic import *


@ensure_csrf_cookie
def main_view(request):  # главная
    with open('templates/index.html', 'r') as f:
        index = f.read()
        return HttpResponse(index, content_type="text/html")


@api_view(['POST', 'GET'])
def login(request):
    if request.method == 'GET':
        return Response({'email': auth.get_user(request).email}, status=status.HTTP_200_OK)
    if request.method == 'POST':
        email = request.data['email']
        if email == '': email = None
        phone_number = request.data['phone_number']
        if phone_number == '': phone_number = None
        password = request.data['password']
        user = auth.authenticate(email=email, phone_number=phone_number, password=password)
        if user is not None:
            auth.login(request, user)
            return Response({'email': auth.get_user(request).email, 'phone': request.data['phone_number']},
                            status=status.HTTP_200_OK)
        else:
            return Response({'error_message': 'Неправильное имя пользователя или пароль'},
                            status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def logout(request):
    auth.logout(request)
    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        email = request.data['email']
        if email == '': email = None
        if 'phone_number' in request.data:
            phone_number = request.data['phone_number']
        else:
            phone_number = ''
        if phone_number == '': phone_number = None
        password = request.data['password']
        try:
            UserWeb.objects.create_user(password, email, phone_number)
        except UserPhone.DoesNotExist:
            return Response({'error_message': 'Не удалось найти мобильный аккаунт для заданного номера телефона'},
                            status=status.HTTP_400_BAD_REQUEST)
        except UserWeb.MultipleObjectsReturned:
            return Response({'error_message': 'Аккаунт для заданного номера телефона уже зарегистрирован'},
                            status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError:
            return Response({'error_message': 'Аккаунт для заданного адреса электронной почты уже зарегистрирован'},
                            status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'error_message': 'Должно быть указано хотя бы одно: адрес почты или телефон'},
                            status=status.HTTP_400_BAD_REQUEST)
        user = auth.authenticate(email=email, phone_number=phone_number, password=password)
        auth.login(request, user)
        return Response({'email': auth.get_user(request).email},
                        status=status.HTTP_200_OK)


@api_view(['GET', 'PUT'])
def users(request):
    if request.method == 'GET':
        user = auth.get_user(request).id
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        user = auth.get_user(request).id
        f_name = request.data['name']
        l_name = request.data['surname']
        if 'b_date' in request.data:
            b_date = request.data['b_date']
        else:
            b_date = None
        user.update(f_name, l_name, b_date)
        return Response(status=status.HTTP_200_OK)


@api_view(['POST', 'GET', 'PUT'])
def company(request):
    if request.method == 'POST':
        title = request.POST['title']
        description = request.POST['description']
        industry = request.POST['industry']
        logo = request.FILES['logo']
        city = request.POST['city']
        user_id = auth.get_user(request).id
        try:
            logo_r = reshape_image(logo.file, (512, 512))
            icon = reshape_image(logo.file, (64, 64))
            images_path = str(user_id.id) + '/'
            logo_path = default_storage.save(images_path + 'logo.jpg', ContentFile(logo_r))
            icon_path = default_storage.save(images_path + 'icon.jpg', ContentFile(icon))
            city = City.objects.get(title=city)
            company = Company.objects.create(id=user_id, title=title, description=description, balance=100,
                                             logo=logo_path, icon=icon_path, id_industry=Industry.objects.get(pk=industry),
                                             city=city)

        except IntegrityError:
            return Response({'error_message': 'Компания для заданного пользователя уже зарегистрирована'},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)

    if request.method == 'PUT':
        title = request.POST['title']
        description = request.POST['description']
        # industry = request.POST['industry']
        user_id = auth.get_user(request).id
        try:
            logo = request.FILES['logo']
            logo_r = reshape_image(logo.file, (512, 512))
            icon = reshape_image(logo.file, (128, 128))
            images_path = str(user_id.id) + '/'
            logo_path = default_storage.save(images_path + 'logo.jpg', ContentFile(logo_r))
            icon_path = default_storage.save(images_path + 'icon.jpg', ContentFile(icon))
        except MultiValueDictKeyError:
            logo_path = None
            icon_path = None

        try:
            company = Company.objects.get(id=user_id)
            company.description = description
            if logo_path is not None:
                company.logo = logo_path
                company.icon = icon_path
            company.title = title
            # company.id_industry = Industry.objects.get(pk=industry)
            company.save()
        except Company.DoesNotExist:
            return Response({'error_message': 'Компания для заданного пользователя еще не зарегистрирована'},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)

    if request.method == 'GET':
        user_id = auth.get_user(request).id
        try:
            company = Company.objects.get(id=user_id)

        except Company.DoesNotExist:
            return Response({'error_message': 'Компания для заданного пользователя еще не зарегистрирована'},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer = CompanySerializer(company)
        departments = Department.objects.filter(id_company=company)
        dep_serializer = DepartmentSerializer(departments, many=True)
        # branch_serializer = BranchSerializer(branches, many=True)

        return Response({'company': serializer.data, 'departments': dep_serializer.data}, status=status.HTTP_200_OK)


def reshape_image(byte_img, resolution):
    im = Image.open(byte_img)
    im = im.resize(resolution, Image.BICUBIC)
    im.save('tmp', 'jpeg', quality=95, optimize=True)
    with open('tmp', 'rb') as f:
        return f.read()


@api_view(['GET'])
def industries(request):
    if request.method == 'GET':
        user_id = auth.get_user(request).id
        try:
            company = Company.objects.get(id=user_id)
            industries = Industry.objects.exclude(pk=company.id_industry.id)
        except Company.DoesNotExist:
            industries = Industry.objects.all()

        serializer = IndustrySerializer(industries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST', 'DELETE'])
def cashiers(request):
    if request.method == 'GET':
        user_id = auth.get_user(request).id
        try:
            company = Company.objects.get(id=user_id)
        except Company.DoesNotExist:
            return Response({'error_message': 'Компания для заданного пользователя еще не зарегистрирована'},
                            status=status.HTTP_400_BAD_REQUEST)
        cashiers = Cashier.objects.filter(id_company=company)
        cashiers_json = []
        for cashier in cashiers:

            user = cashier.id_user
            try:
                phone = UserPhone.objects.get(id=user)
                phone = phone.phone_number
            except UserPhone.DoesNotExist:
                phone = None
            if cashier.is_confirmed:
                info_f = user.first_name
                info_l = user.last_name
                cashiers_json.append({'id': cashier.id, 'phone': phone, 'first_name': info_f,
                                      'last_name': info_l, 'is_confirmed': True})
            else:
                cashiers_json.append({'id': cashier.id, 'phone': phone, 'is_confirmed': False})
        return Response(cashiers_json, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        phone_number = request.data['phone']
        try:
            user = UserPhone.objects.get(phone_number=phone_number)
            user_info = user.id
        except UserPhone.DoesNotExist:
            return Response({'error_message': 'Неверный номер телефона'},
                            status=status.HTTP_400_BAD_REQUEST)

        user_id = auth.get_user(request).id
        try:
            company = Company.objects.get(id=user_id)
        except Company.DoesNotExist:
            return Response({'error_message': 'Компания для заданного пользователя не найдена'},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            Cashier.objects.get(id_company=company, id_user=user.id)
            return Response({'error_message': 'Пользователь уже является кассиром'},
                            status=status.HTTP_400_BAD_REQUEST)
        except Cashier.DoesNotExist:
            cashier = Cashier.objects.create(id_company=company, id_user=user.id)

        return Response({'id': cashier.id, 'phone': user.phone_number, 'is_confirmed': False},
                        status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        user_id = auth.get_user(request).id
        try:
            company = Company.objects.get(id=user_id)
        except Company.DoesNotExist:
            return Response({'error_message': 'Компания для заданного пользователя не найдена'},
                            status=status.HTTP_400_BAD_REQUEST)
        id = request.query_params['id']
        try:
            cashier = Cashier.objects.get(id_company=company, id=id)
            cashier.delete()
        except Cashier.DoesNotExist:
            return Response({'error_message': 'Данный пользователь не является кассиром заданной компании'},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)


@api_view(['PUT', 'POST', 'DELETE'])
def departments(request):
    if request.method == 'POST':
        city = request.data['city']
        street = request.data['street']
        building = request.data['building']
        user_id = auth.get_user(request).id
        try:
            company = Company.objects.get(id=user_id)
        except Company.DoesNotExist:
            return Response({'error_message': 'Компания для заданного пользователя не найдена'},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            city_obj = City.objects.get(title=city)
        except City.DoesNotExist:
            return Response({'error_message': 'Несуществующий город'},
                            status=status.HTTP_400_BAD_REQUEST)
        Department.objects.create(id_company=company, city=city_obj, street=street, building=building, latitude=0.0, longitude=0.0)
        return Response(status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        id = request.query_params['id']
        city = request.data['city']
        street = request.data['street']
        building = request.data['building']
        user_id = auth.get_user(request).id
        try:
            company = Company.objects.get(id=user_id)
        except Company.DoesNotExist:
            return Response({'error_message': 'Компания для заданного пользователя не найдена'},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            department = Department.objects.get(id=id, id_company=company)
        except Company.DoesNotExist:
            return Response({'error_message': 'Заданное отделение компании не найдено'},
                            status=status.HTTP_400_BAD_REQUEST)
        department.city = city
        department.street = street
        department.building = building
        department.save()
        return Response(status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        id = request.query_params['id']
        user_id = auth.get_user(request).id
        try:
            company = Company.objects.get(id=user_id)
        except Company.DoesNotExist:
            return Response({'error_message': 'Компания для заданного пользователя не найдена'},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            department = Department.objects.get(id=id, id_company=company)
        except Company.DoesNotExist:
            return Response({'error_message': 'Заданное отделение компании не найдено'},
                            status=status.HTTP_400_BAD_REQUEST)
        department.delete()
        return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
def spending_per_industry(request):
    user_id = auth.get_user(request).id
    sums = get_sum_per_industry(user_id.id)
    serializer = IndustryStatsSerializer(sums, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def clients_in_industry(request):
    user_id = auth.get_user(request).id
    try:
        company = Company.objects.get(id=user_id)
    except Company.DoesNotExist:
        return Response({'error_message': 'Компания для заданного пользователя не найдена'},
                        status=status.HTTP_400_BAD_REQUEST)
    industry = request.query_params['industry']
    if industry != company.id_industry.id:
        groups = get_clients_in_industry(industry)
        return Response(groups, status=status.HTTP_200_OK)
    else:
        return Response({'error_message': 'Доступ к пользователям данной отрасли запрещен'},
                        status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def clients_in_company(request):
    user_id = auth.get_user(request).id
    try:
        company = Company.objects.get(id=user_id)
    except Company.DoesNotExist:
        return Response({'error_message': 'Компания для заданного пользователя не найдена'},
                        status=status.HTTP_400_BAD_REQUEST)
    groups = get_clients_in_company(company.id.id)
    return Response(groups, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def company_discount(request):
    user_id = auth.get_user(request).id
    try:
        company = Company.objects.get(id=user_id)
    except Company.DoesNotExist:
        return Response({'error_message': 'Компания для заданного пользователя не найдена'},
                        status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        statuses = DiscountStatus.objects.filter(id_company=company).order_by('name')
        serializer = DiscountStatusSerializer(statuses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        name = request.data['name']
        threshold_sum = request.data['threshold_sum']
        discount = request.data['discount']
        try:
            discount_status = DiscountStatus.objects.get(id_company=company, name=name)
            discount_status.threshold_sum = threshold_sum
            discount_status.discount = discount
            discount_status.save()
        except DiscountStatus.DoesNotExist:
            DiscountStatus.objects.create(id_company=company, name=name, threshold_sum=threshold_sum, discount=discount)
        return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
def city(request):
    city_title = request.query_params['title']
    cities = City.objects.filter(title__istartswith=city_title)[:5]
    if cities.count() == 0:
        cities = City.objects.filter(title__icontains=city_title)[:5]
    serializer = CitySerializer(cities, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


'''@api_view(['GET'])
def branch(request):
    city_id = request.query_params['city_id']
    user_id = auth.get_user(request).id
    try:
        company = Company.objects.get(id=user_id)
    except Company.DoesNotExist:
        return Response({'error_message': 'Компания для заданного пользователя не найдена'},
                        status=status.HTTP_400_BAD_REQUEST)
    try:
        city_branch = CityBranch.objects.get(id_company=company, city=City.objects.get(id=city_id))
    except Company.DoesNotExist:
        return Response({'error_message': 'Филиал не найден'},
                        status=status.HTTP_400_BAD_REQUEST)

    serializer = BranchSerializer(city_branch)
    company_ser = CompanySerializer(company)
    return Response({'branch': serializer.data, 'company': company_ser.data}, status=status.HTTP_200_OK)'''


@api_view(['GET'])
def user_history_purchases(request):
    user_id = auth.get_user(request).id
    purchases = UserHistoryPurchases.objects.filter(id_user=user_id)
    serializer = PurchaseSerializer(purchases, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def push_history_purchases(request):
    user_id = auth.get_user(request).id
    push_id = request.query_params['push_id']
    try:
        company = Company.objects.get(id=user_id)
    except Company.DoesNotExist:
        return Response({'error_message': 'Компания для заданного пользователя не найдена'},
                        status=status.HTTP_400_BAD_REQUEST)
    try:
        notification = CompanyNotification.objects.get(id=push_id, id_company=company)
    except CompanyNotification.DoesNotExist:
        return Response({'error_message': 'Не найдено уведомление'},
                        status=status.HTTP_400_BAD_REQUEST)

    purchases = UserHistoryPurchases.objects.filter(push_notification=notification)
    serializer = PurchaseSerializer(purchases, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def push_notifications(request):
    user_id = auth.get_user(request).id
    try:
        company = Company.objects.get(id=user_id)
    except Company.DoesNotExist:
        return Response({'error_message': 'Компания для заданного пользователя не найдена'},
                        status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        notifications = CompanyNotification.objects.filter(id_company=company)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        text = request.POST['text']
        discount = request.POST['discount']
        start_time = request.POST['start_time']
        end_time = request.POST['end_time']
        min_spent = request.POST['min_spent']
        max_spent = request.POST['max_spent']
        industry = request.POST['industry']
        if industry == 'myCompany':
            users = get_clients_for_push(None, company.id.id, min_spent, max_spent)
        else:
            users = get_clients_for_push(industry, None, min_spent, max_spent)
        cost = 0
        for user in users:
            cost += user.cost
        CompanyNotification.objects.create(text=text, start_time=start_time, end_time=end_time, discount=discount,
                                           payment=cost, id_company=company, pushes_amount=len(users))
        return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
def company_history_purchases(request):
    user_id = auth.get_user(request).id
    period = request.query_params['period']
    try:
        company = Company.objects.get(id=user_id)
    except Company.DoesNotExist:
        return Response({'error_message': 'Компания для заданного пользователя не найдена'},
                        status=status.HTTP_400_BAD_REQUEST)
    sums = get_company_history_purchases(company.id.id, period)
    return Response(sums, status=status.HTTP_200_OK)


@api_view(['POST'])
def balance_payment(request):
    user_id = auth.get_user(request).id
    try:
        company = Company.objects.get(id=user_id)
    except Company.DoesNotExist:
        return Response({'error_message': 'Компания для заданного пользователя не найдена'},
                        status=status.HTTP_400_BAD_REQUEST)
    payment = request.data['payment']
    company.balance += float(payment)
    company.save()
    BalancePayment.objects.create(id_company=company, payment_amount=payment, company_balance=company.balance)
    return Response(company.balance, status=status.HTTP_200_OK)
