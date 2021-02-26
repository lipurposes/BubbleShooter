import TouchLayer from './TouchLayer';
const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewGame extends cc.Component {

    @property(cc.Node)
    pathLayer: cc.Node = null;

    @property(cc.Node)
    touchLayer: cc.Node = null;

    @property(cc.Node)
    beginPoint: cc.Node = null;

    start () {
        // init logic
        this.pathLayer.position = this.beginPoint.position;
        this.pathLayer.rotation = 0;
        this.touchLayer.position = this.beginPoint.position;
        let touchLayerCom = this.touchLayer.getComponent(TouchLayer);
    }
}
