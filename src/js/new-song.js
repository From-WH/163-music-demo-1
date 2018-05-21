{
  let view = {
    el: '.newSong',
    template: `
    新建歌曲
    `,
    render(data) {
      $(this.el).html(this.template)
    }
  }
  let modle = {}
  let controller = {
    init(view, modle) {
      this.view = view
      this.modle = modle
      this.view.render(this.modle.data)
      this.active()
      window.eventHub.on('upload', (data) => {
        this.active()
      })
    },
    active() {
      $(this.view.el).addClass('active')
    }
  }
  controller.init(view, modle)
}