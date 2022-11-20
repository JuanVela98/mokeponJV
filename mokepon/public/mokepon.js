const seleccionarataque = document.getElementById('seleccionar-ataque')
const reiniciar = document.getElementById('Reiniciar')
const botonMascotaJugador = document.getElementById('boton-mascota')
const botonReiniciar = document.getElementById('boton-reiniciar')
const seccionMascota= document.getElementById('Seleccionar-mascota')
const spanMascotaJugador = document.getElementById('mascota-jugador')
const spanMascotaEnemigo = document.getElementById('mascota-enemigo')

const spanganadasJugador = document.getElementById('ganadas-jugador')
const spanGanadasEnemigo = document.getElementById('ganadas-enemigo')

const mensajefinall = document.getElementById('mensaje-final')
const mensajeEnemigo = document.getElementById('mensaje-enemigo')
const mensajeJugador = document.getElementById('mensaje-jugador')
const conteneroTarjetas = document.getElementById('contenero-tarjetas') 

const conteneroPoderes = document.getElementById('contenedor-boton-poderes')

const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')

let ganadasJugador = 0
let ganadasEnemigo = 0
let mensajeFinal
let mokepones  = []
let indexAtaqueJugador
let indexAtaqueEnemigo

let opcionDeMokepones
let inputHipodoge 
let inputCapipepo 
let inputRatigueya 
let mascotaJugador

let opcionAtaques
let botonFuego 
let botonAgua 
let botonTierra 
let botonAtaque = []
let ataqueEnemigo = []
let ataquesjugador = []
let ataquesMokeponEnemigo 

let lienzo = mapa.getContext('2d')
let intervalo 
let mapaBackground = new Image()
mapaBackground.src = './assets/mokemap.webp'
let moke
let alturaQueBuscamos
let anchoMapa = window.innerWidth-20
const anchoMaximoMapa = 400
tamañoMapa()

let jugadorId = null
let enemigoId = null
let mokeponesEnemigos = []

class Mokepon{
  constructor(nombre,foto,fotoMapa,id = null){
    this.id = id
    this.nombre = nombre
    this.foto = foto
    this.ataques = []
    this.ancho = 40
    this.alto = 40
    this.x = aleatorio(0,mapa.width - this.ancho)
    this.y = aleatorio(0,mapa.height - this.alto)
    this.mapaFoto = new Image ()
    this.mapaFoto.src = fotoMapa
    this.velocidadX = 0
    this.velocidadY = 0
  }
  pintarmokepon(){
  lienzo.drawImage(this.mapaFoto,this.x,this.y,this.ancho,this.alto)
  }
}

let hipodoge = new Mokepon ('Hipodoge','./assets/mokepons_mokepon_hipodoge_attack.webp','./assets/hipodoge.png')
let capipepo = new Mokepon ('Capipepo','./assets/mokepons_mokepon_capipepo_attack.webp','./assets/capipepo.png')
let ratigueya = new Mokepon ('Ratigueya','./assets/mokepons_mokepon_ratigueya_attack.webp','./assets/ratigueya.png')

hipodoge.ataques.push(
  {nombre:'Water 💧', id: 'boton-agua'},
  {nombre:'Water 💧', id: 'boton-agua'},
  {nombre:'Water 💧', id: 'boton-agua'},
  {nombre:'Fire 🔥', id: 'boton-fuego'},
  {nombre:'Earth 🪨', id: 'boton-tierra'},
)
capipepo.ataques.push(
  {nombre:'Earth 🪨', id: 'boton-tierra'},
  {nombre:'Earth 🪨', id: 'boton-tierra'},
  {nombre:'Earth 🪨', id: 'boton-tierra'},
  {nombre:'Water 💧', id: 'boton-agua'},
  {nombre:'Fire 🔥', id: 'boton-fuego'},
)
ratigueya.ataques.push(
  {nombre:'Fire 🔥', id: 'boton-fuego'},
  {nombre:'Fire 🔥', id: 'boton-fuego'},
  {nombre:'Fire 🔥', id: 'boton-fuego'},
  {nombre:'Earth 🪨', id: 'boton-tierra'},
  {nombre:'Water 💧', id: 'boton-agua'},
)

mokepones.push(hipodoge,capipepo,ratigueya)

//PAGINA 1
function iniciarJuego(){
    seleccionarataque.style.display = 'none'
    sectionVerMapa.style.display ='none'
    reiniciar.style.display = 'none'
   
    mokepones.forEach((mokepon) => {
      opcionDeMokepones=`
      <input type="radio" name="mascota" id=${mokepon.nombre} />   
        <label class="tarjeta-de-mokepon" for=${mokepon.nombre}>  
           <p>${mokepon.nombre}</p>
           <img src=${mokepon.foto} alt=${mokepon.nombre}>
        </label>
         `
      conteneroTarjetas.innerHTML += opcionDeMokepones

      inputHipodoge = document.getElementById('Hipodoge')
      inputCapipepo = document.getElementById('Capipepo')
      inputRatigueya = document.getElementById('Ratigueya')
    })

    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
    botonReiniciar.addEventListener('click',reiniciarJuego)
    unirceAlJuego()
}

function unirceAlJuego(){
  fetch("http://192.168.0.12:8080/unirse")
    .then(function (res){
      if (res.ok){
        res.text()
          .then(function (respuesta){
            jugadorId = respuesta
          })
      }
    })
}

function seleccionarMascotaJugador(){
    seccionMascota.style.display = 'none'
    sectionVerMapa.style.display = 'flex'
    iniciarMapa ()
    if (inputHipodoge.checked) {
      spanMascotaJugador.innerHTML = inputHipodoge.id
      mascotaJugador = inputHipodoge.id
  } else if (inputCapipepo.checked) {
      spanMascotaJugador.innerHTML = inputCapipepo.id
      mascotaJugador = inputCapipepo.id
  } else if (inputRatigueya.checked) {
      spanMascotaJugador.innerHTML = inputRatigueya.id
      mascotaJugador = inputRatigueya.id
  }else{
      alert("SELECT A PET")
      reiniciarJuego()}  

      selecionarMokepon(mascotaJugador)
      extraerAtaques(mascotaJugador)
}

function selecionarMokepon(mascotaJugador){
    fetch(`http://192.168.0.12:8080/mokepon/${jugadorId}`,{
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mokepon: mascotaJugador
      })
    })
}

function aleatorio(min,max){
  return Math.floor(Math.random()*(max-min+1)+min)
}

function extraerAtaques(mascotaJugador){
  let ataques
 for (let i = 0; i < mokepones.length; i++) {
   if(mascotaJugador === mokepones[i].nombre){
      ataques = mokepones[i].ataques
    }
  }
 mostrarAtaques (ataques)
}


function mostrarAtaques (ataques){
  ataques.forEach ((poder) => {
    opcionAtaques = `
    <button id=${poder.id} class="boton BAtaque">${poder.nombre}</button>`
    conteneroPoderes.innerHTML += opcionAtaques
  })

 botonFuego = document.getElementById('boton-fuego')
 botonAgua = document.getElementById('boton-agua')
 botonTierra = document.getElementById('boton-tierra')
 botonAtaque = document.querySelectorAll('.BAtaque') 
}

//PAGINA 2
function iniciarMapa (){
   intervalo =  setInterval (pintarCanvas,50)
   window.addEventListener('keydown',clickTecla)
   window.addEventListener('keyup', detenerMovimiento)
}
function tamañoMapa(){
  if (anchoMapa > anchoMaximoMapa){
    anchoMapa = anchoMaximoMapa
  }
  alturaQueBuscamos = anchoMapa * 600 / 800
  mapa.width = anchoMapa
  mapa.height = alturaQueBuscamos
}

function objetoMascota(){
  for (let i = 0; i < mokepones.length; i++) {
    if(mascotaJugador === mokepones[i].nombre){
       moke = mokepones[i]
     }
   }
}

function pintarCanvas(){
  objetoMascota()
  moke.x = moke.x + moke.velocidadX
  moke.y = moke.y + moke.velocidadY
  lienzo.clearRect(0, 0, mapa.width, mapa.height)
  lienzo.drawImage(mapaBackground,0,0,mapa.width,mapa.height)
  moke.pintarmokepon()
  enviarposicion(moke.x,moke.y)
  mokeponesEnemigos.forEach(function(mokepon){
    mokepon.pintarmokepon()
    revisioColosion(mokepon)
  })
}

function enviarposicion(x,y){
  fetch(`http://192.168.0.12:8080/mokepon/${jugadorId}/posicion`,{
    method: 'post',
    headers: {
     "Content-Type": "application/json"
    },
    body: JSON.stringify({
      x,
      y
    })
  })
  .then(function(res){
    if(res.ok){
      res.json()
        .then(function({enemigos}){
          mokeponesEnemigos = enemigos.map(function(enemigo){
            let mokeponEnemigo = null
            const mokeponNombre = enemigo.mokepon.nombre || ''
            if(mokeponNombre === 'Hipodoge'){
              mokeponEnemigo = new Mokepon ('Hipodoge','./assets/mokepons_mokepon_hipodoge_attack.webp','./assets/hipodoge.png',enemigo.id)
            }else if (mokeponNombre === 'Capipepo'){
              mokeponEnemigo = new Mokepon ('Capipepo','./assets/mokepons_mokepon_capipepo_attack.webp','./assets/capipepo.png',enemigo.id)
            }else if (mokeponNombre === 'Ratigueya'){
              mokeponEnemigo = new Mokepon ('Ratigueya','./assets/mokepons_mokepon_ratigueya_attack.webp','./assets/ratigueya.png',enemigo.id)
            }
            mokeponEnemigo.x = enemigo.x
            mokeponEnemigo.y = enemigo.y
            return mokeponEnemigo
          })
        })
    }
  })
}

function moverRight(){
  moke.velocidadX = + 5
}
function moverLeft(){
  moke.velocidadX = - 5
}
function moverUp(){
  moke.velocidadY = - 5
}
function moverDown(){
  moke.velocidadY = + 5
}

function detenerMovimiento(){
  moke.velocidadY = 0
  moke.velocidadX = 0
}

function clickTecla(event){
  switch (event.key) {
    case 'ArrowDown':
      moverDown()
      break
    case  'ArrowUp' :
      moverUp()
      break
    case 'ArrowLeft':
      moverLeft()
      break
    case 'ArrowRight':
      moverRight()
      break
    default:
      break
  }
}

function revisioColosion(enemigo){
  const arribaEnemigo = enemigo.y
  const abajoEnemigo = enemigo.y + enemigo.alto
  const izquierdaEnemigo = enemigo.x
  const derechaEnemigo = enemigo.x + enemigo.ancho

  const arribaMascota = moke.y
  const abajoMascota =  moke.y + moke.alto
  const izquierdaMascota = moke.x
  const derechaMascota = moke.x + moke.ancho
  if(
    abajoMascota < arribaEnemigo ||
    arribaMascota > abajoEnemigo ||
    derechaMascota < izquierdaEnemigo ||
    izquierdaMascota > derechaEnemigo 
  ){
    return
  }
  spanMascotaEnemigo.innerHTML= enemigo.nombre
  enemigoId = enemigo.id
  clearInterval(intervalo)
  sectionVerMapa.style.display ='none'
  seleccionarataque.style.display = 'flex'
  seleccionarMascotaEnemigo(enemigo)
}

function seleccionarMascotaEnemigo(enemigo){
  sectionVerMapa.style.display ='none'
  seleccionarataque.style.display = 'flex'
  spanMascotaEnemigo.innerHTML= enemigo.nombre
  clearInterval(intervalo)
  
  let ataques
  for (let i = 0; i < mokepones.length; i++) {
    if(enemigo.nombre === mokepones[i].nombre){
       ataques = mokepones[i].ataques
     }
   }
   ataquesMokeponEnemigo = ataques
   secuenciaAtaque ()
}

//PAGINA 3
function secuenciaAtaque () {
  botonAtaque.forEach((boton) => {
    boton.addEventListener('click', (e) => {
      if (e.target.textContent === 'Fire 🔥') {
        ataquesjugador.push ('Fire 🔥')
        boton.style.background = '#112f58'
        boton.disabled = true
      }else if (e.target.textContent === 'Earth 🪨'){
        ataquesjugador.push ('Earth 🪨')
        boton.style.background = '#112f58'
        boton.disabled = true
      }else if (e.target.textContent === 'Water 💧'){
        ataquesjugador.push ('Water 💧')
        boton.style.background = '#112f58'
        boton.disabled = true
      }
      if(ataquesjugador.length === 5){
        enviarAtaques()
      }
    })
  })
}

function enviarAtaques(){
  fetch(`http://192.168.0.12:8080/mokepon/${jugadorId}/ataques`,{
    method: 'post',
    headers: {
      "Content-Type": "application/json"
     },
     body: JSON.stringify({
       ataques: ataquesjugador
     })
  })
  intervalo = setInterval(obtenerataques,50)
}

function obtenerataques (){
  fetch(`http://192.168.0.12:8080/mokepon/${enemigoId}/ataques`)
    .then(function (res) {
      if(res.ok){
        res.json()
        .then(function ({ataques}){
          if(ataques.length === 5){
            ataqueEnemigo = ataques
            peleaMachin ()
          }
        })
      }
   })
}

function indexAmbosOponente(jugador, enemigo) {
  indexAtaqueJugador = ataquesjugador[jugador]
  indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function peleaMachin (){ 
  clearInterval(intervalo)
for (let index = 0; index < ataquesjugador.length; index++) {
  if (ataquesjugador[index] === ataqueEnemigo[index]){
    indexAmbosOponente(index, index)
    crearMensaje ()
  }else if (ataquesjugador[index]  === 'Fire 🔥' && ataqueEnemigo[index]  === 'Earth 🪨' 
  || ataquesjugador[index] === 'Earth 🪨' && ataqueEnemigo[index] === 'Water 💧'
  ||ataquesjugador[index] === 'Water 💧' && ataqueEnemigo[index] === 'Fire 🔥' ){
    indexAmbosOponente(index, index)
    crearMensaje ()
    ganadasJugador++
    spanganadasJugador.innerHTML= ganadasJugador 
  }else{
    indexAmbosOponente(index, index)
    crearMensaje ()
    ganadasEnemigo++
    spanGanadasEnemigo.innerHTML= ganadasEnemigo
  }}
  if(ataquesjugador.length === 5){
    revisionGanas()}
}

function crearMensaje (){
  let nuevoAtaqueDeljugador = document.createElement('p')
  let nuevoAtaqueDelEnemigo = document.createElement('p')

  nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo
  nuevoAtaqueDeljugador.innerHTML = indexAtaqueJugador

  mensajeEnemigo.appendChild(nuevoAtaqueDelEnemigo)
  mensajeJugador.appendChild(nuevoAtaqueDeljugador)
}

function revisionGanas(){
  if (ganadasEnemigo > ganadasJugador) {
    mensajeFinal = "Y O U  L O S T "
    crearMensajefinal ()
  }else if (ganadasEnemigo < ganadasJugador){
    mensajeFinal ="CONGRATULATIONS YOU WON 🥳🥳🥳"
    crearMensajefinal () 
  }else {
    mensajeFinal = 'GRAND TIE ⚔️'
    crearMensajefinal ()
  }
}

function crearMensajefinal (){
    mensajefinall .innerHTML = mensajeFinal
    reiniciar.style.display = 'block'
}
  
function reiniciarJuego(){
  location.reload()
}

window.addEventListener('load',iniciarJuego)

