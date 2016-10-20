$('document').ready(function() {
  //little flag icons for the racers' nationalities
  var flags = {
  'ITA': 'https://lh3.googleusercontent.com/EXvV127iqqWufynGa6oTeo6lzw5m1wYLNAiMHeS0A7No2pWT5sCfSG3jgle2Zk4ATIGUDsHT4rnYQg=s48-rw',
  'USA': 'https://lh3.googleusercontent.com/cjlO_6RShHFJUz6-LqNKl5mIUntJqH9wlBPh1GK54_ApvN3KeVVXrwp_-zObWLvdhcanWqGdUpdjgg=s48-rw',
  'FRA': 'https://lh3.googleusercontent.com/JHaM7dmpoSHY5CzZzECpCiVtLHbWvlRhIrsTJxCFb_VHAHZKHRBeaEXbEUCd_TAAr9RQDrgsAT0-hg=s48-rw',
  'GER': 'https://lh3.googleusercontent.com/O4FzecpNTCNvo0ZljeLoxCAdO6pBn-PaDzuet9r_UQRX0lrogjJsx3Tkd1sDTa_3fGT8TLPBPGzIQQ=s48-rw',
  'ESP': 'https://lh3.googleusercontent.com/i_4qA9CZXUHtL8JJtGiIT7x1wAscB9Qij5xRGAAg6EPgGVIRuN-UEq0FdF-XmHDRCM61s7bIuecxEw=s48-rw',
  'SUI': 'https://lh3.googleusercontent.com/sZwSHZOEimh92WvOkuoBK98dOoUUBD0vRFWmJ425IuFosBOQuXyOY0SCTIkpNaUE6fopv0SDtCOVMQ=s48-rw',
  'DEN': 'https://lh3.googleusercontent.com/nBaq5TPHfphDD96zbQIje6sbKZikewEODkPKjdo7gubGtL3K2BZuyfRahSQ9sc2lFl5iogyFNOwFHg=s48-rw',
  'POR': 'https://lh3.googleusercontent.com/xtcs9XPFm0q7ahYZg-EVIJIr72RAoJR2jOdrHg8W6suy1zIAWPJ-LoD72ZtelJZu8ULg2uaPaTaaRQ=s48-rw',
  'COL': 'https://lh3.googleusercontent.com/q0U6D9qk4WdgnrCMkNHexcvIBCuRRh3pWl_m7PcMoY_RZMQhNxd8423tg3aZkWq8h8nwqCnKEJH-Sg=s48-rw',
  'UKR': 'https://lh3.googleusercontent.com/z7bz-te_mllyOjkQ9YxG5JClxMbGk59D6q_hHhMdGWNCyJ4X1rpNULZ7aYrQa1RRyAuSZNPpp5ht9Q=s48-rw',
  'RUS': 'https://lh3.googleusercontent.com/70Hhy_xTGHbxcedRk8w0qryCW7H_mFu55RgTppHfpFhNrVQj7JigtZaV4CA5kI052LQ1IyV5Yf8gPw=s48-rw'
};

  var margin = { top: 10, right: 30, bottom: 50, left: 70 },
      width = 900,
      height = 465;
  
  var x = d3.scale.linear()
    .range([0, width]);
  
  var y = d3.scale.linear()
    .range([height, 0]);

  //fetching data
  $.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json').success(function(result) {
    //for the axes: x-axis will be year, y-axis will be finishing time
    var firstYear = d3.min(result, function(d) { return d.Year }),
        lastYear = d3.max(result, function(d) { return d.Year }),
        fastest = d3.min(result, function(d) { return d.Seconds }),
        slowest = d3.max(result, function(d) { return d.Seconds });
    
    //finishing up the scales for the axes
    x.domain([firstYear, lastYear]);
    y.domain([fastest, slowest]);
    
    var box = d3.select('.container');
    
    //adding the title
    box.append('h1')
      .attr('class', 'title')
      .text("Cycling Times - Alpe d'Huez");
    
    //adding the legend
    var legend = box.append('div')
      .attr('class', 'legend')
      .html('<svg height="50">' + 
              '<circle cx="10" cy="17" r="5" fill="red"/>' + 
              '<text x="20" y="22">Doping allegations (click for details)</text>' + 
              '<circle cx="10" cy="33" r="5" fill="green"/>' + 
              '<text x="20" y="38">No allegations</text>' + 
            '</svg>');
    
    //the graph
    var svg = box.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.bottom + margin.top)
    
    //the infobox when you hover over a certain point
    var infobox = d3.select('body').append('div')
        .attr('class', 'infobox')
    
    //adding data points
    var points = svg.selectAll('circle')
      .data(result)
      .enter().append('circle')
      .attr('cx', function(d) { return x(d.Year) + margin.left })
      .attr('cy', function(d) { return y(d.Seconds) + margin.top })
      .attr('r', 5)
      .attr('class', function(d) { return (d.Doping == "") ? 'non' : 'doper' })
      //when hovered over, a point will show the finishing time, person, and nationality (flag)
      .on('mouseover', function(d) {
        var point = d3.select(this);
        point.classed('hover', true);
        infobox.transition()
          .duration(200)
          .style('opacity', 0.8);
        infobox.html('<p><strong>' + d.Time + '</strong></p><span><img src=' + flags[d.Nationality] 
                     + '><p>&nbsp;&nbsp;' + d.Name + '</p></span>')
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 80) + "px");
      })
      //red dots can be clicked on for further information about the doping allegation(s)
      .on('click', function(d) {
        if (d.Doping !== "") {
          window.open(d.URL, '_blank');
        }
      })
      //box disappears when mouse moves away
      .on('mouseout', function(d) {
        var point = d3.select(this);
        point.classed('hover', false);
        infobox.transition()
          .duration(200)
          .style('opacity', 0);
      })
    
    //creating and drawing the x-axis
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickFormat(d3.format("d"));
    svg.append('g')
      .attr('class', 'axis')
      .style('transform', 'translate(' + margin.left + 'px,' + (height + margin.top) + 'px)')
      .call(xAxis)
    
    //creating and drawing the y-axis
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .tickFormat(function(d) { return Math.floor(d/60) + ':' + (d%60 == 0 ? '00' : d%60) });
    svg.append('g')
      .attr('class', 'axis')
      .style('transform', 'translate(' + margin.left + 'px,' + margin.top + 'px)')
      .call(yAxis)    
  })
})