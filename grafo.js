var margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom,
    widthleg = 300,
    heightleg = 400;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20();

var radius = d3.scale.linear()
    .range([5,13]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#grafico").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var svglegend = d3.select("#etiquetas").append("svg")
    .attr("width", widthleg)
    .attr("height", heightleg)
  .append("g")
    .attr("transform", "translate(" + 0 + "," + margin.top + ")");
d3.csv("candidatos.csv", function(error, data) {
  data.forEach(function(d) {
    d.ind = +d.ind;
    d.x_coord = +d.x_coord;
    d.y_coord = +d.y_coord;
    d.seguidores = +d.seguidores;
    d.seguidorespol = +d.seguidorespol;
  });


  console.log(data);
  d3.json("indices.seg.json", function(error, indicesseg){ 
  d3.json("indices.ges.json", function(error, indicesges){ 
  console.log(indicesseg);
  console.log(indicesges);

  x.domain(d3.extent(data, function(d) { return d.x_coord; })).nice();
  y.domain(d3.extent(data, function(d) { return d.y_coord; })).nice();
  radius.domain(d3.extent(data, function(d){return d.seguidorespol; })).nice();
  color.domain(d3.extent(data, function(d){return d.partido;}));

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d){return radius(d.seguidorespol);})
      .attr("cx", function(d) { return x(d.x_coord); })
      .attr("cy", function(d) { return y(d.y_coord); })
      .style("stroke", "#fff")
      .style("stroke-width", 0.5)
      .on("click", showCandidato)
      .on("mouseover", showLabCandidato)
      .style("fill", function(d) { return color(d.partido); });

function showLabCandidato(h){
          d3.selectAll(".labtemp").remove();
          var g = svg.append("g");
            g.append("text")
              .attr("class", "labtemp")
              .text(h.twitter)
              .attr("x", x(h.x_coord) + radius(h.seguidorespol))
              .attr("y", y(h.y_coord) - radius(h.seguidorespol))
              .attr("font-size", "1.2em");
}

function showCandidato(h){
            console.log(indicesseg[h.ind]);
            d3.selectAll(".lab").remove();
            d3.selectAll(".labtemp").remove();
            d3.selectAll(".flecha").remove();
            svg.selectAll(".flecha")
//              .data(data.filter(function(d){return d.partido == h.partido}))
              .data(indicesseg[h.ind])
              .enter()
              .append("path")
              .attr("class", "flecha")
              .attr("d", function(d) {
                  var dx = x(h.x_coord) - x(data[d].x_coord),
                      dy = y(h.y_coord) - y(data[d].y_coord),
                      dr = Math.sqrt(dx * dx + dy * dy);
              return "M" + x(data[d].x_coord) + "," + y(data[d].y_coord) + "A" + dr + "," + dr + " 0 0,1 " + x(h.x_coord) + "," + y(h.y_coord);})
              .style('stroke-dasharray', function(d) {
  //debugger
                  var l = d3.select(this).node().getTotalLength();
                  return l + 'px, ' + l + 'px';})
              .style('stroke-dashoffset', function(d) {
                  return d3.select(this).node().getTotalLength() + 'px';})
              .transition()
              .duration(1400)
              .style('stroke-dashoffset', '0px');

            d3.selectAll(".flechab").remove();
            svg.selectAll(".flechab")
//              .data(data.filter(function(d){return d.partido == h.partido}))
              .data(indicesges[h.ind])
              .enter()
              .append("path")
              .attr("class", "flechab")
              .attr("d", function(d) {
                  var dx =  x(data[d].x_coord) - x(h.x_coord),
                      dy =  y(data[d].y_coord) - y(h.y_coord),
                      dr = Math.sqrt(dx * dx + dy * dy);
              return "M" + x(h.x_coord) + "," + y(h.y_coord) + "A" + dr + "," + dr + " 0 0,1 " + x(data[d].x_coord) + "," + y(data[d].y_coord);})
              .style('stroke-dasharray', function(d) {
  //debugger
                  var l = d3.select(this).node().getTotalLength();
                  return l + 'px, ' + l + 'px';})
              .style('stroke-dashoffset', function(d) {
                  return d3.select(this).node().getTotalLength() + 'px';})
              .transition()
              .duration(1400)
              .style('stroke-dashoffset', '0px');
            var g = svg.append("g");
            g.append("svg:a")
              .attr("xlink:href", "http://twitter.com/" + h.twitter)
              .append("text")
              .attr("class", "lab")
              .text(h.twitter)
              .attr("x", x(h.x_coord) + radius(h.seguidorespol))
              .attr("y", y(h.y_coord) - radius(h.seguidorespol))
              .attr("font-size", "1.2em");
      }

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + (450 + (i * 17)) + ")"; });

  legend.append("rect")
      .attr("x", 200 - 15)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", color);

  legend.append("text")
      .attr("x", 200 - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

}); });
});
