$('document').ready(function() {
  
  var margin = { top: 20, right: 30, bottom: 50, left: 80 },
  height = 400,
  approxwidth = 700; //approx. because each bar needs to be a whole pixel width
  
  //partial scale for y-axis
  var y = d3.scale.linear()
    .range([height, 0]);
  
  //retrieving data
  $.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json').success(function(result) {
    var data = result.data, 
        source = result.display_url,
        start = new Date(result.from_date),
        end = new Date(result.to_date);
    
    //chart title
    d3.select('.container').append('h1')
      .attr('class', 'title')
      .text("American Gross Domestic Product (GDP)");
    
    //the graph
    var svg = d3.select('.container').append('svg');
    
    //the infobox when you hover on a certain bar
    var infobox = d3.select('.container').append('div')
          .attr('class', 'infobox')
    
    //source attribution at bottom
    d3.select('.container').append('div')
      .attr("class", "source")
      .text("Source: ")
      .append('a')
        .attr('href', source)
        .attr('target', '_blank')
        .text(source);
    
    var barWidth = Math.ceil(approxwidth/data.length);
    var width = barWidth*data.length;
    
    svg.attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
    //y-axis scale completed with fetched data
    y.domain([0, d3.max(data, function(d) {return d[1] })]);
    
    //x-axis scale with accurate width info
    var x = d3.scale.linear()
      .domain([start.getFullYear(), end.getFullYear()])
      .range([0, width]);
    
    //creates bars and plots bars
    var bars = svg.selectAll('rect')
      .data(data)
      .enter().append('rect')
      .attr('width', barWidth)
      .attr('height', function(d) { return height-y(d[1]) })
      .attr('x', function(d, i) { return barWidth*i + margin.left})
      .attr('y', function(d, i) { return y(d[1]) + margin.top })
      .attr('class', 'bar')
    //adds mouseover functionality--bar lightens, infobox appears
      .on('mouseover', function(d) {
        var bar = d3.select(this);
        bar.attr('class', 'hoverbar');
        var date = new Date(d[0]),
            year = date.getFullYear(),
            month = date.toLocaleString('en-us', { month: 'long' }),
            gdp = d[1];
        infobox.transition()
          .duration(200)
          .style('opacity', 0.8)
        infobox.html('<p><strong>$' + gdp.toLocaleString() + ' Billion</strong></p><p>' + month + ' ' + year + '</p>')
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 60) + "px");
      })
      .on('mouseout', function(d) {
        var rect = d3.select(this);
        rect.attr('class', 'bar');
        infobox.transition()
          .duration(200)
          .style('opacity', 0);
      });
    
    //creates and draws x-axis
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(14)
      .tickFormat(d3.format("d"));
    svg.append("g")
      .attr("class", "axis")
      .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
      .call(xAxis);
    
    //creates and draws y-axis
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(9)
      .tickFormat(function(d) { return "$" + d.toLocaleString() + "B" });
    svg.append("g")
      .attr("class", "axis")
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(yAxis);
  });
})