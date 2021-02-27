import ViewGame from "./ViewGame";
import PathData from "./PathData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameController extends cc.Component {
    @property
    ballRadius = 30;

    @property
    baseSpeed = 1000;

    viewGame: ViewGame = null;
    xLength: number = 0;
    path: PathData;

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.xLength = this.node.width / 2;
        this.path = new PathData(this.xLength - this.ballRadius, this.baseSpeed);
    }

    start() {
        // init logic
        this.viewGame = this.getComponent(ViewGame);
    }

    setPath(startPoint: cc.Vec2, endPoint: cc.Vec2){
        this.path.setPath(startPoint, endPoint);
    }

    getPath(){
        return this.path;
    }
}