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

var nodes = [];
var links = [];

ReadAdjMatrix(data)

const link = d3.select('svg')
  .selectAll('line')
  .data(links) // bind links data to line objects in DOM
  .join('line') // join adds a line for each edge in links (also lets you specify entry, exit update behaviour)
  .attr('stroke', "black")

const node = d3.select('svg')
  .selectAll('cirlce')
  .data(nodes)
  .join('circle')
  .attr('r', 8)

const simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-10))
  .force('center', d3.forceCenter(300 / 2, 300 / 2)) 
  .force('link', d3.forceLink().links(links)) // This is what creates the network
  .on('tick', ticked);

const drag = d3.drag()
  .on('drag', dragged);


node.call(drag)

function dragged(event, d){
  d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);
}

function ticked() { // Update position of nodes and links for every simulation tick
  link 
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

  node
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
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