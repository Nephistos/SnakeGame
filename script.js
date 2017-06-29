var bichon;
var apple;
var snakegame;

window.onload = function()
{
    
    snakegame = new snakegame(900, 600, 30, 100);
    bichon = new snake([[6,4],[5,4],[4,4], [3,4],[2,4]], "right");
    apple = new Apple([10, 10]);
    
    snakegame.init(bichon, apple);

}


document.onkeydown = function handle_keydown(e)
{
        var key = e.keyCode;
        var newdir;
        switch(key)
        {
                case(37): newdir = "left"; break;
                
                case(38): newdir = "up"; break;
                
                case(39): newdir = "right"; break;
                
                case(40): newdir = "down"; break;
                
                case(32): 
                    bichon = new snake([[6,4],[5,4],[4,4], [3,4],[2,4]], "right");
                    apple = new Apple([10, 10]);
                    snakegame.init(bichon, apple); 
                    return;
                
                default: return;
                
        }
        
        snakegame.bichon.setdirection(newdir);
        
}

function snakegame(canvaswidth, canvasheight, blocksize, delay)
{
    this.canvas = document.createElement('canvas');
    this.canvas.width = canvaswidth;
    this.canvas.height = canvasheight;
    this.canvas.style.border = "30px solid gray";
    this.canvas.style.margin = "50px auto";
    this.canvas.style.display = "block";
    this.canvas.style.backgroundColor = "#ddd";
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.blocksize = blocksize;
    this.delay = delay;
    this.bichon;
    this.apple;
    
    this.widthinblock = canvaswidth / blocksize;
    this.heightinblock = canvasheight / blocksize;
    this.score = 0;
    var instance = this;
    var timeout;
    
    this.init = function(bichon, apple)
    {
    
        this.bichon = bichon;
        this.apple = apple;
        this.score = 0;
        clearTimeout(timeout);
        refresh_canvas();
        
    }
    
    var refresh_canvas = function()
    {
        instance.bichon.advance();
        if(instance.checkcollision())
            {
                instance.gameover();
            }
        else
        { 
            if(instance.bichon.iseatingapple(instance.apple))
            {
                instance.score++;
                instance.bichon.ateapple = true;
                do
                    {
                        instance.apple.setnewposition(instance.widthinblock, instance.heightinblock);
                    }
                while(instance.apple.isonsnake(instance.bichon))
                
            }
            instance.ctx.clearRect(0, 0, instance.canvas.width, instance.canvas.height);
        
            instance.drawscore();
            instance.bichon.draw(instance.ctx, instance.blocksize);
            instance.apple.draw(instance.ctx, instance.blocksize);
            
            timeout = setTimeout(refresh_canvas, delay);
        }
        

    }
        
    this.checkcollision = function()
    {
            var wall_collision = false;
            var snake_collision = false;
            var head = this.bichon.body[0];
            var rest = this.bichon.body.slice(1);
            var snakex = head[0];
            var snakey = head[1];
            var minx = 0;
            var miny = 0;
            var maxx = this.widthinblock - 1;
            var maxy = this.heightinblock - 1;
            var isnotbetweenhorizontalwalls = (snakex < minx || snakex > maxx);
            var isnotbetweenverticalwalls = (snakey < miny || snakey > maxy);
            
            if(isnotbetweenhorizontalwalls || isnotbetweenverticalwalls)
                {
                    wall_collision = true;
                }
            
            for(var i = 0; i < rest.length; i++)
                {
                    if((snakex == rest[i][0]) && (snakey == rest[i][1]))
                        {
                            snake_collision = true;
                        }
                }
            
            return wall_collision || snake_collision;
    };
        
    this.gameover = function()
    {
        
        this.ctx.save();
        this.ctx.font = "bold 70px sans-serif";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 5;
        var center_x = this.canvas.width / 2;
        var center_y = this.canvas.height / 2;
        
        this.ctx.strokeText("Game Over...", center_x, center_y - 180);
        this.ctx.fillText("Game Over...", center_x, center_y - 180);
        
        this.ctx.font = "bold 30px sans-serif";
        this.ctx.strokeText("Appuyer sur la touche espace pour rejouer", center_x, center_y - 120);
        this.ctx.fillText("Appuyer sur la touche espace pour rejouer", center_x, center_y - 120);
        this.ctx.restore();
        
    }    
    
    this.drawscore = function()
    {
        this.ctx.save();
        this.ctx.font = "bold 200px sans-serif";
        this.ctx.fillStyle = "grey";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        
        var center_x = this.canvas.width / 2;
        var center_y = this.canvas.height / 2;
        this.ctx.fillText(this.score.toString(), center_x, center_y);
        this.ctx.restore();
    }
        
}
    
function snake(body, direction)
{
        this.body = body;
        this.direction = direction;
        this.ateapple = false;
        this.draw = function(ctx, blocksize)
        {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i++)
                {
                    var x = this.body[i][0] * blocksize;
                    var y = this.body[i][1] * blocksize;
                    ctx.fillRect(x, y, blocksize, blocksize);
                }
            ctx.restore();
            
        };
        
        this.advance = function()
        {
          var nextpos = this.body[0].slice();
          switch(this.direction)
          {
              case "left":
                nextpos[0] -= 1; break;
              case "right":
                nextpos[0] += 1; break;
              case "down":
                nextpos[1] += 1; break;
              case "up":
                nextpos[1] -= 1; break;
                  
              default: throw("Invalid Direction");
          }
          this.body.unshift(nextpos);
          if(!this.ateapple)
              {
                  this.body.pop();
              }
          else this.ateapple = false;
          
            
        };
        
        
        this.setdirection = function(newdir)
        {
            var allaweddirections;
            switch(this.direction)
            {
                case("left"): 
                
                case("right"): allaweddirections = ["up", "down"]; break;
                
                case("up"): 
                
                case("down"): allaweddirections = ["left", "right"]; break;
                    
                default: throw("Invalid Direction");
                                        
            }
            if(allaweddirections.indexOf(newdir) > -1)
                {
                    this.direction = newdir;
                }
        }
        
        
        
        this.iseatingapple = function(appletoeat)
        {
            var head = this.body[0];
            if(head[0] === appletoeat.position[0] && head[1] === appletoeat.position[1])
                {
                    return true;
                }
            else return false;
        }
}
    
function Apple(position)
 {
            this.position = position;
            this.draw = function(ctx, blocksize)
            {
              ctx.save();
              ctx.fillStyle = "#33cc33";
              ctx.beginPath();
                var radius = blocksize/2;
                var x_apple = this.position[0]*blocksize + radius;
                var y_apple = this.position[1]*blocksize + radius;
                ctx.arc(x_apple,y_apple, radius, 0, Math.PI*2, true);
                ctx.fill();
              ctx.restore();
            };
        
            this.setnewposition = function(widthinblock, heightinblock)
            {
                var newx = Math.round(Math.random()*(widthinblock - 1));
                var newy = Math.round(Math.random()*(heightinblock - 1));
                this.position = [newx, newy];
            };
        
            this.isonsnake = function(snaketocheck)
            {
                var isonsnake = false;
                for(var i = 0; i < snaketocheck.body.length; i++)
                    {
                        if((this.position[0] === snaketocheck.body[i][0]) && (this.position[1] === snaketocheck.body[i][1]))
                            {
                                isonsnake = true;
                            }
                        
                    }
                return isonsnake;
            };
}     

    