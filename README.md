# monster-mock
mock lib for fed

## Init

### 在页面中引入js
````js
 //src 根据自己项目的路径进行修改
 <script src="../src/mockFactory.js"></script>
````
### 创建一个mock对象
```js
 <script>
    var user = new window.MockFactory({
        url:'test/user',//资源路径
        pk:'id',//主键:对象识别字段(默认是id)
        data:[//
            {
                id:1,
                name:'z3',
                sex:'M'
            },{
                id:2,
                name:'l4',
                sex:'F'
            }
        ]
    });
 </script>
```

### 查询
#### 获取指定资源(根据主键查询)
```js
    //用回调的方式获取结果
    user.get({
        url:'test/user/2',
        success:function(res){
            console.log(res.data)
        }
    });
    //或者用promise 的方式获取结果
     user.get({
        url:'test/user/2'
     }).then(function(res){
        console.log(res.data)
     });
```
result: 
```js
    {
        id:2,
        name:'l4',
        sex:'F'
    }
```

#### 根据条件搜索
```js
     user.search({
        url:'test/user?sex=M&name=z3'
     }).then(function(res){
        console.log(res.data)
     });
```
result: 
```js
    [
        {
            id:1,
            name:'z3',
            sex:'M'
        }
    ]
```
