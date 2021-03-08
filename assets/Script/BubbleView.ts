
import GameController from './GameController';
const { ccclass, property } = cc._decorator;
import {Bubble} from './BubbleData';

@ccclass
export default class BubbleView extends cc.Component {

    @property([cc.Prefab])
    public bubblePrefabs: cc.Prefab[] = [];

    @property(cc.Node)
    bubbleLayer: cc.Node = null;

    @property()
    minRow = 10;

    private gameController:GameController = null;
    private bubbleRadius = 30;
    private bubbleWSpan = 2 * this.bubbleRadius;
    private bubbleHSpan = 51.96;
    private bubbleEdge = 5;
    private bubbleBeginY = -this.bubbleRadius;
    private minDisSqr = this.bubbleWSpan * this.bubbleWSpan;
    private bubbleNodes = {};
    private viewStartPosY = 0;

    start() {
        this.gameController = this.node.parent.getComponent(GameController);
        this.initBubbles();
        this.viewStartPosY = this.node.y;
    }

    initBubbles() {
        let bubbleData = this.gameController.getBubbleData();
        let bubbles = bubbleData.getAllBubbles();
        for (let i = 0; i < bubbles.length; ++i) {
            this.bubbleNodes[i] = [];
            for (let j = 0; j < bubbles[i].length; ++j) {
                let bubble: Bubble = bubbles[i][j];
                if(bubble){
                    let bubbleNode = cc.instantiate(this.bubblePrefabs[bubble.getColor()]);
                    bubbleNode.parent = this.bubbleLayer;
                    this.setBubblePos(bubbleNode, i, j);
                    this.bubbleNodes["" + i + "_" + j] = bubbleNode;
                }
            }
        }
        this.setViewPos();
    }

    setBubblePos(bubbleNode: cc.Node, row, col){
        let pos = this.getBubblePosByIndex(row, col);
        bubbleNode.setPosition(pos.x, pos.y);
    }

    

    setViewPos(){
        let bubbleData = this.gameController.getBubbleData();
        let row = bubbleData.getRow();
        if(row <= this.minRow){
            this.node.y = this.viewStartPosY;
        }else{
            this.node.y = this.viewStartPosY + (row - this.minRow) * this.bubbleHSpan;
        }
    }

    checkIsLinked(point: cc.Vec2){
        let bubbleLayerPos = this.bubbleLayer.convertToNodeSpaceAR(point);
        return this.getNearestCollide(bubbleLayerPos);
    }

    getBubblePosByIndex(row, col) : cc.Vec2{
        let x = col * this.bubbleWSpan + this.bubbleEdge + this.bubbleRadius;
        if(row % 2 == 1){
            x += this.bubbleRadius;
        }
        let y = this.bubbleBeginY - row * this.bubbleHSpan;
        return new cc.Vec2(x, y);
    }

    // createBubble(point: cc.Vec2, indexPos : cc.Vec2 | boolean, colorIndex){
    //     let x = (indexPos as cc.Vec2).x;
    //     let y = (indexPos as cc.Vec2).y;
    //     let bubblePos = this.getBubblePosByIndex(x, y);

    //     let xDirect = 0; //0在左边，1在右边
    //     let xDis = point.x - bubblePos.x;
    //     if(xDis > 0){
    //         xDirect = 1;
    //     }

    //     let yDirect = 1; // 0在下面，1中间， 2上面

    //     let yDis = point.y - bubblePos.y;
    //     let yIndex = y;
    //     if(yDis > this.bubbleRadius / 2){
    //         yIndex = y + 1;
    //         yDirect = 2;
    //     }else if(yDis < - (this.bubbleRadius / 2)){
    //         yIndex = y - 1;
    //         yDirect = 0;
    //     }
    //     if(yIndex >= this.bubbleColors.length){
    //         yIndex = yIndex - 1;
    //         yDirect = yDirect - 1;
    //     }

    //     if(yDirect == 1 && xDirect == 1 && x + 1 >= this.bubbleNum){
    //         yIndex = yIndex - 1;
    //         yDirect = yDirect - 1;
    //     }

    //     if(yDirect == 1 && xDirect == 0 && x - 1 < 0){
    //         yIndex = yIndex - 1;
    //         yDirect = yDirect - 1;
    //     }

    //     let xIndex = x;
    //     if(yDirect == 0){
    //         if(yIndex == -1){
    //             //todo
    //             return;
    //         }
    //         if(xDirect == 0 && yIndex % 2 != 0){
    //             xIndex -= 1;
    //         }else if(xDirect == 1 && yIndex % 2 == 0){
    //             xIndex += 1;
    //         }
    //     }else if(yDirect == 1){
    //         if(xDirect == 1){
    //             xIndex = x + 1;
    //         }else{
    //             xIndex = x - 1;
    //         }
    //     }else{
    //         if(xDirect == 0 && yIndex % 2 != 0){
    //             xIndex -= 1;
    //         }else if(xDirect == 1 && yIndex % 2 == 0){
    //             xIndex += 1;
    //         }
    //     }
    //     if(xIndex < 0){
    //         xIndex = 1;
    //     }
    //     this.createBubbleNode(xIndex, yIndex, colorIndex);
    // }

    // createBubbleNode(xIndex, yIndex ,colorIndex){
    //     if(this.bubbleNodes[yIndex][xIndex]){
    //         return;
    //     }
    //     this.bubbleColors[yIndex][xIndex] = colorIndex;
    //     let bubble = cc.instantiate(this.bubblePrefabs[colorIndex]);
    //     bubble.parent = this.addBubbleLayer;
    //     let bubblePos = this.getBubblePosByIndex(xIndex, yIndex);
    //     bubble.setPosition(bubblePos);
    //     this.bubbleNodes[yIndex][xIndex] = bubble;
    //     this.collideToDelete(xIndex, yIndex, colorIndex);
    // }

    // collideToDelete(xIndex, yIndex, checkColor){
    //     let toChecks = [];
    //     let isChecked = {};
    //     let checkNumber = 0;
    //     toChecks[0] = [xIndex, yIndex];
    //     while(checkNumber < toChecks.length){
    //         let [xI, yI] = toChecks[checkNumber];
    //         if(!isChecked["" + xI + yI]){
    //             isChecked["" + xI + yI] = true;
    //             let leftX = xI - 1;
    //             if(leftX >= 0 && this.bubbleColors[yI][leftX] == checkColor && !isChecked["" + leftX + yI]){
    //                 toChecks[toChecks.length] = [leftX, yI];
    //             }
    //             let rightX = xI + 1;
    //             if(rightX < this.bubbleNum && this.bubbleColors[yI][rightX] == checkColor && !isChecked["" + rightX + yI]){
    //                 toChecks[toChecks.length] = [rightX, yI];
    //             }
    //             let topY = yI + 1;
    //             let topX1 = xI - 1;
    //             if(topY < this.bubbleColors.length){
    //                 if(topY % 2 == 0){
    //                     topX1 += 1;
    //                 }
    //                 for(let testX = topX1; testX < topX1 + 2; testX +=1){
    //                     if(testX >= 0 && testX < this.bubbleNum && this.bubbleColors[topY][testX] == checkColor && !isChecked["" + testX + topY]){
    //                         toChecks[toChecks.length] = [testX, topY];
    //                     }
    //                 }
    //             }
                
    //             let bottomY = yI - 1;
    //             let bottomX1 = xI - 1;
    //             if(bottomY >= 0){
    //                 if(bottomY % 2 == 0){
    //                     bottomX1 += 1;
    //                 }
    //                 for(let testX = bottomX1; testX < bottomX1 + 2; testX +=1){
    //                     if(testX >= 0 && testX < this.bubbleNum && this.bubbleColors[bottomY][testX] == checkColor && !isChecked["" + testX + bottomY]){
    //                         toChecks[toChecks.length] = [testX, bottomY];
    //                     }
    //                 }
    //             }
    //         }
    //         checkNumber += 1;
    //     }
    //     if(toChecks.length >= 3){
    //         this.deleteBubbleNodes(toChecks);
    //     }
    // }

    // deleteBubbleNodes(deleteIndexs){
    //     for(let i = 0; i < deleteIndexs.length; ++i){
    //         let [xIndex, yIndex] = deleteIndexs[i];
    //         if(this.bubbleNodes[yIndex][xIndex]){
    //             this.bubbleNodes[yIndex][xIndex].destroy();
    //             this.bubbleNodes[yIndex][xIndex] = null;
    //         }
    //         this.bubbleColors[yIndex][xIndex] = null;
    //     }
    // }

    getNearestCollide(point: cc.Vec2){
        let yReflect = -point.y;
        let yMaxIndex = Math.ceil((yReflect + this.bubbleBeginY) / this.bubbleHSpan);
        let minDis = this.minDisSqr + 1;
        let colideRow = 0, colideCol = 0;
        for(let row = yMaxIndex; row >= yMaxIndex - 1; --row){
            let colL;
            if(row % 2 == 0){
                colL = Math.floor((point.x - this.bubbleEdge - this.bubbleRadius) / this.bubbleWSpan);
            }else{
                colL = Math.floor((point.x - this.bubbleEdge - this.bubbleWSpan) / this.bubbleWSpan)
            }
            for(let col = colL; col <= colL + 1; ++col){
                let colideDis = this.getCollideDis(row, col, point);
                if(colideDis < minDis){
                    minDis = colideDis;
                    colideRow = row;
                    colideCol = col;
                }
            }
            if(minDis < this.minDisSqr + 1){
                return [true, new cc.Vec2(colideRow, colideCol)];
            }
        }
        return [false];
    }

    getCollideDis(row, col, pos: cc.Vec2):number{
        if(row < 0){
            row = 0;
        }
        let bubbleData = this.gameController.getBubbleData();
        let bubble = bubbleData.getBubble(row, col);
        if(bubble || row == 0){
            let bubblePos = this.getBubblePosByIndex(row, col);
            let dis = pos.sub(bubblePos).magSqr();
            if(dis <= this.minDisSqr){
                return dis;
            }
        }
        return this.minDisSqr + 1;
    }
}
