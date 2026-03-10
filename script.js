const calendario = document.getElementById("calendario")
const mesInput = document.getElementById("mes")
const letraSelect = document.getElementById("letra")
const statusTurno = document.getElementById("statusTurno")

// base da escala
const base = new Date(2026,2,9)

const hoje = new Date()

// mês atual correto
mesInput.value =
hoje.getFullYear() +
"-" +
String(hoje.getMonth()+1).padStart(2,"0")

function calcularDia(data,offset){

let diff = Math.floor((data-base)/(1000*60*60*24))

diff += offset

let ciclo = diff % 8

if(ciclo < 0){
ciclo += 8
}

return ciclo < 4 ? "trabalho" : "folga"

}

function gerarCalendario(){

calendario.innerHTML=""

const offsets={
A:6,
B:2,
C:0,
D:4
}

let letra = letraSelect.value
let offset = offsets[letra]

let partes = mesInput.value.split("-")

let ano = parseInt(partes[0])
let mes = parseInt(partes[1])-1

let diasNoMes = new Date(ano,mes+1,0).getDate()

for(let i=1;i<=diasNoMes;i++){

let dataDia = new Date(ano,mes,i)

let tipo = calcularDia(dataDia,offset)

let div = document.createElement("div")

div.classList.add("dia")
div.classList.add(tipo)

if(
i===hoje.getDate() &&
mes===hoje.getMonth() &&
ano===hoje.getFullYear()
){
div.classList.remove("trabalho","folga")
div.classList.add("hoje")
}

div.innerText=i

calendario.appendChild(div)

}

// 🔴 STATUS DO TURNO HOJE

let hojeTipo = calcularDia(hoje,offset)

if(hojeTipo === "trabalho"){

statusTurno.classList.remove("statusFolga")
statusTurno.classList.add("statusTrabalho")

statusTurno.innerText = "Letra " + letra + " — TRABALHANDO hoje"

}else{

statusTurno.classList.remove("statusTrabalho")
statusTurno.classList.add("statusFolga")

statusTurno.innerText = "Letra " + letra + " — DE FOLGA hoje"

}

}

letraSelect.addEventListener("change",gerarCalendario)
mesInput.addEventListener("change",gerarCalendario)

gerarCalendario()

async function carregarClima(){

let url="https://api.open-meteo.com/v1/forecast?latitude=-19.4683&longitude=-42.5364&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=auto"

let resposta = await fetch(url)

let dados = await resposta.json()

let atual = dados.current
let diaria = dados.daily

let climaAtual = document.getElementById("climaAtual")

climaAtual.innerHTML =

`
🌡️ Temperatura: ${atual.temperature_2m}°C <br>
🔥 Sensação térmica: ${atual.apparent_temperature}°C <br>
💨 Vento: ${atual.wind_speed_10m} km/h <br>
💧 Umidade: ${atual.relative_humidity_2m}% <br>
🌧️ Chance de chuva: ${diaria.precipitation_probability_max[0]}% <br>
⬆️ Máx: ${diaria.temperature_2m_max[0]}°C <br>
⬇️ Mín: ${diaria.temperature_2m_min[0]}°C <br>
🌅 Nascer do sol: ${diaria.sunrise[0].split("T")[1]} <br>
🌇 Pôr do sol: ${diaria.sunset[0].split("T")[1]}
`

let previsao = document.getElementById("previsao")

previsao.innerHTML=""

for(let i=1;i<6;i++){

let data = diaria.time[i]

let max = diaria.temperature_2m_max[i]

let min = diaria.temperature_2m_min[i]

let chuva = diaria.precipitation_probability_max[i]

let linha=document.createElement("div")

linha.innerHTML=`
📅 ${data} — ⬆️${max}° ⬇️${min}° 🌧️${chuva}%
`

previsao.appendChild(linha)

}

}

carregarClima()

setInterval(carregarClima,600000)