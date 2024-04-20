let canvas = document.getElementById('canvas')
let canvasContainer = document.getElementById('canvasContainer')
let ctx = canvas.getContext("2d", { willReadFrequently: true })
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let linearray = []
let mainarray = []
let area = {
  col: undefined,
  row: undefined
}
let padding = 2
let margin = 20
let linelength = 20
let p = new Promise((resolve, reject) => {
  window.addEventListener('load', function () {

    calculatingLines()

  })
  resolve('Success!');
})

p.then((value) => {
  let iframeTag, div
  for (let i = 0; i < canvasArray.length; i++) {
    iframeTag = document.createElement('iframe')
    div = document.createElement('div')

    iframeTag.src = canvasArray[i].src
    iframeTag.width = 400
    iframeTag.height = 250
    div.classList.add('iframe')
    div.append(iframeTag)
    canvasContainer.append(div)
  }
}).then(() => {
  let iframes = document.querySelectorAll('.iframe')

  iframes.forEach(function (iframe) {
    iframe.addEventListener('click', function () {
      // Get the source URL of the clicked iframe
      var iframeSrc = iframe.childNodes[0].attributes[0].value
      // Open the source URL in a new tab
      window.open(iframeSrc, '_blank');
    });



  });
})
  .then(() => {
    if (window.innerWidth <= 450) {

      document.querySelectorAll("iframe").forEach((frame) => {
        frame.width = 80 * window.innerWidth / 100
        // console.log(frame.width, window.innerWidth)
        frame.height = frame.width / 1.6
      })

    }
  })

function calculatingLines() {


  area.col = Math.floor((canvas.width - 2 * margin) / (padding * 2 + linelength))
  area.row = Math.floor((canvas.height - 2 * margin) / (padding * 2 + linelength))


  for (i = 0; i < area.row; i++) {
    let rows = []
    for (j = 0; j < area.col; j++) {
      rows.push(new lines(i, j))
    }
    linearray.push(rows)
  }

  for (i = 0; i < linearray.length; i++) {
    for (j = 0; j < linearray[i].length; j++) {
      mainarray.push(linearray[i][j])


    }
  }
}

let mouse = {
  x: canvas.width * 0.5,
  y: document.getElementsByTagName('header')[0].clientHeight * 0.5,
  radius: 300
}
clicked = {
  x: undefined,
  y: undefined
}
window.addEventListener('mousemove', (e) => {
  mouse.x = e.x
  mouse.y = e.y
})



window.addEventListener('mousedown', (e) => {
  clicked.x = e.x
  clicked.y = e.y
})
class lines {
  constructor(row, col) {
    this.x = col * (padding * 2 + linelength) + margin  // 0*24 + 20,1*24+20
    this.y = row * (padding * 2 + linelength) + margin + linelength * 0.5 // 0*24+20+10, 1*24+20+10,
    this.dx = undefined
    this.dy = undefined
    this.dist = undefined
    this.alpha = undefined
    this.scale = undefined
    this.angle = 0
    this.spin = false
  }
  update() {
    ctx.save()
    ctx.translate(this.x + 0.5 * linelength, this.y + 0.5 * linelength)
    if (this.spin == false) {
      ctx.rotate(this.angle)
      ctx.scale(this.scale, this.scale)
      this.angle = Math.atan2(this.dy, this.dx)
      this.dx = mouse.x - (this.x + linelength * 0.5)
      this.dy = mouse.y - (this.y + linelength * 0.5)
      this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
      this.alpha = Math.max(0.2, 1 - this.dist / (canvas.width * 0.5))
      this.scale = Math.max(0.5, 1 - this.dist / (canvas.width * 0.5))
    }
    else {
      this.angle += 0.3
      ctx.rotate(this.angle)
      this.alpha = 1
    }

  }
  draw() {

    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`
    ctx.fillRect(-linelength * 0.5, 0, linelength, 3)
    ctx.restore()
  }

}


window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  linearray = []
  mainarray = []
  calculatingLines()

  mouse.x = canvas.width * 0.5
  mouse.y = document.getElementsByTagName('header')[0].clientHeight * 0.5


})
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (i = 0; i < mainarray.length; i++) {
    if ((clicked.x >= mainarray[i].x && clicked.x <= mainarray[i].x + linelength) && (clicked.y >= mainarray[i].y - linelength * .5 && clicked.y <= mainarray[i].y + linelength * .5)) {

      if (mainarray[i].spin == false) {
        mainarray[i].spin = true
        clicked.x = undefined
        clicked.y = undefined
      }
      else {
        mainarray[i].spin = false
        clicked.x = undefined
        clicked.y = undefined
      }
    }
    mainarray[i].update()
    mainarray[i].draw()

  }

  window.requestAnimationFrame(animate)


}
animate()


let canvasArray = [
  {
    src: "./allcanvas/canvas1/index.html",
    des: ""
  },
  {
    src: "./allcanvas/canvas2/index.html",
    des: ""
  },
  {
    src: "./allcanvas/canvas3/index.html",
    des: ""
  },
  {
    src: "./allcanvas/canvas4/index.html",
    des: ""
  },
  {
    src: "./allcanvas/canvas5/index.html",
    des: ""
  },
  {
    src: "./allcanvas/canvas6/index.html",
    des: ""
  },
  {
    src: "./allcanvas/canvas7/index.html",
    des: ""
  },
  {
    src: "./allcanvas/canvas8/index.html",
    des: ""
  },
  {
    src: "./allcanvas/canvas9/index.html",
    des: ""
  },
  {
    src: "./allcanvas/canvas10/index.html",
    des: ""
  },
  {
    src: "./allcanvas/canvas11/index.html",
    des: ""
  }

]

window.addEventListener("resize", function () {

  if (window.innerWidth <= 450) {

    console.log(1)
    document.querySelectorAll("iframe").forEach((frame) => {
      frame.width = 80 * window.innerWidth / 100
      // console.log(frame.width, window.innerWidth)
      frame.height = frame.width / 1.6
    })

  }
})