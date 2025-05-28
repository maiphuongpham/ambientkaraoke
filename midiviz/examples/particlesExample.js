import CircularParticle from "../src/primitives/CircularParticle.js";

new p5(function(p5){
    let particles = [];

    p5.setup = async function() {
        p5.createCanvas(p5.windowWidth,p5.windowHeight);
        
    }

    //called on each frame
    p5.draw = function() {
        p5.background(0);
        p5.stroke(255);
        p5.noFill();

        particles.push(new CircularParticle(100, Math.random()*360, Math.random()*1e-2));
        particles.forEach(p=>{
            if(p.checkBoundary(p5)){
                particles.splice(particles.indexOf(p),1);
                return;
            }

            p.advance();
            p.draw(p5);
        })
        

    }

});