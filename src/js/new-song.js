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
      window.eventHub.on('select',(data)=>{
        console.log(data.id)
        this.deactive()
      })
      $(this.view.el).on('click',this.active.bind(this))
    },
    active() {
      $(this.view.el).addClass('active')
      window.eventHub.emit('new')
    },
    deactive(){
      $(this.view.el).removeClass('active')
    }
  }
  controller.init(view, modle)
}