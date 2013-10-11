

function Particle(name)
{

	this.name=name;
	this.x=Math.random()*961;
	this.y=Math.random()*600;
	this.vector_y;
	this.vector_x;
	this.range_y =function(number)
	{
		// if ((number>600)||(number<1))
		if (number>600)
			this.vector_y=this.vector_y*-1;
		if (number<1)
			this.vector_y=this.vector_y*-1;
		return number;
	}	
	this.range_x =function(number)
	{
		if (number>1050)
			this.vector_x=this.vector_x*-1;
		if (number<1)
			this.vector_x=this.vector_x*-1;
		return number;
	}
	this.draw=function(selector)
	{
		var target=document.getElementById(selector);
		target.innerHTML=target.innerHTML +"<div id='circle_"+this.name+"' style= 'position:absolute; top:"+this.y+"px; left:"+this.x+"px; background-color: black; border-radius:10px; width:10px; height:10px;'></div>";

		return this;
	}

	this.redraw = function()
	{
		var target = document.getElementById('circle_'+this.name);
		target.style.left=this.x+"px";
		target.style.top=this.y+"px";
		// target.innerHTML="<div style= 'position:absolute; top:"+this.y+"px; left:"+this.x+"px; border: 1px solid black; border-radius:10px; width:10px; height:10px;'></div>";
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

	this.move=function(delta_x, delta_y)
	{
		// this.particles[i].nextMove(this.particles[i].vector_x, this.particles[i].vector_y);
		// if this
		this.x=this.range_x(this.x + delta_x);
		this.y=this.range_y(this.y + delta_y);
		return this;
	}
	this.nextMove=function(delta_x, delta_y)
	{
		this.xx=this.x + delta_x;
		this.yy=this.y + delta_y;
		return this;
	}
}

function Field(total_particles)
{
	this.total_particles=total_particles;
	this.particles=new Array();

	for (var i = 0; i <total_particles; i++) 
	{
		this.particles[i]=new Particle(i);
	}
	this.draw_particles=function(selector, number)
	{
		for (var i = 0; i < this.particles.length; i++) 
		{
			this.particles[i].draw(selector).temperature(number);
			// for (var j = 0; j < i; j++) 
			// {
			// 	this.dx=this.particles[i].xx - this.particles[j].xx;
			// 				this.dy=this.particles[i].yy - this.particles[j].yy;
			// 				this.distance=(this.dx*this.dx+this.dy*this.dy);
			// }
		}
		return this;
	}
	// this.drawCollision=function()
	// {

	// }
	this.collision=function()
	{	

		for (var i = 0; i < total_particles; i++) 
		{	
			this.particles[i].nextMove(this.particles[i].vector_x, this.particles[i].vector_y);
			if (!((this.particles[i].xx>1040)||(this.particles[i].xx<10)||(this.particles[i].yy>590)||(this.particles[i].yy<10)))
			{
				for (var j = 0; j < total_particles; j++) 
				{
					this.particles[j].nextMove(this.particles[j].vector_x, this.particles[j].vector_y);
					if(i!=j)
					{
						if (!((this.particles[j].xx>1040)||(this.particles[j].xx<10)||(this.particles[j].yy>590)||(this.particles[j].yy<10)))	
						{
							this.dx=this.particles[i].xx - this.particles[j].xx;
							this.dy=this.particles[i].yy - this.particles[j].yy;
							this.distance=(this.dx*this.dx+this.dy*this.dy);
							// if (((this.particles[i].x > this.particles[j].x-10) && (this.particles[i].x < this.particles[j].x+10)) && ((this.particles[i].y > this.particles[j].y-10) && (this.particles[i].y < this.particles[j].y+10)))
							if(this.distance<=(100))
							{
								this.collisionAngle=Math.atan2(this.dx, this.dy);
								this.speedi=Math.sqrt(this.particles[i].vector_x*this.particles[i].vector_x+this.particles[i].vector_y*this.particles[i].vector_y);
								this.speedj=Math.sqrt(this.particles[j].vector_x*this.particles[j].vector_x+this.particles[j].vector_y*this.particles[j].vector_y);
								this.directioni = Math.atan2(this.particles[i].vector_y, this.particles[i].vector_x);
								this.directionj = Math.atan2(this.particles[j].vector_y, this.particles[j].vector_x);
								this.rotatedVelocityXi = this.speedi * Math.cos(this.directioni - this.collisionAngle);
						        this.rotatedVelocityYi = this.speedi * Math.sin(this.directioni - this.collisionAngle);
					  	        this.rotatedVelocityXj = this.speedj * Math.cos(this.directionj - this.collisionAngle);
						        this.rotatedVelocityYj = this.speedj * Math.sin(this.directionj - this.collisionAngle);
						        this.mass=1;
		           				this.finalVelocityXi = ((this.mass - this.mass) * this.rotatedVelocityXi + (this.mass + this.mass) * this.rotatedVelocityXj) / (this.mass + this.mass);
		      					this.finalVelocityXj = ((this.mass + this.mass) * this.rotatedVelocityXi + (this.mass - this.mass) * this.rotatedVelocityXj) / (this.mass + this.mass);
		      					this.finalVelocityYi = this.rotatedVelocityYi;
		    					this.finalVelocityYj = this.rotatedVelocityYj;
		    					this.i_delta_x = Math.cos(this.collisionAngle) * this.finalVelocityXi + Math.cos(this.collisionAngle + Math.PI/2) * this.finalVelocityYi;
							    this.i_delta_y = Math.sin(this.collisionAngle) * this.finalVelocityXi + Math.sin(this.collisionAngle + Math.PI/2) * this.finalVelocityYi;
							    this.j_delta_x= Math.cos(this.collisionAngle) * this.finalVelocityXj + Math.cos(this.collisionAngle + Math.PI/2) * this.finalVelocityYj;
							    this.j_delta_y = Math.sin(this.collisionAngle) * this.finalVelocityXj + Math.sin(this.collisionAngle + Math.PI/2) * this.finalVelocityYj;
								// this.dist=Math.sqrt(this.dx*this.dx+this.dy*this.dy);
								// this.displace=(this.dist - 10)/2
								// this.i_delta_x=this.particles[i].vector_x+Math.cos(this.collisionAngle)*this.displace;
								// this.i_delta_y=this.particles[i].vector_y+Math.sin(this.collisionAngle)*this.displace;
								// this.j_delta_x=this.particles[j].vector_x-Math.cos(this.collisionAngle)*this.displace;
								// this.j_delta_y=this.particles[j].vector_x-Math.sin(this.collisionAngle)*this.displace;
								this.particles[i].move(this.i_delta_x, this.i_delta_y).redraw();
								this.particles[j].move(this.j_delta_x, this.j_delta_y).redraw();
								// console.log("Particle ", this.particles[i].y, " hit particle ", this.particles[j].y);
							}
						}	
					}
				}	
			}
		}
		return this;
	}
	this.render=function()
	{	
		this.collision();
		for (var i = 0; i < this.particles.length; i++) 
		{	
			this.particles[i].move(this.particles[i].vector_x, this.particles[i].vector_y).redraw();
		}	
		return this;
	}
}
//when a particle collides with another have a random 
