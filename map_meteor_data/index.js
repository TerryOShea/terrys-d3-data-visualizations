$('document').ready(function() {
  var width = 1300,
    height = 550;
  
  //using the Winkel tripel projection for minimal distortion
  var projection = d3.geo.winkel3()
    .scale(182)
    .translate([width / 2, height / 2])
    .precision(.1);
  
  var path = d3.geo.path()
    .projection(projection);
  
  //the latitude and longitude lines
  var graticule = d3.geo.graticule();
  
  var container = d3.select('.container')
    .style('width', width + 'px')
  
  var svg = container.append('svg')
    .attr('width', width)
    .attr('height', height);
  
  svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

  svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

  svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

  svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

  // any meteor from before 1900 (yearLimit) is just shown as orange. 
  // (the oldest meteor is from 869)
  var yearLimit = 1900;
  var color = d3.scale.pow().exponent(.01)
    .range([40, 100]);
  
  // some of the meteors are exorbitantly large--e.g. Sikhote-Alin at
  // 23M pounds (a typo?)--and so the radius is calculated using the
  // fifth root of the meteor's mass
  var radius = d3.scale.pow().exponent(.2)
    .range([1, 25]);
  
  //countries map
  d3.json('https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json', function(world) {
    svg.selectAll('.country')
      .data(topojson.feature(world, world.objects.countries).features)
      .enter()
      .append('path')
      .attr('class', 'land')
      .attr('d', path)
  
    //adding meteor points
    $.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json').success(function(result) {
      var minMass = d3.min(result.features, function(d) { return d.properties.mass });
      var maxMass = d3.max(result.features, function(d) { return Math.round(d.properties.mass) });
      var oldest = yearLimit; // will show a nice gradient of colors from yearLimit to the present day
      var newest = d3.max(result.features, function(d) { return new Date(d.properties.year).getFullYear() + 1 });      
      
      color.domain([oldest, newest]);
      radius.domain([minMass, maxMass]);
      
      //format mass with commas
      var f = d3.format(',');
      
      //adding the meteors
      var meteors = svg.append('g').selectAll('.meteor')
        .data(result.features)
        .enter().append('circle')
        .attr('cx', function(d) { return projection([d.properties.reclong,d.properties.reclat])[0] })
        .attr('cy', function(d) { return projection([d.properties.reclong,d.properties.reclat])[1] })
        //radius size based on mass
        .attr('r', function(d) { return radius(d.properties.mass) })
        .attr('class', 'meteor')
        //color based on age--newer meteors are greener, older are oranger
        .style('fill', function(d) { 
          var year = new Date(d.properties.year).getFullYear() + 1;
          if (year < yearLimit) { year = yearLimit; }
          return 'hsla(' + color(year) + ', 100%, 50%, .6)' 
        })
        // when mouse hovers over a meteor, it becomes more opaque (confirmation)
        // and the name, mass and year are displayed above the map
        .on('mouseover', function(d) {
          var meteor = d3.select(this);
          var rgba = meteor.style('fill').split(" ");
          meteor.style('fill', rgba[0] + rgba[1] + rgba[2] + '.99)');
          d3.select('.title').html(d.properties.name.toUpperCase() + ' : ' + f(d.properties.mass) + ' lbs (' + d.properties.year.slice(0, 4) + ')');
        })
        //opacity returns to normal once mouse moves away
        .on('mouseout', function(d) {
          var meteor = d3.select(this);
          var rgba = meteor.style('fill').split(" ");
          meteor.style('fill', rgba[0] + rgba[1] + rgba[2] + '0.5)');
        })
    });
  });
})