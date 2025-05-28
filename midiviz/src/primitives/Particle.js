import Primitive from "./Primitive.js";

class Particle extends Primitive {
    draw(p5) {
        p5.fill(this.color);
        p5.noStroke();
        p5.circle(this.position.x, this.position.y, this.size);
    }
};

export default Particle;