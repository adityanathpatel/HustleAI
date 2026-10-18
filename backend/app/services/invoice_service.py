from typing import List, Dict, Any
from app.schemas.invoice import InvoiceItemSchema


def calculate_invoice_totals(
    items: List[Dict[str, Any]] | List[InvoiceItemSchema],
    tax_rate_percent: float = 0.0,
    discount_amount: float = 0.0
) -> Dict[str, Any]:
    """
    Calculates subtotal, discounts, taxes, and total with mathematical accuracy.
    Ensures that LLMs never perform financial math, which must be deterministic.
    """
    calculated_items = []
    subtotal = 0.0

    for item in items:
        if isinstance(item, dict):
            desc = item.get("description", "").strip()
            qty = float(item.get("quantity", 1.0))
            price = float(item.get("unit_price", 0.0))
        else:
            desc = item.description.strip()
            qty = float(item.quantity)
            price = float(item.unit_price)

        line_total = round(qty * price, 2)
        subtotal += line_total

        calculated_items.append({
            "description": desc,
            "quantity": qty,
            "unit_price": price,
            "line_total": line_total
        })

    subtotal = round(subtotal, 2)
    discount = max(0.0, round(float(discount_amount), 2))
    discounted_subtotal = max(0.0, round(subtotal - discount, 2))
    
    tax_rate = max(0.0, min(100.0, float(tax_rate_percent)))
    tax_amount = round(discounted_subtotal * (tax_rate / 100.0), 2)
    total_amount = round(discounted_subtotal + tax_amount, 2)

    return {
        "items": calculated_items,
        "subtotal": subtotal,
        "discount_amount": discount,
        "tax_rate_percent": tax_rate,
        "tax_amount": tax_amount,
        "total_amount": total_amount
    }
