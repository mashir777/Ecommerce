def format_price(value):
    try:
        n = int(value)
    except (TypeError, ValueError):
        return value
    return f"₨ {n:,}"
