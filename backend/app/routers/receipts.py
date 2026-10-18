import os
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models.user import User
from app.models.receipt import Receipt
from app.schemas.receipt import ReceiptResponse, ReceiptUpdate
from app.services.ocr_service import extract_text_from_file, parse_receipt_data
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/receipts", tags=["Receipts"])

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=ReceiptResponse)
async def upload_receipt(
    file: UploadFile = File(...),
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate extension
    file_ext = os.path.splitext(file.filename or "")[1].lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{file_ext}'. Allowed formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    # Read and validate file size (strict limit)
    contents = await file.read()
    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB."
        )

    # Generate secure storage filename (never trust uploaded filename)
    safe_filename = f"{uuid.uuid4().hex}{file_ext}"
    saved_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    with open(saved_path, "wb") as f:
        f.write(contents)

    # Extract text and run deterministic field extraction
    raw_text = extract_text_from_file(saved_path)
    
    # If the file had readable ASCII text in it, parse it; otherwise provide clean extraction
    parsed = parse_receipt_data(raw_text, file.filename or "receipt")

    receipt = Receipt(
        user_id=user.id if user else None,
        original_filename=file.filename or "uploaded_receipt",
        stored_filename=safe_filename,
        file_path=saved_path,
        file_size_bytes=len(contents),
        merchant=parsed["merchant"],
        transaction_date=parsed["transaction_date"],
        total_amount=parsed["total_amount"],
        tax_amount=parsed["tax_amount"],
        currency=parsed["currency"],
        category=parsed["category"],
        confidence_score=parsed["confidence_score"],
        is_uncertain=parsed["is_uncertain"],
        is_verified=False,
        raw_extracted_text=parsed["raw_extracted_text"]
    )
    db.add(receipt)
    db.commit()
    db.refresh(receipt)

    resp = ReceiptResponse.model_validate(receipt)
    resp.uncertain_fields = parsed["uncertain_fields"]
    return resp


@router.get("", response_model=List[ReceiptResponse])
def list_receipts(
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Receipt)
    if user:
        query = query.filter(Receipt.user_id == user.id)
    receipts = query.order_by(Receipt.created_at.desc()).all()
    
    results = []
    for r in receipts:
        resp = ReceiptResponse.model_validate(r)
        # determine missing fields
        uncertain = []
        if not r.merchant or r.merchant == "Unspecified Merchant":
            uncertain.append("merchant")
        if not r.transaction_date:
            uncertain.append("transaction_date")
        if r.total_amount is None:
            uncertain.append("total_amount")
        resp.uncertain_fields = uncertain
        results.append(resp)
    return results


@router.get("/{receipt_id}", response_model=ReceiptResponse)
def get_receipt(
    receipt_id: int,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found.")
    
    resp = ReceiptResponse.model_validate(receipt)
    uncertain = []
    if not receipt.merchant or receipt.merchant == "Unspecified Merchant":
        uncertain.append("merchant")
    if not receipt.transaction_date:
        uncertain.append("transaction_date")
    if receipt.total_amount is None:
        uncertain.append("total_amount")
    resp.uncertain_fields = uncertain
    return resp


@router.put("/{receipt_id}", response_model=ReceiptResponse)
def update_receipt(
    receipt_id: int,
    update_in: ReceiptUpdate,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found.")

    if update_in.merchant is not None:
        receipt.merchant = update_in.merchant
    if update_in.transaction_date is not None:
        receipt.transaction_date = update_in.transaction_date
    if update_in.total_amount is not None:
        receipt.total_amount = update_in.total_amount
    if update_in.tax_amount is not None:
        receipt.tax_amount = update_in.tax_amount
    if update_in.currency is not None:
        receipt.currency = update_in.currency
    if update_in.category is not None:
        receipt.category = update_in.category
    if update_in.notes is not None:
        receipt.notes = update_in.notes
    if update_in.is_verified is not None:
        receipt.is_verified = update_in.is_verified
        if update_in.is_verified:
            receipt.is_uncertain = False
            receipt.confidence_score = 1.0

    db.commit()
    db.refresh(receipt)
    
    resp = ReceiptResponse.model_validate(receipt)
    resp.uncertain_fields = []
    return resp


@router.delete("/{receipt_id}")
def delete_receipt(
    receipt_id: int,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found.")
    
    # Remove file on disk safely
    if os.path.exists(receipt.file_path):
        try:
            os.remove(receipt.file_path)
        except OSError:
            pass

    db.delete(receipt)
    db.commit()
    return {"message": "Receipt removed successfully."}
