from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.core.mail import send_mail
from django.conf import settings
from .forms import SignUpForm, SearchTrainForm, OTPVerificationForm
from .models import Train, Station, Booking
from datetime import datetime
import random
import string
from django.http import JsonResponse

def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

def send_otp_email(email, otp):
    """Send OTP via email"""
    subject = 'Your SudishExpress Verification Code'
    message = f'Your verification code is: {otp}\nThis code will expire in 10 minutes.'
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [email]
    
    try:
        send_mail(subject, message, from_email, recipient_list)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def home(request):
    # Get all stations for the search form
    stations = Station.objects.all()
    
    # Get popular routes (you may want to customize this query based on your needs)
    popular_routes = [
        {
            'name': 'Janakpur to Kurtha',
            'description': 'Experience the scenic beauty of the Terai region',
            'image': 'janakpur-train.jpg',
            'duration': '2 hours',
            'price': '150',
            'from_station': 1,  # Replace with actual station IDs
            'to_station': 2
        },
        {
            'name': 'Kurtha to Bardibas',
            'description': 'Travel through historic landmarks and cultural sites',
            'image': 'kurtha-train.jpg',
            'duration': '1.5 hours',
            'price': '120',
            'from_station': 2,
            'to_station': 3
        },
        {
            'name': 'Janakpur to Bardibas',
            'description': 'The complete journey through Nepal\'s railway corridor',
            'image': 'bardibas-train.jpg',
            'duration': '3.5 hours',
            'price': '250',
            'from_station': 1,
            'to_station': 3
        }
    ]
    
    context = {
        'stations': stations,
        'popular_routes': popular_routes
    }
    
    return render(request, 'reservation/home.html', context)

def signup_view(request):
    if request.method == 'POST':
        # Check if we're processing the OTP verification
        if 'otp' in request.POST:
            form = OTPVerificationForm(request.POST)
            if form.is_valid():
                session_otp = request.session.get('otp')
                session_user_data = request.session.get('user_data')
                
                if session_otp and session_otp == form.cleaned_data['otp']:
                    # Create user
                    try:
                        user = User.objects.create_user(
                            username=session_user_data['email'],
                            email=session_user_data['email'],
                            password=session_user_data['password'],
                            first_name=session_user_data['first_name'],
                            last_name=session_user_data['last_name']
                        )
                        
                        # Add phone number to user profile (you'll need to create a UserProfile model)
                        # UserProfile.objects.create(user=user, phone_number=session_user_data['phone_number'])
                        
                        # Log the user in
                        login(request, user)
                        messages.success(request, 'Account created successfully!')
                        
                        # Clean up session
                        del request.session['otp']
                        del request.session['user_data']
                        
                        return redirect('home')
                    except Exception as e:
                        messages.error(request, 'Error creating account. Please try again.')
                else:
                    messages.error(request, 'Invalid OTP. Please try again.')
            return render(request, 'reservation/verify_otp.html', {'form': form})
        
        # Process the signup form
        form = SignUpForm(request.POST)
        if form.is_valid():
            try:
                # Check if email already exists
                if User.objects.filter(email=form.cleaned_data['email']).exists():
                    messages.error(request, 'Email already exists. Please use another.')
                    return render(request, 'reservation/signup.html', {'form': form})
                
                # Generate and send OTP
                otp = generate_otp()
                if send_otp_email(form.cleaned_data['email'], otp):
                    # Store OTP and user data in session
                    request.session['otp'] = otp
                    request.session['user_data'] = {
                        'email': form.cleaned_data['email'],
                        'password': form.cleaned_data['password1'],
                        'first_name': form.cleaned_data['full_name'].split(' ')[0],
                        'last_name': ' '.join(form.cleaned_data['full_name'].split(' ')[1:]),
                        'phone_number': form.cleaned_data['phone_number']
                    }
                    
                    # Redirect to OTP verification
                    return render(request, 'reservation/verify_otp.html', {
                        'form': OTPVerificationForm(),
                        'email': form.cleaned_data['email']
                    })
                else:
                    messages.error(request, 'Error sending verification code. Please try again.')
            except ValidationError as e:
                messages.error(request, str(e))
            except Exception as e:
                messages.error(request, 'An error occurred. Please try again.')
    else:
        form = SignUpForm()
    return render(request, 'reservation/signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        if not username or not password:
            messages.error(request, 'Please enter both username and password.')
            return render(request, 'registration/login.html')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            messages.success(request, 'Logged in successfully!')
            
            # Check if there's a next parameter in the URL
            next_url = request.GET.get('next')
            if next_url:
                return redirect(next_url)
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password.')
    
    return render(request, 'registration/login.html')

def logout_view(request):
    logout(request)
    messages.info(request, 'Logged out successfully!')
    return redirect('home')

def search_trains(request):
    if request.method == 'POST':
        form = SearchTrainForm(request.POST)
        if form.is_valid():
            from_station = form.cleaned_data['from_station']
            to_station = form.cleaned_data['to_station']
            date = form.cleaned_data['date']
            passengers = form.cleaned_data['passengers']
            
            # In a real app, you would query the database for trains
            # For demo purposes, we'll use some mock data or existing trains
            try:
                source_stations = Station.objects.filter(name__icontains=from_station)
                dest_stations = Station.objects.filter(name__icontains=to_station)
                
                if source_stations.exists() and dest_stations.exists():
                    trains = Train.objects.filter(
                        source__in=source_stations,
                        destination__in=dest_stations,
                        available_seats__gte=int(passengers)
                    )
                else:
                    # If stations don't exist, create dummy data for demo
                    if not Station.objects.exists():
                        create_sample_data()
                    
                    # Get some trains for demo
                    trains = Train.objects.all()[:3]
            except:
                # If there's an error or no data, create sample data
                create_sample_data()
                trains = Train.objects.all()[:3]
            
            return render(request, 'reservation/search_results.html', {
                'trains': trains,
                'date': date,
                'passengers': passengers,
                'from_station': from_station,
                'to_station': to_station
            })
    else:
        form = SearchTrainForm()
    
    return render(request, 'reservation/search_trains.html', {'form': form})

@login_required
def book_ticket(request):
    if request.method == 'POST':
        train_id = request.POST.get('train_id')
        date = request.POST.get('date')
        passengers = int(request.POST.get('passengers', 1))
        
        try:
            train = Train.objects.get(id=train_id)
            if train.available_seats >= passengers:
                total_price = train.price * passengers
                
                booking = Booking.objects.create(
                    user=request.user,
                    train=train,
                    booking_date=date,
                    num_passengers=passengers,
                    total_price=total_price
                )
                
                train.available_seats -= passengers
                train.save()
                
                messages.success(request, 'Ticket booked successfully!')
                return redirect('booking_confirmation', booking_id=booking.id)
            else:
                messages.error(request, 'Not enough seats available')
        except Train.DoesNotExist:
            messages.error(request, 'Train not found')
            
    return redirect('search_trains')

@login_required
def booking_confirmation(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)
        return render(request, 'reservation/booking_confirmation.html', {'booking': booking})
    except Booking.DoesNotExist:
        messages.error(request, 'Booking not found')
        return redirect('home')

@login_required
def my_bookings(request):
    bookings = Booking.objects.filter(user=request.user).order_by('-booking_time')
    return render(request, 'reservation/my_bookings.html', {'bookings': bookings})

def about_us(request):
    return render(request, 'reservation/about_us.html')

def contact(request):
    return render(request, 'reservation/contact.html')

def contact_view(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        
        # Send email to admin
        admin_message = f"""
        New Contact Form Submission
        
        Name: {name}
        Email: {email}
        Subject: {subject}
        Message: {message}
        """
        
        try:
            # Send email to admin
            send_mail(
                f'Contact Form: {subject}',
                admin_message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.ADMIN_EMAIL],
                fail_silently=False,
            )
            
            # Send confirmation email to user
            user_message = f"""
            Dear {name},
            
            Thank you for contacting us. We have received your message and will get back to you as soon as possible.
            
            Here's a copy of your message:
            Subject: {subject}
            Message: {message}
            
            Best regards,
            The SudishExpress Team
            """
            
            send_mail(
                'Thank you for contacting SudishExpress',
                user_message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            
            return JsonResponse({'message': 'Message sent successfully'})
        except Exception as e:
            return JsonResponse({'message': 'Error sending message. Please try again later.'}, status=500)
    
    return render(request, 'reservation/contact.html')

def about_view(request):
    return render(request, 'reservation/about.html')

# Helper function to create sample data for demo
def create_sample_data():
    # Only create if no data exists
    if Station.objects.count() == 0:
        # Create stations
        delhi = Station.objects.create(name="Delhi", code="DEL")
        mumbai = Station.objects.create(name="Mumbai", code="MUM")
        bangalore = Station.objects.create(name="Bangalore", code="BLR")
        chennai = Station.objects.create(name="Chennai", code="CHN")
        
        # Create trains
        Train.objects.create(
            train_number="EXP1001",
            name="Express Superfast",
            source=delhi,
            destination=mumbai,
            departure_time="08:00",
            arrival_time="12:30",
            available_seats=45,
            price=1200
        )
        
        Train.objects.create(
            train_number="EXP1002",
            name="Rajdhani Express",
            source=mumbai,
            destination=bangalore,
            departure_time="14:15",
            arrival_time="18:45",
            available_seats=32,
            price=1500
        )
        
        Train.objects.create(
            train_number="EXP1003",
            name="Shatabdi Express",
            source=bangalore,
            destination=chennai,
            departure_time="16:30",
            arrival_time="21:00",
            available_seats=18,
            price=1800
        )