function Promise(executor) {
    let _this = this
    // promise状态，默认pending
    _this.status = 'pending'
    // promise成功时的返回结果
    _this.value = undefined
    // promise失败时的结果
    _this.result = undefined
    // 缓存回调函数，解决异步问题
    _this.onResolvedCallbacks = []
    _this.onRejectedCallbacks = []
    // resolve函数
    function resolve(value) {
        // 成功或失败的状态只能由pending转化
        if (_this.status === 'pending') {
            _this.status = 'resolved'
            _this.value = value
            _this.onResolvedCallbacks.forEach(fn => {
                fn()
            })
        }
    }

    function reject(result) {
        if (_this.status === 'pending') {
            _this.status = 'rejected'
            _this.result = result
            _this.onRejectedCallbacks.forEach(fn => {
                fn()
            })
        }
    }
    // 执行执行器函数（promise的参数），将两个方法传入
    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    }

}
Promise.prototype.then = function (onFulfilled, onRjected) {
    // 避免只有then，什么都不传的情况
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) {
        return value
    }
    onRjected = typeof onRjected === 'function' ? onRjected : function (result) {
        return result
    }
    let _this = this
    if (_this.status === 'resolved') {
        let promise2 = new Promise(function (resolve, reject) {
            // 当成功或者失败执行时有异常那么返回的promise应该处于失败状态
            setTimeout(function () {
                try {
                    let x = onFulfilled(_this.value)
                    // 统一处理各种问题
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        })
    }
    if (_this.status === 'rejected') {
        let promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onRjected(_this.result)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        })
    }
    // 异步时，因为Promise会立即执行，所以到then这里。status还是pending的状态，异步结束，status的状态才会被改变
    if (_this.status === 'pending') {
        let promise2 = new Promise(function (resolve, reject) {
            _this.onResolvedCallbacks.push(function () {
                setTimeout(function () {
                    try {
                        let x = onFulfilled(_this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            })
            _this.onRejectedCallbacks.push(function () {
                setTimeout(function () {
                    try {
                        let x = onRjected(_this.result)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            })
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    console.log(11111)
    // 对于then中的函数return结果x做出各种判断，有以下几种情况
    // p.then(function(res) {
    //     return new Promise(function(){})
    //     或
    //     return function() {}
    //     或
    //     return p
    //     或
    //     return '123'
    //     或不return
    // }, function(err) {
    //     ……
    // })
    debugger
    if (promise2 === x) {
        return reject('循环引用')
    }
    let called // 表示是否调用过成功或者失败，用来解决调resolve又调reject问题,如果是这样，忽略reject
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        // 若then中return了promise，或function
        try {
            // 如果x中有then方法，那我们就认为它是promise，
            let then = x.then
            if (typeof then === 'function') {
                // 这里的y也是官方规范，如果还是promise，可以当下一次的x使用
                // 执行then方法，this指向本次的x
                then.call(x, function (y) {
                    //如果调用过就return掉
                    if (called) return
                    called = true
                    // y可能还是一个promise，在去解析直到返回的是一个普通值，递归调用
                    resolvePromise(promise2, y, resolve, reject)
                }, function (err) {
                    if (called) return
                    called = true
                    reject(err)
                })
            } else {
                resolve(x)
            }
        } catch (e) {
            reject(e)
        }
    } else {
        // 若then中正常返回或不返回
        resolve(x)
    }
}
// module.exports = Promise