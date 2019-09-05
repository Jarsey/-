// 闭包的词法作用域
// 闭包的外部作用域在其定义的时候被决定，而不是执行的时候
(function test() {
    let num = 1

    function inside() {
        console.log('num', num)
    }

    function run() {
        let num = 2
        inside()
    }
    run()
})()


// 闭包与封装性
// 闭包的应用

// 一、工厂模式与私有原型对象
// 将todoPrototype放置Todo1中，成为私有属性，而非暴露在全局中
let Todo1 = (function () {
    let todoPrototype = {
        concat: function () {
            return `在${this.time}当天${this.listName}`
        }
    }
    return function (todo) {
        let newTode = Object.create(todoPrototype)
        Object.assign(newTode, todo)
        return newTode
    }
})()

let todo1 = Todo1({
    listName: '完成小程序',
    time: '2020年元旦'
})
let todo2 = Todo1({
    listName: '看完JavaScript高程',
    time: '2020年2月'
})
console.log('todo1.concat', todo1.concat())
console.log('todo2.concat', todo2.concat())

// 二、工厂模式和私有构造函数
// 这里把构造函数放在了Todo2中，做成了私有函数
let Todo2 = (function () {
    function Concat(todo) {
        // 在构造函数中，return是没用的
        // return `在${time}当天${listName}`
        Object.assign(this, todo)
    }
    return function (todo) {
        let newTode = new Concat(todo)
        return newTode
    }
})()
let todo3 = Todo2({
    listName: '完成小程序',
    time: '2020年元旦'
})
console.log('todo3', todo3)

// 三、翻译功能与私有map
// 这里主要是把map做成了私有属性，而不是放在全局环境中
let translate = (function () {
    let map = {}
    map['home'] = '家'
    map['nation'] = '民族'
    return function (word) {
        return map[word] ? map[word] : '暂无翻译'
    }
})()
let transResult = translate('home')
console.log('transResult', transResult)

// 四、自增生成器函数
// 注意这里的createAGenerate不再是自执行方法,不然无法实现自增生成器效果
// 这里利用的就是闭包引用着外部环境的变量，所以闭包一直存在，所以闭包里面的状态也一直存在，若想将闭包状态清空，需要清除引用，即将闭包函数置成null
let createAGenerate = function (count, increment) {
    return function () {
        count += increment
        return count
    }
}
let generateResult = createAGenerate(0, 1)
console.log('1', generateResult())
console.log('2', generateResult())
console.log('3', generateResult())

// 五、对象与私有状态
// 和上面一样的，return的时候引用了add和get，一直存在，并且add和get函数引用了外部函数的变量，故这两个是闭包，状态一直保存
// 而isPriorityTodo和toTodoViewModel没有引用外部作用域的对象，这两个是纯函数而非闭包
function TodoStore() {
    let todos = []

    function add(todo) {
        todos.push(todo);
    }

    function get() {
        return todos.filter(isPriorityTodo).map(toTodoViewModel);
    }

    function isPriorityTodo(todo) {
        return task.type === "RE" && !task.completed;
    }

    function toTodoViewModel(todo) {
        return {
            id: todo.id,
            title: todo.title
        };
    }
    return Object.freeze({
        add,
        get
    })
}