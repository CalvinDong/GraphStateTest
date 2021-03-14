let dummyData = 
[
    [0,1,1,0,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [0,0,0,0,0],
    [0,1,0,0,0]
];
let data;
data = dummyData;
console.log(data)

let nodes = [];
let links = [];
let circles;
let text;
let nodeAdd = false;
let nodeRemove = false;
let edgeAdd = false;
let edgeRemove = false;
let drag = true;
let clickCount = 0;

ReadAdjMatrix(data)

let simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-100))
  .force('center', d3.forceCenter(300 / 2, 300 / 2)) 
  .force('link', d3.forceLink().links(links)) // This is what creates the network
  .force("x", d3.forceX())
  .force("y", d3.forceY())
  .on('tick', ticked);

let svg = d3.select('svg')
  .on("click", clickedSVG);

let node = svg.selectAll('.node')
  .data(nodes) 

let node_enter = node.join('g')
  .attr('class', 'node')
  .call(d3.drag()
      .on("start", dragstarted)
      .on('drag', dragged)
      .on('end', dragEnded)
    )
  .on("click", clickedNode);

node_enter.append('circle')
  .attr('r', 8)

node_enter.append('text')
  .text(d => d.id)
  .attr('x', 10)
  .attr('y', 6);

link = svg.selectAll('line')
  .data(links) // bind links data to line objects in DOM
  .join('line') // join adds a line for each edge in links (also lets you specify entry, exit update behaviour)
  .attr('stroke', "black")

function clickedSVG(event, d){
  if (nodeAdd && event.srcElement === svg._groups[0][0]){ // svg groups to prevent spawning on nodes
    AddNode(event)
  }
}

function clickedNode(event, d){
  console.log(event)
  console.log(d)
  if (nodeRemove){
    RemoveNode(d)
  }

}

function dragstarted(d) {

}

function dragged(event, d){
  d3.select(this)
    .attr("transform", d => `translate(${d.x = event.x}, ${d.y = event.y})`); //For moving g elements
  
  //d3.select(this)
  //  .attr("cx", d.x = event.x).attr("cy", d.y = event.y);
}

function dragEnded(){
  simulation.alpha(1).restart();
}

function ticked() { // Update position of nodes and links for every simulation tick
  link 
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  svg.selectAll('.node')
    .attr("transform", d => `translate(${d.x}, ${d.y})`); 
}

function ReadAdjMatrix(matrix){
  matrix.forEach(function(obj, index){
    nodes.push({id: index}
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

function DrawNodes(){
  simulation.nodes(nodes)
  simulation.force("link").links(links);
  
  node = svg.selectAll('.node').remove()

  node = svg.selectAll('.node')
  .data(nodes) 

  console.log(nodes)

  node_enter = node.enter().append('g') // enter().append() pattern to draw one at a time, .join() for all data in array
    .attr('class', 'node')
    .call(d3.drag()
      .on("start", dragstarted)
      .on('drag', dragged)
      .on('end', dragEnded)
    )
  .on("click", clickedNode);

  node_enter.append('circle')
    .attr('r', 8)

  node_enter.append('text')
    .text(d => d.id)
    .attr('x', 10)
    .attr('y', 6);

  node.exit().remove()  // Remove any extra groups
                        // BUG: It doesn't remove the actual node you click on, just the last one in the body
 
  link = svg.selectAll('line')
    .data(links) // bind links data to line objects in DOM
    .join('line') // join adds a line for each edge in links (also lets you specify entry, exit update behaviour)
    .attr('stroke', "black")

  //simulation.nodes(nodes)
  //simulation.force("link").links(links);
  simulation.alpha(1).restart();
}

function AddNode(event){
  console.log("adding")
  let tempNodes = [...nodes];
  tempNodes.push({id: nodes.length, x: event.x, y: event.y})
  nodes = tempNodes 
  DrawNodes()
}

function RemoveNode(d){
  console.log("removing")
  nodes.splice(d.index, 1);
  links = links.filter(function(n){
    return (n.source != d && n.target != d)
  });
  console.log(links);
  DrawNodes()
  console.log(simulation.nodes())
}

function AddNodeActive(){
  nodeAdd = true;
  nodeRemove = false;
  drag = false;
}

function RemoveNodeActive(){
  nodeAdd = false;
  nodeRemove = true;
  drag = false;
}

function DragActive(){
  nodeAdd = false;
  nodeRemove = false;
  drag = true;
}
