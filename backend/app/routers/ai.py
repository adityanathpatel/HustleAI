import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.generation_history import GenerationHistory
from app.models.preferences import UserPreferences
from app.schemas.ai import (
    ListingRequest, ListingResponse,
    MarketingRequest, MarketingResponse,
    EmailRequest, EmailResponse,
    ModelStatus, ModelConfigUpdate
)
from app.services.ai_provider import ai_service
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/ai", tags=["AI Generation"])


def get_user_privacy_mode(user: User | None, db: Session) -> str:
    if user:
        pref = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()
        if pref and pref.active_ai_mode:
            return pref.active_ai_mode
    return "local"


@router.get("/models/status", response_model=ModelStatus)
async def get_model_status(
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mode = get_user_privacy_mode(user, db)
    return await ai_service.get_model_status(active_mode=mode)


@router.post("/models/config", response_model=ModelStatus)
async def update_model_config(
    update_in: ModelConfigUpdate,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mode = update_in.active_mode or "local"
    if user:
        pref = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()
        if not pref:
            pref = UserPreferences(user_id=user.id)
            db.add(pref)
        if update_in.active_mode:
            pref.active_ai_mode = update_in.active_mode
        if update_in.local_endpoint:
            pref.local_endpoint = update_in.local_endpoint
        if update_in.local_model:
            pref.local_model = update_in.local_model
        if update_in.remote_endpoint:
            pref.remote_endpoint = update_in.remote_endpoint
        if update_in.remote_model:
            pref.remote_model = update_in.remote_model
        if update_in.remote_api_key:
            pref.has_remote_key = True
        db.commit()
        mode = pref.active_ai_mode

    return await ai_service.get_model_status(active_mode=mode)


@router.post("/listing", response_model=ListingResponse)
async def generate_listing(
    req: ListingRequest,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mode = get_user_privacy_mode(user, db)
    try:
        res = await ai_service.generate_listing(req, mode=mode)
        
        # Log generation history
        history = GenerationHistory(
            user_id=user.id if user else None,
            tool_name="listing",
            prompt_summary=f"Listing for '{req.product_name}' on {req.marketplace}",
            generated_content=res.seo_title + "\n\n" + res.short_description,
            model_name=res.model_used,
            inference_mode=res.inference_mode,
            is_local=res.is_local,
            latency_ms=res.latency_ms,
            status="success"
        )
        db.add(history)
        db.commit()
        return res
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/marketing", response_model=MarketingResponse)
async def generate_marketing(
    req: MarketingRequest,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mode = get_user_privacy_mode(user, db)
    try:
        res = await ai_service.generate_marketing(req, mode=mode)
        
        history = GenerationHistory(
            user_id=user.id if user else None,
            tool_name="marketing",
            prompt_summary=f"{req.campaign_type} for '{req.product_or_service}' ({req.language})",
            generated_content=res.headline + "\n\n" + res.content,
            model_name=res.model_used,
            inference_mode=res.inference_mode,
            is_local=res.is_local,
            latency_ms=res.latency_ms,
            status="success"
        )
        db.add(history)
        db.commit()
        return res
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/email", response_model=EmailResponse)
async def generate_email(
    req: EmailRequest,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mode = get_user_privacy_mode(user, db)
    try:
        res = await ai_service.generate_email(req, mode=mode)
        
        history = GenerationHistory(
            user_id=user.id if user else None,
            tool_name="email",
            prompt_summary=f"{req.email_type} email to '{req.recipient_name}' re: {req.subject_context}",
            generated_content=res.subject_line + "\n\n" + res.body,
            model_name=res.model_used,
            inference_mode=res.inference_mode,
            is_local=res.is_local,
            latency_ms=res.latency_ms,
            status="success"
        )
        db.add(history)
        db.commit()
        return res
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
