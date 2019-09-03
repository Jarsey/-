class RouterClass {
    constructor() {
        // 记录路径标识符对应的cb
        this.routes = {}
        // 记录hash值，方便执行cb
        this.currentUrl = ''
        window.addEventListener('load', () => this.render())
        window.addEventListener('hashchange', () => this.render())
    }

    // 初始化
    static init() {
        window.Router = new RouterClass()
    }

    // 注册路由和回调
    route(path, cb) {
        this.routes[path] = cb || function () {}
    }

    // 记录当前hash，执行cd
    render() {
        this.currentUrl = location.hash.slice(1) || '/'
        this.routes[this.currentUrl]()
    }
}

RouterClass.init()
// window.Router = new RouterClass()
const contentDom = document.querySelector('.content-div')
const changeContent = content => contentDom.innerHTML = content

Router.route('/', () => {
    changeContent('既会唱歌又会演戏的我们优秀的嘟嘟啊')
})
Router.route('/name', () => {
    changeContent('是都演员呀')
})
Router.route('/alias', () => {
    changeContent('是主唱D.O.呀')
})