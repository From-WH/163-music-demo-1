{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
            <form class="form">
                <div class="row">
                    <label>
                        歌名
                    </label>
                    <input name="name" type="text" value="__name__">
                </div>

                <div class="row">
                    <label>
                        歌手
                    </label>
                    <input name="singer" type="text" value="__singer__">
                </div>

                <div class="row">
                    <label>
                        外链
                    </label>
                    <input name="url" type="text" value="__url__">
                </div>
                <div class="row actions">
                    <button type="submit">保存</button>
                </div>
            </form>
        `,
        render(data = {}) {  //ES6新语法
            let placeHoders = ['name', 'singer','url','id']
            let html = this.template
            placeHoders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).prepend('<h2>编辑歌曲</h2>')
            }else{
                $(this.el).prepend('<h2>新建歌曲</h2>')
            }
        },
        reset(){
            this.render({})
        }
    }
    let model = {
        data: {
            name: '',
            singer: '',
            url: '',
            id: ''
        }, 
        create(data) {
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save().then( (newSong)=> {   //如果save成功了会得到一个新的song
                let {id,attributes} = newSong
                // this.data.id = id
                // this.data.name = attributes.name
                // this.data.singer = attributes.singer
                // this.data.url = attributes.url
                Object.assign(this.data,{     //这五行等于上面五行
                    id,
                    ...attributes, //
                    // name:attributes.name,
                    // singer:attributes.singer,
                    // url:attributes.url
                })
            }, (error)=> {
                console.error(error);
            });
        }   
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('upload', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('select',(data)=>{
                 this.view.render(data)
            })
            window.eventHub.on('new',()=>{
                this.model.data = {
                    name: '',
                    singer: '',
                    url: '',
                    id: ''
                }
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                let needs = 'name singer url'.split(' ') //通过空格得到一个数组，这个数组包含三个字符串
                let data = {}
                needs.map((string) => {
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                this.model.create(data)
                .then(()=>{
                    this.view.reset()
                    let string = JSON.stringify(this.model.data)    //深拷贝
                    let object = JSON.parse(string)
                    window.eventHub.emit('create',object)
                })

            })
        }
    }
    controller.init(view, model)
}