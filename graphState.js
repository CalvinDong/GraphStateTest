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

/*
const node = d3.select('svg')
  .selectAll('circle')
  .data(nodes)
  .join('circle')
  .attr('r', 8)
*/

/*
const node = d3.select('svg')
  .selectAll('g')
  .data(nodes)
    .join('circle')
    .attr('r', 8)
    //.join('text')
    //.text(function(d) { return d; }
*/
const node = d3.select('svg')
  .attr("class", "nodes")
  .selectAll('g')
  .data(nodes)
    .join('g')

const circles = node.append('circle')
  .attr('r', 8)
  .call(d3.drag()
    .on("start", dragstarted)
    .on('drag', dragged)
    .on('end', dragEnded)
  );

const text = node.append('text')
  .text(d => d.text)
  .attr('x', 10)
  .attr('y', 6);

const simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-0.5))
  .force('center', d3.forceCenter(300 / 2, 300 / 2)) 
  .force('link', d3.forceLink().links(links)) // This is what creates the network
  .on('tick', ticked);

/*
const drag = d3.drag()
  .on('drag', dragged)
  .on('end', dragEnded);
node.call(drag)
*/

function dragstarted(d) {
  //if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  //d.fx = d.x;
  //d.fy = d.y;
}

function dragged(event, d){
  console.log(d)
  console.log(event)
  d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);
}

function dragEnded(){
  simulation.alpha(1).restart();
  //if (!d3.event.active) simulation.alphaTarget(0);
}

function ticked() { // Update position of nodes and links for every simulation tick
  link 
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("transform", d => `translate(${d.x}, ${d.y})`);
}

function ReadAdjMatrix(matrix){
  matrix.forEach(function(obj, index){
    nodes.push({text: index}
  )})
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