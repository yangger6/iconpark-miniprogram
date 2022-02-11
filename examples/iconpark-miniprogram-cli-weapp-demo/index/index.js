const app = getApp()
const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
Page({
  data: {
    c1: '#000',
    c2: '#000',
    c3: '#000',
    c4: '#000',
    s1: 16,
    s2: 16,
    s3: 16,
    s4: 16,
    Timer: null
  },
  onLoad() {
    const timer = setInterval(() => {
      this.setData({
        c1: this.radomColor(),
        c2: this.radomColor(),
        c3: this.radomColor(),
        c4: this.radomColor(),
        s1: random(16, 32),
        s2: random(16, 32),
        s3: random(16, 32),
        s4: random(16, 32),
      })
    }, 1000)
    this.setData({
      Timer: timer
    })
  },
  onUnload() {
    clearInterval(this.data.Timer)
  },
  radomColor() {
    return `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, ${Math.random()})`
  }
})
