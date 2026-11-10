from django import forms
from django.contrib import admin
from django.db import models
from django.utils.html import format_html

from .models import (
    Category,
    ContactMessage,
    Order,
    OrderItem,
    Product,
    QuoteRequest,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("image_preview", "name", "slug", "sort_order")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "slug")

    @admin.display(description="Image")
    def image_preview(self, obj):
        if not obj.image_url:
            return "—"
        return format_html(
            '<img src="{}" alt="" style="height:40px;width:40px;object-fit:cover;border-radius:6px;" />',
            obj.image_url,
        )


class ProductImageWidget(forms.ClearableFileInput):
    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        instance = getattr(value, "instance", None)
        if instance is not None and getattr(instance, "image_url", ""):
            class _Preview:
                def __init__(self, stored, url):
                    self.url = url
                    self._stored = stored

                def __str__(self):
                    return str(self._stored)

            context["widget"]["value"] = _Preview(value, instance.image_url)
        return context


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("image_preview", "name", "category", "price_from", "price_to", "featured")
    list_filter = ("category", "featured")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if isinstance(db_field, models.ImageField):
            kwargs["widget"] = ProductImageWidget
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    @admin.display(description="Image")
    def image_preview(self, obj):
        if not obj.image_url:
            return "—"
        return format_html(
            '<img src="{}" alt="" style="height:40px;width:40px;object-fit:cover;border-radius:6px;" />',
            obj.image_url,
        )


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = (
        "product",
        "product_name",
        "product_slug",
        "unit_price",
        "quantity",
        "line_total",
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "order_number",
        "full_name",
        "phone",
        "city",
        "payment_method",
        "status",
        "total",
        "created_at",
    )
    list_filter = ("status", "payment_method", "city")
    search_fields = ("order_number", "full_name", "phone", "email")
    readonly_fields = (
        "order_number",
        "subtotal",
        "shipping_fee",
        "total",
        "created_at",
        "updated_at",
    )
    inlines = [OrderItemInline]


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "product_type", "created_at")
    search_fields = ("name", "phone", "email")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "email", "created_at")
    search_fields = ("name", "phone", "email", "message")
