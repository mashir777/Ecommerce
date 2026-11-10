import json
from pathlib import Path

from django.core.management.base import BaseCommand

from catalog.models import Category, Product

CATEGORIES = [
    {"slug": "kraft-pouches", "name": "Kraft Standup Pouches", "image": "categories/kraft-pouches.webp"},
    {"slug": "zamzam", "name": "Zam Zam Packaging", "image": "categories/zamzam.webp"},
    {"slug": "shipping", "name": "Home Shifting Boxes", "image": "categories/shipping.webp"},
    {"slug": "cups", "name": "Coffee Cup", "image": "categories/cups.webp"},
    {"slug": "straws", "name": "Coffee Straws", "image": "categories/straws.webp"},
    {"slug": "bakery", "name": "Bakery Packaging", "image": "categories/bakery.webp"},
    {"slug": "cutlery", "name": "Eco Cutlery", "image": "categories/cutlery.webp"},
    {"slug": "eco", "name": "Eco Food Packaging", "image": "categories/eco.webp"},
    {"slug": "containers", "name": "Food Containers", "image": "categories/containers.webp"},
    {"slug": "icecream", "name": "Ice Cream Cup", "image": "categories/icecream.webp"},
    {"slug": "kraft-bags", "name": "Kraft Paper Bags", "image": "categories/kraft-bags.webp"},
    {"slug": "salad", "name": "Salad Bowls", "image": "categories/salad.webp"},
    {"slug": "burger", "name": "Burger Box", "image": "categories/burger.webp"},
    {"slug": "plastic-cup", "name": "Coffee Disposable Glass", "image": "categories/plastic-cup.webp"},
    {"slug": "acrylic", "name": "Acrylic Box", "image": "categories/acrylic.webp"},
    {"slug": "heart", "name": "Heart Shape Chocolate Box", "image": "categories/heart.webp"},
    {"slug": "pizza", "name": "Pizza Box", "image": "categories/pizza.webp"},
    {"slug": "tin", "name": "Tin Boxes", "image": "categories/tin.webp"},
]


class Command(BaseCommand):
    help = "Load PackHive categories and products from scraped-products.json"

    def add_arguments(self, parser):
        parser.add_argument(
            "--json",
            default="",
            help="Path to scraped-products.json (defaults to packhive/scraped-products.json)",
        )

    def handle(self, *args, **options):
        base = Path(__file__).resolve().parents[3]
        json_path = Path(options["json"]) if options["json"] else None
        if not json_path:
            candidates = [
                base.parent / "packhive" / "scraped-products.json",
                base / "scraped-products.json",
            ]
            json_path = next((p for p in candidates if p.exists()), candidates[0])

        if not json_path.exists():
            self.stderr.write(self.style.ERROR(f"JSON not found: {json_path}"))
            return

        def clean(text):
            if text is None:
                return ""
            s = str(text)
            # Drop invalid surrogate pairs that break SQLite UTF-8
            return s.encode("utf-8", "ignore").decode("utf-8").strip()

        products_data = json.loads(json_path.read_text(encoding="utf-8"))

        cat_map = {}
        for i, c in enumerate(CATEGORIES):
            obj, _ = Category.objects.update_or_create(
                slug=c["slug"],
                defaults={
                    "name": c["name"],
                    "image": c["image"],
                    "sort_order": i,
                },
            )
            cat_map[c["slug"]] = obj

        created = updated = 0
        for i, p in enumerate(products_data):
            cat_slug = p.get("category") or "eco"
            category = cat_map.get(cat_slug) or cat_map["eco"]
            image = (p.get("image") or "").lstrip("/")
            obj, was_created = Product.objects.update_or_create(
                slug=clean(p["slug"]),
                defaults={
                    "name": clean(p["name"]),
                    "image": clean(image),
                    "price_from": int(p.get("priceFrom") or 0),
                    "price_to": p.get("priceTo"),
                    "category": category,
                    "featured": bool(p.get("featured")) or i < 24,
                    "description": clean(p.get("description") or ""),
                },
            )
            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Categories: {len(cat_map)} | Products created: {created}, updated: {updated}"
            )
        )
