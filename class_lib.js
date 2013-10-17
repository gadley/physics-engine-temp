

function Particle(name)
{
	this.theCanvas = document.getElementById('environment');
  	this.context = this.theCanvas.getContext("2d");
	this.name=name;
	this.radius=5;
	this.x=Math.floor(Math.random()*this.theCanvas.width);
	this.y=Math.floor(Math.random()*this.theCanvas.height);
	this.vector_y;
	this.vector_x;
	this.speed;

	this.testWalls =function()
	{
		if (this.next_x>this.theCanvas.width)
		{
			this.vector_x=this.vector_x*-1;
			this.next_x=this.theCanvas.width-this.radius;
		}	
		else if (this.next_x<1)
		{
			this.vector_x=this.vector_x*-1;
			this.next_x=this.radius;
		}	
		else if (this.next_y>this.theCanvas.height)
		{
			this.vector_y=this.vector_y*-1;
			this.next_y=this.theCanvas.height-this.radius;
		}	
		else if (this.next_y<1)
		{
			this.vector_y=this.vector_y*-1;
			this.next_y=this.radius;
		}	
		return this;
	}
	this.draw=function()
	{
		var color =Math.floor(this.speed*31);
		this.context.fillStyle = "rgb("+color+",0,"+color+")";
      	this.context.beginPath();
      	this.context.arc(this.x, this.y, this.radius, 0, Math.PI *2);
      	this.context.closePath();
      	this.context.fill();
		return this;
	}
	this.temperature=function(number)
	{
		var change_x=(Math.random()-.5)*number;
		var change_y=(Math.random()-.5)*number;
		this.vector_x=change_x;
		this.vector_y=change_y;
		return this;
	}

	this.move=function()
	{
		this.next_x=(this.x+this.vector_x);
		this.next_y=(this.y+this.vector_y)
		return this;
	}
	this.update=function()
	{
		this.x=this.next_x;
		this.y=this.next_y;
		return this;
	}
	this.collisionMove=function(vector_x, vector_y)
	{
		this.next_x+=vector_x;
		this.next_y+=vector_y;
		this.vector_x=vector_x;
		this.vector_y=vector_y;
		return this;
	}
}

function Field(total_particles)
{
	this.total_particles=total_particles;
	
	this.particles=new Array();
	var y = new Particle(0);
	this.particles.push(y);
	var index=1;
	while(this.particles.length < this.total_particles) //this will make 100 things that satisfy our needs
	{
		
		var x = new Particle(index);  //make a new random particle

		var count = this.particles.length; //this is how we iterate through this.particles
		var buffer = 0;  //required distance gap
		for( var i = 0; i < count; i ++)  //homemade in_array function 
		{
			var dx=this.particles[i].x - x.x;
			var dy=this.particles[i].y - x.y;
			var distance=(dx*dx+dy*dy);
			// console.log(distance);
			if(distance < (100 +100)) //this will be the check
			{
				buffer ++;
			}
		}
		if(buffer < 1) //meaning the conditions have been satisfied, no overlap
			{	
				index++;
				this.particles.push(x);
			}
	}
	this.draw_particles=function(number)
	{	
		for (var i = 0; i < this.particles.length; i++) 
		{
			this.particles[i].draw().temperature(number)
		}	
		return this;
	}
	this.resetField=function()
	{
		this.colliding_particles=new Array();
		this.theCanvas = document.getElementById('environment');
  		this.context = this.theCanvas.getContext("2d");
		this.context.fillStyle = "#E0E0E0";
    	this.context.fillRect(0, 0, this.theCanvas.width, this.theCanvas.height);
	}

	this.collision=function()
	{	
		for (var j = 0; j < this.particles.length; j++) 
		{	
			for (var i = 0; i < total_particles; i++) 
			{	
				this.particles[i].collide=false;
				if(i!=j)
				{
					var dx=this.particles[j].next_x - this.particles[i].next_x;
					var dy=this.particles[j].next_y - this.particles[i].next_y;
					var distance=(dx*dx+dy*dy);
					if(distance<=100)
					{
						var xVelocity= this.particles[i].vector_x -this.particles[j].vector_x;
						var yVelocity= this.particles[i].vector_y -this.particles[j].vector_y;
						var dotProduct = dx*xVelocity +dy*yVelocity;
						if (dotProduct>0)
						{	
							var collisionAngle=Math.atan2(dy, dx);
							var speedi=Math.sqrt(this.particles[i].vector_x*this.particles[i].vector_x+this.particles[i].vector_y*this.particles[i].vector_y);
							var speedj=Math.sqrt(this.particles[j].vector_x*this.particles[j].vector_x+this.particles[j].vector_y*this.particles[j].vector_y);
							var directioni = Math.atan2(this.particles[i].vector_y, this.particles[i].vector_x);
							var directionj = Math.atan2(this.particles[j].vector_y, this.particles[j].vector_x);
							var rotatedVelocityXi = speedi * Math.cos(directioni - collisionAngle);
					        var rotatedVelocityYi = speedi * Math.sin(directioni - collisionAngle);
						    var rotatedVelocityXj = speedj * Math.cos(directionj - collisionAngle);
					        var rotatedVelocityYj = speedj * Math.sin(directionj - collisionAngle);
					        var mass=5;
							var finalVelocityXi = ((mass - mass) * rotatedVelocityXi + (mass + mass) * rotatedVelocityXj) / (mass + mass);
							var finalVelocityXj = ((mass + mass) * rotatedVelocityXi + (mass - mass) * rotatedVelocityXj) / (mass + mass);
							var finalVelocityYi = rotatedVelocityYi;
							var finalVelocityYj = rotatedVelocityYj;
							var i_delta_x = Math.cos(collisionAngle) * finalVelocityXi + Math.cos(collisionAngle + Math.PI/2) * finalVelocityYi;
						    var i_delta_y = Math.sin(collisionAngle) * finalVelocityXi + Math.sin(collisionAngle + Math.PI/2) * finalVelocityYi;
						    var j_delta_x= Math.cos(collisionAngle) * finalVelocityXj + Math.cos(collisionAngle + Math.PI/2) * finalVelocityYj;
						    var j_delta_y = Math.sin(collisionAngle) * finalVelocityXj + Math.sin(collisionAngle + Math.PI/2) * finalVelocityYj;
						    this.particles[i].speed=this.particles[i].vector_y*this.particles[i].vector_y+this.particles[i].vector_x*this.particles[i].vector_x;
						    this.particles[i].collide=true;
							this.colliding_particles.push({id:i, collide_vector_x:i_delta_x, collide_vector_y:i_delta_y });
						}
					}
				}
			}	
		}
	}
	this.render=function()
	{	
		this.resetField();
		var averageSpeed=0;
		for (var i = 0; i < total_particles; i++) 
		{
			this.particles[i].move();
			averageSpeed +=this.particles[i].vector_y*this.particles[i].vector_y+this.particles[i].vector_x*this.particles[i].vector_x;
			this.particles[i].testWalls();
		}
		averageSpeed=averageSpeed/total_particles;
		// console.log(averageSpeed);
		this.collision();
		for (var p = 0; p < total_particles; p++) 
		{	
			if(this.particles[p].collide==false)
			{
				this.particles[p].speed=this.particles[p].vector_y*this.particles[p].vector_y+this.particles[p].vector_x*this.particles[p].vector_x;
				this.particles[p].update().draw();
			}	

		}	
		for (var k = 0; k < this.colliding_particles.length; k++) 
		{
			this.particles[this.colliding_particles[k].id].collisionMove(this.colliding_particles[k].collide_vector_x, this.colliding_particles[k].collide_vector_y).update().draw();
		}

	}
}

//add a collision variable for each particle. if true then run collision stuff. If false then just go to draw
