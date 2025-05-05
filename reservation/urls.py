from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('search/', views.search_trains, name='search_trains'),
    path('book/', views.book_ticket, name='book_ticket'),
    path('booking/<int:booking_id>/', views.booking_confirmation, name='booking_confirmation'),
    path('my-bookings/', views.my_bookings, name='my_bookings'),
    path('about/', views.about_view, name='about'),
    path('contact/', views.contact_view, name='contact'),
]