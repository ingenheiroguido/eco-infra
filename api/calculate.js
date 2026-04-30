export default function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    const { floors, units_per_floor, people_per_unit } = req.body;

    const population = floors * units_per_floor * people_per_unit;

    const waste_total = population * 1.0;

    const organic = waste_total * 0.5;
    const recyclable = waste_total * 0.3;
    const reject = waste_total * 0.2;

    const density_organic = 300;
    const density_recyclable = 100;
    const density_reject = 150;

    const vol_organic = organic / density_organic;
    const vol_recyclable = recyclable / density_recyclable;
    const vol_reject = reject / density_reject;

    const volume_total = vol_organic + vol_recyclable + vol_reject;

    const storage_days = 2;
    const volume_real = volume_total * storage_days;

    const altura = 2.5;
    const area = volume_real / altura;
    const area_final = Math.max(area, 4);

    const container_volume = 0.24;

    const containers = {
        organic: Math.ceil((vol_organic * storage_days) / container_volume),
        recyclable: Math.ceil((vol_recyclable * storage_days) / container_volume),
        reject: Math.ceil((vol_reject * storage_days) / container_volume)
    };

    res.status(200).json({
        population,
        organic,
        recyclable,
        reject,
        volume_total,
        volume_real,
        area_sala: area_final,
        containers
    });
}