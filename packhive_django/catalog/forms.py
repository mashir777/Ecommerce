from django import forms

from .models import ContactMessage, Order, QuoteRequest

INPUT = (
    "mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--cream-soft)] "
    "px-4 py-3 outline-none focus:border-[var(--terra)]"
)


class QuoteForm(forms.ModelForm):
    class Meta:
        model = QuoteRequest
        fields = ["name", "phone", "email", "product_type", "quantity", "details"]
        widgets = {
            "name": forms.TextInput(attrs={"class": INPUT, "required": True}),
            "phone": forms.TextInput(attrs={"class": INPUT, "required": True}),
            "email": forms.EmailInput(attrs={"class": INPUT}),
            "product_type": forms.Select(
                attrs={"class": INPUT},
                choices=[
                    ("Kraft Standup Pouches", "Kraft Standup Pouches"),
                    ("Bakery Boxes", "Bakery Boxes"),
                    ("Coffee Cups", "Coffee Cups"),
                    ("Eco Packaging", "Eco Packaging"),
                    ("Food Containers", "Food Containers"),
                    ("Custom / Other", "Custom / Other"),
                ],
            ),
            "quantity": forms.TextInput(
                attrs={"class": INPUT, "placeholder": "e.g. 1000"}
            ),
            "details": forms.Textarea(
                attrs={
                    "class": INPUT,
                    "rows": 5,
                    "placeholder": "Size, printing, city, deadline...",
                }
            ),
        }
        labels = {
            "name": "Business / Name",
            "phone": "Phone / WhatsApp",
            "product_type": "Product type",
            "quantity": "Quantity (approx)",
            "details": "Details",
        }


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ["name", "phone", "email", "message"]
        widgets = {
            "name": forms.TextInput(
                attrs={"class": INPUT, "required": True, "placeholder": "Your name"}
            ),
            "phone": forms.TextInput(
                attrs={"class": INPUT, "required": True, "placeholder": "03xx-xxxxxxx"}
            ),
            "email": forms.EmailInput(
                attrs={"class": INPUT, "placeholder": "you@business.com"}
            ),
            "message": forms.Textarea(
                attrs={
                    "class": INPUT,
                    "rows": 5,
                    "required": True,
                    "placeholder": "Tell us what packaging you need...",
                }
            ),
        }


class CheckoutForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = [
            "full_name",
            "phone",
            "email",
            "city",
            "address",
            "payment_method",
            "notes",
        ]
        widgets = {
            "full_name": forms.TextInput(
                attrs={"class": INPUT, "required": True, "placeholder": "Full name"}
            ),
            "phone": forms.TextInput(
                attrs={
                    "class": INPUT,
                    "required": True,
                    "placeholder": "03xx-xxxxxxx / WhatsApp",
                }
            ),
            "email": forms.EmailInput(
                attrs={"class": INPUT, "placeholder": "you@business.com"}
            ),
            "city": forms.TextInput(
                attrs={
                    "class": INPUT,
                    "required": True,
                    "placeholder": "Lahore, Karachi, Islamabad...",
                }
            ),
            "address": forms.Textarea(
                attrs={
                    "class": INPUT,
                    "rows": 3,
                    "required": True,
                    "placeholder": "Complete delivery address",
                }
            ),
            "payment_method": forms.RadioSelect(),
            "notes": forms.Textarea(
                attrs={
                    "class": INPUT,
                    "rows": 3,
                    "placeholder": "Any special instructions (optional)",
                }
            ),
        }
        labels = {
            "full_name": "Full name",
            "phone": "Phone / WhatsApp",
            "email": "Email",
            "city": "City",
            "address": "Delivery address",
            "payment_method": "Payment method",
            "notes": "Order notes",
        }
