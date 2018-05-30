{
  let view = {}
  let model = {
    data: {
      id: '',
      name: '',
      singer: '',
      url: ''
    },
    get(id) {
      var query = new AV.Query('Song');
      return query.get(id).then((song) => {
        Object.assign(this.data, { id: song.id, ...song.attributes })
        return song
      }, function (error) {
        alert('哎呀，出错了')
      });
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      let id = this.getSongId()
      this.model.get(id).then((data) => {
        console.log(this.model.data)
      })
    },
    getSongId() {
      let search = window.location.search     //获取查询参数
      if (search.indexOf('?') === 0) {
        search = search.substring(1)   //去掉第一个 从第二个开始显示
      }

      let array = search.split('&').filter((v => v)) //filter过滤空字符串   v=>v就是判断真，假
      let id = ''
      for (let i = 0; i < array.length; i++) {
        let kv = array[i].split('=')
        let key = kv[0]
        let value = kv[1]
        if (key === 'id') {
          id = value
          break
        }
      }
      return id
    }
  }
  controller.init(view, model)
}

