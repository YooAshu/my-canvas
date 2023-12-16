let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight


let shapeselector = document.getElementById('shapeselector')
let wantlines = document.getElementById('wantlines')
let slider = document.getElementById('slider')
let mousehover = document.getElementById('mousehover')
let randomparticles = document.getElementById('randomparticles')
let inflateparticles = document.getElementById('inflate')
let bgcolorselector = document.getElementById('bgcolorselector')
let particlecolorselector = document.getElementById('particlecolorselector')
let colorgradientselector = document.getElementById('colorgradientselector')
let bgcolor = bgcolorselector.value
colorgradientselector.value = ""
let particlecolor = particlecolorselector.value
let gradient

wantlines.checked = true
mousehover.checked = false
randomparticles.checked = true


let particlesarray = []
let hue = 0
let d, h, k
let l, m
let mouse = {
  x: undefined,
  y: undefined,
  radius: 150,
  pressed: false

}

let img = new Image()
img.src = './emoji.png'
let intensity = 200

if (window.innerWidth > window.innerHeight && window.innerWidth <= 400) {
  // it is in iframe of my canvas websiste
  document.getElementById('custom').style.display = 'none';
  document.getElementsByTagName('body')[0].style.backgroundColor = 'black'
  intensity = 50

}
else {     //it is not in iframe
  intensity = 200
}


slider.oninput = function() {
  intensity = document.getElementById('slider').value
  if (randomparticles.checked) {
    particlesarray = []
    intensity = document.getElementById('slider').value
    init()
  }
}

bgcolorselector.addEventListener('input', function() {
  bgcolor = bgcolorselector.value
  document.getElementById('canvas').style.backgroundColor = bgcolor
})

particlecolorselector.addEventListener('input', function() {
  particlecolor = particlecolorselector.value
  colorgradientselector.value = ""
  for (i = 0; i < particlesarray.length; i++) {
    particlesarray[i].color = particlecolor
  }
})

shapeselector.addEventListener('change', function() {
  if (shapeselector.value == 'bubble') {
    for (i = 0; i < particlesarray.length; i++) {
      particlesarray[i].color = '#4f4f4f'
      particlecolorselector.value = '#4f4f4f'
      particlecolor = '#4f4f4f'
    }
  }
})


colorgradientselector.addEventListener('change', function() {
  gradapply()
})






window.addEventListener('mousemove', e => {
  if (randomparticles.checked && mouse.pressed) {
    mouse.x = e.x
    mouse.y = e.y
  }
})
window.addEventListener('mousedown', e => {
  mouse.x = e.x
  mouse.y = e.y
  mouse.pressed = true
})
window.addEventListener('mouseup', () => {
  mouse.pressed = false
})

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})



function init() {
  let x,y

  if (colorgradientselector.value == 'allcolor') {
    particlecolor = `hsl(${hue},100%,25%)`
  }
  
  //mouse-hover
  if (mousehover.checked) {

    for (i = 0; i < intensity; i++) {
      x = mouse.x
      y = mouse.y
      if (colorgradientselector.value == 'randomcolor') {
        particlecolor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
      }
      particlesarray.push(new particle(x,y,particlecolor))
    }
  }

  //random-movement
  if (randomparticles.checked) {
    for (i = 0; i < intensity; i++) {
      x = Math.random() * window.innerWidth
      y = Math.random() * window.innerHeight
      if (colorgradientselector.value == 'randomcolor') {
        particlecolor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
      }
      particlesarray.push(new particle(x,y,particlecolor))
    }
  }

}



class particle {
  constructor(x,y,color) {
    this.x = x
    this.y = y
    this.dx = undefined
    this.dy = undefined
    this.angle = undefined
    this.force = undefined
    this.dist = undefined
    this.pushx = 0
    this.pushy = 0
    this.radius = Math.random() * 5 + 5
    this.velocityx = Math.random() * 2 - 1
    this.velocityy = Math.random() * 2 - 1
    this.color = color
    this.spritex = Math.floor(Math.random() * 16)
    this.spritey = Math.floor(Math.random() * 9)
    this.maxradius = this.radius * 3
    this.bubbleangle = Math.floor(Math.random() * 360)
  }


  update() {

    if (randomparticles.checked && mouse.pressed) {
      this.dx = this.x - mouse.x
      this.dy = this.y - mouse.y
      this.dist = Math.hypot(this.dx, this.dy)
      this.force = mouse.radius / this.dist
      if (this.dist < mouse.radius) {
        this.angle = Math.atan2(this.dy, this.dx)
        this.pushx += Math.cos(this.angle) * this.force
        this.pushy += Math.sin(this.angle) * this.force
      }
    }

    if (randomparticles.checked) {
      this.x += (this.pushx *= 0.95) + this.velocityx
      this.y += (this.pushy *= 0.95) + this.velocityy

    }

    if (mousehover.checked) {
      this.x += this.velocityx
      this.y += this.velocityy
    }
    if (this.x < this.radius) {
      this.x = this.radius
      this.velocityx *= -1
    }
    else if (this.x > window.innerWidth - this.radius) {
      this.x = window.innerWidth - this.radius
      this.velocityx *= -1
    }

    if (this.y < this.radius) {
      this.y = this.radius
      this.velocityy *= -1
    }
    else if (this.y > window.innerHeight - this.radius) {
      this.y = window.innerHeight - this.radius
      this.velocityy *= -1
    }


  }





  draw() {

    if (shapeselector.value == 'circle') {
      if (colorgradientselector.dataset.grad == 'grad') {

        ctx.fillStyle = gradient
      }
      else {
        ctx.fillStyle = this.color

      }
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fill()
    }

    else if (shapeselector.value == 'heart') {
      if (colorgradientselector.dataset.grad == 'grad') {

        ctx.fillStyle = gradient
      }
      else {
        ctx.fillStyle = this.color

      }
      d = 2 * this.radius
      k = this.x;
      h = this.y;
      ctx.moveTo(k, h);
      ctx.quadraticCurveTo(k, h - d / 4, k - d / 4, h - d / 4);
      ctx.quadraticCurveTo(k - d / 2, h - d / 4, k - d / 2, h);
      ctx.quadraticCurveTo(k - d / 2, h + d / 4, k - d / 4, h + d / 2);
      ctx.lineTo(k, h + d * 3 / 4);
      ctx.lineTo(k + d / 4, h + d / 2);
      ctx.quadraticCurveTo(k + d / 2, h + d / 4, k + d / 2, h);
      ctx.quadraticCurveTo(k + d / 2, h - d / 4, k + d / 4, h - d / 4);
      ctx.quadraticCurveTo(k, h - d / 4, k, h);
      ctx.fill()
    }

    else if (shapeselector.value == 'emoji') {
      ctx.drawImage(img, 72 * this.spritex, 72 * this.spritey, 72, 72, this.x, this.y, 5 * this.radius, 5 * this.radius)

    }
    else if (shapeselector.value == 'square1') {
      if (colorgradientselector.dataset.grad == 'grad') {

        ctx.strokeStyle = gradient
      }
      else {
        ctx.strokeStyle = this.color

      }
      ctx.beginPath()
      if (randomparticles.checked) {
        ctx.strokeRect(this.x - this.radius, this.y - this.radius, 2 * this.radius, 2 * this.radius);
      }
      else if (mousehover.checked) {
        ctx.strokeRect(this.x - this.radius, this.y - this.radius, 4 * this.radius, 4 * this.radius);
      }

    }

    else if (shapeselector.value == 'square2') {
      if (colorgradientselector.dataset.grad == 'grad') {

        ctx.fillStyle = gradient
      }
      else {
        ctx.fillStyle = this.color

      }
      ctx.beginPath()
      ctx.fillRect(this.x - this.radius, this.y - this.radius, 2 * this.radius, 2 * this.radius);

    }
    else if (shapeselector.value == 'bubble') {
      if (colorgradientselector.dataset.grad == 'grad') {

        ctx.fillStyle = gradient
      }
      else {
        ctx.fillStyle = this.color

      }
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.save()
      ctx.beginPath()
      ctx.arc(this.x + this.radius * Math.cos(this.bubbleangle) / 2, this.y + this.radius * Math.sin(this.bubbleangle) / 2, this.radius / 2, 0, Math.PI * 2)
      ctx.fillStyle = 'white'
      ctx.fill()
      ctx.restore()
    }

  }
}


randomparticles.onclick = function() {
  mousehover.checked = false
  inflateparticles.disabled = false
  slider.max = 500
  intensity = 200
  slider.value = 200
  particlesarray = []
  init()


}
let fireworks = []
let clicked = {
  x: undefined,
  y: undefined,
}
window.addEventListener('mousedown', e => {
  if (mousehover.checked) {
    clicked.x = e.x
    clicked.y = e.y

    for (let i = 0; i < intensity; i++) {
      fireworks.push(new firework())
    }
  }

})
class firework extends particle {
  constructor() {
    super()
    this.x = clicked.x
    this.y = clicked.y
    this.dir = Math.random() > .5 ? 1 : -1
    this.xr = (Math.random() * (108) + 2) * this.dir
    this.yr = (Math.random() * (120) + 30)
    this.maxangle = Math.random() * .2 - 3.2
    this.color = particlecolor
    if (colorgradientselector.value == 'allcolor') {
      this.color = `hsl(${hue},100%,25%)`
    }
    if (colorgradientselector.value == 'randomcolor') {
      this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
    }

    this.radius = Math.random() * 10 + 1
    this.angle = 0
    this.xangle = this.xr * 0.01
    this.centrex = -this.xr * Math.cos(this.angle) + this.x
    this.centrey = -this.yr * Math.sin(this.angle) + this.y
  }
  updatefirework() {
    this.angle -= this.yr * 0.0005
    this.radius -= 0.08
    if (this.angle > this.maxangle) {

      this.x = this.centrex + this.xr * Math.cos(this.angle)
      this.y = this.centrey + this.yr * Math.sin(this.angle)
    }
  }

}

mousehover.onclick = function() {
  randomparticles.checked = false
  inflateparticles.disabled = true
  inflateparticles.checked = false
  slider.max = 50
  intensity = 5
  slider.value = 5
  particlesarray = []

}



window.addEventListener('mousemove', function(event) {
  if (mousehover.checked) {

    init()
    mouse.x = event.x
    mouse.y = event.y
  }
  if (inflateparticles.checked) {
    mouse.x = event.x
    mouse.y = event.y
  }

})





if (randomparticles.checked) {
  init()
}







let dx, dy, dist, opacity
function handler() {
  for (i = 0; i < particlesarray.length; i++) {
    particlesarray[i].update()
    particlesarray[i].draw()
    if (wantlines.checked) {
      for (j = 0; j < particlesarray.length; j++) {
        dx = particlesarray[i].x - particlesarray[j].x
        dy = particlesarray[i].y - particlesarray[j].y
        dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100 && mousehover.checked) {
          let maxdist = 100
          ctx.strokeStyle = particlecolor
          if (colorgradientselector.value == 'allcolor') {
            ctx.strokeStyle = `hsl(${hue},100%,25%)`

          }
          if (colorgradientselector.dataset.grad == 'grad') {
            ctx.strokeStyle = gradient

          }
          if (colorgradientselector.value == 'randomcolor') {
            ctx.strokeStyle = linescolorBasedOnBgColor(bgcolor, '#FFFFFF', '#000000')

          }
          ctx.lineWidth = (1 - (dist / maxdist)) / 2
          ctx.golobalAlpha = 1 - (dist / maxdist)
          ctx.beginPath()
          ctx.moveTo(particlesarray[i].x, particlesarray[i].y)
          ctx.lineTo(particlesarray[j].x, particlesarray[j].y)
          ctx.stroke()

        }
        if (dist < 100 && randomparticles.checked) {
          let maxdist = 100
          ctx.save()
          ctx.strokeStyle = particlecolor
          if (colorgradientselector.value == 'allcolor') {
            ctx.strokeStyle = `hsl(${hue},100%,25%)`

          }
          if (colorgradientselector.value == 'randomcolor') {
            ctx.strokeStyle = linescolorBasedOnBgColor(bgcolor, '#FFFFFF', '#000000')

          }
          if (colorgradientselector.dataset.grad == 'grad') {
            ctx.strokeStyle = gradient

          }
          ctx.lineWidth = .3
          ctx.golobalAlpha = 1 - (dist / maxdist)
          ctx.beginPath()
          ctx.moveTo(particlesarray[i].x, particlesarray[i].y)
          ctx.lineTo(particlesarray[j].x, particlesarray[j].y)
          ctx.stroke()
          ctx.restore()
        }
      }
    }
    else {

      ctx.beginPath()

    }

    if (particlesarray[i].radius > 0.3 && mousehover.checked) {
      particlesarray[i].radius -= 0.1
    }
    if (particlesarray[i].radius <= 0.3 && mousehover.checked) {
      particlesarray.splice(i, 1)
      i--
    }


  }

  for (i = 0; i < fireworks.length; i++) {
    fireworks[i].updatefirework()
    fireworks[i].draw()
    if (fireworks[i].radius <= 0.3) {
      fireworks.splice(i, 1)
      --i
    }
    else if (fireworks[i].angle <= fireworks[i].maxangle) {
      // console.log(1)
      // particlearray.splice(i, 1)
      // i--
      fireworks[i].angle = fireworks[i].maxangle
      fireworks[i].y += fireworks[i].yr * 0.05
      fireworks[i].x -= fireworks[i].xangle
    }

  }

  if (inflateparticles.checked) {
    for (i = 0; i < particlesarray.length; i++) {
      if (((mouse.x < particlesarray[i].x && mouse.x > particlesarray[i].x - particlesarray[i].radius) || (mouse.x > particlesarray[i].x && mouse.x < particlesarray[i].x + particlesarray[i].radius)) && ((mouse.y < particlesarray[i].y && mouse.y > particlesarray[i].y - particlesarray[i].radius) || (mouse.y > particlesarray[i].y && mouse.y < particlesarray[i].y + particlesarray[i].radius))) {
        // console.log(1)
        if (particlesarray[i].radius < particlesarray[i].maxradius) {
          particlesarray[i].radius = particlesarray[i].maxradius
        }
      }

      if (particlesarray[i].radius > particlesarray[i].maxradius / 3) {
        particlesarray[i].radius -= 0.3
      }
    }
  }
}


function animate() {

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  handler()
  if (colorgradientselector.value == 'allcolor') {
    hue++
    if (randomparticles.checked) {
      for (i = 0; i < particlesarray.length; i++) {
        particlesarray[i].color = `hsl(${hue},100%,25%)`
      }
    }

  }
  if (colorgradientselector.value == '') {
    colorgradientselector.dataset.grad = ''
  }

  window.requestAnimationFrame(animate)
}
animate()

function gradapply() {
  if (colorgradientselector.value == 'allcolor') {
    colorgradientselector.dataset.grad = ''
  }
  else if (colorgradientselector.value == 'randomcolor') {
    colorgradientselector.dataset.grad = ''
    for (i = 0; i < particlesarray.length; i++) {
      particlesarray[i].color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
    }
  }
  else if (colorgradientselector.value == '') {
    colorgradientselector.dataset.grad = ''
  }

  else if (colorgradientselector.value == 'grad1') {
    colorgradientselector.dataset.grad = 'grad'
    gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "green");
    gradient.addColorStop(0.5, "cyan");
    gradient.addColorStop(1, "green");

  }
  else if (colorgradientselector.value == 'grad2') {
    colorgradientselector.dataset.grad = 'grad'
    gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#ee0979");
    gradient.addColorStop(0.5, "#ff6a00");
  }
  else if (colorgradientselector.value == 'grad3') {
    colorgradientselector.dataset.grad = 'grad'
    gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#A770EF");
    gradient.addColorStop(0.5, "#CF8BF3");
    gradient.addColorStop(1, "#FDB99B");
  }

  else if (colorgradientselector.value == 'grad4') {
    colorgradientselector.dataset.grad = 'grad'
    gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#ff00cc");
    gradient.addColorStop(0.5, "#333399");
  }


}
//sets line color opposite of bg color
function linescolorBasedOnBgColor(bgColor, lightColor, darkColor) {
  var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
    darkColor : lightColor;
}



