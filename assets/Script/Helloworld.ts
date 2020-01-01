const {ccclass, property} = cc._decorator;
import {CacheManager} from './CacheManager';
@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Button)
    button:cc.Button = null;

    @property
    text: string = 'hello';
    count:number = 0;
    onLoad(){
        this.button.node.on('click', this.buttonClicked)
        this.button.node.active = false;
    }

    start () {
        // init logic
        let self = this;
        this.label.string = this.text;
        CacheManager.getInstance().loadJson('testJson', function(err,data){
            self.loadEnd();

        });
        CacheManager.getInstance().loadResWithType('loadSpine/alien-ess', sp.SkeletonData,function(err, data){
            self.loadEnd();
        });
        CacheManager.getInstance().loadResWithType('spineboy/spineboy', sp.SkeletonData,function(err, data){
            self.loadEnd();
        });
        CacheManager.getInstance().loadResWithType('spineRaptor/raptor', sp.SkeletonData,function(err, data){
            self.loadEnd();
        });
    }
    buttonClicked(){
        if (cc.sys.os === cc.sys.OS_ANDROID || cc.sys.os === cc.sys.OS_IOS){
            CacheManager.getInstance().releaseCaches();
        }
        cc.director.loadScene('empty');
        cc.sys.garbageCollect();
    }

    loadEnd(){
        this.count += 1;
        if (this.count == 4){
            this.button.node.active = true;
        }
    }
}
