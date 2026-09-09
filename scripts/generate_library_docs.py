#!/usr/bin/env python3
"""
Renders the Library's downloadable documents.

The catalogue describes every resource — a bilingual title, a description and
the list of things the document contains. This turns that description into the
file, so a Library entry and its download cannot drift apart and nothing has to
be produced by hand.

Read the manifest first:

    node scripts/build-library-doc-manifest.mjs
    python3 scripts/generate_library_docs.py

Deterministic and safe to re-run: a file that already exists and is non-empty
is left alone unless --force is passed, so a document replaced through Admin is
never overwritten by a later run.

Requires: openpyxl, python-docx, reportlab, arabic-reshaper and python-bidi.
The PDFs are drawn directly rather than converted, so the renderer needs no
office suite and produces the same bytes anywhere; Arabic is reshaped and
reordered before drawing, and set in DejaVu Sans as the existing PDFs are.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

import docx
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt

import arabic_reshaper
from bidi.algorithm import get_display
from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, "scripts", "library-doc-manifest.json")
OUT = {k: os.path.join(ROOT, "resources", "library", k) for k in ("xlsx", "docx", "pdf")}

# Mirrored from the existing workbooks so a new sheet is indistinguishable.
INK = "FF17324D"
TEXT = "FF1F2933"
INPUT_BLUE = "FF0070C0"
HEADER_ROW = 5
FIRST_DATA_ROW = 6
LAST_DATA_ROW = 25

INSTRUCTIONS = [
    "Replace sample rows with your verified business data.",
    "Yellow and blue-font cells are intended for user inputs; calculated cells contain formulas.",
    "Review the Summary after completing the input table.",
    "Do not use sample values as market facts or investment advice.",
]

# The bilingual furniture every document carries, copied from the existing set.
INTRO_EN = ("This resource gives restaurant owners and operators a structured way to collect evidence, "
            "record decisions and turn material findings into actions with an owner and a date.")
INTRO_AR = ("يساعد هذا المورد ملاك المطاعم والمشغلين على جمع الأدلة وتسجيل القرارات وتحويل النتائج المهمة "
            "إلى إجراءات محددة بمسؤول وتاريخ. استبدل الإرشادات ببيانات المشروع الموثقة.")
META_ROWS = [
    ("Project / المشروع",),
    ("Prepared by / إعداد",),
    ("Review date / تاريخ المراجعة",),
    ("Decision owner / صاحب القرار",),
]
SECTION_HEADERS = ["Evidence / الدليل", "Source / المصدر", "Implication / الأثر", "Action / الإجراء"]
CHECK_HEADERS = ["Evidence / الدليل", "Status / الحالة", "Action / الإجراء"]
SECTION_PROMPT_EN = "Purpose and decision required / الغرض والقرار المطلوب"
SECTION_PROMPT_AR = "سجل الحقائق الموثقة ومصدرها وأثرها على المطعم والقرار أو الإجراء المطلوب."
CHECK_PROMPT_AR = "راجع هذا البند وسجل الدليل والحالة والإجراء المطلوب."

# ------------------------------------------------------------------ workbooks
#
# One column plan per workbook. Sample rows carry a label and editable numbers;
# every derived column is a formula, so the sheet computes rather than asserts.
# `{r}` is the row number.
I, F = "input", "formula"
SHEETS: dict[str, dict] = {
    "annual-budget-model": {
        "columns": [
            ("Revenue segment", I), ("Monthly revenue", I), ("Cost of sales %", I),
            ("Labour cost", I), ("Fixed cost share", I),
            ("Cost of sales", F, '=IFERROR($B{r}*$C{r},"")'),
            ("Monthly contribution", F, '=IFERROR($B{r}-F{r}-$D{r}-$E{r},"")'),
            ("Annualised", F, '=IFERROR(G{r}*12,"")'),
        ],
        "samples": [["Dine-in", None, None, None, None], ["Delivery", None, None, None, None],
                    ["Collection", None, None, None, None]],
        "summary": [
            ("Segments entered", '=COUNTA(Inputs!A{f}:A{l})'),
            ("Monthly revenue", '=SUM(Inputs!B{f}:B{l})'),
            ("Monthly contribution", '=SUM(Inputs!G{f}:G{l})'),
            ("Annualised contribution", '=SUM(Inputs!H{f}:H{l})'),
            ("Contribution margin", '=IFERROR(B7/B6,"")'),
        ],
        "assumptions": [("Downside revenue factor", 0.9), ("Downside cost-of-sales uplift", 0.03)],
    },
    "cash-flow-forecast": {
        "columns": [
            ("Month", I), ("Opening cash", I), ("Receipts", I), ("Payments", I),
            ("Net movement", F, '=IFERROR(C{r}-D{r},"")'),
            ("Closing cash", F, '=IFERROR(B{r}+E{r},"")'),
        ],
        "samples": [["Month 1", None, None, None], ["Month 2", None, None, None], ["Month 3", None, None, None]],
        "summary": [
            ("Months entered", '=COUNTA(Inputs!A{f}:A{l})'),
            ("Total receipts", '=SUM(Inputs!C{f}:C{l})'),
            ("Total payments", '=SUM(Inputs!D{f}:D{l})'),
            ("Net movement", '=IFERROR(B7-B8,"")'),
            ("Lowest closing cash", '=IFERROR(MIN(Inputs!F{f}:F{l}),"")'),
        ],
        "assumptions": [("Downside receipts factor", 0.9), ("Supplier payment terms (days)", 30)],
    },
    "food-cost-sheet": {
        "columns": [
            ("Ingredient", I), ("Pack size", I), ("Pack cost", I), ("Yield %", I), ("Portion qty", I),
            ("Usable pack size", F, '=IFERROR(B{r}*D{r},"")'),
            ("Cost per unit", F, '=IFERROR(C{r}/F{r},"")'),
            ("Cost per portion", F, '=IFERROR(G{r}*E{r},"")'),
        ],
        "samples": [["Ingredient A", None, None, None, None], ["Ingredient B", None, None, None, None],
                    ["Sub-recipe base", None, None, None, None]],
        "summary": [
            ("Ingredients entered", '=COUNTA(Inputs!A{f}:A{l})'),
            ("Total cost per plate", '=SUM(Inputs!H{f}:H{l})'),
            ("Highest cost per portion", '=IFERROR(MAX(Inputs!H{f}:H{l}),"")'),
        ],
    },
    "item-profitability-analysis": {
        "columns": [
            ("Menu item", I), ("Selling price", I), ("Food cost", I), ("Packaging", I),
            ("Channel commission %", I), ("Units sold", I),
            ("Gross profit", F, '=IFERROR(B{r}-C{r},"")'),
            ("Contribution per unit", F, '=IFERROR(B{r}-C{r}-D{r}-(B{r}*E{r}),"")'),
            ("Total contribution", F, '=IFERROR(H{r}*F{r},"")'),
            ("Loss-making", F, '=IF(H{r}="","",IF(H{r}<0,"REVIEW",""))'),
        ],
        "samples": [["Item A", None, None, None, None, None], ["Item B", None, None, None, None, None],
                    ["Item C", None, None, None, None, None]],
        "summary": [
            ("Items entered", '=COUNTA(Inputs!A{f}:A{l})'),
            ("Total contribution", '=SUM(Inputs!I{f}:I{l})'),
            ("Loss-making items", '=COUNTIF(Inputs!J{f}:J{l},"REVIEW")'),
            ("Best contribution per unit", '=IFERROR(MAX(Inputs!H{f}:H{l}),"")'),
        ],
    },
    "product-mix-analysis": {
        "columns": [
            ("Category", I), ("Item", I), ("Units this period", I), ("Units last period", I),
            ("Contribution per unit", I),
            ("Share of units", F, '=IFERROR(C{r}/SUM($C${f}:$C${l}),"")'),
            ("Period movement", F, '=IFERROR(C{r}-D{r},"")'),
            ("Movement %", F, '=IFERROR((C{r}-D{r})/D{r},"")'),
            ("Weighted contribution", F, '=IFERROR(C{r}*E{r},"")'),
        ],
        "samples": [["Category A", "Item A", None, None, None], ["Category A", "Item B", None, None, None],
                    ["Category B", "Item C", None, None, None]],
        "summary": [
            ("Items entered", '=COUNTA(Inputs!B{f}:B{l})'),
            ("Units this period", '=SUM(Inputs!C{f}:C{l})'),
            ("Units last period", '=SUM(Inputs!D{f}:D{l})'),
            ("Mix-weighted contribution", '=SUM(Inputs!I{f}:I{l})'),
            ("Largest gain", '=IFERROR(MAX(Inputs!G{f}:G{l}),"")'),
            ("Largest fall", '=IFERROR(MIN(Inputs!G{f}:G{l}),"")'),
        ],
    },
    "cafe-kpi-dashboard": {
        "columns": [
            ("Day part", I), ("Covers", I), ("Beverage revenue", I), ("Food revenue", I),
            ("Beverage cost", I), ("Food cost", I),
            ("Revenue", F, '=IFERROR(C{r}+D{r},"")'),
            ("Ticket size", F, '=IFERROR(G{r}/B{r},"")'),
            ("Attachment rate", F, '=IFERROR(D{r}/C{r},"")'),
            ("Gross margin", F, '=IFERROR((G{r}-E{r}-F{r})/G{r},"")'),
        ],
        "samples": [["Morning peak", None, None, None, None, None], ["Midday", None, None, None, None, None],
                    ["Afternoon", None, None, None, None, None]],
        "summary": [
            ("Day parts entered", '=COUNTA(Inputs!A{f}:A{l})'),
            ("Total covers", '=SUM(Inputs!B{f}:B{l})'),
            ("Total revenue", '=SUM(Inputs!G{f}:G{l})'),
            ("Average ticket size", '=IFERROR(B7/B6,"")'),
            ("Peak covers", '=IFERROR(MAX(Inputs!B{f}:B{l}),"")'),
        ],
    },
    "social-media-content-planner": {
        "columns": [
            ("Publish date", I), ("Content pillar", I), ("Format", I), ("Caption language", I),
            ("Production day", I), ("Reach", I), ("Engagements", I),
            ("Engagement rate", F, '=IFERROR(G{r}/F{r},"")'),
            ("Published", F, '=IF(A{r}="","",IF(F{r}="","planned","published"))'),
        ],
        "samples": [[None, "Pillar A", "Reel", "AR", None, None, None],
                    [None, "Pillar B", "Carousel", "EN", None, None, None],
                    [None, "Pillar C", "Photo", "AR + EN", None, None, None]],
        "summary": [
            ("Posts planned", '=COUNTA(Inputs!B{f}:B{l})'),
            ("Posts published", '=COUNTIF(Inputs!I{f}:I{l},"published")'),
            ("Total reach", '=SUM(Inputs!F{f}:F{l})'),
            ("Total engagements", '=SUM(Inputs!G{f}:G{l})'),
            ("Average engagement rate", '=IFERROR(B9/B8,"")'),
        ],
    },
}


def _title(ws, text):
    ws["A2"] = text
    ws["A2"].font = Font(bold=True, size=12, color=INK)


def _widths(ws, count):
    ws.column_dimensions["A"].width = 22
    for i in range(2, count + 1):
        ws.column_dimensions[get_column_letter(i)].width = 18


def _header(ws, labels):
    for i, label in enumerate(labels, start=1):
        c = ws.cell(HEADER_ROW, i, label)
        c.font = Font(bold=True, size=10, color="FFFFFFFF")
        c.fill = PatternFill("solid", fgColor=INK)
        c.alignment = Alignment(vertical="center", wrap_text=True)


def build_workbook(doc, spec):
    wb = Workbook()
    inputs = wb.active
    inputs.title = "Inputs"
    name = f"Noriva {doc['titleEn']}"
    cols = spec["columns"]

    _title(inputs, name)
    _widths(inputs, len(cols))
    _header(inputs, [c[0] for c in cols])
    inputs.freeze_panes = f"A{FIRST_DATA_ROW}"

    fmt = {"r": 0, "f": FIRST_DATA_ROW, "l": LAST_DATA_ROW}
    for offset in range(LAST_DATA_ROW - FIRST_DATA_ROW + 1):
        r = FIRST_DATA_ROW + offset
        sample = spec["samples"][offset] if offset < len(spec["samples"]) else []
        for i, col in enumerate(cols, start=1):
            cell = inputs.cell(r, i)
            if col[1] == F:
                cell.value = col[2].format(r=r, f=FIRST_DATA_ROW, l=LAST_DATA_ROW)
                cell.font = Font(size=10, color=INPUT_BLUE)
            else:
                if i - 1 < len(sample) and sample[i - 1] is not None:
                    cell.value = sample[i - 1]
                cell.font = Font(size=10, color=TEXT if i == 1 else INPUT_BLUE)

    if spec.get("assumptions"):
        a = wb.create_sheet("Assumptions")
        _title(a, name)
        _widths(a, 4)
        _header(a, ["Driver", "Base", "Downside", "Active"])
        for i, (label, base) in enumerate(spec["assumptions"]):
            r = FIRST_DATA_ROW + i
            a.cell(r, 1, label).font = Font(size=10, color=TEXT)
            a.cell(r, 2, base).font = Font(size=10, color=INPUT_BLUE)
            a.cell(r, 3).font = Font(size=10, color=INPUT_BLUE)
            c = a.cell(r, 4, f"=B{r}")
            c.font = Font(size=10, color=INPUT_BLUE)

    s = wb.create_sheet("Summary")
    _title(s, name)
    _widths(s, 2)
    _header(s, ["Metric", "Result"])
    for i, (label, formula) in enumerate(spec["summary"]):
        r = FIRST_DATA_ROW + i
        s.cell(r, 1, label).font = Font(size=10, color=TEXT)
        c = s.cell(r, 2, formula.format(**fmt))
        c.font = Font(size=10, color=INPUT_BLUE)

    ins = wb.create_sheet("Instructions")
    _title(ins, name)
    _widths(ins, 2)
    ins["A4"] = "How to use this workbook"
    ins["A4"].font = Font(bold=True, size=10, color=INK)
    for i, line in enumerate(INSTRUCTIONS):
        r = FIRST_DATA_ROW + i
        ins.cell(r, 1, i + 1).font = Font(size=10, color=TEXT)
        ins.cell(r, 2, line).font = Font(size=10, color=TEXT)
    ins.column_dimensions["B"].width = 96
    return wb


# --------------------------------------------------------------- word and pdf
def _para(d, text, *, style=None, bold=False, size=None, rtl=False, color=None):
    p = d.add_paragraph(text, style=style)
    if rtl:
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    for run in p.runs:
        run.bold = bold or run.bold
        if size:
            run.font.size = Pt(size)
    return p


def _table(d, headers, rows=3):
    t = d.add_table(rows=1 + rows, cols=len(headers))
    t.style = "Table Grid"
    for i, h in enumerate(headers):
        cell = t.rows[0].cells[i]
        cell.text = h
        for p in cell.paragraphs:
            for r in p.runs:
                r.bold = True
    return t


def build_document(doc, *, checklist: bool):
    """A report/brief (checklist=False) or a review guide (checklist=True)."""
    d = docx.Document()
    d.add_heading(doc["titleEn"], 0)
    _para(d, doc["titleAr"], rtl=True)
    _para(d, "NORIVA", bold=True)
    _para(d, doc["descEn"] or doc["summaryEn"])
    _para(d, doc["descAr"] or doc["summaryAr"], rtl=True)

    meta = d.add_table(rows=len(META_ROWS), cols=2)
    meta.style = "Table Grid"
    for i, (label,) in enumerate(META_ROWS):
        meta.rows[i].cells[0].text = label
        for p in meta.rows[i].cells[0].paragraphs:
            for r in p.runs:
                r.bold = True

    d.add_paragraph()
    if checklist:
        d.add_heading("Review points", level=1)
        _para(d, "نقاط المراجعة", rtl=True)
        for i, pair in enumerate(doc["includes"], start=1):
            en, ar = pair[0], pair[1]
            _para(d, f"{i}. {en}", bold=True)
            _para(d, f"{i}. {ar} — {CHECK_PROMPT_AR}", rtl=True)
            _table(d, CHECK_HEADERS)
            d.add_paragraph()
    else:
        for pair in doc["includes"]:
            en, ar = pair[0], pair[1]
            d.add_heading(en, level=1)
            _para(d, ar, rtl=True)
            _para(d, SECTION_PROMPT_EN, bold=True)
            _para(d, SECTION_PROMPT_AR, rtl=True)
            _table(d, SECTION_HEADERS)
            d.add_paragraph()

    if doc["audience"]:
        d.add_heading("Intended for", level=1)
        for pair in doc["audience"]:
            _para(d, f"{pair[0]} / {pair[1]}")
    return d


DEJAVU = "/usr/share/fonts/truetype/dejavu"
_FONTS_READY = False


def _fonts():
    """Registers DejaVu Sans, the family the existing Library PDFs already use."""
    global _FONTS_READY
    if _FONTS_READY:
        return
    pdfmetrics.registerFont(TTFont("Noriva", os.path.join(DEJAVU, "DejaVuSans.ttf")))
    pdfmetrics.registerFont(TTFont("Noriva-Bold", os.path.join(DEJAVU, "DejaVuSans-Bold.ttf")))
    pdfmetrics.registerFontFamily("Noriva", normal="Noriva", bold="Noriva-Bold")
    _FONTS_READY = True


def ar(text: str) -> str:
    """One line of Arabic as it must be drawn: joined, then ordered right-to-left.

    reportlab draws glyphs in the order it is given them and does no shaping, so
    unshaped Arabic comes out as disconnected letters in reverse. Reshaping and
    applying the bidi algorithm here is what makes the Arabic in these files
    read correctly rather than merely be present.

    Single lines only — see `ar_lines` for anything that can wrap.
    """
    return get_display(arabic_reshaper.reshape(text))


def ar_lines(text: str, font: str, size: float, width: float) -> str:
    """Arabic laid out over as many lines as it needs, in the right order.

    Reordering a whole paragraph and letting the renderer wrap it afterwards
    puts the lines themselves back to front: the reader gets the end of the
    sentence above its beginning. The wrap therefore has to happen first, on
    the reshaped-but-not-yet-reordered text, so each line can be reordered on
    its own while the lines stay in reading order.
    """
    reshaped = arabic_reshaper.reshape(text)
    lines, current = [], ""
    for word in reshaped.split(" "):
        candidate = f"{current} {word}".strip()
        if current and pdfmetrics.stringWidth(candidate, font, size) > width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return "<br/>".join(get_display(line) for line in lines)


def build_pdf(doc, target):
    _fonts()
    styles = getSampleStyleSheet()
    base = ParagraphStyle("nb", parent=styles["Normal"], fontName="Noriva", fontSize=9.5, leading=14,
                          textColor=colors.HexColor("#1F2933"))
    rtl = ParagraphStyle("nr", parent=base, alignment=TA_RIGHT)
    h1 = ParagraphStyle("nh", parent=base, fontName="Noriva-Bold", fontSize=17, leading=22,
                        textColor=colors.HexColor("#17324D"), spaceAfter=4)
    h2 = ParagraphStyle("nh2", parent=base, fontName="Noriva-Bold", fontSize=11, leading=15,
                        textColor=colors.HexColor("#17324D"), spaceBefore=10, spaceAfter=2)
    brand = ParagraphStyle("nbr", parent=base, fontName="Noriva-Bold", fontSize=9,
                           textColor=colors.HexColor("#2F6DB5"), spaceAfter=8)

    # A margin under the true frame width: the wrap is computed here but applied
    # by the renderer, and a line measured flush to the edge can still be broken
    # again on the page — which would put a reordered line back out of order.
    avail = (LETTER[0] - 44 * mm) * 0.93
    wrap = lambda t: ar_lines(t, "Noriva", base.fontSize, avail)

    story = [Paragraph(doc["titleEn"], h1), Paragraph(ar(doc["titleAr"]), rtl),
             Paragraph("NORIVA", brand),
             Paragraph(doc["descEn"] or doc["summaryEn"], base), Spacer(1, 4),
             Paragraph(wrap(doc["descAr"] or doc["summaryAr"]), rtl), Spacer(1, 10)]

    meta = Table([[Paragraph(_label(l), base), ""] for (l,) in META_ROWS],
                 colWidths=[70 * mm, 100 * mm])
    meta.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#C9D2DD")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F2F5F8")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story += [meta, Spacer(1, 12), Paragraph("Review points", h2), Paragraph(ar("نقاط المراجعة"), rtl)]

    header = [Paragraph(f"<b>{_label(h)}</b>", base) for h in CHECK_HEADERS]
    for i, pair in enumerate(doc["includes"], start=1):
        en, arabic = pair[0], pair[1]
        story.append(Paragraph(f"{i}. {en}", h2))
        story.append(Paragraph(wrap(f"{arabic} — {CHECK_PROMPT_AR}") + f" .{i}", rtl))
        t = Table([header, ["", "", ""]], colWidths=[80 * mm, 45 * mm, 45 * mm])
        t.setStyle(TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#C9D2DD")),
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F2F5F8")),
            ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("MINIMUMHEIGHT", (0, 1), (-1, 1), 16),
        ]))
        story += [Spacer(1, 3), t, Spacer(1, 6)]

    if doc["audience"]:
        story += [Spacer(1, 6), Paragraph("Intended for", h2)]
        for pair in doc["audience"]:
            story.append(Paragraph(_label(f"{pair[0]} / {pair[1]}"), base))

    SimpleDocTemplate(target, pagesize=LETTER, title=doc["titleEn"], author="Noriva",
                      leftMargin=22 * mm, rightMargin=22 * mm,
                      topMargin=20 * mm, bottomMargin=18 * mm).build(story)
    return target


def _label(text: str) -> str:
    """A bilingual 'English / عربي' label, with only the Arabic half reshaped."""
    if "/" not in text:
        return text
    left, _, right = text.partition("/")
    return f"{left.strip()} / {ar(right.strip())}"


def present(path):
    return os.path.exists(path) and os.path.getsize(path) > 0


def main():
    force = "--force" in sys.argv
    with open(MANIFEST, encoding="utf-8") as fh:
        documents = json.load(fh)["documents"]
    for d in OUT.values():
        os.makedirs(d, exist_ok=True)

    written, skipped, failed = 0, 0, []
    for doc in documents:
        kind, slug = doc["kind"], doc["slug"]
        target = os.path.join(OUT[kind], doc["file"])
        if present(target) and not force:
            skipped += 1
            continue
        try:
            if kind == "xlsx":
                spec = SHEETS.get(slug)
                if not spec:
                    failed.append(f"{slug}: no workbook plan")
                    continue
                build_workbook(doc, spec).save(target)
            elif kind == "docx":
                build_document(doc, checklist=False).save(target)
            elif kind == "pdf":
                build_pdf(doc, target)
            written += 1
            print(f"  rendered {kind}/{doc['file']}")
        except Exception as exc:  # noqa: BLE001 - reported, not swallowed
            failed.append(f"{slug}: {exc}")

    print(f"[library-docs] wrote {written}, left {skipped} in place, {len(failed)} failed")
    for f in failed:
        print(f"  !! {f}")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
