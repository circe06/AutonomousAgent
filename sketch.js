     
const flock= [];
let f=0.0;
let space=500;//size of the environment


function setup() {

  createCanvas(600,600,WEBGL);
  smooth();

  //add the agents
  for(let i=0; i<40;i++){
    flock.push(new agent());
  }
  
}

function draw() {

  background(255);
 // perspective();
 stroke(255,0,0);
 noFill();
 rectMode(CENTER);
 rect(0,0,space,space);  

  
  for(let agent of flock){
    
    agent.flocking(flock);
    agent.update();
    agent.show();    
  }

}








// function mousePressed() {
//   background(255); // clear the screen
//   flock.length=0; // remove all particles
// }


