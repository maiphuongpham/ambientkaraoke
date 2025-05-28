import Primitive from "./Primitive.js";
import vec2 from "../utils/Vec2.js";

class CircularParticle extends Primitive {
    //a circular distribution of particles, random size,
    //random speed, random color
    constructor(radius, deg = 360 * Math.random(), acceleration = Math.random(), trackIdx = 0, size = 5, color = [255, 255, 255]) {
        super();
        this.position = vec2.fromDegree(deg).scalar_mul(radius);
        this.velocity = new vec2(0, 0);
        this.acceleration = this.position.copy().scalar_mul(acceleration).scalar_mul(Math.random());
        this.size = size;
        this.trackIdx = trackIdx;
        this.color = color;
    }

    //override the bounary function, the actual draw position is different from the position of the particle
    checkBoundary(p5) {
        if (this.position.x < -p5.windowWidth / 2 || this.position.x > p5.windowWidth / 2 || this.position.y < -p5.windowHeight / 2 || this.position.y > p5.windowHeight / 2)
            return true;
        return false;
    }

    draw(p5) {
        super.draw(p5);
        p5.circle(this.position.x + p5.windowWidth / 2, this.position.y + p5.windowHeight / 2, this.size);
    }

}

export default CircularParticle;