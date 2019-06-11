from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.main_view, name='main_view'),  # главная
    url(r'^login$', views.login, name='login'),  # вход
    url(r'^logout$', views.logout, name='logout'),  # выход
    url(r'^register$', views.register, name='register'),  # регистрация
    url(r'^users$', views.users, name='users'),  # данные пользователя
    url(r'^company$', views.company, name='company'),  # данные компании
    url(r'^industries$', views.industries, name='industries'),  # отрасли компаний
    url(r'^cashiers$', views.cashiers, name='cashiers'),  # кассиры компании
    url(r'^departments$', views.departments, name='departments'),  # отделения компании
    url(r'^spending_per_industry$', views.spending_per_industry, name='spending_per_industry'),  # траты пользователя по отраслям
    url(r'^clients_in_industry$', views.clients_in_industry, name='clients_in_industry'),  # распределение пользователей по отраслям
    url(r'^clients_in_company$', views.clients_in_company, name='clients_in_company'),  # распределение пользователей по компании
    url(r'^city$', views.city, name='city'),  # города
    url(r'^user_history_purchases$', views.user_history_purchases, name='user_history_purchases'),  # история покупок пользователя
    url(r'^push_history_purchases$', views.push_history_purchases, name='push_history_purchases'),  # история покупок по уведомлениям
    url(r'^push_notifications$', views.push_notifications, name='push_notifications'),  # уведомления
    url(r'^balance_payment$', views.balance_payment, name='balance_payment'),  # пополнение баланса
    url(r'^company_history_purchases$', views.company_history_purchases, name='company_history_purchases'),  # история покупок у компании
    url(r'^company_discount$', views.company_discount, name='company_discount'),  # скидки
]
