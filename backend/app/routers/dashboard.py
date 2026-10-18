from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.models.invoice import Invoice
from app.models.receipt import Receipt
from app.models.project import SavedProject
from app.models.generation_history import GenerationHistory
from app.services.ai_provider import ai_service
from app.routers.auth import get_current_user
from app.routers.ai import get_user_privacy_mode

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def get_dashboard_stats(
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    inv_query = db.query(Invoice)
    rec_query = db.query(Receipt)
    proj_query = db.query(SavedProject)
    hist_query = db.query(GenerationHistory)

    if user:
        inv_query = inv_query.filter(Invoice.user_id == user.id)
        rec_query = rec_query.filter(Receipt.user_id == user.id)
        proj_query = proj_query.filter(SavedProject.user_id == user.id)
        hist_query = hist_query.filter(GenerationHistory.user_id == user.id)

    total_invoices = inv_query.count()
    total_invoiced_amount = db.query(func.sum(Invoice.total_amount)).filter(
        Invoice.user_id == user.id if user else True
    ).scalar() or 0.0

    total_receipts = rec_query.count()
    total_receipts_amount = db.query(func.sum(Receipt.total_amount)).filter(
        Receipt.user_id == user.id if user else True
    ).scalar() or 0.0

    total_projects = proj_query.count()
    total_generations = hist_query.count()

    recent_projects = proj_query.order_by(SavedProject.updated_at.desc()).limit(4).all()
    recent_history = hist_query.order_by(GenerationHistory.created_at.desc()).limit(5).all()

    privacy_mode = get_user_privacy_mode(user, db)
    model_status = await ai_service.get_model_status(active_mode=privacy_mode)

    return {
        "user": {
            "name": user.full_name if user else "Hustler",
            "business": user.business_name if user else "Solo Business",
            "plan": user.plan if user else "Free Plan",
        },
        "stats": {
            "total_invoices": total_invoices,
            "total_invoiced_amount": round(total_invoiced_amount, 2),
            "total_receipts": total_receipts,
            "total_expenses_tracked": round(total_receipts_amount, 2),
            "saved_projects": total_projects,
            "total_generations": total_generations
        },
        "model_status": model_status,
        "recent_projects": [
            {
                "id": p.id,
                "title": p.title,
                "tool_type": p.tool_type,
                "updated_at": p.updated_at.strftime("%b %d, %Y") if p.updated_at else ""
            }
            for p in recent_projects
        ],
        "recent_history": [
            {
                "id": h.id,
                "tool_name": h.tool_name,
                "prompt_summary": h.prompt_summary,
                "model_name": h.model_name,
                "is_local": h.is_local,
                "created_at": h.created_at.strftime("%b %d, %H:%M")
            }
            for h in recent_history
        ]
    }
