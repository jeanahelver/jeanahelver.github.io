let timer =0;
function draw(dt){
    timer += dt*0.001;

    // setting the background black
    PIX.setColor(0,0,0,255);
    PIX.fillRect(0,0,PIX.width+1,PIX.height+1);
    
    PIX.sprite(PIX.width/2,20);
    PIX.print(10,PIX.height/2,"GRAPHICS sample");

    PIX.setColor({red:255});
    PIX.line(0,PIX.height/2,PIX.width,Math.floor(PIX.height/2 +Math.cos(timer)*PIX.height/2));

    PIX.setColor({blue:255});
    PIX.circle(PIX.width-20,PIX.height-20,20);

    PIX.setColor({alpha:150});
    PIX.fillRect(10,20, 100, 20);
    PIX.rect(50,30, 100, 20);

    PIX.setColor(0,255,0,255);
    for (let i = 0; i < 10; i++) {
        PIX.pixel(Math.random()*20, Math.random()*20);    
    }
}
