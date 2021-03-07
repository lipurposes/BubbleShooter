export default class PathData {
    public xEdge = 0;
    public speed = 0;

    private totalW = 0;
    private xFactor = 1; //x = xFactor * t;
    private yFactor = 1; //y = yFactor * t;
    
    constructor(xEdge, speed) {
        this.xEdge = xEdge;
        this.speed = speed;
        this.totalW = xEdge * 2;
    }
    setPath(startPos: cc.Vec2, endPos: cc.Vec2) {
        let subV = endPos.sub(startPos);
        let dis = subV.len();
        
        this.xFactor = subV.x / dis * this.speed;
        this.yFactor = subV.y / dis * this.speed;
    }

    getPoint(time): cc.Vec2 {
        
        let xValue = this.xFactor * time;
        let yValue = this.yFactor * time;
        
        let absX = Math.abs(xValue);
        if(absX > this.xEdge){
            absX = absX - this.xEdge;
            let timesTotalW = Math.floor(absX / this.totalW);
            xValue = absX - timesTotalW * this.totalW;
            xValue = timesTotalW % 2 == 0 ? this.xEdge - xValue : -this.xEdge + xValue;
            xValue = this.xFactor < 0 ? -xValue : xValue;
        }
        return new cc.Vec2(xValue, yValue);
    }

}