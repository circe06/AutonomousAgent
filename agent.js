class agent{

  constructor(){
    this.pos = createVector(random(-space/2,space/2),random(-space/2,space/2));
    
    this.velo = p5.Vector.random2D();
    this.velo.setMag(random(1.5,0.15));
    
    //this.acc = createVector(); 
    this.acc = createVector(); 
    
    this.maxForce=.8;
    this.maxSpeed=.6;      
  }  



//check for boundary 
boundaries() {

    let steering = createVector();
    

    if(this.pos.x<-space/2)
      {
          steering.set(this.maxSpeed,this.velo.y);
      } 
    else if(this.pos.x>space/2)
      {
        steering.set(-this.maxSpeed,this.velo.y);
      }

    if(this.pos.y<-space/2)
      {
        steering.set(this.velo.x,this.maxSpeed);
      } 
    else if(this.pos.y>space/2) 
      {
       steering.set(this.velo.x,-this.maxSpeed);
      }


   if (steering.mag() != 0) {
      steering.normalize();
      steering.mult(this.maxSpeed);
      steering.sub(this.velo);
      steering.limit(this.maxForce);
    }

    return steering;
  }

  
//Align function
 align(otheragents){

  let steering=createVector();
  let perceptionradius=40;
  let perceptionangle=PI/4;
  let total=0;

  for(let one of otheragents){
    let d=dist(one.pos.x,one.pos.y,this.pos.x,this.pos.y);
    let angle_between=this.pos.angleBetween(one.pos);
    if (one != this && (d<perceptionradius && angle_between<perceptionangle))
     { steering.add(one.velo);
      total++;
    }
  }

  if(total>0){
    steering.div(total);
    steering.normalize();
    steering.limit(this.maxSpeed);
    steering.sub(this.velo);  //renolds rule 
    steering.limit(this.maxForce);
  } 

  
  return steering;

}


//cohesion
cohesion(otheragents){
  let steering=createVector();

  let perceptionradius=50;
  let total=0;

  for(let one of otheragents){
    let d=dist(one.pos.x,one.pos.y,this.pos.x,this.pos.y);
   
    if (d!=0 && d>perceptionradius)
     { 
      let diff=createVector();
      diff.set(this.pos);
      diff.sub(one.pos);
      diff.normalize();
      diff.mult(-1);
      diff.div(d);
      steering.add(diff);
      total++;
    }
  }

  if(total>0){
    steering.div(total);
    steering.normalize();
    steering.mult(this.maxSpeed);
    steering.sub(this.velo);
    steering.limit(this.maxForce);
  }

  
  return steering;

}



//separation
separation(otheragents){

  let steering=createVector();

  let perceptionradius=10;
  let total=0;

  for(let one of otheragents){
    let d=dist(one.pos.x,one.pos.y,this.pos.x,this.pos.y);
   
    if (d>0 && d<perceptionradius)
     { 
      let diff=createVector();
      diff.set(this.pos);
      diff.sub(one.pos);
      diff.normalize();
      diff.div(d);
      steering.add(diff);
      total++;
    }
  }

  if(total>0){
    steering.div(total);
    steering.normalize();
    steering.mult(this.maxSpeed);
    steering.sub(this.velo);
    steering.limit(this.maxForce);
  }

  
  return steering;

}


//update acc
flocking(agents){
 
  this.acc.mult(0);

  //getting the values for each action forces
   let bound= this.boundaries();
   let alignment= this.align(agents);
   let cohesion=this.cohesion(agents);
   let separation=this.separation(agents);

  //add weightage to each of these forces
  cohesion.mult(.1);
  separation.mult(2);

  //add the various forces a= F/m amd considering mass=1: a=F
   this.acc.add(bound);
   this.acc.add(alignment);
   this.acc.add(cohesion);
   this.acc.add(separation);

}


//updating all velo, pos
update(){
  
  //print(this.velo);
  this.velo.add(this.acc);
  this.velo.limit(this.maxSpeed);
  this.pos.add(this.velo);
 

}
    

show() {
  stroke(0);
  let len=10; // length of the agent
 // line(this.velo.x,this.velo.y,this.velo.x+(len*cos(this.velo.heading())),this.velo.y+(len*sin(this.velo.heading())));
  ellipse(this.pos.x+(len*cos(this.pos.heading())),this.pos.y+(len*sin(this.pos.heading())),2)

  //ellipse(this.pos.x,this.pos.y,3,3);
  }


}
