import Particles from "../src/collections/Particles.js";
import vec2 from "../src/utils/Vec2.js";

new p5(function (p5) {
    let particles = new Particles();

    p5.setup = async function () {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);

    }

    //called on each frame
    p5.draw = function () {
        for (let i = 0; i < 10; i++)
            particles.add(new vec2(p5.mouseX, p5.mouseY), vec2.random2DNormalized(), 10, [Math.random() * 50 + 200, Math.random() * 50 + 200, Math.random() * 50 + 200]);

        p5.background(0);
        particles.step(p5);
    }

});