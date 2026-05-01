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

function salvarProjeto() {

    let resultadoHTML = document.getElementById("resultado").innerHTML;

    if (!resultadoHTML.trim()) {
        alert("Faça um cálculo primeiro!");
        return;
    }

    let projetos = JSON.parse(localStorage.getItem("projetos")) || [];

    projetos.push(resultadoHTML); // salva HTML, não objeto

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

    let dataAtual = new Date().toLocaleDateString();

    let janela = window.open("", "", "width=800,height=600");

    janela.document.write(`
        <html>
        <head>
            <title>Relatório EcoInfra</title>
            <style>
                body {
                    font-family: Arial;
                    padding: 30px;
                    line-height: 1.6;
                }

                h1 {
                    text-align: center;
                    margin-bottom: 5px;
                }

                h2 {
                    text-align: center;
                    margin-top: 0;
                    color: gray;
                }

                .info {
                    margin-bottom: 20px;
                }

                .footer {
                    margin-top: 40px;
                    font-size: 12px;
                    text-align: center;
                    color: gray;
                }

                hr {
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>

            <h1>EcoInfra</h1>
            <h2>Relatório de Dimensionamento de Resíduos</h2>

            <div class="info">
                <p><b>Data:</b> ${dataAtual}</p>
            </div>

            <hr>

            ${conteudo}

            <div class="footer">
                Sistema EcoInfra - Projeto Acadêmico
            </div>

        </body>
        </html>
    `);

    janela.document.close();

    setTimeout(() => {
        janela.print();
    }, 500);
}
let janela = window.open("", "", "width=800,height=600");

janela.document.write(`
        <html>
        <head>
            <title>Relatório EcoInfra</title>
            <style>
                body {
                    font-family: Arial;
                    padding: 20px;
                }
                h1 {
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <h1>Relatório EcoInfra</h1>
            <hr>
            ${conteudo}
        </body>
        </html>
    `);

janela.document.close();

setTimeout(() => {
    janela.print();
}, 500);
}