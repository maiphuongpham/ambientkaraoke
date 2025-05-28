class vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    };

    x = 0;
    y = 0;

    set(x, y) {
        this.x = x;
        this.y = y;
    };

    normalize() {
        let length = Math.sqrt(this.x * this.x + this.y * this.y);
        return new vec2(this.x / length, this.y / length);
    };

    normalized() {
        let length = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x /= length;
        this.y /= length;
    };

    copy() {
        return new vec2(this.x, this.y);
    };

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    add(v) {
        return new vec2(this.x + v.x, this.y + v.y);
    }

    sub(v) {
        return new vec2(this.x - v.x, this.y - v.y);
    }

    elem_mul(v) {
        return new vec2(this.x * v.x, this.y * v.x);
    }

    elem_div(v) {
        return new vec2(this.x / v.x, this.y / v.x);
    }

    scalar_mul(v) {
        return new vec2(this.x * v, this.y * v);
    }

    scalar_div(v) {
        return new vec2(this.x / v, this.y / v);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    //random sample a 2D vector with length 1
    //non-uniform sampling (on degree) of a unit circle, it's uniform on area of rectangle
    //it has a bias towards larger area
    static random2DNormalized() {
        return new vec2(Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
    }

    //random 2D vector random length
    static random2D() {
        return new vec2(Math.random() * 2 - 1, Math.random() * 2 - 1);
    }

    //given degree, return a vector with that degree
    static fromDegree(degree) {
        let rad = degree * Math.PI / 180;
        return new vec2(Math.cos(rad), Math.sin(rad)).normalize();
    }

    static zeros() {
        return new vec2(0, 0);
    }

};

export default vec2;