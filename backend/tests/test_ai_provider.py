import asyncio
from app.schemas.ai import ListingRequest, MarketingRequest, EmailRequest
from app.services.ai_provider import LocalRuleEngine


def test_local_rule_engine_listing():
    async def _run():
        engine = LocalRuleEngine()
        req = ListingRequest(
            product_name="Ceramic Pour-Over Coffee Dripper",
            category="Kitchenware & Coffee",
            features="Heat-retaining stoneware, Spiral internal ribs, Dishwasher safe",
            target_audience="Home baristas and coffee enthusiasts",
            language="en",
            tone="Artisanal & Sophisticated",
            marketplace="Etsy"
        )
        res = await engine.generate_listing(req)
        assert "Ceramic Pour-Over Coffee Dripper" in res.seo_title
        assert len(res.key_selling_points) >= 3
        assert len(res.suggested_keywords) >= 3
        assert res.is_local is True
        assert res.inference_mode == "local"

    asyncio.run(_run())


def test_marketing_generation_hindi_support():
    async def _run():
        engine = LocalRuleEngine()
        req = MarketingRequest(
            product_or_service="Handmade Diya Gift Box",
            campaign_type="festival_offer",
            offer_details="Flat 25% discount + Free shipping",
            language="hi",
            tone="Festive & Joyful"
        )
        res = await engine.generate_marketing(req)
        assert len(res.content) > 50
        assert "tyohar" in res.content.lower() or "shubh" in res.content.lower() or "offer" in res.content.lower()
        assert res.is_local is True

    asyncio.run(_run())


def test_email_writer_quotation():
    async def _run():
        engine = LocalRuleEngine()
        req = EmailRequest(
            email_type="quotation",
            recipient_name="Marcus Vance",
            recipient_company="Apex Studio",
            subject_context="Brand Identity Package",
            key_details="Includes 3 logo concepts, style guide, and social assets for $1,200",
            tone="Professional"
        )
        res = await engine.generate_email(req)
        assert "Quotation" in res.subject_line
        assert "Marcus" in res.salutation
        assert "$1,200" in res.body
        assert res.is_local is True

    asyncio.run(_run())
