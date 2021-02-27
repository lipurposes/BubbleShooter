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
        this.touchLayer.position = this.beginPoint.position;
        let touchLayerCom = this.touchLayer.getComponent(TouchLayer);
        let startWorldPos = this.touchLayer.convertToWorldSpaceAR(new cc.Vec2(0, 0));
        touchLayerCom.startPoint = startWorldPos;
    }
}
