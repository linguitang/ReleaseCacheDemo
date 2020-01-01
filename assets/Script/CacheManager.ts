export class CacheManager{
    private static _instance:CacheManager = null;
    private _releaseJson:string[] = []; // json资源
    private _releasePrefab:string[] = []; // prefab资源
    private _releaseSpine:string[] = []; // spine资源
    private _releaseOther:{[url:string]:typeof cc.Asset} = {}; // 其他的资源
    private constructor(){
    }
    static getInstance():CacheManager{
        if (this._instance == null) {
            this._instance = new CacheManager();
        }
        return this._instance;
    }

    // 加载某种类型的资源
    public loadResWithType(url:string,type:typeof cc.Asset,completeCallback: (error: Error, resource: any) => void){
        this.loadResNow(url,type);
        cc.loader.loadRes(url,type,completeCallback);
    }

    // 加载json资源
    public loadJson(url:string,completeCallback: (error: Error, resource: any) => void){
        this.loadResNow(url, null);
        cc.loader.loadRes(url,completeCallback);
    }

    // 将加载的列表存起来
    private loadResNow(url:string,type:typeof cc.Asset){
        if (cc.sys.os !== cc.sys.OS_ANDROID && cc.sys.os !== cc.sys.OS_IOS){
            return;
        }
        if (type === sp.SkeletonData){
            if (this._releaseSpine.indexOf(url) === -1){
                this._releaseSpine.push(url);
            }
        } else if (type === cc.Prefab){
            if (this._releasePrefab.indexOf(url) === -1){
                this._releasePrefab.push(url);
            }
        } else {
            if (type == null){
                if (this._releaseJson.indexOf(url) === -1){
                    this._releaseJson.push(url);
                }
            } else {
                if (this._releaseOther[url] == null){
                    this._releaseOther[url] = type;
                }
            }
        }
    }

    // 释放缓存
    public releaseCaches(){
        if (cc.sys.os !== cc.sys.OS_ANDROID && cc.sys.os !== cc.sys.OS_IOS){
            return;
        }
        for (let i = 0; i < this._releaseJson.length; ++i){
            cc.loader.release(this._releaseJson[i]);
        }

        for (let i = 0; i < this._releasePrefab.length; ++i){
            let deps:string[] = cc.loader.getDependsRecursively(this._releasePrefab[i]);
            cc.loader.release(deps);
            cc.loader.releaseRes(this._releasePrefab[i],cc.Prefab);
            cc.loader.release(this._releasePrefab[i]);
        }

        for (let i = 0; i < this._releaseSpine.length; ++i){
            let deps:string[] = cc.loader.getDependsRecursively(this._releaseSpine[i]);
            cc.loader.release(deps);
            cc.loader.releaseRes(this._releaseSpine[i],sp.SkeletonData);
            let index:number = this._releaseSpine[i].lastIndexOf("/");
            cc.loader.releaseResDir(this._releaseSpine[i].substring(0,index));
            cc.loader.release(this._releaseSpine[i]);
        }

        for (let i in this._releaseOther){
            cc.loader.releaseRes(i,this._releaseOther[i]);
            cc.loader.release(i);
        }

        this._releaseJson = [];
        this._releasePrefab = [];
        this._releaseSpine = [];
        this._releaseOther = {};
    }

}