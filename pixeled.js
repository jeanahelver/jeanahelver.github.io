//  PIXELED.GRAPHICS library  //
//PIX()

(function(window){
    //initilize
        const canvas = document.createElement("canvas");
        canvas.style.imageRendering = "-moz-crisp-edges";
        canvas.style.imageRendering = "-webkit-crisp-edges";
        canvas.style.imageRendering = "pixelated";
        canvas.style.imageRendering = "crisp-edges";
        const ctx = canvas.getContext("2d");
        document.body.appendChild(canvas);
    
   const spritesheet = new Image();
   const font = new Image();
    function PIX(){
        const _pix = {};
        let loadcount = 0;
        
        
        
        let minWidth = minHeight = 128;
        let updateSize = () =>{
            if (window.innerWidth*minWidth > window.innerHeight*minHeight) {
                canvas.height = minWidth;
                canvas.style.height = "100vh";
                canvas.width = Math.floor(window.innerWidth/window.innerHeight*canvas.height)+1;
                canvas.style.width = canvas.width/(canvas.height/100)+"vh"; 

                _pix.width = canvas.width-2;
                _pix.height = canvas.height-2;
            }else{
                canvas.width = minHeight;
                canvas.style.width = "100vw";
                canvas.height = Math.floor(window.innerHeight/window.innerWidth*canvas.width)+1;
                canvas.style.height = canvas.height/(canvas.width/100)+"vw";

                _pix.width = canvas.width-2;
                _pix.height = canvas.height-2;
            }
        }
        updateSize();
        window.addEventListener('resize', updateSize);
        _pix.setSize = (mw,mh)=>{ minWidth=mw; minHeight=mh; updateSize();}

        let imgData;
        let buffer;
        const color ={red:255, green:255, blue:255, alpha:1}
        _pix.setColor =(r,g,b,a)=>{
            if(typeof(r) == "number") setColorNumber(r,g,b,a);
            else setColorObject(r);
        }
        let setColorNumber =(r =color.red,g = color.green,b=color.blue,a=color.alpha)=>{
            color.red = r;
            color.green = g;
            color.blue = b;
            ctx.fillStyle = 'rgb('+r+','+g+','+b+')';
            ctx.globalAlpha = a/255
        }
        let setColorObject =(c)=>{
            color.red = c.red === undefined? color.red : c.red;
            color.green = c.green === undefined? color.green : c.green;
            color.blue = c.blue === undefined? color.blue : c.blue;
            ctx.fillStyle = 'rgb('+color.red+','+color.green+','+color.blue+')';
            ctx.globalAlpha = c.alpha === undefined? ctx.globalAlpha : c.alpha/255
        }
        let lasttime = 0;
        let dt;
        _pix.refresh = (time)=>{
            dt = time - lasttime;
            lasttime = time;
            window.requestAnimationFrame(_pix.refresh);
            

            if(typeof(draw) != 'undefined') draw(dt);

        }
        
        _pix.sprite = (x,y,offsetX,offsetY,w,h)=>{
            if(offsetX == undefined) ctx.drawImage(spritesheet, Math.floor(x), Math.floor(y));
            else ctx.drawImage(spritesheet, Math.floor(offsetX), Math.floor(offsetY), Math.floor(w) ,Math.floor(h) ,Math.floor(x), Math.floor(y),Math.floor(w) ,Math.floor(h));
        }
        _pix.fillRect = (x,y,w,h)=>{
            ctx.fillRect(Math.floor(x),Math.floor(y),Math.floor(w),Math.floor(h));
        }
        
        _pix.pixel = (x, y)=>{
            ctx.fillRect(x,y,1,1);
        }
        
        _pix.line = (x0, y0, x1, y1)=>{
             
            let dx = Math.abs(x1 - x0),
                sx = x0 < x1 ? 1 : -1;
            let dy = Math.abs(y1 - y0),
                sy = y0 < y1 ? 1 : -1;
            let err = (dx > dy ? dx : -dy) / 2;
            while (true) {
                _pix.pixel(x0, y0);
                if (x0 === x1 && y0 === y1) break;
                let e2 = err;
                if (e2 > -dx) {
                    err -= dy;
                    x0 += sx;
                }
                if (e2 < dy) {
                    err += dx;
                    y0 += sy;
                }
            }
            
        }
        _pix.rect = (x,y,w,h)=>{

            for (let i = 0; i < w; i++) {
                _pix.pixel(x+i,y);
                _pix.pixel(x+i,y+h-1);
            }
            for (let i = 1; i < h-1; i++) {
                _pix.pixel(x,y+i);
                _pix.pixel(x+w-1,y+i);
            }
        }
        _pix.circle =(centerx, centery, radius)=>{
            let cp = (cx,cy, x,y)=>{
            if(x === 0){
                _pix.pixel(cx,cy+y);
                _pix.pixel(cx, cy-y);
                _pix.pixel(cx+y,cy);
                _pix.pixel(cx-y,cy);
            }else if(x === y){
                _pix.pixel(cx + x, cy + y);
                _pix.pixel(cx - x, cy + y);
                _pix.pixel(cx + x, cy - y);
                _pix.pixel(cx - x, cy - y);
            }else if(x<y){
                _pix.pixel(cx + x, cy + y);
                _pix.pixel(cx - x, cy + y);
                _pix.pixel(cx + x, cy - y);
                _pix.pixel(cx - x, cy - y);
        
                _pix.pixel(cx + y, cy + x);
                _pix.pixel(cx - y, cy + x);
                _pix.pixel(cx + y, cy - x);
                _pix.pixel(cx - y, cy - x);
            }
            };
        
            let x = 0;
            let y = radius;
            let p = (5-radius*4)/4;
            cp(centerx,centery,x,y);
            while (x < y) {
                x++;
                if (p < 0) {
                    p+=2*x+1;
                }else{
                    y--;
                    p +=2*(x-y)+1;
                }
                cp(centerx,centery,x,y);
            }
        }

        _pix.print =(x,y,text)=>{
            for (let i = 0; i < text.length; i++) {
               let t = text.charCodeAt(i)
               ctx.drawImage(font, (t%16)*8, Math.floor(t/16)*8, 8,8 ,Math.floor(x)+i*8, Math.floor(y),8,8);
            }
        }
        
        function loader(){
            loadcount ++
            if(loadcount == 2) window.requestAnimationFrame(_pix.refresh);
        }
        spritesheet.addEventListener("load", loader, {once:true});
        spritesheet.src = "spritesheet.png";
        font.addEventListener("load", loader, {once:true});
        font.src = "font.png";
        
        return _pix;
    }
    if(typeof(window.PIX) === 'undefined'){
        window.PIX = PIX();
        
    }
    
}(window));
