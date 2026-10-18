import pytest
from app.services.invoice_service import calculate_invoice_totals
from app.services.pdf_service import generate_invoice_pdf


def test_invoice_calculation_accuracy():
    items = [
        {"description": "Item A", "quantity": 3, "unit_price": 50.0},
        {"description": "Item B", "quantity": 2, "unit_price": 25.50},
    ]
    # Subtotal: (3 * 50) + (2 * 25.50) = 150 + 51 = 201.00
    # Discount: 20.00 -> Discounted: 181.00
    # Tax Rate: 10% -> Tax Amount: 18.10
    # Total: 181.00 + 18.10 = 199.10
    result = calculate_invoice_totals(items, tax_rate_percent=10.0, discount_amount=20.0)

    assert result["subtotal"] == 201.00
    assert result["discount_amount"] == 20.00
    assert result["tax_amount"] == 18.10
    assert result["total_amount"] == 199.10
    assert len(result["items"]) == 2
    assert result["items"][0]["line_total"] == 150.00
    assert result["items"][1]["line_total"] == 51.00


def test_invoice_excessive_discount_cannot_be_negative():
    items = [{"description": "Item X", "quantity": 1, "unit_price": 10.0}]
    result = calculate_invoice_totals(items, tax_rate_percent=10.0, discount_amount=50.0)
    assert result["subtotal"] == 10.0
    assert result["total_amount"] == 0.0


def test_invoice_pdf_generation():
    invoice_dict = {
        "invoice_number": "INV-TEST-99",
        "issue_date": "2026-10-18",
        "due_date": "2026-11-01",
        "seller_name": "Test Seller Co.",
        "customer_name": "Acme Corp",
        "currency": "USD",
        "subtotal": 100.0,
        "discount_amount": 10.0,
        "tax_rate_percent": 8.0,
        "tax_amount": 7.20,
        "total_amount": 97.20,
        "items": [
            {"description": "Consulting Hour", "quantity": 1, "unit_price": 100.0, "line_total": 100.0}
        ]
    }
    pdf_bytes = generate_invoice_pdf(invoice_dict)
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 500
    assert pdf_bytes.startswith(b"%PDF")
