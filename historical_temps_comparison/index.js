$('document').ready(function() {
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""];
  
  var margin = { top: 90, right: 40, bottom: 40, left: 90 },
      approxWidth = 1100, //approx. because each bar needs to be a whole pixel width
      height = 504,
      boxHeight = height/12;
  
  //scale for the y-axis
  var y = d3.scale.linear()
    .domain([1, 13])
    .range([0, height]);
  
  //color scale--variance below the average(green-yellow) temp is bluer, above is redder
  var color = d3.scale.linear()
    .range([240, 0]);
    
  $.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json').success(function(result) {
    var data = result.monthlyVariance,
        base = result.baseTemperature,
        minVar = d3.min(data, function(d) { return d.variance }),
        maxVar = d3.max(data, function(d) { return d.variance }),
        boxWidth = Math.floor(approxWidth*12/data.length),
        width = boxWidth*data.length/12;
    
    //container for centering purposes
    var container = d3.select('.container')
      .style('width', (width + margin.left + margin.right) + 'px')
    
    //scale for the x-axis
    var x = d3.scale.linear()
      .domain([data[0].year, data[data.length - 1].year])
      .range([0, width]);
    
    color.domain([minVar, maxVar]);
    
    //adding the title
    container.append('div')
      .attr('class', 'title')
      .style('width', (width + margin.left + margin.right) + 'px')
      .append('h1')
        .text('Global temperatures')
      .append('h1')
        .attr('class', 'smaller')
        .text('Relative to the Jan. 1951 - Dec. 1980 monthly averages');
    
    //the infobox when you hover over a certain month
    var infobox = d3.select('body').append('div')
      .attr('class', 'infobox')
    
    //graph will go here
    var svg = container.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.bottom + margin.top)
    
    //source link
    container.append('div')
      .attr('class', 'source')
      .append('a')
        .text('Source')
        .attr('href', 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json')
        .attr('target', '_blank');
    
    //adding month boxes
    var boxes = svg.selectAll('rect')
      .data(data)
      .enter().append('rect')
      .attr('width', boxWidth)
      .attr('height', boxHeight)
      .attr('x', function(d, i) { return margin.left + x(d.year) })
      .attr('y', function(d, i) { return margin.top + y(d.month) })
      //color is a function of that month's deviation from the base temp (8.66°C)
      .attr('fill', function(d, i) { return 'hsl(' + Math.ceil(color(d.variance)) + ', 100%, 75%)' })
       //when you hover over a month, its color darkens and more info appears
      .on('mouseover', function(d) {
        var month = d3.select(this);
        var hsl = month.attr('fill').split(" ");
        month.style('fill', hsl[0] + hsl[1] + '40%)');
        infobox.transition()
          .duration(200)
          .style('opacity', 0.7);
        infobox.html('<p><strong>' + ((d.variance < 0) ? (d.variance*(-1)) + '&nbsp;°C&nbsp;cooler' : d.variance + '&nbsp;°C&nbsp;warmer') + '</strong></p><br>' + 
                     '<p>' + months[d.month - 1] + ' ' + d.year + '</p>')
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 80) + "px");
      })
      //returns to normal when mouse goes elsewhere
      .on('mouseout', function(d) {
        var month = d3.select(this);
        var hsl = month.attr('fill').split(" ");
        month.style('fill', hsl[0] + hsl[1] + '75%)');
        infobox.transition()
          .duration(200)
          .style('opacity', 0);
      });
    
    //creating and drawing the x-axis
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(data.length/120, "d");
    svg.append('g')
      .attr('class', 'axis')
      .style('transform', 'translate(' + margin.left + 'px,' + (height + margin.top) + 'px)')
      .call(xAxis)
    
    //creating and drawing the y-axis
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .tickFormat(function(d) { return months[d-1] });
    svg.append('g')
      .attr('class', 'axis')
      .style('transform', 'translate(' + margin.left + 'px,' + margin.top + 'px)')
      .call(yAxis)     
  });
})