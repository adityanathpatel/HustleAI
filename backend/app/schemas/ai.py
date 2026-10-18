from pydantic import BaseModel, Field
from typing import Optional, List


# 1. Smart Listing Writer
class ListingRequest(BaseModel):
    product_name: str = Field(..., description="Name of the product")
    category: str = Field(..., description="e.g. Handmade Crafts, Electronics, Apparel, Home Decor")
    features: str = Field(..., description="Bullet points or key specs")
    target_audience: Optional[str] = Field("Everyday buyers", description="Target customer persona")
    language: Optional[str] = Field("en", description="en, hi, etc.")
    tone: Optional[str] = Field("Persuasive & Engaging", description="Tone of voice")
    marketplace: Optional[str] = Field("Amazon", description="Amazon, Etsy, eBay, Shopify, Instagram Shop, Local Store")
    price_point: Optional[str] = None


class ListingResponse(BaseModel):
    seo_title: str
    short_description: str
    long_description: str
    key_selling_points: List[str]
    suggested_keywords: List[str]
    call_to_action: str
    model_used: str
    inference_mode: str
    is_local: bool
    latency_ms: float


# 2. Marketing Copy Generator
class MarketingRequest(BaseModel):
    product_or_service: str
    campaign_type: str = Field(..., description="instagram_caption, whatsapp_promo, facebook_post, product_announcement, festival_offer, promo_email")
    offer_details: Optional[str] = None
    target_audience: Optional[str] = None
    language: Optional[str] = Field("en", description="en (English) or hi (Hindi / Hinglish)")
    tone: Optional[str] = Field("Catchy & Enthusiastic")
    length: Optional[str] = Field("medium", description="short, medium, long")
    include_emojis: Optional[bool] = True
    include_hashtags: Optional[bool] = True


class MarketingResponse(BaseModel):
    headline: str
    content: str
    suggested_hashtags: List[str]
    recommended_timing: Optional[str]
    call_to_action: str
    model_used: str
    inference_mode: str
    is_local: bool
    latency_ms: float


# 3. Business Email Writer
class EmailRequest(BaseModel):
    email_type: str = Field(..., description="follow_up, quotation, order_confirmation, payment_reminder, customer_support")
    recipient_name: str
    recipient_company: Optional[str] = None
    subject_context: str
    key_details: str
    tone: Optional[str] = Field("Professional & Courteous")
    language: Optional[str] = Field("en")


class EmailResponse(BaseModel):
    subject_line: str
    salutation: str
    body: str
    sign_off: str
    model_used: str
    inference_mode: str
    is_local: bool
    latency_ms: float


# Model & Privacy Status Schemas
class ModelStatus(BaseModel):
    active_mode: str  # "local" or "remote"
    local_available: bool
    local_endpoint: str
    local_model: str
    local_models_available: List[str] = []
    remote_available: bool
    remote_endpoint: str
    remote_model: str
    status_message: str
    latency_ms: Optional[float] = None
    privacy_badge: str  # e.g., "100% On-Device / Air-Gapped", "Remote API Gateway"


class ModelConfigUpdate(BaseModel):
    active_mode: Optional[str] = None
    local_endpoint: Optional[str] = None
    local_model: Optional[str] = None
    remote_endpoint: Optional[str] = None
    remote_model: Optional[str] = None
    remote_api_key: Optional[str] = None
