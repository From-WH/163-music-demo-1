{
  let view = {
    el: '#songList-container',
    template: `
    <ul class="songList">
    </ul>
    `,
    render(data) {
      let $el = $(this.el)
      $el.html(this.template)
      let { songs } = data
      let liList = songs.map((song) => $('<li></li>').text(song.name))
      console.log(1)
      $el.find('ul').empty()
      console.log(2)
      liList.map((domLi) => {
        console.log(3)
        $el.find('ul').append(domLi)
      })
    },
    clearActive() {
      // $(this.el).find('.active'), removeClass('active')
    }
  }
  let model = {
    data: {
      songs: []
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      window.eventHub.on('upload', () => {
        this.view.clearActive()
      })
      window.eventHub.on('create', (songData) => {
        console.log(songData)
        this.model.data.songs.push(songData)
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}