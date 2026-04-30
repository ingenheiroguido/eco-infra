def handler(request):
    data = request.json()

    floors = int(data["floors"])
    units = int(data["units_per_floor"])
    people = int(data["people_per_unit"])

    population = floors * units * people

    waste_total = population * 1.0

    organic = waste_total * 0.5
    recyclable = waste_total * 0.3
    reject = waste_total * 0.2

    density_organic = 300
    density_recyclable = 100
    density_reject = 150

    vol_organic = organic / density_organic
    vol_recyclable = recyclable / density_recyclable
    vol_reject = reject / density_reject

    volume_total = vol_organic + vol_recyclable + vol_reject

    storage_days = 2
    volume_real = volume_total * storage_days

    altura = 2.5
    area = volume_real / altura
    area_final = max(area, 4)

    return {
        "statusCode": 200,
        "body": {
            "population": population,
            "area_sala": round(area_final, 2)
        }
    }