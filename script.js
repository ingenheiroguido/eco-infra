document.addEventListener("DOMContentLoaded", function () {

    listarProjetos();

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
                <h3>📊 Dados Gerais</h3>
                <p><b>População:</b> ${result.population}</p>

                <h3>♻️ Resíduos</h3>
                <p>🟢 Orgânico: ${result.organic.toFixed(2)} kg</p>
                <p>🔵 Reciclável: ${result.recyclable.toFixed(2)} kg</p>
                <p>⚫ Rejeito: ${result.reject.toFixed(2)} kg</p>

                <h3>📦 Dimensionamento</h3>
                <p>Volume diário: ${result.volume_total.toFixed(2)} m³</p>
                <p>Volume armazenamento: ${result.volume_real.toFixed(2)} m³</p>
                <p>Área da sala: ${result.area_sala.toFixed(2)} m²</p>

                <h3>🗑️ Containers necessários</h3>
                <p>🟢 Orgânico: ${result.containers.organic}</p>
                <p>🔵 Reciclável: ${result.containers.recyclable}</p>
                <p>⚫ Rejeito: ${result.containers.reject}</p>
            `;

        } catch (error) {
            console.error(error);
            alert("Erro ao calcular");
        }

    });

});

function salvarProjeto() {

    let resultadoHTML = document.getElementById("resultado").innerHTML;

    if (!resultadoHTML.trim()) {
        alert("Faça um cálculo primeiro!");
        return;
    }

    let projetos = JSON.parse(localStorage.getItem("projetos")) || [];

    projetos.push(resultadoHTML);

    localStorage.setItem("projetos", JSON.stringify(projetos));

    listarProjetos();
}

function listarProjetos() {

    let lista = JSON.parse(localStorage.getItem("projetos")) || [];
    let div = document.getElementById("listaProjetos");

    div.innerHTML = "";

    lista.forEach((proj, i) => {
        div.innerHTML += `
            <div>
                Projeto ${i + 1}
                <button onclick="carregarProjeto(${i})">Abrir</button>
            </div>
        `;
    });
}

function carregarProjeto(index) {
    let lista = JSON.parse(localStorage.getItem("projetos"));
    document.getElementById("resultado").innerHTML = lista[index];
}

function gerarPDF() {

    let conteudo = document.getElementById("resultado").innerHTML;

    if (!conteudo.trim()) {
        alert("Faça um cálculo primeiro!");
        return;
    }

    let janela = window.open("", "", "width=800,height=600");

    janela.document.write(`
        <html>
        <head>
            <title>Relatório EcoInfra</title>
        </head>
        <body>
            <h1>EcoInfra</h1>
            ${conteudo}
        </body>
        </html>
    `);

    janela.document.close();

    setTimeout(() => {
        janela.print();
    }, 500);
}