from app.services.ocr_service import parse_receipt_data


def test_receipt_parsing_known_merchant_and_amounts():
    sample_text = """
    STARBUCKS STORE #1492
    SEATTLE, WA
    10/14/2026 09:23 AM
    1x Caramel Macchiato    $5.45
    1x Butter Croissant     $3.95
    Subtotal:               $9.40
    Tax:                    $0.85
    Total Amount:           $10.25
    Visa Ending in 4410
    """
    parsed = parse_receipt_data(sample_text, "starbucks_oct.jpg")
    assert parsed["merchant"] == "Starbucks"
    assert parsed["total_amount"] == 10.25
    assert parsed["tax_amount"] == 0.85
    assert parsed["category"] == "Meals & Dining"
    assert parsed["currency"] == "USD"
    assert parsed["is_uncertain"] is False


def test_receipt_parsing_flags_uncertain_missing_values():
    blurry_text = """
    RECEIPT SLIP
    ITEMS PURCHASED
    THANK YOU
    """
    parsed = parse_receipt_data(blurry_text, "unknown_receipt.png")
    assert parsed["total_amount"] is None
    assert "total_amount" in parsed["uncertain_fields"]
    assert parsed["is_uncertain"] is True
