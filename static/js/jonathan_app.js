//Grab our data with promise, and graph a d3 sunburst chart.
d3.json("/static/Data/food.json").then(function(x) {
  
  //This initialize the sunburst chart title
  var info_box = d3.select("#recipe");
      info_box.html("");
      info_box.append("h3").attr("class", "text-uppercase").html('food');

  var data = x

  //this is the format of the sunburst chart
  var format = d3.format(",d")

  var width = 932

  var radius = width / 6

  var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

  var arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

  // var d3 = require("d3@5")

  //This does partition on the json data.
  partition = data => {
    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    return d3.partition()
        .size([2 * Math.PI, root.height + 1])
      (root);
  }

    //Graph the data with d3.js
    const root = partition(data);

    root.each(d => d.current = d);

    const svg = d3.select("#sunburst")
      .append("svg")
      .attr("viewBox", [0, 0, width, width])
      .style("font", "12px sans-serif");

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

    const path = g.append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("d", d => arc(d.current));

    path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

    path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    const label = g.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name);

    const parent = g.append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

    //Build recipe information
    function buildrecipe(val) {
      // console.log(val)
      d3.csv("/static/Data/merged.csv").then(function(x) {
        
        //Filter our data base on the value that the user clicked
        function filter_dish(x) {
          return x.title === val;
        }
        var selected_dish = x.filter(filter_dish);

        //Arrays that stores the columns of information in the filtered data.
        var instructions = selected_dish.map(y => y.instructions)
        var image = selected_dish.map(y => y.image)
        var sourceUrl = selected_dish.map(y => y.sourceUrl)
        var readyInMinutes = selected_dish.map(y => y.readyInMinutes)
        var servings = selected_dish.map(y => y.servings)
        var ingredients  = selected_dish.map(y => y.ingredients)

        //Append food image.
        var img_box = d3.select("#image");
            img_box.html("");
            img_box.attr("src", `${image}`);

        //Append recipe information.
        var info_box = d3.select("#recipe");
            info_box.html("");
            info_box.append("h3").attr("class", "text-uppercase").html(val);
            info_box.append("p").html(instructions);
            if (sourceUrl == ""){
            info_box.append("a").html("");
            } else {
              info_box.append("a").attr("href", `${sourceUrl}`).html("Click me for source site");
            }
        
        //Append cooking time and serving size of the dish.
        var misc_box = d3.select("#misc");
            misc_box.html("");
            if (readyInMinutes == ""){
            misc_box.html("");
            } else {
            misc_box.append("p").text(`Ready in ${readyInMinutes} minutes || Serving size: ${servings}`);
            }
        
        //Append ingredients
        var ingredient_box = d3.select("#ing");
            ingredient_box.html("");
            if (ingredients == ""){
              ingredient_box.html("");
            } else {
              ingredient_box.append("p").html(`<b>Ingredients: </b> ${ingredients}`);
            }
          
      }).catch(function(error) {
        console.log(error);
      });
    }

    
    //Function that runs when user click on the sunburst chart.
    function clicked(p) {

      buildrecipe(p.data.name)

      parent.datum(p.parent || root);

      root.each(d => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });

      const t = g.transition().duration(750);

      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      path.transition(t)
          .tween("data", d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
          })
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
          .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
          .attrTween("d", d => () => arc(d.current));

      label.filter(function(d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
          .attr("fill-opacity", d => +labelVisible(d.target))
          .attrTween("transform", d => () => labelTransform(d.current));
      }
  
    function arcVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

      function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
      }

    function labelTransform(d) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    return svg.node();

    
  


}).catch(function(error) {
  console.log(error);
});

