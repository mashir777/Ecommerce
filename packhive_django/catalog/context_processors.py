SITE = {
    "name": "PackHive",
    "tagline": "Pakistan's Trusted Food Packaging Partner",
    "phone": "+92 324-411-0157",
    "phone_href": "tel:+923244110157",
    "phone_alt": "",
    "email": "info@packhive.pk",
    "whatsapp": "923244110157",
    "whatsapp_href": "https://wa.me/923244110157",
    "address": "P No 11- Ali Town, R-W- Road Lahore, 54000, Pakistan",
    "hours": "Mon – Sat: 9:00 AM – 7:00 PM",
    "rating": "4.5",
    "customers": "1000+",
}

REVIEWS = [
    {"name": "Syed Ahsan Ali", "text": "Excellent product and got on time."},
    {
        "name": "Bilal Tallat",
        "text": "I have been purchasing these kraft packaging boxes for a few months now and I am really happy with the quality. They are really sturdy and do not break easily.",
    },
    {
        "name": "Afu Tallat",
        "text": "I recently bought packaging and was very impressed with the quality. The boxes are sturdy and well-made. The price was also right.",
    },
    {
        "name": "Hanan Talat",
        "text": "I'm a small business owner and these boxes are perfect for my needs. Easy to use, long-lasting, and great price point.",
    },
    {
        "name": "Danial Rafique",
        "text": "I've been using Kraft Stand-Up Pouches for over three months. The clear window shows the product while keeping contents safe.",
    },
    {
        "name": "Fasiha Ansar",
        "text": "I really enjoyed the packaging boxes. Great for any food business — keeps food fresh and protected during delivery.",
    },
]

HERO_SLIDES = [
    {
        "eyebrow": "PAKISTAN'S #1 FOOD PACKAGING PARTNER",
        "title": "Custom Food Packaging Boxes in Pakistan",
        "text": "Premium quality custom printed boxes, pouches & packaging solutions for businesses across Pakistan. Low MOQ, fast turnaround, and 100% brand-matching design.",
        "image": "hero/standup-pouches.webp",
        "short_label": "Kraft Pouches",
        "primary": {"label": "Shop Kraft Pouches ›", "href": "/shop/?cat=kraft-pouches"},
        "secondary": {"label": "Get Free Quote", "href": "/quote/"},
    },
    {
        "eyebrow": "SUSTAINABLE PACKAGING SOLUTIONS",
        "title": "Eco-Friendly Packaging Pakistan",
        "text": "Go green without compromising on quality. Our biodegradable & recyclable packaging helps your brand reduce its carbon footprint while looking premium.",
        "image": "hero/eco-packaging.webp",
        "short_label": "Eco Packaging",
        "primary": {"label": "Explore Eco Range ›", "href": "/shop/?cat=eco"},
        "secondary": {"label": "Request Sample", "href": "/quote/"},
    },
    {
        "eyebrow": "BRANDED CUP PRINTING",
        "title": "Custom Printed Cups & Glasses",
        "text": "Make every cup a brand moment. High-quality custom printed paper & plastic cups for cafes, restaurants, events & corporate gifting across Pakistan.",
        "image": "hero/coffee-cups.webp",
        "short_label": "Custom Cups",
        "primary": {"label": "Order Custom Cups ›", "href": "/shop/?cat=cups"},
        "secondary": {"label": "Get a Quote", "href": "/quote/"},
    },
    {
        "eyebrow": "FOOD & BAKERY PACKAGING",
        "title": "Custom Bakery Boxes Pakistan",
        "text": "From cupcakes to cakes — our custom bakery boxes keep your treats fresh & your brand looking delicious. Food-safe materials, custom sizes & printing.",
        "image": "hero/bakery-boxes.webp",
        "short_label": "Bakery Boxes",
        "primary": {"label": "Shop Bakery Boxes ›", "href": "/shop/?cat=bakery"},
        "secondary": {"label": "Custom Order", "href": "/quote/"},
    },
]


def site_settings(request):
    from catalog.cart import Cart

    cart = Cart(request)
    return {
        "site": SITE,
        "reviews": REVIEWS,
        "hero_slides": HERO_SLIDES,
        "cart": cart,
        "cart_count": cart.item_count,
    }
