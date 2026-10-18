from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.invoice import Invoice, InvoiceItem
from app.schemas.invoice import (
    InvoiceCreate, InvoiceUpdate, InvoiceResponse,
    InvoiceCalculationRequest, InvoiceCalculationResponse
)
from app.services.invoice_service import calculate_invoice_totals
from app.services.pdf_service import generate_invoice_pdf
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/invoices", tags=["Invoices"])


@router.post("/calculate", response_model=InvoiceCalculationResponse)
def calculate_totals_endpoint(calc_req: InvoiceCalculationRequest):
    """Real-time calculation helper without database persistence."""
    result = calculate_invoice_totals(
        items=calc_req.items,
        tax_rate_percent=calc_req.tax_rate_percent,
        discount_amount=calc_req.discount_amount
    )
    return result


@router.get("", response_model=List[InvoiceResponse])
def list_invoices(
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Invoice)
    if user:
        query = query.filter(Invoice.user_id == user.id)
    return query.order_by(Invoice.created_at.desc()).all()


@router.post("", response_model=InvoiceResponse)
def create_invoice(
    invoice_in: InvoiceCreate,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Perform strict financial calculation
    calc = calculate_invoice_totals(
        items=invoice_in.items,
        tax_rate_percent=invoice_in.tax_rate_percent or 0.0,
        discount_amount=invoice_in.discount_amount or 0.0
    )

    invoice = Invoice(
        user_id=user.id if user else None,
        invoice_number=invoice_in.invoice_number,
        issue_date=invoice_in.issue_date,
        due_date=invoice_in.due_date,
        seller_name=invoice_in.seller_name,
        seller_email=invoice_in.seller_email,
        seller_phone=invoice_in.seller_phone,
        seller_address=invoice_in.seller_address,
        seller_tax_id=invoice_in.seller_tax_id,
        customer_name=invoice_in.customer_name,
        customer_email=invoice_in.customer_email,
        customer_phone=invoice_in.customer_phone,
        customer_address=invoice_in.customer_address,
        currency=invoice_in.currency or "USD",
        tax_rate_percent=calc["tax_rate_percent"],
        subtotal=calc["subtotal"],
        discount_amount=calc["discount_amount"],
        tax_amount=calc["tax_amount"],
        total_amount=calc["total_amount"],
        payment_instructions=invoice_in.payment_instructions,
        notes=invoice_in.notes,
        status=invoice_in.status or "draft"
    )
    db.add(invoice)
    db.flush()

    for item_data in calc["items"]:
        item = InvoiceItem(
            invoice_id=invoice.id,
            description=item_data["description"],
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            line_total=item_data["line_total"]
        )
        db.add(item)

    db.commit()
    db.refresh(invoice)
    return invoice


@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(
    invoice_id: int,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found.")
    return invoice


@router.put("/{invoice_id}", response_model=InvoiceResponse)
def update_invoice(
    invoice_id: int,
    invoice_in: InvoiceUpdate,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found.")

    calc = calculate_invoice_totals(
        items=invoice_in.items,
        tax_rate_percent=invoice_in.tax_rate_percent or 0.0,
        discount_amount=invoice_in.discount_amount or 0.0
    )

    invoice.invoice_number = invoice_in.invoice_number
    invoice.issue_date = invoice_in.issue_date
    invoice.due_date = invoice_in.due_date
    invoice.seller_name = invoice_in.seller_name
    invoice.seller_email = invoice_in.seller_email
    invoice.seller_phone = invoice_in.seller_phone
    invoice.seller_address = invoice_in.seller_address
    invoice.seller_tax_id = invoice_in.seller_tax_id
    invoice.customer_name = invoice_in.customer_name
    invoice.customer_email = invoice_in.customer_email
    invoice.customer_phone = invoice_in.customer_phone
    invoice.customer_address = invoice_in.customer_address
    invoice.currency = invoice_in.currency or "USD"
    invoice.tax_rate_percent = calc["tax_rate_percent"]
    invoice.subtotal = calc["subtotal"]
    invoice.discount_amount = calc["discount_amount"]
    invoice.tax_amount = calc["tax_amount"]
    invoice.total_amount = calc["total_amount"]
    invoice.payment_instructions = invoice_in.payment_instructions
    invoice.notes = invoice_in.notes
    invoice.status = invoice_in.status or invoice.status

    # Replace items
    db.query(InvoiceItem).filter(InvoiceItem.invoice_id == invoice.id).delete()
    for item_data in calc["items"]:
        item = InvoiceItem(
            invoice_id=invoice.id,
            description=item_data["description"],
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            line_total=item_data["line_total"]
        )
        db.add(item)

    db.commit()
    db.refresh(invoice)
    return invoice


@router.delete("/{invoice_id}")
def delete_invoice(
    invoice_id: int,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found.")
    db.delete(invoice)
    db.commit()
    return {"message": "Invoice deleted successfully."}


@router.get("/{invoice_id}/pdf")
def export_invoice_pdf(
    invoice_id: int,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found.")

    invoice_dict = {
        "invoice_number": invoice.invoice_number,
        "issue_date": invoice.issue_date,
        "due_date": invoice.due_date,
        "seller_name": invoice.seller_name,
        "seller_email": invoice.seller_email,
        "seller_phone": invoice.seller_phone,
        "seller_address": invoice.seller_address,
        "seller_tax_id": invoice.seller_tax_id,
        "customer_name": invoice.customer_name,
        "customer_email": invoice.customer_email,
        "customer_phone": invoice.customer_phone,
        "customer_address": invoice.customer_address,
        "currency": invoice.currency,
        "subtotal": invoice.subtotal,
        "discount_amount": invoice.discount_amount,
        "tax_rate_percent": invoice.tax_rate_percent,
        "tax_amount": invoice.tax_amount,
        "total_amount": invoice.total_amount,
        "payment_instructions": invoice.payment_instructions,
        "notes": invoice.notes,
        "items": [
            {
                "description": it.description,
                "quantity": it.quantity,
                "unit_price": it.unit_price,
                "line_total": it.line_total
            }
            for it in invoice.items
        ]
    }

    pdf_bytes = generate_invoice_pdf(invoice_dict)
    filename = f"Invoice_{invoice.invoice_number.replace(' ', '_')}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=\"{filename}\""
        }
    )
