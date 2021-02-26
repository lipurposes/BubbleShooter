import ViewGame from "./ViewGame";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameController extends cc.Component {
    viewGame: ViewGame = null;
    start () {
        // init logic
        this.viewGame = this.getComponent(ViewGame);
    }
}