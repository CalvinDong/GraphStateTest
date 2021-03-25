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
let node1 = null;
let node2 = null;
let isMoving = true;
let timer = setInterval(timeInitial, 700)
clearInterval(timeInitial)

ReadAdjMatrix(data)



let simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-250))
  .force('center', d3.forceCenter(1200 / 2, 1200 / 2)) 
  .force('link', d3.forceLink().links(links).distance(100)) // This is what creates the network
  .force("x", d3.forceX())
  .force("y", d3.forceY())
  .on('tick', ticked);

nodes.forEach(function(obj){
  //obj.fx = obj.x;
  //obj.fy = obj.y;
})

document.body.onmousemove = moveCursor; // Add text next to cursor
var curTxt=document.createElement('div');
curTxt.id="cursorText";
curTxt.innerHTML="D"; /* Or whatever you want */
document.body.appendChild(curTxt);
var curTxtLen=[curTxt.offsetWidth,curTxt.offsetHeight];

function moveCursor(e){
    if(!e){e=window.event;}
    curTxt.style.left=e.clientX-curTxtLen[0]+'px';
    curTxt.style.top=e.clientY-curTxtLen[1]+'px';
}


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
  .on("mousedown", clickedLine);

function timeInitial(){
  if (isMoving){
    nodes.forEach(function(obj){
      obj.fx = obj.x
      obj.fy = obj.y
    })
    isMoving = false
  }
}

function clickedSVG(event, d){
  if (nodeAdd && event.srcElement === svg._groups[0][0]){ // svg groups to prevent spawning on nodes
    AddNode(event)
  }
  if (edgeAdd && event.srcElement === svg._groups[0][0]){ // If adding edge and pressing outside a node, reset edge add
    clickCount = 0;
    node1 = null;
    node2 = null;
  }
}

function clickedNode(event, d){
  console.log(event)
  if (nodeRemove){
    RemoveNode(d)
  }
  if (edgeAdd){
    clickCount++;
    if (clickCount == 1){
      node1 = d;
    }
    if (clickCount == 2){
      node2 = d;
      AddEdge();
      clickCount = 0;
      node1 = null;
      node2 = null;
    }
    console.log(clickCount)
  }

}

function clickedLine(event, d){
  console.log(event)
  console.log(d)
  if (edgeRemove){
    RemoveEdge(d)
  }
}

function dragstarted(d) {

}

function dragged(event, d){
  d3.select(this)
    .attr("transform", d => `translate(${d.x = event.x}, ${d.y = event.y})`); //For moving g elements
  d.fx = event.x;
  d.fy = event.y;
  simulation.alpha(1).restart();
}

function dragEnded(){
  //simulation.alpha(1).restart();
}

function ticked() { // Update position of nodes and links for every simulation tick
  link 
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node_enter
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
 
  link = svg.selectAll('line')
    .data(links) // bind links data to line objects in DOM
    .join('line') // join adds a line for each edge in links (also lets you specify entry, exit update behaviour)
    .attr('stroke', "black")
  simulation.alpha(1).restart();
}

function AddNode(event){
  console.log("adding node")
  let tempNodes = [...nodes, {id: nodes.length, fx: event.x, fy: event.y}]; // Need to check that we're not adding 
                                                                          // existing links
  nodes = tempNodes 
  DrawNodes()
}

function RemoveNode(d){
  console.log("removing")
  console.log(d)
  //nodes.splice(d.index, 1);
  links = links.filter(function(n){
    return (n.source != d && n.target != d)
  });
  console.log(links);
  DrawNodes();
  console.log(simulation.nodes());
}

function AddEdge(){
  console.log("adding edge");
  let tempEdges = [...links, {source: node1, target: node2}];
  links = tempEdges
  DrawNodes()
}

function RemoveEdge(d){
  console.log("removing edge");
  links.splice(d.index, 1);
  DrawNodes()
}

function DragActive(){
  nodeAdd = false;
  nodeRemove = false;
  drag = true;
  edgeAdd = false;
  edgeRemove = false;
}

function AddNodeActive(){
  nodeAdd = true;
  nodeRemove = false;
  drag = false;
  edgeAdd = false;
  edgeRemove = false;
  curTxt.innerHTML = "V"
}

function RemoveNodeActive(){
  nodeAdd = false;
  nodeRemove = true;
  drag = false;
  edgeAdd = false;
  edgeRemove = false;
  curTxt.innerHTML = "Z"
}

function AddEdgeActive(){
  nodeAdd = false;
  nodeRemove = false;
  drag = false;
  edgeAdd = true;
  edgeRemove = false;
  curTxt.innerHTML = "E"
}

function RemoveEdgeActive(){
  nodeAdd = false;
  nodeRemove = false;
  drag = false;
  edgeAdd = false;
  edgeRemove = true;
  curTxt.innerHTML = "Z"
}



// x measure, y measure, z measure, keep vector of booleans to be drawn. 
// Call Jabalizer for every measure/action and re draw according to given matrix from jabalizer.
// Remove node is to detatch all edges.
// Get the visuals we want.     
