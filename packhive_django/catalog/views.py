from django.contrib import messages
from django.db import transaction
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST

from .cart import Cart
from .forms import CheckoutForm, ContactForm, QuoteForm
from .models import Category, Order, OrderItem, Product
from .utils import format_price

PRODUCT_TABS = [
    {"id": "all", "label": "Food Packaging"},
    {"id": "kraft-pouches", "label": "Kraft Standup Pouches"},
    {"id": "bakery", "label": "Bakery Packaging"},
    {"id": "cups", "label": "Disposable Packaging"},
]

CUP_TAB_SLUGS = {"cups", "containers", "plastic-cup", "icecream"}

# Free shipping threshold / flat fee (PKR)
SHIPPING_FEE = 250
FREE_SHIPPING_OVER = 15000


def _shipping_fee(subtotal: int) -> int:
    if subtotal <= 0:
        return 0
    if subtotal >= FREE_SHIPPING_OVER:
        return 0
    return SHIPPING_FEE


def home(request):
    categories = Category.objects.all()
    tab = request.GET.get("tab", "all")
    products = Product.objects.select_related("category")
    if tab == "cups":
        products = products.filter(category__slug__in=CUP_TAB_SLUGS)
    elif tab != "all":
        products = products.filter(category__slug=tab)
    products = products[:16]
    return render(
        request,
        "catalog/home.html",
        {
            "categories": categories,
            "products": products,
            "product_tabs": PRODUCT_TABS,
            "active_tab": tab,
        },
    )


def shop(request):
    cat = request.GET.get("cat") or ""
    categories = Category.objects.all()
    products = Product.objects.select_related("category")
    active = None
    if cat:
        active = categories.filter(slug=cat).first()
        if active:
            products = products.filter(category=active)
        else:
            products = products.none()
    return render(
        request,
        "catalog/shop.html",
        {
            "categories": categories,
            "products": products,
            "active": active,
            "cat": cat,
        },
    )


def product_detail(request, slug):
    product = get_object_or_404(Product.objects.select_related("category"), slug=slug)
    related = (
        Product.objects.filter(category=product.category)
        .exclude(pk=product.pk)
        .select_related("category")[:4]
    )
    return render(
        request,
        "catalog/product_detail.html",
        {"product": product, "related": related},
    )


def about(request):
    return render(request, "catalog/about.html")


def quote(request):
    if request.method == "POST":
        form = QuoteForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Quote request submitted. We will contact you soon.")
            return redirect("quote")
    else:
        form = QuoteForm()
    return render(request, "catalog/quote.html", {"form": form})


def contact(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Message sent. Thank you for contacting PackHive.")
            return redirect("contact")
    else:
        form = ContactForm()
    return render(request, "catalog/contact.html", {"form": form})


@require_POST
def cart_add(request, slug):
    product = get_object_or_404(Product, slug=slug)
    quantity = request.POST.get("quantity", 1)
    try:
        quantity = max(1, int(quantity))
    except (TypeError, ValueError):
        quantity = 1
    cart = Cart(request)
    cart.add(product, quantity=quantity)
    messages.success(request, f"Added “{product.name}” to cart.")
    next_url = request.POST.get("next") or request.GET.get("next")
    if next_url:
        return redirect(next_url)
    return redirect("cart")


@require_POST
def cart_update(request, product_id):
    cart = Cart(request)
    quantity = request.POST.get("quantity", 1)
    cart.update(product_id, quantity)
    messages.success(request, "Cart updated.")
    return redirect("cart")


@require_POST
def cart_remove(request, product_id):
    cart = Cart(request)
    cart.remove(product_id)
    messages.success(request, "Item removed from cart.")
    return redirect("cart")


def cart_view(request):
    cart = Cart(request)
    subtotal = cart.subtotal
    shipping = _shipping_fee(subtotal)
    total = subtotal + shipping
    return render(
        request,
        "catalog/cart.html",
        {
            "cart_items": list(cart),
            "subtotal": subtotal,
            "subtotal_display": format_price(subtotal),
            "shipping": shipping,
            "shipping_display": "Free" if shipping == 0 and subtotal > 0 else format_price(shipping),
            "total": total,
            "total_display": format_price(total),
            "free_shipping_over": FREE_SHIPPING_OVER,
            "free_shipping_over_display": format_price(FREE_SHIPPING_OVER),
        },
    )


def checkout(request):
    cart = Cart(request)
    if cart.is_empty():
        messages.info(request, "Your cart is empty. Add products before checkout.")
        return redirect("shop")

    subtotal = cart.subtotal
    shipping = _shipping_fee(subtotal)
    total = subtotal + shipping

    if request.method == "POST":
        form = CheckoutForm(request.POST)
        if form.is_valid():
            with transaction.atomic():
                order = form.save(commit=False)
                order.subtotal = subtotal
                order.shipping_fee = shipping
                order.total = total
                order.status = Order.STATUS_PENDING
                order.save()
                for item in cart:
                    OrderItem.objects.create(
                        order=order,
                        product=item["product"],
                        product_name=item["product"].name,
                        product_slug=item["product"].slug,
                        unit_price=item["price"],
                        quantity=item["quantity"],
                        line_total=item["total"],
                    )
                cart.clear()
            messages.success(
                request,
                f"Order {order.order_number} placed successfully. We will confirm on WhatsApp.",
            )
            return redirect("order_success", order_number=order.order_number)
    else:
        form = CheckoutForm(initial={"payment_method": Order.PAYMENT_COD})

    return render(
        request,
        "catalog/checkout.html",
        {
            "form": form,
            "cart_items": list(cart),
            "subtotal": subtotal,
            "subtotal_display": format_price(subtotal),
            "shipping": shipping,
            "shipping_display": "Free" if shipping == 0 else format_price(shipping),
            "total": total,
            "total_display": format_price(total),
        },
    )


def order_success(request, order_number):
    order = get_object_or_404(
        Order.objects.prefetch_related("items"), order_number=order_number
    )
    return render(request, "catalog/order_success.html", {"order": order})
