
const { ccclass, property } = cc._decorator;

@ccclass
export default class TouchLayer extends cc.Component {

    @property
    minTouchYDistance = 100;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Vec2)
    _startPoint = new cc.Vec2(0, 0);

    @property
    get startPoint() {
        return this._startPoint;
    }

    set startPoint(point : cc.Vec2) {
        this._startPoint = point
    }

    onLoad() {
        this.registerEvent();
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
        let worldPoint = event.getLocation();
    }

    onEventMove(event: cc.Event.EventTouch) {
        let viewPoint= event.getLocationInView();
        // console.log('start Event \n worldPoint= ', viewPoint.x, viewPoint.y);
    }

    onEventCancel(event: cc.Event.EventTouch) {
        let viewPoint= event.getLocationInView();
    }

    onEventEnd(event: cc.Event.EventTouch) {
        let viewPoint= event.getLocationInView();
    }

}
