
import GameController from './GameController';
const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewGame extends cc.Component {

    @property()
    pointDis = 100;

    @property()
    pointSpeed = 50;

    @property(cc.Prefab)
    pointSp = null;
    
    gameController: GameController = null;
    maxY = 1800;
    
    pointsTimes: number[] = [];

    start() {
        this.gameController = cc.Canvas.instance.getComponent(GameController);
    }

    setPath() {
        let children = this.node.children;
        for(let i = 0; i < children.length; ++i){
            children[i].destroy();
        }
        let path = this.gameController.getPath();
        let pathSpeed = path.speed;
        let time = 0;
        let pos = 0;
        let timeSpace = this.pointDis / this.pointSpeed;
        let timeSpacePath = timeSpace * (this.pointSpeed / pathSpeed);
        while(true){
            let setPoint = path.getPoint(time);
            if(setPoint.y < this.maxY){
                let node = cc.instantiate(this.pointSp);
                node.parent = this.node;
                node.setPosition(setPoint.x, setPoint.y);
                this.pointsTimes[pos] = time;
            }else{
                break;
            }
            time = time +  timeSpacePath;
            pos += 1;
        }
    }

    removePath() {

    }

    update(dt) {
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
