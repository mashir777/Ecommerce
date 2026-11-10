from django import template

from catalog.utils import format_price as _format_price

register = template.Library()


@register.filter(name="format_price")
def format_price(value):
    return _format_price(value)


@register.filter
def whatsapp_order_url(product, whatsapp_href):
    from urllib.parse import quote

    text = f"Hi PackHive, I want to order: {product.name}"
    return f"{whatsapp_href}?text={quote(text)}"
