console.log("JS carregou");
document.body.style.background = "red";
document.addEventListener("DOMContentLoaded", function () {

    console.log("JS carregou");

    document.body.style.background = "red";

    listarProjetos();

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
    });

});

function salvarProjeto() {

    let projeto = {
        floors: document.getElementById("floors").value,
        units: document.getElementById("units").value,
        people: document.getElementById("people").value,
        resultado: document.getElementById("resultado").innerHTML
    };

    let lista = JSON.parse(localStorage.getItem("projetos")) || [];

    lista.push(projeto);

    localStorage.setItem("projetos", JSON.stringify(lista));

    alert("Projeto salvo!");
    listarProjetos();
}

function listarProjetos() {

    let lista = JSON.parse(localStorage.getItem("projetos")) || [];
    let div = document.getElementById("listaProjetos");

    div.innerHTML = "";

    lista.forEach((proj, index) => {
        div.innerHTML += `
            <div class="card">
                <p><b>Projeto ${index + 1}</b></p>
                <button onclick="carregarProjeto(${index})">Abrir</button>
            </div>
        `;
    });
}

function carregarProjeto(index) {
    let lista = JSON.parse(localStorage.getItem("projetos"));
    let projeto = lista[index];

    document.getElementById("resultado").innerHTML = projeto.resultado;
}

function gerarPDF() {

    let elemento = document.getElementById("resultado");

    if (!elemento || elemento.innerHTML.trim() === "") {
        alert("Faça o cálculo antes de gerar o PDF!");
        return;
    }

    if (typeof html2pdf === "undefined") {
        alert("Erro: biblioteca PDF não carregou");
        return;
    }

    let container = document.createElement("div");

    container.innerHTML = `
        <h1>Relatório EcoInfra</h1>
        <hr>
        ${elemento.innerHTML}
    `;

    html2pdf()
        .from(container)
        .set({
            margin: 10,
            filename: "eco-infra-relatorio.pdf",
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        })
        .save();
}