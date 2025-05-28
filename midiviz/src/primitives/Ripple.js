import Primitive from "./Primitive.js";

class Ripple extends Primitive {

    currSize = 0;
    sizeAccel = 0.1;

    setSizeAccel(sizeAccel) {
        this.sizeAccel = sizeAccel;
    };

    advance() {
        this.currSize += this.sizeAccel;
        super.advance();
    }

    constructor(position, velocity, acceleration, sizeAccel, maxSize, trackIdx, color) {
        super(position, velocity, acceleration, maxSize, trackIdx, color);
        this.sizeAccel = sizeAccel;
        this.currSize = 0;
    }

    checkBoundary(p5) {
        if (this.currSize > this.size)
            return true;
        return false;
    };

    draw(p5) {
        p5.noFill();
        p5.stroke(this.color);
        p5.circle(this.position.x, this.position.y, this.currSize);
    }
};

export default Ripple;