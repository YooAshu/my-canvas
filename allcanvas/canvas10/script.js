let canvas = document.getElementById('canvas')
let w = canvas.width = window.innerWidth
let h = canvas.height = window.innerHeight
let ctx = canvas.getContext('2d')
let particle_array = []
let amount = 200
let originx = w / 2
let originy = h / 2
let hue = 0
window.addEventListener('load', function () {
    init()
})
window.addEventListener('resize', function () {
    resize()
})
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x
    mouse.y = e.y
})
window.addEventListener('mouseout', function () {
    mouse.x = undefined
    mouse.y = undefined
})
let mouse = {
    x: undefined,
    y: undefined
}


class particle {
    constructor() {
        this.hue = 0
        this.reset()
    }
    reset() {
        this.x = getRandomInt(w / 4, 3 * w / 4)
        this.y = h / 2
        this.radius = getRandomInt(5, 10)
        this.time = 0
        this.dist_prcnt = (this.x - w / 2) / (w / 4)//percentage of dist of particle from origin on basis of which angle will be calculated

        if (this.dist_prcnt >= 0) {
            Math.random() > 0.5 ? this.angle = 90 - this.dist_prcnt * 90 : this.angle = this.dist_prcnt * 90 - 90
        }
        else {
            Math.random() > 0.5 ? this.angle = 90 - this.dist_prcnt * 90 : this.angle = -90 + this.dist_prcnt * 90
        }
        this.radian = this.angle * (Math.PI / 180)
        this.speed = getRandomInt(10, 20) / 10
        this.hue = hue
        this.force = Math.abs(Math.abs(this.dist_prcnt) - 0.5) * 2
        this.comp_time = 60 + (ease_in(this.force) * 90)
        this.progress = 1 - (this.time / this.comp_time)
    }
    draw() {
        ctx.save()
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${this.hue},80%,40%,1)`
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
    update() {
        this.progress = (this.time / this.comp_time)
        if (this.time < this.comp_time) {
            if (mouse.x) {
                // console.log(this.x,this.y,mouse.x,mouse.y,this.angle)
                this.angle = getAngle(this.x, this.y, mouse.x, mouse.y)
                this.radian = this.angle * (Math.PI / 180)
            }
            this.x += this.speed * Math.cos(this.radian)
            this.y += this.speed * Math.sin(this.radian)
            // this.size = ((1 - (this.time / this.comp_time)) * this.radius)
            this.size = Math.max(0, this.radius - (ease_in(this.progress) * this.radius))

        }
        else {
            this.reset()
        }
        this.time++
    }
}
function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min
}
function animate() {
    init()
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0, 0, 0, .1)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    hue += 1
    for (i = 0; i < particle_array.length; i++) {
        particle_array[i].update()
        particle_array[i].draw()
    }
    window.requestAnimationFrame(animate)
}
function resize() {
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, w, h);
}
function init() {

    if (particle_array.length < amount && Math.random() > 0.1) {
        particle_array.push(new particle())

    }
}
function ease_in(x) {
    return 1 - Math.cos((x * Math.PI) / 2);
}
function getAngle(x1, y1, x2, y2) {
    let rad = Math.atan2(y2 - y1, x2 - x1);
    return (rad * 180) / Math.PI;
}
animate()