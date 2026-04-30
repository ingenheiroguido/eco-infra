from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


from fastapi import FastAPI
from pydantic import BaseModel
import math

app = FastAPI()

class Building(BaseModel):
    floors: int
    units_per_floor: int
    people_per_unit: int

@app.post("/calculate")
def calculate(data: Building):

    # população
    population = data.floors * data.units_per_floor * data.people_per_unit

    # geração de resíduos
    waste_per_person = 1.0
    waste_total = population * waste_per_person

    # separação
    organic = waste_total * 0.5
    recyclable = waste_total * 0.3
    reject = waste_total * 0.2

    # densidades (kg/m³)
    density_organic = 300
    density_recyclable = 100
    density_reject = 150

    # volumes por tipo
    vol_organic = organic / density_organic
    vol_recyclable = recyclable / density_recyclable
    vol_reject = reject / density_reject

    volume_total = vol_organic + vol_recyclable + vol_reject

    # armazenamento
    storage_days = 2
    volume_real = volume_total * storage_days

    # 📐 área da sala
    altura_sala = 2.5
    area_sala = volume_real / altura_sala

    area_minima = 4
    area_sala_final = max(area_sala, area_minima)

    # 🗑️ containers (240 litros = 0.24 m³)
    container_volume = 0.24

    containers_organic = math.ceil((vol_organic * storage_days) / container_volume)
    containers_recyclable = math.ceil((vol_recyclable * storage_days) / container_volume)
    containers_reject = math.ceil((vol_reject * storage_days) / container_volume)

    return {
        "population": population,
        "organic": round(organic, 2),
        "recyclable": round(recyclable, 2),
        "reject": round(reject, 2),

        "volume_total": round(volume_total, 2),
        "volume_real": round(volume_real, 2),

        "area_sala": round(area_sala_final, 2),

        # 🔥 NOVO (nível profissional)
        "containers": {
            "organic": containers_organic,
            "recyclable": containers_recyclable,
            "reject": containers_reject
        }
    }

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors

@app.post("/generate-pdf")
def generate_pdf(data: Building):

    result = calculate(data)

    file_path = "relatorio.pdf"

    doc = SimpleDocTemplate(file_path)
    styles = getSampleStyleSheet()
    elements = []

    # Título
    elements.append(Paragraph("RELATÓRIO DE DIMENSIONAMENTO DE RESÍDUOS", styles["Title"]))
    elements.append(Spacer(1, 12))

    # Dados gerais
    elements.append(Paragraph("Dados do Projeto", styles["Heading2"]))
    elements.append(Paragraph(f"População: {result['population']}", styles["Normal"]))
    elements.append(Spacer(1, 10))

    # Tabela resíduos
    data_table = [
        ["Tipo", "Quantidade (kg)"],
        ["Orgânico", result["organic"]],
        ["Reciclável", result["recyclable"]],
        ["Rejeito", result["reject"]],
    ]

    table = Table(data_table)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.grey),
        ('TEXTCOLOR',(0,0),(-1,0),colors.white),
        ('GRID', (0,0), (-1,-1), 1, colors.black)
    ]))

    elements.append(table)
    elements.append(Spacer(1, 12))

    # Dimensionamento
    elements.append(Paragraph("Dimensionamento", styles["Heading2"]))
    elements.append(Paragraph(f"Volume total: {result['volume_total']} m³", styles["Normal"]))
    elements.append(Paragraph(f"Volume armazenamento: {result['volume_real']} m³", styles["Normal"]))
    elements.append(Paragraph(f"Área da sala: {result['area_sala']} m²", styles["Normal"]))

    elements.append(Spacer(1, 12))

    # Containers
    elements.append(Paragraph("Containers necessários", styles["Heading2"]))
    elements.append(Paragraph(f"Orgânico: {result['containers']['organic']}", styles["Normal"]))
    elements.append(Paragraph(f"Reciclável: {result['containers']['recyclable']}", styles["Normal"]))
    elements.append(Paragraph(f"Rejeito: {result['containers']['reject']}", styles["Normal"]))

    elements.append(Spacer(1, 12))

    # Recomendação
    if result["area_sala"] <= 6:
        recommendation = "Sala pequena - ideal para prédios compactos"
    elif result["area_sala"] <= 15:
        recommendation = "Sala média - padrão residencial"
    else:
        recommendation = "Sala grande - considerar compactação de resíduos"

    elements.append(Paragraph("Recomendação", styles["Heading2"]))
    elements.append(Paragraph(recommendation, styles["Normal"]))

    doc.build(elements)