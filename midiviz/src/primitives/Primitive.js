import vec2 from "../utils/Vec2.js";

class Primitive {
    
    velocity;
    acceleration;
    position;
    size;
    color;
    trackIdx;

    /** 
     * @param {vec2} position - the position of the primitive
     * @param {vec2} velocity - the initial velocity of the primitive
     * @param {vec2} acceleration - the initial acceleration of the primitive
     * @param {int} size  - the size of the primitive
     * @param {int} trackIdx  - the track index of the primitive
     * @param {number[]} color - the color of the primitive
    */
    constructor(position, velocity, acceleration, size, trackIdx, color) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.size = size;
        this.color = color;
        this.trackIdx = trackIdx;
    }

    /**
     * @description - called every frame to update the position of the primitive
     * @params no parameters
     * @returns no return value
     */
    advance() {
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);
    }

    /**
     * @description - called every frame to check if the primitive is out of the boundary
     * @param {p5} p5 - a p5.js instance
     * @returns {boolean} - true if the primitive is out of the boundary, false otherwise
     */
    checkBoundary(p5) {
        if (this.position.x < 0 || this.position.x > p5.windowWidth || this.position.y < 0 || this.position.y > p5.windowHeight)
            return true;
        return false;
    }

    /**
     * @description - called every frame to draw the primitive
     * @param {p5} p5 - a p5.js instance
     * @returns no return value
     */
    draw(p5) {
        p5.fill(this.color);
        p5.noStroke();
    }

    /**
    * @description - set the color of the primitive
    * @param {Array<int>} color - the color of the primitive in RGB, e.g. [0,0,0] is black
    * @returns no return value
     */
    setColor(color) {
        this.color = color;
    }

    /**
     * @description - set the track index of the primitive
     * @param {int} trackIdx - the track index of the primitive
     * @returns no return value
     */
    setTrackIdx(trackIdx) {
        this.trackIdx = trackIdx;
    }

    /**
     * @description - set the acceleration of the primitive
     * @param {vec2} acceleration - the acceleration of the primitive
     * @returns no return value
     */
    setAcceleration(acceleration) {
        this.acceleration = acceleration;
    }

    /**
     * @description - set the velocity of the primitive
     * @param {vec2} velocity - the velocity of the primitive
     * @returns no return value
     */
    setVelocity(velocity) {
        this.velocity = velocity;
    }

    /**
     * @description - set the position of the primitive
     * @param {vec2} position - the position of the primitive in pixel
     * @returns no return value
     */
    setPosition(position) {
        this.position = position;
    }

    /**
     * @description - set the size of the primitive
     * @param {int} size - the size of the primitive in pixels
     * @returns no return value
    */
    setSize(size) {
        this.size = size;
    }

};

export default Primitive;