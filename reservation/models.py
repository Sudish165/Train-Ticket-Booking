from django.db import models
from django.contrib.auth.models import User

class Station(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.name

class Train(models.Model):
    train_number = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    source = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='departing_trains')
    destination = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='arriving_trains')
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    available_seats = models.IntegerField(default=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.train_number} - {self.name}"

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    train = models.ForeignKey(Train, on_delete=models.CASCADE)
    booking_date = models.DateField()
    num_passengers = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    booking_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='CONFIRMED')

    def __str__(self):
        return f"Booking {self.id} - {self.user.username} - {self.train.train_number}"