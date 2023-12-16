let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d', { willReadFrequently: true })

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particlearray = []
let density = 2000
window.addEventListener('load', function () {
    for (i = 0; i < density; i++) {
        particlearray.push(new particle())
    }

})

let mouse = {
    x: undefined,
    y: undefined
}

class particle {

    constructor() {
        this.x = Math.floor((Math.random() * 1.2 - .1) * canvas.width)
        this.y = Math.floor((Math.random() * 1 + 1) * canvas.height)
        this.basex = this.x
        this.radius = Math.floor(Math.random() * 4 + 2)
        this.totaldist = this.y
        this.curdist = this.y
        this.progress = 0
        this.amp = Math.floor(Math.random() * 15 + 5)
        this.angle = 0
        this.fluct = Math.random() * 25 + 100
        this.ampfluct = Math.random() * 25 + 25
        this.velfluct = Math.random() * 2 + 2
        this.dir = Math.random() > .5 ? 1 : -1
        this.flag = 0
        this.mousex = undefined
    }

    update() {
        if (this.y <= canvas.height) {

            if (this.curdist <= this.totaldist) {
                this.progress = (this.curdist / this.totaldist) * 100
                this.curdist = this.y
            }
            if (this.y <= 0) {
                this.reset()
            }
            if (this.y <= ((4 * canvas.height) / 100)) {
                this.velfluct = 0
            }
            this.ampfluct = this.progress /3
            this.amp = Math.max(0, (this.fluct + this.ampfluct) * this.progress / 100) * this.dir
            this.angle += 0.1
             if(this.flag == 1){
                this.basex += (this.mousex - this.basex)* 0.05
             }

            this.x = this.basex + this.amp * Math.sin(this.angle)
            this.y -= Math.max(.7, this.progress * (2 / 100) + this.velfluct)
        } else {
            this.y -= 4
        }


    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = `rgba(182, 112, 16, 1)`
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.fill()
    }
    reset() {
        this.x = Math.floor((Math.random() * 1.2 - .1) * canvas.width)
        this.y = Math.floor((Math.random() * 1 + 1) * canvas.height)
        this.flag = 0
        if (mouse.x) {
            this.mousex = mouse.x
            this.fluct = Math.random() > .3 ? Math.random() * 150 + 5 : 2
            this.ampfluct = Math.random() > .3 ? Math.random() * 15 + 15 : 2
            this.flag = 1
        }
        else {

            this.fluct = Math.random() * 25 + 100
            this.ampfluct = Math.random() * 15 + 5
        }
        this.basex = this.x
        this.radius = Math.floor(Math.random() * 4 + 2)
        this.totaldist = this.y
        this.curdist = this.y
        this.progress = 0
        this.amp = Math.floor(Math.random() * 15 + 5)
        this.angle = 0
        this.dir = Math.random() > .5 ? 1 : -1
        this.velfluct = Math.random() * 2 + 2

    }
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = 'lighter'
    for (i = 0; i < particlearray.length; i++) {
        particlearray[i].update()
        particlearray[i].draw()
    }
    window.requestAnimationFrame(animate)
}
let mousemove = false

window.addEventListener("mouseout", function () {
    mouse.x = undefined
    mouse.y = undefined
})
window.addEventListener("mousemove", (e) => {

    mouse.x = e.x
    mouse.y = e.y
})


animate()