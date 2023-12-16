let canvas = document.getElementById('canvas')
let ctx = canvas.getContext("2d", { willReadFrequently: true })
canvas.width = window.innerWidth
canvas.height = window.innerHeight


let inputtext = document.getElementById('inputtext')
inputtext.value = 'ashu'
let text = inputtext.value

let textx = canvas.width / 2
let fontsize = 8 * (window.innerWidth) / 100
let cellsize = Math.round(4 * fontsize/100) 
let texty
let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, "green");
gradient.addColorStop(0.5, "cyan");
gradient.addColorStop(1, "green");

ctx.textAlign = 'center'
ctx.textBaseline = 'middle'
ctx.fillStyle = gradient
ctx.font = `${fontsize}px Cherry Bomb One`;

if (window.innerWidth > window.innerHeight && window.innerWidth <= 400) {
  // it is in iframe of my canvas websiste
  document.getElementById('inputtext').style.height = '8%';
  fontsize = 60
  ctx.font = `${fontsize}px Cherry Bomb One`;
  cellsize = 3

}
else {     //it is not in iframe
}
inputtext.addEventListener('keyup', e => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  particlesarray = []
  scannedpixelsmatrix = []
  text = inputtext.value
  textdisplay(text)
  scantext()
})
window.addEventListener('resize', function () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  fontsize = 8 * (window.innerWidth) / 100

  cellsize = Math.round(4 * fontsize/100) 
  textx = canvas.width / 2
  particlesarray = []
  scannedpixelsmatrix = []
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = gradient
  ctx.font = `${fontsize}px Cherry Bomb One`;
  textdisplay(text)
  scantext()
})
let words, linesarray
function textdisplay(text) {


  words = text.split(' ')
  let maxWidth = canvas.width * 0.5
  for (i = 0; i < words.length; i++) {
    if (ctx.measureText(words[i]).width > maxWidth) {
      for (j = 0; j < words[i].length; j++) {
        if (ctx.measureText(words[i].slice(0, j)).width > maxWidth) {
          let storeRemainLetter = words[i].slice(j - 3)
          words[i] = words[i].slice(0, j - 3) + '-'
          words.splice(i + 1, 0, storeRemainLetter)
          j = -1
        }
      }
    }
  }
  linesarray = []
  let linecounter = 0
  let line = ' '
  let testline
  for (let i = 0; i < words.length; i++) {

    testline = line + words[i] + ' '
    if (ctx.measureText(testline).width > maxWidth) {

      if (words.length == 1) {
        linesarray[linecounter] = testline
        linecounter++
        line = words[i] + " "
      }
      else {

        linecounter++
        line = words[i] + " "
        linesarray[linecounter] = line
      }


    }
    else {
      line = testline
      linesarray[linecounter] = line
    }

  }

  let textheight = fontsize * linecounter
  texty = window.innerHeight / 2 - textheight / 2
  for (i = 0; i < linesarray.length; i++) {
    ctx.fillText(linesarray[i], textx, texty + i * fontsize)
  }


}
let pixels, particlesarray = [], scannedpixelsmatrix = []



function scantext() {

  pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)

  for (let y = 0; y < canvas.height; y += cellsize) {
    let row = []
    for (let x = 0; x < canvas.width; x += cellsize) {
      let red = pixels.data[(y * 4 * canvas.width) + x * 4]
      let green = pixels.data[(y * 4 * canvas.width) + x * 4 + 1]
      let blue = pixels.data[(y * 4 * canvas.width) + x * 4 + 2]
      let alpha = pixels.data[(y * 4 * canvas.width) + x * 4 + 3]

      let data = {
        color: `rgb(${red},${green},${blue})`, x: x, y: y
      }
      if (alpha > 0)
        row.push(data)
    }
    scannedpixelsmatrix.push(row)
  }
  for (y = 0; y < scannedpixelsmatrix.length; y++) {
    for (x = 0; x < scannedpixelsmatrix[y].length; x++) {
      particlesarray.push(new particle(scannedpixelsmatrix[y][x].x, scannedpixelsmatrix[y][x].y, scannedpixelsmatrix[y][x].color))
    }
  }

}


window.addEventListener('load', function () {
  textdisplay(text)
  scantext()
})
let mouse = {
  radius: 2000,
  x: undefined,
  y: undefined
}
window.addEventListener('mousemove', event => {
  mouse.x = event.x
  mouse.y = event.y
})

class particle {
  constructor(x, y, color) {
    this.originx = x
    this.originy = y
    this.color = color
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.vx = 0
    this.vy = 0
    this.distance = undefined
    this.angle = undefined
    this.force = undefined
    this.dx = undefined
    this.dy = undefined


  }

  draw() {
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, cellsize, cellsize)
    ctx.fill()
  }
  update() {
    this.dx = mouse.x - this.x
    this.dy = mouse.y - this.y
    this.distance = (this.dx * this.dx + this.dy * this.dy)
    this.force = - mouse.radius / this.distance

    if (this.distance < mouse.radius) {
      this.angle = Math.atan2(this.dy, this.dx)
      this.vx += this.force * Math.cos(this.angle)
      this.vy += this.force * Math.sin(this.angle)
    }
    this.x += (this.vx *= 0.95) + (this.originx - this.x) * 0.05
    this.y += (this.vy *= 0.95) + (this.originy - this.y) * 0.05

  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (i = 0; i < particlesarray.length; i++) {
    particlesarray[i].update()
    particlesarray[i].draw()
  }
  window.requestAnimationFrame(animate)


}
animate()