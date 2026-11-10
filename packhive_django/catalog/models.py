from pathlib import Path

from django.conf import settings
from django.db import models
from django.templatetags.static import static


class Category(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=120)
    image = models.ImageField(upload_to="categories/", blank=True, max_length=255)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name

    @property
    def image_url(self):
        if not self.image:
            return ""
        relative = self.image.name.lstrip("/")
        if (Path(settings.MEDIA_ROOT) / relative).is_file():
            return self.image.url
        return static(relative)


class Product(models.Model):
    slug = models.SlugField(unique=True, max_length=200)
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to="products/", blank=True, max_length=255)
    price_from = models.PositiveIntegerField(default=0)
    price_to = models.PositiveIntegerField(null=True, blank=True)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="products"
    )
    featured = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

    @property
    def image_url(self):
        if not self.image:
            return ""
        relative = self.image.name.lstrip("/")
        if (Path(settings.MEDIA_ROOT) / relative).is_file():
            return self.image.url
        return static(relative)

    def price_display(self):
        from catalog.utils import format_price

        if self.price_to and self.price_to != self.price_from:
            return f"{format_price(self.price_from)} – {format_price(self.price_to)}"
        return format_price(self.price_from)


class QuoteRequest(models.Model):
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=40)
    email = models.EmailField(blank=True)
    product_type = models.CharField(max_length=120, blank=True)
    quantity = models.CharField(max_length=60, blank=True)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} – {self.product_type or 'Quote'}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=40)
    email = models.EmailField(blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} – {self.created_at:%Y-%m-%d}"


class Order(models.Model):
    STATUS_PENDING = "pending"
    STATUS_CONFIRMED = "confirmed"
    STATUS_SHIPPED = "shipped"
    STATUS_DELIVERED = "delivered"
    STATUS_CANCELLED = "cancelled"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_SHIPPED, "Shipped"),
        (STATUS_DELIVERED, "Delivered"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    PAYMENT_COD = "cod"
    PAYMENT_BANK = "bank"
    PAYMENT_CHOICES = [
        (PAYMENT_COD, "Cash on Delivery"),
        (PAYMENT_BANK, "Bank Transfer"),
    ]

    order_number = models.CharField(max_length=20, unique=True, editable=False)
    full_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=40)
    email = models.EmailField(blank=True)
    city = models.CharField(max_length=80)
    address = models.TextField()
    notes = models.TextField(blank=True)
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_CHOICES, default=PAYMENT_COD
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING
    )
    subtotal = models.PositiveIntegerField(default=0)
    shipping_fee = models.PositiveIntegerField(default=0)
    total = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.order_number

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self._generate_order_number()
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_order_number():
        import random
        from django.utils import timezone

        stamp = timezone.now().strftime("%y%m%d")
        for _ in range(20):
            candidate = f"PH{stamp}{random.randint(1000, 9999)}"
            if not Order.objects.filter(order_number=candidate).exists():
                return candidate
        return f"PH{stamp}{random.randint(10000, 99999)}"

    def total_display(self):
        from catalog.utils import format_price

        return format_price(self.total)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        Product, on_delete=models.SET_NULL, null=True, blank=True
    )
    product_name = models.CharField(max_length=255)
    product_slug = models.SlugField(max_length=200, blank=True)
    unit_price = models.PositiveIntegerField(default=0)
    quantity = models.PositiveIntegerField(default=1)
    line_total = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

    def line_total_display(self):
        from catalog.utils import format_price

        return format_price(self.line_total)

