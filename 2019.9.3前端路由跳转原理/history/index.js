class RouterClass {
    constructor(path) {
        this.routes = {}
        history.replaceState({
            path
        }, null, path)
        window.addEventListener('popstate', e => {
            const path = e.state && e.state.path
            this.routes[path] && this.routes[path]()
        })
    }

    static init() {
        window.Router = new RouterClass(location.pathname)
    }

    route(path, cb) {
        this.routes[path] = cb || function () {}
    }

    // 触发路由对应回调
    go(path) {
        history.pushState({
            path
        }, null, path)
        this.routes[path] && this.routes[path]()
    }
}
RouterClass.init()
// window.Router = new RouterClass()
const ul = document.querySelector('ul')
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
ul.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
        e.preventDefault()
        Router.go(e.target.getAttribute('href'))
    }
})