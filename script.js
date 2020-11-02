canvas = document.getElementById('layer1');
ctx = canvas.getContext('2d');

var width = canvas.width;
var height = canvas.height;

window.onmousedown = function(e){
    console.log(123)
	if(e.which == 1){
        isCursirInCircle(ball)
        isCursirInRect(ball)
		mouse.isDown = true;		
	}
}
window.onmouseup = function(e){
	if(e.which == 1){
        mouse.isDown = false;

        if(!selected_arc && selected_rect)
        {
             ball.velocity.x = (ball.position.x - mouse.x) / 10;
             ball.velocity.y = (ball.position.y - mouse.y) / 10;     
        }
            selected_arc = false;
            selected_rect = false;
	}
};
window.onmousemove = function(e){
	mouse.x = e.pageX - canvas.offsetLeft;
	mouse.y = e.pageY - canvas.offsetTop;
};

var Ball = function (x, y, radius, e, mass, colour){
	this.position = {x: x, y: y};
	this.velocity = {x: 0, y: 0}; 
	this.e = -e;
	this.mass = mass; 
	this.radius = radius;
    this.colour = colour; 
    this.ag = 9.81; //m/s^2 ускорение силы тяжести на земле = 9.81 m/s^2. 
    this.drag = 0.5; //Коэффициент трения
    this.density = 2; //Плотность
}


var selected_arc = false;
var selected_rect = false;


Ball.prototype = 
	{
        draw : function()
        {
            ctx.beginPath();
            ctx.fillStyle = ball.colour;
            ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.closePath();
        },

        move : function()
        {
            // вычисление аэродинамических сил для сопротивления
			// -0.5 * Cd * A * v^2 * rho
            var fx = -0.5 * this.drag * this.density * ball.area * ball.velocity.x * ball.velocity.x * (ball.velocity.x / Math.abs(ball.velocity.x));
			var fy = -0.5 * this.drag * this.density * ball.area * ball.velocity.y * ball.velocity.y * (ball.velocity.y / Math.abs(ball.velocity.y));

			fx = (isNaN(fx)? 0 : fx);
			fy = (isNaN(fy)? 0 : fy);
			//Ускорение мяча
			//F = ma или a = F/m
			var ax = fx / ball.mass;
			var ay = (this.ag * 1) + (fy / ball.mass);

			//Вычесление скорости мяча
			ball.velocity.x += ax * fps;
			ball.velocity.y += ay * fps;

			//Вычесление позиции мяча
			ball.position.x += ball.velocity.x * fps * 100;
			ball.position.y += ball.velocity.y * fps * 100;

        },

		grav : function()
		{
            if(this.position.x > width - this.radius){
                this.velocity.x *= this.e;
                this.position.x = width - this.radius;
            }
            if(this.position.y > height - this.radius){
                this.velocity.y *= this.e;
                this.position.y = height - this.radius;
            }
            if(this.position.x < this.radius){
                console.log(this.position.x)
                this.velocity.x *= this.e;
                this.position.x = this.radius;
            }
            if(this.position.y < this.radius){
                this.velocity.y *= this.e;
                this.position.y = this.radius;
            }
		}
	};


var fps = 1/60; 
var dt = fps * 1000; 

var mouse = {x: 0, y:0, isDown: false};


var ball = new Ball(width/2, height/2, 40, 0.7,10, 'green');

timer = setInterval(loop, dt);

document.getElementById("setradius").onclick = function()
{
    ball = null;
    ball = new Ball(width/2, height/2, parseInt(document.getElementById("radius").value,10), 0.7,10, 'green')
}


function loop(){
    
    ball.ag = parseInt(document.getElementById("ag").value,10);
    document.getElementById("_ag").value = ball.ag

    ball.density = parseInt(document.getElementById("density").value,10);
    document.getElementById("dsn").value = ball.density

    ball.drag = document.getElementById("drag").value;
    document.getElementById("_dg").value = ball.drag

	ctx.clearRect(0, 0, width, height);

		//if(!mouse.isDown){
        ball.grav()
		ball.move();
		//}
        ball.draw();

        if(!selected_arc && selected_rect)
        {
            if(mouse.isDown){
            ctx.beginPath();
            ctx.moveTo(ball.position.x, ball.position.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.closePath();
            }
        }  
	}

var isCursirInCircle = function(ball)
{
    if(Math.pow(ball.position.x-mouse.x,2) + Math.pow(ball.position.y-mouse.y,2) <= Math.pow(ball.radius,2))
        selected_arc = true;    
    else     
        selected_rect = false
    return false;
}

var isCursirInRect = function(ball)
	{
		if( (mouse.x > ball.position.x-ball.radius*2 && mouse.x < ball.position.x + ball.radius*2) && (mouse.y > ball.position.y-ball.radius*2 && mouse.y < ball.position.y + ball.radius*2))
			selected_rect = true;	
        else 
             selected_rect = false
		return false;
	}