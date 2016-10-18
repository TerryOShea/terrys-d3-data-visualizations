$('document').ready(function() {
  var width = 1000,
      height = 600,
      linkDistance = 50, //approximate distance between nodes
      charge = -150; //the repulsion between nodes
  
  //for the sprite images, which can't be handled well in svg
  var container = d3.select('.container')
    .style('width', width + 'px')
    
  //for the lines
  var svg = container.append('svg')
    .attr('width', width)
    .attr('height', height);
  
  //chart title
  var title = container.append('h1')
    .attr('class', 'title')
    .text('Neighbors')
    .style('left', width/2 + 'px')
    .style('top', height/2 + 'px');
  
  //source link at bottom
  container.append('div')
    .attr('class', 'source')
    .append('a')
      .text('Source')
      .attr('href', 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json')
      .attr('target', '_blank');
  
  //reading in the data
  $.getJSON('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json').success(function(result) {
    var nodes = result.nodes,
        links = result.links;
    
    //creates force-directed graph
    var force = d3.layout.force()
      .size([width, height])
      .nodes(nodes)
      .links(links)
      .charge(charge)
      .linkDistance(linkDistance);
    
    //creates links!
    var link = svg.selectAll('.link')
      .data(links)
      .enter().append('line')
        .attr('class', 'link');
    
    //creates flag nodes!
    var node = container.selectAll('img')
      .data(nodes)
      .enter().append('img')
        .attr('class', function(d) { return 'flag flag-' + d.code })
        .on('mouseover', function(d) {
          d3.select(this).classed('shadow', true);
          title.html(d.country);
        })
        .on('mouseout', function(d) {
          d3.select(this).classed('shadow', false);
        })
        .call(force.drag);
    
    //dynamically positions each node and link
    force.on('tick', function() {
      node.style('left', function(d) { return (d.x - 8) + 'px' })
          .style('top', function(d) { return (d.y * .5625 + height/5 - 5) + 'px' })
      link.attr('x1', function(d) { return d.source.x })
          .attr('y1', function(d) { return (d.source.y * .5625 + height/5) })
          .attr('x2', function(d) { return d.target.x })
          .attr('y2', function(d) { return (d.target.y * .5625 + height/5) })
    });
    
    //starts the whole thing up
    force.start();    
  });
})