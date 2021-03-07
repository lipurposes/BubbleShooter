
import GameController from './GameController';
import BubbleView from './BubbleView';
const { ccclass, property } = cc._decorator;

@ccclass
export default class ViewGame extends cc.Component {

    @property()
    pointDis = 30;

    @property()
    pointSpeed = 50;

    @property()
    bubbleSpeed = 1000;

    @property(BubbleView)
    bubbleView: BubbleView = null;

    @property(cc.Prefab)
    pointSp = null;

    @property([cc.Prefab])
    public bubblePrefabs: cc.Prefab[] = [];

    private ball: cc.Node;
    private ballTime = 0;
    private colorIndex = 0;
    private isEmmit = false;
    private nodeToWorldPosY = 100;

    gameController: GameController = null;
    maxY = 1000;

    pointsTimes: number[] = [];

    start() {
        this.gameController = cc.Canvas.instance.getComponent(GameController);
        this.nodeToWorldPosY = this.node.convertToWorldSpace(cc.v2(0, 0)).y;
        console.log(this.nodeToWorldPosY);
    }

    setPath() {
        this.createBall();
        let children = this.node.children;
        for (let i = 0; i < children.length; ++i) {
            if(children[i] != this.ball){
                children[i].destroy();
            }
        }
        let path = this.gameController.getPath();
        let pathSpeed = path.speed;
        let time = 0;
        let pos = 0;
        let moveTime = this.pointDis / this.pointSpeed;
        let timeSpacePath = moveTime * (this.pointSpeed / pathSpeed);
        while (true) {
            let setPoint = path.getPoint(time);
            if (setPoint.y < this.maxY) {
                let node = cc.instantiate(this.pointSp);
                node.parent = this.node;
                node.setPosition(setPoint.x, setPoint.y);
                this.pointsTimes[pos] = time;
            } else {
                break;
            }
            time = time + timeSpacePath;
            pos += 1;
        }
    }

    removePath() {
        let children = this.node.children;
        for (let i = 0; i < children.length; ++i) {
            if(children[i] != this.ball){
                children[i].destroy();
            }
        }
    }

    createBall(){
        if(!this.ball){
            let index = Math.floor(Math.random() * 6);
            this.ball = cc.instantiate(this.bubblePrefabs[index]);
            this.ball.parent = this.node;
            this.ballTime = 0;
            this.colorIndex = index;
        }
    }

    emitBall() {
        this.isEmmit = true;
    }

    removeBall() {
        this.isEmmit = false;
        this.ball.destroy();
        this.ball = null;
    }

    update(dt) {
        if(this.isEmmit){
            let path = this.gameController.getPath();
            let pathSpeed = path.speed;
            let timeSpaceDt = dt * (this.bubbleSpeed / pathSpeed);
            this.ballTime += timeSpaceDt;

            let setPoint = path.getPoint(this.ballTime);
            this.ball.setPosition(setPoint.x, setPoint.y);
            setPoint.y += this.nodeToWorldPosY;
            // let [isCollide, indexs] = this.bubbleView.checkIsLinked(setPoint);
            // if(isCollide){
            //     this.removeBall();
            //     this.bubbleView.createBubble(setPoint, indexs, this.colorIndex);
            // }
        }
        // let path = this.gameController.getPath();
        // let pathSpeed = path.speed;
        // let timeSpaceDt = dt * (this.pointSpeed / pathSpeed);
        // let children = this.node.children;
        // for(let i = 0; i < children.length; ++i){
        //     this.pointsTimes[i] += timeSpaceDt;
        //     let setPoint = path.getPoint(this.pointsTimes[i]);
        //     if(setPoint.y > this.maxY){
        //         let plus = setPoint.y - this.maxY;
        //         let plusTime = (plus / path.segementY) * path.segementTime;
        //         this.pointsTimes[i] = plusTime;
        //         setPoint = path.getPoint(this.pointsTimes[i]);
        //     }
        //     children[i].setPosition(setPoint.x, setPoint.y);
        // }
    }
}
