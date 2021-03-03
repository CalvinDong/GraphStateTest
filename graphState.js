let dummyData = 
[
    [0,1,0,0,0],
    [1,0,0,0,1],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,1,0,0,0]
];
let data;
data = dummyData;
console.log(data)


/*
let p = d3.select("body")
        .selectAll("p")
        .data(data)
        .text(dat => {return dat});
*/

/*
var nodes = [{}, {}, {}, {}, {}]
var links = [
  {source: 0, target: 1},
  {source: 0, target: 2},
  {source: 0, target: 3},
  {source: 1, target: 4},
  {source: 3, target: 4},
  {source: 3, target: 3},
  {source: 4, target: 0},
  {source: 4, target: 0}
]
*/

var nodes = [];
var links = [];

ReadAdjMatrix(data)
/*
var svg = d3.select("#graphState")
.append("svg")
    .attr("width", 400)
    .attr("height", 600)
    .attr("fill", "yellow")
.append("g").attr("transform", "translate(400,1000)")*/


var simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-10))
  .force('center', d3.forceCenter(300 / 2, 300 / 2)) 
  .force('link', d3.forceLink().links(links)) // This is what creates the network
  .on('tick', ticked);

var drag = d3.drag()
  .on('drag', dragged);

d3.selectAll('circle').call(drag)

function dragged(){
  let current = d3.select(this);
  current
  .attr('cx', d3.event.x)
  .attr('cy', d3.event.y)
  .attr('r', 5);
}

function updateNodes(){ // Create nodes
  var u = d3.select('svg')
      .selectAll('circle')
      .data(nodes) // bind node data to circle objects in DOM
  
    u.enter() // Adding the nodes that haven't been added yet
      .append('circle')
      .attr('r', 8)
      .merge(u)
      .attr('cx', function(d) {
        //console.log(d.x)
        return d.x
      })
      .attr('cy', function(d) {
        return d.y
      })
  
    u.exit().remove()
}

function updateLinks() { // Create links
  var u = d3.select('svg')
    .selectAll('line')
    .data(links) // bind links data to line objects in DOM

    u.enter() // Adding the lines that haven't been added yet
      .append('line') 
      .merge(u)
      .attr('stroke', "black")
      .attr('x1', function(d) {
        return d.source.x
      })
      .attr('y1', function(d) {
        return d.source.y
      })
      .attr('x2', function(d) {
        return d.target.x
      })
      .attr('y2', function(d) {
        return d.target.y
      })

  u.exit().remove()
}

function ticked() {
  updateLinks()
  updateNodes()
}

function ReadAdjMatrix(matrix){
  matrix.forEach(throwAway => {nodes.push({})})
  matrix.forEach(function(row, i){
    row.forEach(function(target, j){
      if (target == 1){
        links.push({source: i, target: j})
        matrix[j][i] = 0;
      }
    })
  })
  console.log(nodes)
  console.log(links)
}