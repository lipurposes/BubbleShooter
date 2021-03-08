 class Bubble {
     private color = 0;
     constructor(color){
         this.color = color;
     }
     getColor(){
         return this.color;
     }
 }
export default class BubbleData {
    private bubbleNums = 0;
    private bubbles = []; 
    private bubbleLength = [];
    
    constructor() {
        
    }

    init(bubbleData : number[][]){
        for(let i = 0; i < bubbleData.length; ++i){
            this.bubbles[i] = [];
            this.bubbleLength[i] = 0;
            for(let j = 0; j < bubbleData[i].length; ++j){
                if(bubbleData[i][j] >= 0){
                    this.bubbles[i][j] = new Bubble(bubbleData[i][j]);
                    this.bubbleLength[i] += 1;
                }
            }
        }
    }
    
    getBubble(row, col): Bubble{
        if(this.bubbles[row]){
            return this.bubbles[row][col];
        }
        return null;
    }

    getRow(): number{
        return this.bubbles.length;
    }

    getAllBubbles(): Bubble[][]{
        return this.bubbles;
    }

    addBubble(row, col, color){
        this.bubbles[row] = this.bubbles[row] || [];
        if(!this.bubbles[row][col]){
            this.bubbleLength[row] += 1;
        }
        this.bubbles[row][col] = new Bubble(color);
    }

    deleteBubble(row, col){
        if(this.getBubble(row, col)){
            this.bubbles[row][col] = null;
            this.bubbleLength[row] -= 1;
        }
        while(this.bubbleLength[row] == 0 && row == this.bubbles.length - 1){
            this.bubbles.splice(row, 1);
            this.bubbleLength.splice(row, 1);
            row -= 1;
        }
    }
    deleteNoLinkedBubbles(){
        let deleteBubbles = {};
        for(let i = 0; i < this.bubbles.length; ++i){
            for(let j = 0; j < this.bubbles[i].length; ++j){
                if(this.bubbles[i][j]){
                    deleteBubbles["" + i + "_" + j] = true;
                }
            }
        }
        for(let i = 0; i < this.bubbles[1].length; ++i){
            if(this.bubbles[0][i]){
                this._markAsLinked(0, i, deleteBubbles);
            }
        }
        return deleteBubbles;
    }
    _markAsLinked(row, col, noMarkedTable){
        let key = "" + row + "_" + col
        if(!noMarkedTable[key]){
            return;
        }
        delete noMarkedTable[key];
        //左边
        this._markAsLinked(row, col - 1, noMarkedTable);
        //右边
        this._markAsLinked(row, col + 1, noMarkedTable);
        //下边
        let right = col;
        if((row + 1) % 2 == 0){
            right += 1;
        }
        this._markAsLinked(row + 1, right - 1, noMarkedTable);
        this._markAsLinked(row + 1, right - 1, noMarkedTable);
    }
}

export {Bubble};