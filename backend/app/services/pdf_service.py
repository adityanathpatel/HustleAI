import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT, TA_LEFT, TA_CENTER


def generate_invoice_pdf(invoice_data: dict) -> bytes:
    """
    Generates a sleek, modern, professional invoice PDF using ReportLab.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Brand Palette
    NAVY = colors.HexColor("#0F172A")
    VIOLET = colors.HexColor("#4F46E5")
    SLATE_LIGHT = colors.HexColor("#F8FAFC")
    BORDER_COLOR = colors.HexColor("#E2E8F0")
    MUTED_TEXT = colors.HexColor("#64748B")

    title_style = ParagraphStyle(
        'InvoiceTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=NAVY
    )
    
    brand_tag_style = ParagraphStyle(
        'BrandTag',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=VIOLET
    )

    inv_meta_style = ParagraphStyle(
        'InvoiceMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        alignment=TA_RIGHT,
        textColor=NAVY
    )

    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=VIOLET
    )

    body_style = ParagraphStyle(
        'InvoiceBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=NAVY
    )

    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        alignment=TA_CENTER,
        textColor=MUTED_TEXT
    )

    elements = []

    # 1. Header Section
    header_data = [
        [
            Paragraph("<b>INVOICE</b>", title_style),
            Paragraph(f"<b>Invoice #:</b> {invoice_data.get('invoice_number', 'INV-001')}<br/>"
                      f"<b>Date:</b> {invoice_data.get('issue_date', 'N/A')}<br/>"
                      f"<b>Due Date:</b> {invoice_data.get('due_date', 'N/A')}", inv_meta_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[280, 250])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 15))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=VIOLET, spaceBefore=0, spaceAfter=15))

    # 2. Seller and Customer Details
    seller_name = invoice_data.get('seller_name', 'Business Owner')
    seller_email = invoice_data.get('seller_email', '')
    seller_phone = invoice_data.get('seller_phone', '')
    seller_address = invoice_data.get('seller_address', '')
    seller_tax_id = invoice_data.get('seller_tax_id', '')

    seller_info = f"<b>{seller_name}</b><br/>"
    if seller_email:
        seller_info += f"Email: {seller_email}<br/>"
    if seller_phone:
        seller_info += f"Phone: {seller_phone}<br/>"
    if seller_address:
        seller_info += f"Address: {seller_address}<br/>"
    if seller_tax_id:
        seller_info += f"Tax ID / GST: {seller_tax_id}<br/>"

    customer_name = invoice_data.get('customer_name', 'Client')
    customer_email = invoice_data.get('customer_email', '')
    customer_phone = invoice_data.get('customer_phone', '')
    customer_address = invoice_data.get('customer_address', '')

    customer_info = f"<b>{customer_name}</b><br/>"
    if customer_email:
        customer_info += f"Email: {customer_email}<br/>"
    if customer_phone:
        customer_info += f"Phone: {customer_phone}<br/>"
    if customer_address:
        customer_info += f"Address: {customer_address}<br/>"

    parties_data = [
        [
            Paragraph("<b>FROM:</b>", h2_style),
            Paragraph("<b>BILL TO:</b>", h2_style)
        ],
        [
            Paragraph(seller_info, body_style),
            Paragraph(customer_info, body_style)
        ]
    ]
    parties_table = Table(parties_data, colWidths=[265, 265])
    parties_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(parties_table)
    elements.append(Spacer(1, 20))

    # 3. Items Table
    currency = invoice_data.get('currency', 'USD')
    items = invoice_data.get('items', [])
    
    table_header = [
        Paragraph("<b>Description</b>", ParagraphStyle('TH', parent=body_style, fontName='Helvetica-Bold', textColor=colors.white)),
        Paragraph("<b>Qty</b>", ParagraphStyle('TH', parent=body_style, fontName='Helvetica-Bold', alignment=TA_RIGHT, textColor=colors.white)),
        Paragraph("<b>Unit Price</b>", ParagraphStyle('TH', parent=body_style, fontName='Helvetica-Bold', alignment=TA_RIGHT, textColor=colors.white)),
        Paragraph("<b>Total</b>", ParagraphStyle('TH', parent=body_style, fontName='Helvetica-Bold', alignment=TA_RIGHT, textColor=colors.white)),
    ]
    
    table_rows = [table_header]
    for item in items:
        desc = item.get('description', '')
        qty = item.get('quantity', 1)
        price = item.get('unit_price', 0.0)
        line_tot = item.get('line_total', qty * price)
        
        table_rows.append([
            Paragraph(desc, body_style),
            Paragraph(f"{qty:g}", ParagraphStyle('TR', parent=body_style, alignment=TA_RIGHT)),
            Paragraph(f"{currency} {price:,.2f}", ParagraphStyle('TR', parent=body_style, alignment=TA_RIGHT)),
            Paragraph(f"{currency} {line_tot:,.2f}", ParagraphStyle('TR', parent=body_style, alignment=TA_RIGHT)),
        ])

    items_table = Table(table_rows, colWidths=[280, 50, 100, 100])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 15))

    # 4. Totals Calculation Box
    subtotal = invoice_data.get('subtotal', 0.0)
    discount = invoice_data.get('discount_amount', 0.0)
    tax_rate = invoice_data.get('tax_rate_percent', 0.0)
    tax_amount = invoice_data.get('tax_amount', 0.0)
    total = invoice_data.get('total_amount', 0.0)

    totals_data = [
        [Paragraph("Subtotal:", ParagraphStyle('TL', parent=body_style, alignment=TA_RIGHT)),
         Paragraph(f"<b>{currency} {subtotal:,.2f}</b>", ParagraphStyle('TR', parent=body_style, alignment=TA_RIGHT))],
        [Paragraph("Discount:", ParagraphStyle('TL', parent=body_style, alignment=TA_RIGHT)),
         Paragraph(f"- {currency} {discount:,.2f}", ParagraphStyle('TR', parent=body_style, alignment=TA_RIGHT))],
        [Paragraph(f"Tax ({tax_rate}%):", ParagraphStyle('TL', parent=body_style, alignment=TA_RIGHT)),
         Paragraph(f"+ {currency} {tax_amount:,.2f}", ParagraphStyle('TR', parent=body_style, alignment=TA_RIGHT))],
        [Paragraph("<b>TOTAL DUE:</b>", ParagraphStyle('TLB', parent=body_style, fontName='Helvetica-Bold', fontSize=11, alignment=TA_RIGHT, textColor=NAVY)),
         Paragraph(f"<b>{currency} {total:,.2f}</b>", ParagraphStyle('TRB', parent=body_style, fontName='Helvetica-Bold', fontSize=11, alignment=TA_RIGHT, textColor=VIOLET))]
    ]
    
    totals_table = Table(totals_data, colWidths=[430, 100])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LINEABOVE', (0, 3), (1, 3), 1, VIOLET),
    ]))
    elements.append(totals_table)
    elements.append(Spacer(1, 20))

    # 5. Payment Instructions & Notes
    payment_inst = invoice_data.get('payment_instructions')
    notes = invoice_data.get('notes')
    
    if payment_inst or notes:
        notes_content = ""
        if payment_inst:
            notes_content += f"<b>Payment Instructions:</b><br/>{payment_inst}<br/><br/>"
        if notes:
            notes_content += f"<b>Notes:</b><br/>{notes}"
            
        notes_data = [[
            Paragraph("<b>ADDITIONAL DETAILS</b>", h2_style),
        ], [
            Paragraph(notes_content, body_style)
        ]]
        notes_table = Table(notes_data, colWidths=[530])
        notes_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), SLATE_LIGHT),
            ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('PADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(notes_table)
        elements.append(Spacer(1, 20))

    # 6. Footer Disclaimer
    elements.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=10, spaceAfter=8))
    elements.append(Paragraph(
        "Generated securely by HustleAI • Your AI. Your Business. Your Rules. • Not official legal or certified tax counsel.",
        disclaimer_style
    ))

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
