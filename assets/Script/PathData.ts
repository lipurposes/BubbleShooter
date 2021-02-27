export default class PathData {
    public xEdge = 0;
    public speed = 0;

    static readonly MaxNumber = 99999999;
    private ratio = 1; //y与x的比值
    public segementTime = 1; //从左边界到右边界的一段路程用时
    private segementDis = 100; //从左边界到右边界的距离
    public segementY = 1;
    constructor(xEdge, speed) {
        this.xEdge = xEdge;
        this.speed = speed;
    }
    setPath(startPos: cc.Vec2, endPos: cc.Vec2) {
        let subV = endPos.sub(startPos);
        if (subV.x != 0) {
            this.ratio = subV.y / subV.x;
            let yDis = this.xEdge * this.ratio;
            this.segementDis = cc.Vec2.len(new cc.Vec2(this.xEdge, yDis)) * 2;
            this.segementTime = this.segementDis / this.speed;
            this.segementY = 2 * yDis;
        } else {
            this.ratio = PathData.MaxNumber;
            this.segementTime = PathData.MaxNumber;
            this.segementDis = PathData.MaxNumber;
            this.segementY = PathData.MaxNumber;
        }
    }
    getPoint(time): cc.Vec2 {
        if (time == 0) {
            return new cc.Vec2(0, 0);
        }
        if (time <= this.segementTime / 2) {
            let rat = time / (this.segementTime / 2);
            let x = rat * this.xEdge;
            let y = x * this.ratio;
            if (this.ratio < 0) {
                return new cc.Vec2(-x, -y);
            } else {
                return new cc.Vec2(x, y);
            }
        }
        let y = this.xEdge * this.ratio;
        time -= this.segementTime / 2;
        let minusTimes = Math.floor(time / this.segementTime);
        y += this.segementY * minusTimes;
        time -= minusTimes * this.segementTime;

        let rat = time / this.segementTime;
        let x = rat * (this.xEdge * 2);
        y += x * this.ratio;
        if (minusTimes % 2 == 0) {
            x = this.xEdge - x;
        } else {
            x += -this.xEdge;
        }
        if (this.ratio < 0) {
            return new cc.Vec2(-x, -y);
        } else {
            return new cc.Vec2(x, y);
        }
    }

}