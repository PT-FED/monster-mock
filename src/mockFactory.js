/**
 * Created by yongsheng.kuang on 16/9/18.
 */

(function (window,undefined) {
    //缓存的mockdata
    var mockData =[
        //{
        //  "url":数据模拟url,
        //  "data":[数据],
        //  "pk":"id"//数据对象的主键。默认是id
        //}
    ];
    var config={
        showLog:true//显示log信息
    };


    //工具方法
    var Util={};

    /**
     * 转化Req请求信息。
     * @param url
     * @returns {{url: string, pk: string, prams: {}}}
     */
    Util.parseReq=function (url,mock) {
        var paramString,pk, additionalUrl = url.replace(mock.url,'');
        if(additionalUrl){
            paramString = additionalUrl.match(/\?[\s\S]*/g);
            if(paramString && paramString.length){
                paramString = paramString[0];
            }
            pk = additionalUrl.replace(paramString,'');
            paramString = paramString?paramString.substr(1):'';
            pk = pk?pk.substr(1):'';

        }

        var params = paramString?
            paramString.split('&').map(function (p) {
                var pArray = p.split('=');
                return {
                    key:pArray[0],
                    value:pArray[1]}})
            :[];
        return {
            pk:pk,
            params:params
        }
    };

    /**
     * 生成guid
     * @returns {guid}
     */
    Util.generateUUID =function(){
        var d = new Date().getTime();
        if(window.performance && typeof window.performance.now === "function"){
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };

    /**
     * 创建一个mock对象
     * @param mock {url:模拟url,data:模拟数据,pk:主键}
     * @constructor
     */
    function MockFactory(mock) {
        if(!mock.pk){
            mock.pk='id';
        }
        this._mock = mock;
    }

    //取消print log
    MockFactory.disableLog = function () {
      config.showLog=false;
    };
    //设置 发起数据请求时，打印log
    MockFactory.showLog = function () {
        config.showLog=true;
    };

    //打印log。（根据设置信息，判断是否打印）
    MockFactory.print=function (args) {
        if(config.showLog){
            console.log('MockFactory log!!!',args);
        }
    };

    MockFactory.prototype._filter=function (pk,params) {
        var mockFactory = this;
       return this._mock.data.filter(function (obj) {
            var isMatch = true;
            if(pk){
                if(obj[mockFactory._mock.pk] == pk){
                    isMatch=false;
                }
            }
            params.forEach(function (p) {
                if(p.value != obj[p.key]){
                    isMatch=false;
                }
            });
            return isMatch;
        });
    };
    
    MockFactory.prototype.get = function (req) {
        var mockFactory = this;
        MockFactory.print(req);
        return new Promise(function (resolve,reject) {
            var reqInfo = Util.parseReq(req.url, mockFactory._mock);

            var resData = mockFactory._filter(reqInfo.pk,[]);
            if(resData.length){
                resData = resData[0];
            }else{
                resData=null;
            }
            var res = {
                status:'success',
                data:resData
            };
            MockFactory.print(res);
            if(req.success){
                req.success(res);
            }
            resolve(res);
        });
    };

    MockFactory.prototype.search = function (req) {
        var mockFactory = this;
        MockFactory.print(req);
        return new Promise(function (resolve,reject) {
            var reqInfo = Util.parseReq(req.url, mockFactory._mock);

            var resData = mockFactory._filter('',reqInfo.params);
            var res = {
                status:'success',
                data:resData
            };
            MockFactory.print(res);
            if(req.success){
                req.success(res);
            }
            resolve(res);
        });
    };

    window.MockFactory = MockFactory;
})(window);


