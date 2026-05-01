document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("calcForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = {
            floors: Number(document.getElementById("floors").value),
            units_per_floor: Number(document.getElementById("units").value),
            people_per_unit: Number(document.getElementById("people").value)
        };

        try {
            const response = await fetch("/api/calculate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            document.getElementById("resultado").innerHTML = `
                <h3>Resultado</h3>
                <p>População: ${result.population}</p>
                <p>Área necessária: ${result.area_sala} m²</p>
            `;

        } catch (error) {
            console.error(error);
            alert("Erro ao calcular");
        }

    });

});