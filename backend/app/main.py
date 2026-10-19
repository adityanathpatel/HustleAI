import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, Invoice, InvoiceItem, Receipt, SavedProject, GenerationHistory, UserPreferences
from app.services.auth_service import hash_password
from app.routers import auth, ai, invoices, receipts, projects, dashboard

# Initialize Database Schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="HustleAI Backend API — Open-Source AI Side Hustle Platform"
)

# Enable CORS for local Vite development & network access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(ai.router)
app.include_router(invoices.router)
app.include_router(receipts.router)
app.include_router(projects.router)
app.include_router(dashboard.router)


@app.on_event("startup")
def seed_sample_data_if_empty():
    """Populates realistic initial sample items if database is freshly initialized."""
    db = SessionLocal()
    try:
        # Check if users exist
        user_count = db.query(User).count()
        if user_count == 0:
            demo_user = User(
                email="adityatemp@gmail.com",
                hashed_password=hash_password("Aditya@112"),
                full_name="Aditya Nath Patel",
                business_name="Rivera Handcrafted Co.",
                plan="pro"
            )
            db.add(demo_user)
            db.flush()

            # Default preferences
            prefs = UserPreferences(
                user_id=demo_user.id,
                default_currency="USD",
                default_language="en",
                business_name="Rivera Handcrafted Co.",
                active_ai_mode="local",
                local_endpoint="http://localhost:11434",
                local_model="llama3.2:3b"
            )
            db.add(prefs)

            # Sample Invoice
            sample_inv = Invoice(
                user_id=demo_user.id,
                invoice_number="INV-2026-001",
                issue_date="2026-10-15",
                due_date="2026-10-30",
                seller_name="Rivera Handcrafted Co.",
                seller_email="adityatemp@gmail.com",
                seller_phone="+1 (555) 349-2041",
                seller_address="142 Maker Studio Way, Austin, TX 78701",
                seller_tax_id="US-TX-998231",
                customer_name="Seraphina Green",
                customer_email="seraphina@greengallery.io",
                customer_phone="+1 (555) 891-2319",
                customer_address="78 Artisan Boulevard, Portland, OR 97201",
                currency="USD",
                subtotal=740.0,
                discount_amount=40.0,
                tax_rate_percent=8.25,
                tax_amount=57.75,
                total_amount=757.75,
                payment_instructions="Bank Transfer: First Artisan Credit Union, Routing #121000358, Acct #98421039.",
                notes="Thank you for supporting sustainable handmade crafts! Orders ship within 48 hours of payment receipt.",
                status="sent"
            )
            db.add(sample_inv)
            db.flush()

            item1 = InvoiceItem(
                invoice_id=sample_inv.id,
                description="Custom Walnut Desk Organizer with Brass Accent",
                quantity=4.0,
                unit_price=120.0,
                line_total=480.0
            )
            item2 = InvoiceItem(
                invoice_id=sample_inv.id,
                description="Artisan Minimalist Laptop Stand - Dark Oak",
                quantity=2.0,
                unit_price=130.0,
                line_total=260.0
            )
            db.add(item1)
            db.add(item2)

            # Sample Receipt
            sample_rec = Receipt(
                user_id=demo_user.id,
                original_filename="home_depot_hardwood_supplies.png",
                stored_filename="sample_seed_receipt_1.png",
                file_path="./uploads/sample_seed_receipt_1.png",
                file_size_bytes=1024 * 128,
                merchant="Home Depot",
                transaction_date="2026-10-12",
                total_amount=142.85,
                tax_amount=10.95,
                currency="USD",
                category="Inventory & Materials",
                confidence_score=0.95,
                is_uncertain=False,
                is_verified=True,
                raw_extracted_text="HOME DEPOT #481\nLUMBER & CRAFT MATERIALS\nSUBTOTAL: $131.90\nTAX: $10.95\nTOTAL: $142.85\nTHANK YOU FOR SHOPPING WITH US",
                notes="Raw walnut timber boards for autumn gift sets"
            )
            db.add(sample_rec)

            # Sample Saved Project
            sample_proj = SavedProject(
                user_id=demo_user.id,
                title="Etsy Launch: Artisan Oak Laptop Stand",
                tool_type="listing",
                content=(
                    "SEO Title: Handcrafted Solid Oak Laptop Stand – Ergonomic Desk Riser for MacBook & PC | Rivera Crafts\n\n"
                    "Short Description: Elevate your workstation with our handmade Solid Oak Laptop Stand. Crafted from sustainably harvested oak and finished with organic beeswax.\n\n"
                    "Key Selling Points:\n"
                    "• 100% Solid Kiln-Dried American Oak\n"
                    "• Ergonomic 15-degree viewing angle relieves neck strain\n"
                    "• Integrated cable pass-through and silicone non-slip pads\n"
                    "• Hand-finished with natural non-toxic plant oils\n\n"
                    "Keywords: oak laptop stand, wooden desk riser, macbook wood stand, ergonomic workstation, artisan office decor"
                ),
                metadata_json='{"marketplace":"Etsy","tone":"Artisanal & Warm","category":"Woodworking & Decor"}',
                tags="etsy,woodworking,launch",
                is_favorite=True
            )
            db.add(sample_proj)

            # Sample Generation History
            sample_hist = GenerationHistory(
                user_id=demo_user.id,
                tool_name="listing",
                prompt_summary="Listing for 'Artisan Oak Laptop Stand' on Etsy",
                generated_content="Handcrafted Solid Oak Laptop Stand...",
                model_name="HustleAI Local Rule Engine (Air-Gapped)",
                inference_mode="local",
                is_local=True,
                latency_ms=120.0,
                status="success"
            )
            db.add(sample_hist)

            db.commit()
        else:
            # Ensure demo account is synced in existing databases
            demo_user = db.query(User).filter(User.email == "adityatemp@gmail.com").first()
            if not demo_user:
                legacy = db.query(User).filter(User.email.in_(["alex@riveracrafts.com", "founder@hustleai.local"])).first()
                if legacy:
                    legacy.email = "adityatemp@gmail.com"
                    legacy.full_name = "Aditya Nath Patel"
                    legacy.hashed_password = hash_password("Aditya@112")
                else:
                    demo_user = User(
                        email="adityatemp@gmail.com",
                        hashed_password=hash_password("Aditya@112"),
                        full_name="Aditya Nath Patel",
                        business_name="Rivera Handcrafted Co.",
                        plan="pro"
                    )
                    db.add(demo_user)
            else:
                demo_user.full_name = "Aditya Nath Patel"
                demo_user.hashed_password = hash_password("Aditya@112")
            db.commit()
    except Exception as e:
        db.rollback()
        print(f"Sample data initialization note: {e}")
    finally:
        db.close()


@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "tagline": "Your AI. Your Business. Your Rules.",
        "version": settings.APP_VERSION,
        "status": "online",
        "docs_url": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "ok", "app": settings.APP_NAME}
