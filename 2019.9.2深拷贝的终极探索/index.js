let testObjSource = {
  a: 1,
  b: 2,
  c: {
    a: 3
  }
}
// ****************只拷贝一层***************
// function shallowclone(source) {
//     let target = {}
//     for (let key in source) {
//         if (source.hasOwnProperty(key)) {
//             target[key] = source[key]
//         }
//     }
//     return target
// }
// let testObjTarget = shallowclone(testObjSource)
// console.log('testObjTarget', testObjTarget)
// console.log('testObjTarget.c && testObjSource.c', testObjTarget.c === testObjSource.c)
// console.log('testObjTarget && testObjSource', testObjTarget === testObjSource)

// ****************一行实现代码的深拷贝**************
// function cloneJSON(source) {
//     return JSON.parse(JSON.stringify(source))
// }
// let testObjTarget = cloneJSON(testObjSource)
// console.log('testObjTarget', testObjTarget)
// console.log('testObjTarget.c && testObjSource.c', testObjTarget.c === testObjSource.c)
// console.log('testObjTarget && testObjSource', testObjTarget === testObjSource)

// ***************递归实现最简单的深拷贝****************

// function clone(source) {
//     var target = {}
//     for (let key in source) {
//         if (source.hasOwnProperty(key)) {
//             if (isObject(source[key])) {
//                 console.log(1)
//                 // if (typeof source[key] === 'object') {
//                 target[key] = clone(source[key])
//             } else {
//                 target[key] = source[key]
//             }
//         }
//     }
//     return target
// }
// let testObjTarget = clone(testObjSource)
// console.log('testObjTarget.f&& testObjSource.f', testObjTarget.f === testObjSource.f)
// console.log('testObjTarget.c && testObjSource.c', testObjTarget.c === testObjSource.c)
// console.log('testObjTarget && testObjSource', testObjTarget === testObjSource)

// 这样用递归实现的深拷贝有以下几个问题：
// 1.参数没有进行校验（若参数是非引用类型），解决方法，在clone函数最前面加上参数是object的判断
// 2.判断为对象的方法不够严谨
// 3.考虑数组的兼容
// 4.栈溢出情况（对象层级很深或者对象的相互引用）
// 针对上述问题的解决方案：

// 判断传入的是否为对象
// 若使用typeof判断，那么除了function，所有引用类型的typeof返回值都是"object"
// 但是如果使用Object.prototype.toString.call(obj)，若Function类型，则为'[object Function]'， 若为Array类型，则为[object Array]……
// function isObject(obj) {
//     return Object.prototype.toString.call(obj) === '[object Object]'
// }

// 如果数据的层级很深，则会导致栈溢出
// 破解递归爆栈
// function cloneDeep(x) {
//     const root = {}
//     // 栈
//     const loopList = [{
//         parent: root,
//         key: undefined,
//         data: x
//     }]

//     while (loopList.length) {
//         // 深度优先
//         const node = loopList.pop()
//         const parent = node.parent
//         const key = node.key
//         const data = node.data
//         // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
//         // 完美利用对象的引用
//         let res = parent
//         if (typeof key !== 'undefined') {
//             res = parent[key] = {}
//         }
//         for (let key in data) {
//             if (data.hasOwnProperty(key)) {
//                 if (typeof data[key] === 'object') {
//                     // 像栈中推一个数据，继续循环
//                     loopList.push({
//                         parent: res,
//                         key: key,
//                         data: data[key]
//                     })
//                 } else {
//                     res[key] = data[key]
//                 }
//             }
//         }
//     }
//     return root
// }
// // 方法解析
// // 此方法的亮点在于：
// // 1.完美利用对象的引用，res，parent[key]/parent引用的是一个对象；parent和root引用的是一个对象
// // 2.利用while循环替代递归，当某一对象属性值为对象时，向loopList中push一条数据，即向栈顶push一条数据，再利用循环将push的数据pop出来，并处理
// let testObjTarget = cloneDeep(testObjSource)
// console.log('testObjTarget', testObjTarget)
// console.log('testObjTarget.c && testObjSource.c', testObjTarget.c === testObjSource.c)
// console.log('testObjTarget && testObjSource', testObjTarget === testObjSource)

// 上述几种拷贝方式都会出现引用丢失问题
// 如：
let b = {
  test: 1
}
let testObjSource1 = {
  a: 1,
  b: 2,
  c: {
    a: 3
  },
  d: b,
  f: b
}

// 对于引用丢失问题的解决方法
function cloneForce(x) {
  const root = {}
  // 用来去重
  const uniqueList = []
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x
    }
  ]
  while (loopList.length) {
    const node = loopList.pop()
    const parent = node.parent
    const key = node.key
    const data = node.data
    let res = parent

    if (typeof key !== 'undefined') {
      res = parent[key] = {}
    }

    let uniqueData = find(uniqueList, data)
    if (uniqueData) {
      parent[key] = uniqueData.target
      continue // 中断本次循环
    }
    uniqueList.push({
      source: data,
      target: res
    })
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] === 'object') {
          loopList.push({
            parent: res,
            key: key,
            data: data[key]
          })
        } else {
          res[key] = data[key]
        }
      }
    }
  }
  return root
}
function find(arr, item) {
  for (let i in arr) {
    if (arr[i].source === item) {
      return arr[i]
    }
  }
  return null
}

let testObjTarget = cloneForce(testObjSource1)
console.log('testObjTarget', testObjTarget)
console.log(
  'testObjTarget.d && testObjSource1.d',
  testObjTarget.d === testObjSource1.d
) // 这里的输出值应该是true，而不是false
console.log(
  'testObjTarget.f && testObjTarget.d',
  testObjTarget.f === testObjTarget.d
)
console.log('testObjTarget && testObjSource1', testObjTarget === testObjSource1)
// 仔细分析会发现，cloneDeep对于对象的个数是有要求的，如果对象个数过多，那么需要一次次地遍历来判断是否引用了已经引用过的对象，对于运行速度很不友好
