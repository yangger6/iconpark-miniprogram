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
  onLoad(query) {
    // 页面加载
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
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
    clearInterval(this.data.Timer)
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
  radomColor() {
    return `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, ${Math.random()})`
  }
});
