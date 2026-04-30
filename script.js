document.getElementById("calcForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let data = {
        floors: parseInt(document.getElementById("floors").value),
        units_per_floor: parseInt(document.getElementById("units").value),
        people_per_unit: parseInt(document.getElementById("people").value)
    };

    let response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    let result = await response.json();

    document.getElementById("resultado").innerHTML = `
        <h3>📊 Dados Gerais</h3>
        <p><b>População:</b> ${result.population}</p>

        <h3>♻️ Resíduos</h3>
        <p>🟢 Orgânico: ${result.organic} kg</p>
        <p>🔵 Reciclável: ${result.recyclable} kg</p>
        <p>⚫ Rejeito: ${result.reject} kg</p>

        <h3>📦 Dimensionamento</h3>
        <p>Volume diário: ${result.volume_total} m³</p>
        <p>Volume armazenamento: ${result.volume_real} m³</p>
        <p>Área da sala: ${result.area_sala} m²</p>

        <h3>🗑️ Containers necessários</h3>
        <p>🟢 Orgânico: ${result.containers.organic}</p>
        <p>🔵 Reciclável: ${result.containers.recyclable}</p>
        <p>⚫ Rejeito: ${result.containers.reject}</p>
    `;
});