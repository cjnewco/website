import * as PIXI from 'https://cdn.skypack.dev/pixi.js';
import debounce from 'https://cdn.skypack.dev/debounce';

const app = new PIXI.Application({
    view: document.querySelector('.skybox'),
    resizeTo: window,
    transparent: true,
});

class Star{

    constructor(fill = 0xFFFFFF ){

        this.bounds = this.setBounds();
        this.x = random( this.bounds['x'].min, this.bounds['x'].max);
        this.y = random( this.bounds['y'].min, this.bounds['y'].max);

        this.scale = 1;
        this.fill = fill;
        this.direction = Math.random() * Math.PI * 2;
        this.radius = 3;
        this.inc = 0.002;
        this.out = 1; //moving forewards or backwards

        this.graphics = new PIXI.Graphics();
        this.graphics.alpha = 0.825;

        // 250ms after the last window resize event, recalculate star positions.
        window.addEventListener(
            'resize',
            debounce(() => {
                this.bounds = this.setBounds();
            }, 250)
        );
    }

    setBounds(){
        //how far from the origin each star can move
        const maxDistX = window.innerWidth / 1.75;
        const maxDistY = window.innerHeight / 1.75;

        const originX = window.innerWidth / 2;
        const originY = window.innerHeight / 2;
        
        return{
            x:{
                min: originX - maxDistX,
                max: originX + maxDistX
            },
            y:{
                min: originY - maxDistY,
                max: originY + maxDistY
            }
        };
    }

    update(){   
        if( this.x > this.bounds['x'].max || this.x < this.bounds['x'].min ){
            this.out *= -1;
        }
        if( this.y > this.bounds['y'].max || this.y < this.bounds['y'].min ){
            this.out *= -1;
        }

        this.x += Math.sin(this.direction) * this.out;
        this.y += Math.cos(this.direction) * this.out;
    }

    render(){
        this.graphics.x = this.x;
        this.graphics.y = this.y;
        this.graphics.scale.set(this.scale);

        this.graphics.clear();
        this.graphics.beginFill(this.fill);
        this.graphics.drawCircle(0,0,this.radius);
        this.graphics.endFill();
    }
}

const stars = [];

for( let i = 0; i < 30; i++ ){
    const star = new Star(0xcccccc);
    app.stage.addChild(star.graphics);

    stars.push(star);
}

if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    app.ticker.add(() => {
        // update and render each star, each frame. app.ticker attempts to run at 60fps
        stars.forEach((star) => {
            star.update();
            star.render();
        });
    });
} else {
    // perform one update and render per star, do not animate
    stars.forEach((star) => {
        star.update();
        star.render();
    });
}



function random(min, max) {
    return Math.random() * (max - min) + min;
}

function map(n, start1, end1, start2, end2) {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}