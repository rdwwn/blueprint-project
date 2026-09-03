import openpyxl

SRC = "C:/MyProjects/05-documents/The Blueprint Project - Free Opportunities.xlsx"
FIX = {
    "Law, Politics & Public": "Law",
    "Space, Earth & Environment": "Space",
    "International": "International",
    "Theater": "Theater",
    "Psychology & Neuroscience": "Psychology & Neuroscience",
}

wb = openpyxl.load_workbook(SRC)
ws = wb["All Opportunities"]
n = 0
for r in ws.iter_rows(min_row=2):
    if r[2].value and str(r[2].value).strip() in FIX:
        r[2].value = FIX[str(r[2].value).strip()]
        n += 1
print("fixed", n, "cells")
wb.save(SRC)