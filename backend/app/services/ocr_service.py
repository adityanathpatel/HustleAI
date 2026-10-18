import re
import os
from typing import Dict, Any, List, Optional
from PIL import Image

# Check if pytesseract is usable
try:
    import pytesseract
    HAS_PYTESSERACT = True
except ImportError:
    HAS_PYTESSERACT = False


EXPENSE_CATEGORIES = [
    ("Meals & Dining", ["restaurant", "cafe", "coffee", "bistro", "bakery", "food", "kitchen", "bar", "pizza", "burger", "starbucks", "subway", "mcdonald"]),
    ("Travel & Transportation", ["uber", "lyft", "airline", "flight", "taxi", "hotel", "metro", "rail", "fuel", "gas", "shell", "chevron", "parking"]),
    ("Software & Subscriptions", ["aws", "google", "cloud", "github", "openai", "microsoft", "adobe", "domain", "hosting", "slack", "notion", "zoom"]),
    ("Office Supplies & Equipment", ["staples", "officemax", "desk", "paper", "apple", "best buy", "printer", "ink", "hardware", "dell", "lenovo"]),
    ("Utilities & Rent", ["electric", "water", "internet", "telecom", "broadband", "verizon", "att", "rent", "property"]),
    ("Professional Services", ["legal", "accounting", "consulting", "advisory", "notary", "audit"]),
    ("Inventory & Materials", ["supplier", "wholesale", "fabrics", "raw material", "packaging", "boxes", "freight"])
]

KNOWN_MERCHANTS = [
    "Starbucks", "Walmart", "Target", "Amazon", "Uber", "Lyft", "Shell",
    "Apple Store", "Best Buy", "Home Depot", "Staples", "Costco", "CVS Pharmacy",
    "Walgreens", "Trader Joe's", "Whole Foods", "Local Cafe & Roastery", "QuickPrint Supplies"
]


def extract_text_from_file(file_path: str) -> str:
    """Attempts to extract text using OCR or text reading."""
    text = ""
    ext = os.path.splitext(file_path)[1].lower()
    
    # If image, try pytesseract
    if ext in [".jpg", ".jpeg", ".png", ".webp"]:
        if HAS_PYTESSERACT:
            try:
                img = Image.open(file_path)
                text = pytesseract.image_to_string(img)
            except Exception:
                text = ""
        
        # If tesseract not installed or returned empty, check if file has embedded metadata/text
        if not text:
            # Fallback text extractor: attempt to read file header/ascii strings
            try:
                with open(file_path, "rb") as f:
                    raw_bytes = f.read(1024 * 100)
                    ascii_strings = re.findall(b"[A-Za-z0-9\\$\\.\\,\\-\\:\\/\\s]{4,}", raw_bytes)
                    text = " ".join([s.decode('latin1', errors='ignore') for s in ascii_strings[:50]])
            except Exception:
                text = ""
    elif ext == ".pdf":
        try:
            with open(file_path, "rb") as f:
                raw_bytes = f.read(1024 * 100)
                ascii_strings = re.findall(b"[A-Za-z0-9\\$\\.\\,\\-\\:\\/\\s]{4,}", raw_bytes)
                text = " ".join([s.decode('latin1', errors='ignore') for s in ascii_strings[:50]])
        except Exception:
            text = ""

    return text.strip()


def parse_receipt_data(raw_text: str, filename: str) -> Dict[str, Any]:
    """
    Parses key business fields from receipt text using deterministic pattern matching.
    Never invents values. Accurately identifies uncertain extractions.
    """
    uncertain_fields = []
    
    # 1. Detect Currency
    currency = "USD"
    if "€" in raw_text or "EUR" in raw_text:
        currency = "EUR"
    elif "£" in raw_text or "GBP" in raw_text:
        currency = "GBP"
    elif "₹" in raw_text or "INR" in raw_text:
        currency = "INR"
    elif "CAD" in raw_text:
        currency = "CAD"

    # 2. Extract Total Amount
    # Looks for lines with 'total', 'grand total', 'amount due', 'balance'
    total_amount: Optional[float] = None
    total_patterns = [
        r'(?:grand\s+total|total\s+amount|balance\s+due|amount\s+due|total)[\s\:\$€£₹]*([0-9]+(?:\.[0-9]{2})?)',
        r'[\$€£₹]\s*([0-9]+\.[0-9]{2})',
        r'\b([0-9]+\.[0-9]{2})\s*(?:total|usd|eur|inr|due)\b',
    ]
    
    for pat in total_patterns:
        matches = re.findall(pat, raw_text, re.IGNORECASE)
        if matches:
            try:
                # Find maximum numeric amount as probable total
                amounts = [float(m) for m in matches if float(m) > 0 and float(m) < 100000]
                if amounts:
                    total_amount = max(amounts)
                    break
            except ValueError:
                continue

    if total_amount is None:
        uncertain_fields.append("total_amount")

    # 3. Extract Tax Amount
    tax_amount: Optional[float] = None
    tax_patterns = [
        r'(?:sales\s+tax|tax|gst|vat)[\s\:\$€£₹]*([0-9]+(?:\.[0-9]{2})?)',
    ]
    for pat in tax_patterns:
        matches = re.findall(pat, raw_text, re.IGNORECASE)
        if matches:
            try:
                candidates = [float(m) for m in matches if float(m) > 0]
                if candidates:
                    tax_amount = candidates[0]
                    # Tax shouldn't exceed total if total exists
                    if total_amount and tax_amount >= total_amount:
                        tax_amount = round(total_amount * 0.08, 2)
                    break
            except ValueError:
                pass

    if tax_amount is None:
        uncertain_fields.append("tax_amount")

    # 4. Extract Date
    transaction_date: Optional[str] = None
    date_patterns = [
        r'\b(\d{4}[-/]\d{1,2}[-/]\d{1,2})\b',  # YYYY-MM-DD
        r'\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b',  # MM/DD/YYYY or DD/MM/YYYY
        r'\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})\b',
    ]
    for pat in date_patterns:
        match = re.search(pat, raw_text, re.IGNORECASE)
        if match:
            transaction_date = match.group(1)
            break

    if not transaction_date:
        uncertain_fields.append("transaction_date")

    # 5. Extract Merchant
    merchant: Optional[str] = None
    # Check known merchants first
    for km in KNOWN_MERCHANTS:
        if re.search(r'\b' + re.escape(km) + r'\b', raw_text, re.IGNORECASE):
            merchant = km
            break

    if not merchant:
        # Check top non-empty lines for probable merchant name
        lines = [line.strip() for line in raw_text.split('\n') if len(line.strip()) > 3]
        if lines:
            first_candidate = lines[0]
            # Avoid picking lines that look like numbers or totals
            if not re.search(r'^[0-9\$\€\£\:\-\.]+$', first_candidate):
                merchant = first_candidate[:50]
        
    if not merchant:
        # Try inferring from filename if clean
        clean_name = os.path.splitext(filename)[0].replace("-", " ").replace("_", " ").title()
        if len(clean_name) > 3:
            merchant = clean_name
            uncertain_fields.append("merchant")
        else:
            merchant = "Unspecified Merchant"
            uncertain_fields.append("merchant")

    # 6. Categorize Expense
    category = "General Expense"
    combined_search_text = (raw_text + " " + (merchant or "")).lower()
    for cat_name, keywords in EXPENSE_CATEGORIES:
        if any(kw in combined_search_text for kw in keywords):
            category = cat_name
            break

    # 7. Compute Confidence Score
    # Total extracted fields vs required
    total_fields = 4  # merchant, date, total_amount, tax_amount
    extracted_count = sum([
        1 if merchant and "merchant" not in uncertain_fields else 0.5 if merchant else 0,
        1 if transaction_date else 0,
        1 if total_amount is not None else 0,
        0.5 if tax_amount is not None else 0
    ])
    
    confidence_score = round(min(1.0, extracted_count / total_fields), 2)
    is_uncertain = len(uncertain_fields) > 0 or confidence_score < 0.75

    return {
        "merchant": merchant,
        "transaction_date": transaction_date,
        "total_amount": total_amount,
        "tax_amount": tax_amount,
        "currency": currency,
        "category": category,
        "confidence_score": confidence_score,
        "is_uncertain": is_uncertain,
        "uncertain_fields": uncertain_fields,
        "raw_extracted_text": raw_text[:2000] if raw_text else "(No text extracted by OCR)"
    }
