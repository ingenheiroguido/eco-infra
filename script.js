document.getElementById("resultado").innerHTML =

    `
<h3>📊 Dados Gerais</h3>
<p><b>População:</b> ${data.population}</p>

<h3>♻️ Resíduos</h3>
<p>🟢 Orgânico: ${data.organic} kg</p>
<p>🔵 Reciclável: ${data.recyclable} kg</p>
<p>⚫ Rejeito: ${data.reject} kg</p>

<h3>📦 Dimensionamento</h3>
<p>Volume diário: ${data.volume_total} m³</p>
<p>Volume armazenamento: ${data.volume_real} m³</p>
<p>Área da sala: ${data.area_sala} m²</p>

<h3>🗑️ Containers necessários</h3>
<p>🟢 Orgânico: ${data.containers.organic}</p>
<p>🔵 Reciclável: ${data.containers.recyclable}</p>
<p>⚫ Rejeito: ${data.containers.reject}</p>
`;