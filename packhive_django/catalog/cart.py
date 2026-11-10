from .models import Product
from .utils import format_price

CART_SESSION_KEY = "packhive_cart"


class Cart:
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get(CART_SESSION_KEY)
        if not cart:
            cart = self.session[CART_SESSION_KEY] = {}
        self.cart = cart

    def add(self, product, quantity=1, override=False):
        product_id = str(product.id)
        quantity = max(1, int(quantity or 1))
        if product_id not in self.cart:
            self.cart[product_id] = {
                "quantity": 0,
                "price": int(product.price_from or 0),
            }
        if override:
            self.cart[product_id]["quantity"] = quantity
        else:
            self.cart[product_id]["quantity"] += quantity
        self.cart[product_id]["price"] = int(product.price_from or 0)
        self.save()

    def update(self, product_id, quantity):
        product_id = str(product_id)
        if product_id not in self.cart:
            return
        quantity = int(quantity or 0)
        if quantity <= 0:
            self.remove(product_id)
            return
        self.cart[product_id]["quantity"] = quantity
        self.save()

    def remove(self, product_id):
        product_id = str(product_id)
        if product_id in self.cart:
            del self.cart[product_id]
            self.save()

    def clear(self):
        self.session[CART_SESSION_KEY] = {}
        self.cart = self.session[CART_SESSION_KEY]
        self.save()

    def save(self):
        self.session[CART_SESSION_KEY] = self.cart
        self.session.modified = True

    def __iter__(self):
        product_ids = self.cart.keys()
        products = Product.objects.filter(id__in=product_ids).select_related("category")
        product_map = {str(p.id): p for p in products}
        for product_id, item in self.cart.items():
            product = product_map.get(product_id)
            if not product:
                continue
            quantity = int(item.get("quantity") or 0)
            price = int(item.get("price") or product.price_from or 0)
            yield {
                "product": product,
                "product_id": product_id,
                "quantity": quantity,
                "price": price,
                "total": price * quantity,
                "price_display": format_price(price),
                "total_display": format_price(price * quantity),
            }

    def __len__(self):
        return sum(int(item.get("quantity") or 0) for item in self.cart.values())

    @property
    def item_count(self):
        return len(self)

    @property
    def subtotal(self):
        return sum(int(i["total"]) for i in self)

    @property
    def subtotal_display(self):
        return format_price(self.subtotal)

    def is_empty(self):
        return self.item_count == 0
