const { ccclass, property } = cc._decorator;

import GameController from './GameController';
import PathLayer from './PathLayer';


@ccclass
export default class TouchLayer extends cc.Component {

    gameController: GameController;
    

    @property(PathLayer)
    pathLayer: PathLayer = null;

    @property
    minTouchYDistance = 100;
    

    @property(cc.Vec2)
    _startPoint = new cc.Vec2(0, 0);

    @property
    get startPoint() {
        return this._startPoint;
    }

    set startPoint(point : cc.Vec2) {
        this._startPoint = point;
    }

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.registerEvent();
        this.gameController = this.node.parent.getComponent(GameController);
    }

    start() {

    }

    registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onEventStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onEventMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onEventCancel, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEventEnd, this);
    }

    onEventStart(event: cc.Event.EventTouch) {
        let location= event.getLocation();
        this.setPath(location);
        
    }

    onEventMove(event: cc.Event.EventTouch) {
        let location= event.getLocation();
        this.setPath(location);
        // console.log('start Event \n worldPoint= ', viewPoint.x, viewPoint.y);
    }

    onEventCancel(event: cc.Event.EventTouch) {

    }

    onEventEnd(event: cc.Event.EventTouch) {
        
    }

    setPath(touchLocation : cc.Vec2) {
        if(touchLocation.y - this.startPoint.y > this.minTouchYDistance){
            this.gameController.setPath(this.startPoint, touchLocation);
            this.pathLayer.setPath();
        }
    }

    removePath() {

    }

    emitBall() {

    }

}
