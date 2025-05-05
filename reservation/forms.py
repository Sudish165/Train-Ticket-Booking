from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

class SignUpForm(UserCreationForm):
    full_name = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your full name'
        })
    )
    
    email = forms.EmailField(
        max_length=254,
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your email address'
        })
    )
    
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone_number = forms.CharField(
        validators=[phone_regex],
        max_length=17,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your phone number'
        })
    )
    
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your password'
        })
    )
    
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Confirm your password'
        })
    )
    
    class Meta:
        model = User
        fields = ('full_name', 'email', 'phone_number', 'password1', 'password2')
    
    def save(self, commit=True):
        user = super().save(commit=False)
        # Split full name into first_name and last_name
        name_parts = self.cleaned_data['full_name'].split(' ', 1)
        user.first_name = name_parts[0]
        user.last_name = name_parts[1] if len(name_parts) > 1 else ''
        user.email = self.cleaned_data['email']
        user.username = self.cleaned_data['email']  # Use email as username
        
        if commit:
            user.save()
        return user

class SearchTrainForm(forms.Form):
    from_station = forms.CharField(
        max_length=100, 
        required=True, 
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'From where?'
        })
    )
    
    to_station = forms.CharField(
        max_length=100, 
        required=True, 
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'To where?'
        })
    )
    
    date = forms.DateField(
        required=True, 
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date'
        })
    )
    
    passengers = forms.ChoiceField(
        choices=[(str(i), f"{i} Passenger{'s' if i > 1 else ''}") for i in range(1, 11)],
        widget=forms.Select(attrs={
            'class': 'form-control'
        })
    )

class OTPVerificationForm(forms.Form):
    otp = forms.CharField(
        max_length=6,
        min_length=6,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter 6-digit OTP'
        })
    )