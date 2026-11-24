#!/usr/bin/env python3
"""Ryvqena Tech business cards (90 x 55 mm, front + back per person, vector QR).

Usage:  python3 make_cards.py https://your-website-address
Needs:  pip install reportlab pillow
"""
import sys, os
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics import renderPDF
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from PIL import Image

URL = sys.argv[1] if len(sys.argv) > 1 else 'https://example.com'
HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, '..', 'public', 'images')

NAVY, BLUE, PAPER, INK, MUTED = HexColor('#08122B'), HexColor('#1456E0'), HexColor('#F6F3EC'), HexColor('#0B1B3A'), HexColor('#5B6781')
PHONE, EMAIL, PLACE = '+254 181 167 607', 'ryvqenatech@gmail.com', 'Nairobi, Kenya'
W, H = 90 * mm, 55 * mm

PEOPLE = [  # name, role line, status line
    ('Allan Mogunde', 'Chief Executive Officer', 'Founder'),
    ('Allan Jason', 'Chief Operating Officer', 'Co-founder'),
    ('Irene Kiragu', 'Head of Sales and Business Development', 'Co-founder'),
    ('Natasha Mugo', 'Financial Administrator', 'Co-founder'),
    ('Phoebe Mathenge', 'Chief Financial Officer', 'Co-founder'),
    ('Nduta Gitau', 'Human Resources', 'Co-founder'),
]

def png(name):
    p = f'/tmp/_rq_{name}.png'
    Image.open(os.path.join(IMG, name + '.webp')).convert('RGBA').save(p)
    return ImageReader(p)

LOGO_W, LOGO_D = png('brand-lockup'), png('brand-lockup-dark')

def fit(c, text, font, size, maxw):
    while stringWidth(text, font, size) > maxw and size > 5:
        size -= .2
    c.setFont(font, size)

def front(c, name, role, status):
    c.setFillColor(NAVY); c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(BLUE); c.rect(0, 0, 3.2 * mm, H, stroke=0, fill=1)
    lw = 40 * mm; c.drawImage(LOGO_W, 9 * mm, H - 8 * mm - lw * 105 / 445, lw, lw * 105 / 445, mask='auto')
    x = 9 * mm
    c.setFillColor(white); fit(c, name, 'Helvetica-Bold', 15, W - 18 * mm); c.drawString(x, 25 * mm, name)
    c.setFillColor(HexColor('#8FB3FF')); fit(c, role, 'Helvetica', 8.2, W - 18 * mm); c.drawString(x, 20.6 * mm, role)
    c.setFillColor(HexColor('#B9C4DC')); c.setFont('Helvetica', 7); c.drawString(x, 17.2 * mm, status.upper().replace('', ' ').strip() if False else status)
    c.setStrokeColor(HexColor('#2A3A66')); c.setLineWidth(.4); c.line(x, 14.2 * mm, W - 9 * mm, 14.2 * mm)
    c.setFillColor(white); c.setFont('Helvetica', 7.6)
    for i, t in enumerate((PHONE, EMAIL, PLACE)):
        c.drawString(x, (10.4 - i * 3.5) * mm, t)

def back(c):
    c.setFillColor(PAPER); c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(BLUE); c.rect(W - 3.2 * mm, 0, 3.2 * mm, H, stroke=0, fill=1)
    lw = 36 * mm; c.drawImage(LOGO_D, 9 * mm, H - 8 * mm - lw * 105 / 445, lw, lw * 105 / 445, mask='auto')
    q = QrCodeWidget(URL); q.barLevel = 'Q'; q.barFillColor = INK; q.barStrokeColor = INK
    b = q.getBounds(); size = 26 * mm; d = Drawing(size, size, transform=[size / (b[2] - b[0]), 0, 0, size / (b[3] - b[1]), 0, 0])
    d.add(q)
    qx, qy = W - 9 * mm - size - 3.2 * mm, 9 * mm
    c.setFillColor(white); c.rect(qx - 2 * mm, qy - 2 * mm, size + 4 * mm, size + 4 * mm, stroke=0, fill=1)
    renderPDF.draw(d, c, qx, qy)
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 9.5); c.drawString(9 * mm, 25 * mm, 'Technology Beyond')
    c.drawString(9 * mm, 21.4 * mm, 'the Expected.')
    c.setFillColor(MUTED); c.setFont('Helvetica', 7); c.drawString(9 * mm, 14 * mm, 'Scan to visit our website')
    c.drawString(9 * mm, 10.6 * mm, 'Software, AI and digital products')

out = os.path.join(HERE, 'ryvqena-business-cards.pdf')
c = canvas.Canvas(out, pagesize=(W, H)); c.setTitle('Ryvqena Tech business cards'); c.setAuthor('Ryvqena Tech')
for n, r, s in PEOPLE:
    front(c, n, r, s); c.showPage()
    back(c); c.showPage()
c.save(); print('wrote', out, 'QR ->', URL)
