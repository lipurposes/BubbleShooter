
import GameController from './GameController';
const { ccclass, property } = cc._decorator;

@ccclass
export default class BubbleLayer extends cc.Component {

    @property([cc.Prefab])
    public bubblePrefabs: cc.Prefab[] = [];

    private startPosY = 0;
    private bubbleRadius = 30;
    private bubbleWSpan = 60;
    private bubbleHSpan = 51.96;
    private bubbleEdge = 15;
    private bubbleNum = 17;
    private bubbleColors = [];
    private minDisSqr = 3600;
    private bubbleNodes = [];
    private addBubbleLayer = null;

    start() {
        this.startPosY = 800;
        this.initBubbles();
    }

    initBubbles() {
        this.addBubbleLayer = new cc.Node();
        this.addBubbleLayer.parent = this.node;
        this.bubbleColors = [
            [],
            [0, 2, 1, 2, 4, 5, 0, 0, 1, 0, 1, 1, 2, 2, 5, 3, 4],
            [0, 2, 1, 2, 4, 5, 0, 0, 1, 0, 1, 1, 2, 2, 5, 3, 4],
            [0, 2, 1, 2, 4, 5, 0, 0, 1, 0, 1, 1, 2, 2, 5, 3, 4],
            [0, 2, 1, 2, 4, 5, 0, 0, 1, 0, 1, 1, 2, 2, 5, 3, 4],
            [0, 2, 1, 2, 4, 5, 0, 0, 1, 0, 1, 1, 2, 2, 5, 3, 4]
        ];
        for (let i = 0; i < this.bubbleColors.length; ++i) {
            this.bubbleNodes[i] = [];
            for (let j = 0; j < this.bubbleColors[i].length; ++j) {
                let bubbleColor = this.bubbleColors[i][j];
                let bubble = cc.instantiate(this.bubblePrefabs[bubbleColor]);
                bubble.parent = this.addBubbleLayer;
                let bubbleBeginX = (i % 2 == 1) && (this.bubbleEdge + this.bubbleWSpan) || this.bubbleEdge + this.bubbleRadius;
                bubble.setPosition(bubbleBeginX + j * this.bubbleWSpan, i * this.bubbleHSpan);
                this.bubbleNodes[i][j] = bubble;
            }
        }
    }

    checkIsLinked(point: cc.Vec2){
        if (point.y < this.startPosY) {
            return [false];
        }
        point.x = point.x + 540;
        point.y = point.y - this.startPosY;
        return this.getNearestCollide(point);
    }

    getBubblePosByIndex(xIndex, yIndex) : cc.Vec2{
        let bubbleX = yIndex % 2 == 0 ? this.bubbleEdge + this.bubbleRadius + xIndex * this.bubbleWSpan : this.bubbleEdge + this.bubbleWSpan + xIndex * this.bubbleWSpan;
        let bubbleY = yIndex * this.bubbleHSpan;
        return new cc.Vec2(bubbleX, bubbleY);
    }

    createBubble(point: cc.Vec2, indexPos : cc.Vec2 | boolean, colorIndex){
        let x = (indexPos as cc.Vec2).x;
        let y = (indexPos as cc.Vec2).y;
        let bubblePos = this.getBubblePosByIndex(x, y);

        let xDirect = 0; //0在左边，1在右边
        let xDis = point.x - bubblePos.x;
        if(xDis > 0){
            xDirect = 1;
        }

        let yDirect = 1; // 0在下面，1中间， 2上面

        let yDis = point.y - bubblePos.y;
        let yIndex = y;
        if(yDis > this.bubbleRadius / 2){
            yIndex = y + 1;
            yDirect = 2;
        }else if(yDis < - (this.bubbleRadius / 2)){
            yIndex = y - 1;
            yDirect = 0;
        }
        if(yIndex >= this.bubbleColors.length){
            yIndex = yIndex - 1;
            yDirect = yDirect - 1;
        }

        if(yDirect == 1 && xDirect == 1 && x + 1 >= this.bubbleNum){
            yIndex = yIndex - 1;
            yDirect = yDirect - 1;
        }

        if(yDirect == 1 && xDirect == 0 && x - 1 < 0){
            yIndex = yIndex - 1;
            yDirect = yDirect - 1;
        }

        let xIndex = x;
        if(yDirect == 0){
            if(yIndex == -1){
                //todo
                return;
            }
            if(xDirect == 0 && yIndex % 2 != 0){
                xIndex -= 1;
            }else if(xDirect == 1 && yIndex % 2 == 0){
                xIndex += 1;
            }
        }else if(yDirect == 1){
            if(xDirect == 1){
                xIndex = x + 1;
            }else{
                xIndex = x - 1;
            }
        }else{
            if(xDirect == 0 && yIndex % 2 != 0){
                xIndex -= 1;
            }else if(xDirect == 1 && yIndex % 2 == 0){
                xIndex += 1;
            }
        }
        if(xIndex < 0){
            xIndex = 1;
        }
        this.createBubbleNode(xIndex, yIndex, colorIndex);
    }

    createBubbleNode(xIndex, yIndex ,colorIndex){
        if(this.bubbleNodes[yIndex][xIndex]){
            return;
        }
        this.bubbleColors[yIndex][xIndex] = colorIndex;
        let bubble = cc.instantiate(this.bubblePrefabs[colorIndex]);
        bubble.parent = this.addBubbleLayer;
        let bubblePos = this.getBubblePosByIndex(xIndex, yIndex);
        bubble.setPosition(bubblePos);
        this.bubbleNodes[yIndex][xIndex] = bubble;
        this.collideToDelete(xIndex, yIndex, colorIndex);
    }

    collideToDelete(xIndex, yIndex, checkColor){
        let toChecks = [];
        let isChecked = {};
        let checkNumber = 0;
        toChecks[0] = [xIndex, yIndex];
        while(checkNumber < toChecks.length){
            let [xI, yI] = toChecks[checkNumber];
            if(!isChecked["" + xI + yI]){
                isChecked["" + xI + yI] = true;
                let leftX = xI - 1;
                if(leftX >= 0 && this.bubbleColors[yI][leftX] == checkColor && !isChecked["" + leftX + yI]){
                    toChecks[toChecks.length] = [leftX, yI];
                }
                let rightX = xI + 1;
                if(rightX < this.bubbleNum && this.bubbleColors[yI][rightX] == checkColor && !isChecked["" + rightX + yI]){
                    toChecks[toChecks.length] = [rightX, yI];
                }
                let topY = yI + 1;
                let topX1 = xI - 1;
                if(topY < this.bubbleColors.length){
                    if(topY % 2 == 0){
                        topX1 += 1;
                    }
                    for(let testX = topX1; testX < topX1 + 2; testX +=1){
                        if(testX >= 0 && testX < this.bubbleNum && this.bubbleColors[topY][testX] == checkColor && !isChecked["" + testX + topY]){
                            toChecks[toChecks.length] = [testX, topY];
                        }
                    }
                }
                
                let bottomY = yI - 1;
                let bottomX1 = xI - 1;
                if(bottomY >= 0){
                    if(bottomY % 2 == 0){
                        bottomX1 += 1;
                    }
                    for(let testX = bottomX1; testX < bottomX1 + 2; testX +=1){
                        if(testX >= 0 && testX < this.bubbleNum && this.bubbleColors[bottomY][testX] == checkColor && !isChecked["" + testX + bottomY]){
                            toChecks[toChecks.length] = [testX, bottomY];
                        }
                    }
                }
            }
            checkNumber += 1;
        }
        if(toChecks.length >= 3){
            this.deleteBubbleNodes(toChecks);
        }
    }

    deleteBubbleNodes(deleteIndexs){
        for(let i = 0; i < deleteIndexs.length; ++i){
            let [xIndex, yIndex] = deleteIndexs[i];
            if(this.bubbleNodes[yIndex][xIndex]){
                this.bubbleNodes[yIndex][xIndex].destroy();
                this.bubbleNodes[yIndex][xIndex] = null;
            }
            this.bubbleColors[yIndex][xIndex] = null;
        }
    }

    getNearestCollide(point: cc.Vec2){
        let yMin = Math.floor(point.y / this.bubbleHSpan);
        let yMax = yMin + 1;

        let xPos = point.x - this.bubbleEdge;
        let xMin, xMax;
        if (yMin % 2 == 0) {
            xMin = Math.floor(xPos / this.bubbleWSpan);
            xMax = Math.floor((xPos - this.bubbleRadius) / this.bubbleWSpan);
        } else {
            xMin = Math.floor((xPos - this.bubbleRadius) / this.bubbleWSpan);
            xMax = Math.floor(xPos / this.bubbleWSpan);
        }

        let minDis = 9999; 
        let maxDis = 9999;
        if(this.bubbleNodes[yMin] && this.bubbleNodes[yMin][xMin]){
            let bubbleMinPos = this.getBubblePosByIndex(xMin, yMin);
            minDis = point.sub(bubbleMinPos).magSqr();
        }
        if(this.bubbleNodes[yMax] && this.bubbleNodes[yMax][xMax]){
            let bubbleMaxPos = this.getBubblePosByIndex(xMax, yMax);
            maxDis = point.sub(bubbleMaxPos).magSqr();
        }
        
        if(minDis <= this.minDisSqr && minDis <= maxDis){
            return [true, new cc.Vec2(xMin, yMin)];
        }else if(maxDis <= this.minDisSqr){
            return [true, new cc.Vec2(xMax, yMax)];
        }
        return [false];
    }

}
