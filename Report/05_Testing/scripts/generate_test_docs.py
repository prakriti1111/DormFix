#!/usr/bin/env python3
"""
Generates Test_Cases.pdf and Test_Cases.md from:
  - test_catalog.py                      (test case definitions)
  - <server>/tests/evidence/*            (real results from `npm run test:evidence`)
  - ../manual_results.csv                (results of the manual UI tests, filled by the group)

Usage:  python3 generate_test_docs.py [--group "Group 07"] [--evidence PATH]
Requires: pip install reportlab
"""
import argparse, csv, json, os, sys
from collections import OrderedDict
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, PageBreak, KeepTogether)
from xml.sax.saxutils import escape
from test_catalog import AUTO, MANUAL

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.abspath(os.path.join(HERE, ".."))
ap = argparse.ArgumentParser()
ap.add_argument("--group", default="[Group Number]")
ap.add_argument("--evidence", default=os.path.join(BASE, "..", "04_Source_Code", "source_files", "server", "tests", "evidence"))
args = ap.parse_args()
EV = os.path.abspath(args.evidence)

def load_json(name, default=None):
    p = os.path.join(EV, name)
    return json.load(open(p)) if os.path.exists(p) else default

jest = load_json("jest-results.json")
meta = load_json("meta.json", {})
cov = load_json("coverage-summary.json")
if jest is None:
    sys.exit(f"No jest-results.json in {EV}. Run `npm run test:evidence` in the server folder first.")

status = {}
for tr in jest["testResults"]:
    for a in tr["assertionResults"]:
        tid = a["title"].split(":")[0].strip()
        status[tid] = ("PASS" if a["status"] == "passed" else "FAIL")
titles = {}
for tr in jest["testResults"]:
    for a in tr["assertionResults"]:
        tid, _, t = a["title"].partition(":")
        titles[tid.strip()] = t.strip()

actuals = {}
ap_path = os.path.join(EV, "actuals.ndjson")
if os.path.exists(ap_path):
    for line in open(ap_path):
        line = line.strip()
        if line:
            o = json.loads(line); actuals[o["id"]] = o["actual"]

manual = {}
mp = os.path.join(BASE, "manual_results.csv")
if os.path.exists(mp):
    for r in csv.DictReader(open(mp, newline="", encoding="utf-8")):
        manual[r["id"].strip()] = r

# ---------- build rows ----------
auto_rows = []
for tid, mod, inp, exp in AUTO:
    auto_rows.append(dict(id=tid, mod=mod, desc=titles.get(tid, ""), inp=inp, exp=exp,
                          act=actuals.get(tid, "-"), st=status.get(tid, "NOT RUN")))
man_rows = []
for tid, mod, steps, exp in MANUAL:
    m = manual.get(tid, {})
    shot = os.path.exists(os.path.join(BASE, "Test_Evidence", f"{tid}.png"))
    st = (m.get("status") or "").strip().upper() or "PENDING"
    act = (m.get("actual") or "").strip() or "Not yet executed - run manually and record result"
    man_rows.append(dict(id=tid, mod=mod, steps=steps, exp=exp, act=act, st=st,
                         shot=f"{tid}.png" + (" (attached)" if shot else " (to capture)")))

def count(rows, s): return sum(1 for r in rows if r["st"] == s)
n_auto = len(auto_rows); a_pass = count(auto_rows, "PASS"); a_fail = count(auto_rows, "FAIL")
n_man = len(man_rows); m_pass = count(man_rows, "PASS"); m_fail = count(man_rows, "FAIL"); m_pend = n_man - m_pass - m_fail

mods = OrderedDict()
for r in auto_rows:
    d = mods.setdefault(r["mod"], [0, 0, 0]); d[0] += 1
    d[1] += r["st"] == "PASS"; d[2] += r["st"] == "FAIL"

OBS = [
 ("OBS-1","High","Live app folder (server/server.js): the feedback and dashboard routes are commented out, so feedback (TC-28 to TC-32, TC-66 to TC-68) and the warden dashboard statistics (TC-69 to TC-71) return 404 there. The submission snapshot (04_Source_Code) has them enabled and all of those tests pass. Running the same suite against the live folder gave 59 pass / 11 fail; un-commenting the four lines gave 70/70.","Un-comment the two require() lines and the two app.use() lines in server/server.js, or re-sync the live code from 04_Source_Code."),
 ("OBS-2","Medium","Login page offers a \"Register as Warden\" link to /warden/register, but that route does not exist in App.jsx (the catch-all redirects to /), and the SRS says wardens are created by the seed script only.","Remove the link from Login.jsx (see UI-20)."),
 ("OBS-3","Low","Mongoose prints \"Duplicate schema index\" warnings for email and registrationNumber in models/User.js: the fields use unique: true and the file also calls schema.index() for them.","Delete the two userSchema.index(...) lines."),
 ("OBS-4","Info","The original tests/ folder contained only scaffolds with placeholder assertions (expect(true).toBe(true)) and could not run without a database. They were replaced by the suite documented here.","None."),
]

# ---------- PDF ----------
ss = getSampleStyleSheet()
H1 = ParagraphStyle("H1", parent=ss["Heading1"], fontSize=15, spaceAfter=6, textColor=colors.HexColor("#1f2d3d"))
H2 = ParagraphStyle("H2", parent=ss["Heading2"], fontSize=11.5, spaceBefore=10, spaceAfter=4, textColor=colors.HexColor("#1f2d3d"))
B = ParagraphStyle("B", parent=ss["BodyText"], fontSize=8.8, leading=11.5)
C = ParagraphStyle("C", parent=ss["BodyText"], fontSize=7, leading=8.6)
CH = ParagraphStyle("CH", parent=C, textColor=colors.white, fontName="Helvetica-Bold")
T = ParagraphStyle("T", parent=ss["Title"], fontSize=20, spaceAfter=4)

def P(t, st=C): return Paragraph(escape(str(t)).replace("\n", "<br/>"), st)
def badge(s):
    col = {"PASS": "#1b7f3b", "FAIL": "#c0262d"}.get(s, "#8a6d00")
    return Paragraph(f'<font color="{col}"><b>{s}</b></font>', C)

def table(header, rows, widths, repeat=1):
    data = [[Paragraph(h, CH) for h in header]] + rows
    t = Table(data, colWidths=widths, repeatRows=repeat)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2f4156")),
        ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#b8c2cc")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f4f6f8")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 3), ("RIGHTPADDING", (0, 0), (-1, -1), 3),
        ("TOPPADDING", (0, 0), (-1, -1), 2), ("BOTTOMPADDING", (0, 0), (-1, -1), 2)]))
    return t

def footer(c, d):
    c.saveState(); c.setFont("Helvetica", 7); c.setFillColor(colors.grey)
    c.drawString(15 * mm, 8 * mm, f"Dormfix - Test Cases and Results - {args.group}")
    c.drawRightString(landscape(A4)[0] - 15 * mm, 8 * mm, f"Page {d.page}"); c.restoreState()

out_pdf = os.path.join(BASE, "Test_Cases.pdf")
doc = SimpleDocTemplate(out_pdf, pagesize=landscape(A4), leftMargin=15*mm, rightMargin=15*mm,
                        topMargin=14*mm, bottomMargin=14*mm, title="Dormfix - Test Cases and Results")
W = landscape(A4)[0] - 30 * mm
s = []
s += [Paragraph("Dormfix - Test Cases and Results", T),
      Paragraph("Hostel Complaint &amp; Maintenance Management System - Mid-Semester Evaluation", B),
      Paragraph(f"<b>Group:</b> {escape(args.group)}", B), Spacer(1, 6)]

s.append(Paragraph("1. Test approach and environment", H2))
s.append(Paragraph(
    "Backend behaviour is tested automatically with <b>Jest 29</b> and <b>Supertest</b>: unit tests for pure logic "
    "(overdue rule, JWT, role middleware, response helpers) and integration tests that call the real Express app over HTTP "
    "against a real MongoDB database that is wiped before every test. Every automated test carries its Test ID in its name "
    "(e.g. <i>TC-24: ...</i>) and records the observed HTTP status/message, so the <b>Actual Result</b> columns below are "
    "generated from the run, not typed by hand. Browser behaviour (forms, navigation, role-based screens) is covered by the "
    "manual UI cases in section 4, which must be run and screenshotted by a group member.", B))
env = [["Run date (UTC)", meta.get("runAt", "-")], ["Node.js", meta.get("node", "-")],
       ["Platform", meta.get("platform", "-")], ["Database used", meta.get("database", "-")],
       ["Command", meta.get("command", "npm run test:evidence")],
       ["Test target", "04_Source_Code/source_files/server (submission snapshot)"]]
t = Table([[P(a, B), P(b, B)] for a, b in env], colWidths=[40*mm, W - 40*mm])
t.setStyle(TableStyle([("GRID", (0,0), (-1,-1), 0.3, colors.HexColor("#b8c2cc")),
                       ("BACKGROUND", (0,0), (0,-1), colors.HexColor("#eef1f4")), ("VALIGN", (0,0), (-1,-1), "TOP")]))
s += [Spacer(1, 3), t]

s.append(Paragraph("2. Summary", H2))
rows = [[P(m, C), P(v[0]), P(v[1]), P(v[2])] for m, v in mods.items()]
rows.append([P("Automated total"), P(n_auto), P(a_pass), P(a_fail)])
rows.append([P("Manual UI (pending until executed)"), P(n_man), P(m_pass), P(f"{m_fail} fail / {m_pend} pending")])
s.append(table(["Module", "Cases", "Pass", "Fail"], rows, [90*mm, 25*mm, 25*mm, 45*mm]))
if cov:
    tot = cov["total"]
    s.append(Spacer(1, 4))
    s.append(Paragraph(
        f"<b>Code coverage of the backend (Jest/Istanbul):</b> statements {tot['statements']['pct']}%, "
        f"branches {tot['branches']['pct']}%, functions {tot['functions']['pct']}%, lines {tot['lines']['pct']}%.", B))

s.append(PageBreak())
s.append(Paragraph("3. Automated test cases (Jest + Supertest)", H2))
hdr = ["ID", "Module", "Test description", "Input / scenario", "Expected result", "Actual result (recorded)", "Status"]
wd = [12*mm, 24*mm, 48*mm, 50*mm, 50*mm, 62*mm, 14*mm]
rows = [[P(r["id"]), P(r["mod"]), P(r["desc"]), P(r["inp"]), P(r["exp"]), P(r["act"]), badge(r["st"])] for r in auto_rows]
s.append(table(hdr, rows, wd))

s.append(PageBreak())
s.append(Paragraph("4. Manual UI test cases (to be executed in the browser)", H2))
s.append(Paragraph("Precondition: server and client running, database seeded with <i>npm run seed</i>. "
                   "Save one screenshot per case as <b>Test_Evidence/&lt;ID&gt;.png</b> and record the result in "
                   "<b>manual_results.csv</b>, then re-run <i>generate_test_docs.py</i>.", B))
s.append(Spacer(1, 3))
hdr = ["ID", "Area", "Steps", "Expected result", "Actual result", "Evidence file", "Status"]
wd = [12*mm, 26*mm, 62*mm, 62*mm, 50*mm, 34*mm, 14*mm]
rows = [[P(r["id"]), P(r["mod"]), P(r["steps"]), P(r["exp"]), P(r["act"]), P(r["shot"]), badge(r["st"])] for r in man_rows]
s.append(table(hdr, rows, wd))

s.append(PageBreak())
s.append(Paragraph("5. Observations and defects found during testing", H2))
rows = [[P(i), P(sv), P(d), P(f)] for i, sv, d, f in OBS]
s.append(table(["ID", "Severity", "Observation", "Recommended fix"], rows, [16*mm, 18*mm, 150*mm, 78*mm]))

s.append(Paragraph("6. How to reproduce", H2))
s.append(Paragraph(
    "From <i>04_Source_Code/source_files/server</i>: <b>npm install</b>, then <b>npm test</b> (or <b>npm run test:evidence</b> "
    "to also save logs, JSON results and coverage under tests/evidence/). The first run downloads a small MongoDB binary "
    "for mongodb-memory-server (internet needed once). To use an existing MongoDB instead, set MONGO_URI_TEST to a "
    "throw-away database URI. No real credentials are used by the tests.", B))
doc.build(s, onFirstPage=footer, onLaterPages=footer)

# ---------- Markdown ----------
md = [f"# Test Cases and Results\n", f"## Dormfix - Hostel Complaint & Maintenance Management System\n",
      f"**Group:** {args.group}\n",
      f"*Generated by `scripts/generate_test_docs.py` from the real Jest run ({meta.get('runAt','-')}, Node {meta.get('node','-')}, DB: {meta.get('database','-')}).*\n",
      f"**Automated:** {a_pass}/{n_auto} pass, {a_fail} fail. **Manual UI:** {m_pass} pass, {m_fail} fail, {m_pend} pending.\n"]
if cov:
    tot = cov["total"]
    md.append(f"**Coverage:** statements {tot['statements']['pct']}%, branches {tot['branches']['pct']}%, functions {tot['functions']['pct']}%, lines {tot['lines']['pct']}%.\n")
def cell(x): return str(x).replace("|", "\\|").replace("\n", " ")
md.append("\n## Automated test cases\n\n| ID | Module | Description | Input | Expected | Actual | Status |\n|---|---|---|---|---|---|---|")
for r in auto_rows:
    md.append("| " + " | ".join(cell(r[k]) for k in ("id","mod","desc","inp","exp","act","st")) + " |")
md.append("\n## Manual UI test cases\n\n| ID | Area | Steps | Expected | Actual | Evidence | Status |\n|---|---|---|---|---|---|---|")
for r in man_rows:
    md.append("| " + " | ".join(cell(r[k]) for k in ("id","mod","steps","exp","act","shot","st")) + " |")
md.append("\n## Observations\n\n| ID | Severity | Observation | Recommended fix |\n|---|---|---|---|")
for o in OBS: md.append("| " + " | ".join(cell(x) for x in o) + " |")
open(os.path.join(BASE, "Test_Cases.md"), "w", encoding="utf-8").write("\n".join(md) + "\n")
print(f"Wrote {out_pdf}\nAutomated {a_pass}/{n_auto} pass; manual pending {m_pend}")
