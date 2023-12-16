canvas = document.getElementById("canvas")
w = canvas.width = window.innerWidth
h = canvas.height = window.innerHeight

ctx = canvas.getContext('2d', { willReadFrequently: true })
let amount = 100
let particle_array = []
window.addEventListener('load', function () {
    init()
})
function init() {
    for (i = 0; i < amount; i++) {
        particle_array.push(new particle())
    }
}

class particle {
    constructor() {
        this.hue = 0
        this.reset()
    }
    reset() {
        this.x = w / 2
        this.y = h / 2
        this.time = 0
        this.total_time = getRandomInteger(200, 300)

        this.hue += 20
        this.angle = +((60 * getRandomInteger(0, 5) + 90) * ((Math.PI) / 180)).toFixed(2)
        this.length = 30
        this.speed = 2
        this.sx = this.x
        this.sy = this.y
        this.dx = this.sx - this.x
        this.dy = this.sy - this.y
        this.dist = Math.floor(Math.sqrt(this.dx * this.dx + this.dy * this.dy))
    }
    draw() {
        ctx.save()
        ctx.beginPath()
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${this.hue},100%,50%)`
        ctx.shadowColor = `hsl(${this.hue},100%,50%)`
        ctx.shadowBlur = 3
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
    update() {

        if (this.time < this.total_time) {
            this.x += Math.round(Math.cos(this.angle) * this.speed)
            this.y += Math.round(Math.sin(this.angle) * this.speed)
            this.dx = this.sx - this.x
            this.dy = this.sy - this.y
            this.dist = Math.floor(Math.sqrt(this.dx * this.dx + this.dy * this.dy))
            if (this.dist >= this.length) {
                this.angle += +((Math.random() > .5 ? 1 : -1) * (60) * ((Math.PI) / 180)).toFixed(2)
                this.sx = this.x
                this.sy = this.y
            }
        }
        if (this.time > this.total_time || this.x > w || this.x < 0 || this.y > h || this.y < 0) {
            this.reset()
        }
        this.time++
    }
}
function getRandomInteger(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}
function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, .05)";
    ctx.fillRect(0, 0, w, h)
    for (i = 0; i < particle_array.length; i++) {
        particle_array[i].update()
        particle_array[i].draw()
    }
    window.requestAnimationFrame(animate)
}
animate()


window.addEventListener('resize', function resize() {
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight


    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, w, h);

})