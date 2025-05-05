from django.contrib import admin
from .models import Station, Train, Booking

@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')

@admin.register(Train)
class TrainAdmin(admin.ModelAdmin):
    list_display = ('train_number', 'name', 'source', 'destination', 'departure_time', 'arrival_time', 'available_seats', 'price')
    list_filter = ('source', 'destination')
    search_fields = ('train_number', 'name')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'train', 'booking_date', 'num_passengers', 'total_price', 'status')
    list_filter = ('status', 'booking_date')
    search_fields = ('user__username', 'train__name', 'train__train_number')