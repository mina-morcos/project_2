//Build two dropdown list and plot the data that user selected with plot.ly bar chart.
function buildlist(){

  d3.csv("/static/Data/mina_chart_data.csv").then(function(x) {
  
  //Grab regions from data, then remove duplicate.
  var region = x.map(y => y.region)
  var uniqueregion = Array.from(new Set(region))
  
  //d3.select the first dropdown menu and build unique region names into it.
  var dropdownMenu = d3.select("#selDataset1");
      
  dropdownMenu.selectAll("option")
      .data(uniqueregion)
      .enter()
      .append("option")
      .text(function(d) {
          return d;
      })
      .attr("value", function(d) {
          return d;
          });
  
  }).catch(function(error) {
    console.log(error);
  });
  }
  //build region dropdown when page initializes.
  buildlist()

  //Build the second dropdown of dish names base on the region user selected on the first dropdown.
  function buildlist2(val){
  
      d3.csv("/static/Data/mina_chart_data.csv").then(function(x) {
      
      //Filter data base on the region selected.
      function filter_region(x) {
          return x.region === val;
        }
      var selected_region = x.filter(filter_region);
  
      //Grab dish name from region filtered data.
      var dish_name = selected_region.map(y => y.title)
      
      //d3.select the second dropdown and populate it with dish names.
      var dropdownMenu = d3.select("#selDataset2");
      //empty the dish name dropdown for future append.
          dropdownMenu.html("")

      //Append dish names to emptied dropdown
      dropdownMenu.selectAll("option")
          .data(dish_name)
          .enter()
          .append("option")
          .text(function(d) {
              return d;
          })
          .attr("value", function(d) {
              return d;
              });
      
      //Build bar chart and summary of first dish of the region user selected.
      buildbar(dish_name[0])
      buildsummary(dish_name[0])

      }).catch(function(error) {
        console.log(error);
      });
      }
      
      //Build the initial dropdown list with the initial region of the first list.
      buildlist2('chinese')
      
      //Build the second dropdown when user select a region in the first dropdown.
      function optionChanged1(val) {
          buildlist2(val)
        }

      //Build Plot.ly bar chart.
      function buildbar(val){
          d3.csv("/static/Data/mina_chart_data.csv").then(function(x) {

              //Filter data base on the dish name selected in the second dropdown.
              function filter_dish(x) {
                  return x.title === val;
                }
              var selected_dish = x.filter(filter_dish);

              //Grab info in filtered data.
              var fat = selected_dish.map(y => y.fat)
              var calories = selected_dish.map(y => y.calories)
              var protein = selected_dish.map(y => y.protein)
              var carbs = selected_dish.map(y => y.carbs)
              
              //Plot.ly bar graphing here. Transform the values to integer (parseInt).
              var data = [
                  {
                    x: ['fat (g)', 'protein (g)', 'carbs (g)'],
                    y: [parseInt(fat), parseInt(protein), parseInt(carbs)],
                    type: 'bar',
                    marker:{
                      color: ['grey', 'pink', 'yellow']
                    }
                  }
                ];
                var layout = {
                  title: {
                    text:`<b>${val}</b> <br> Total Calories: ${parseInt(calories)}`,
                    font: {
                      family: 'Courier New, monospace',
                      size: 15
                    },
                    xref: 'paper',
                    x: 0.05,
                  }
              }
                Plotly.newPlot('bar', data, layout)
  
          }).catch(function(error) {
              console.log(error);
            });
        }

        //Pull summary information of the dish user selected.
        function buildsummary(val){
          d3.csv("/static/Data/mina_chart_data.csv").then(function(x) {

              //Filter data base on the dish user selected.
              function filter_dish(x) {
                  return x.title === val;
                }
              var selected_dish = x.filter(filter_dish);
                
              //Grab the summary of the dish.
              var summary = selected_dish.map(y => y.summary)
              
              //Append the summary information to html with d3.select.
              var info_box = d3.select("#dish-summary");
              info_box.html("");
              info_box.append("p").html(summary)
              
          }).catch(function(error) {
              console.log(error);
            });
        }
      
      //Initialize html page with the first dish name of the first region.
      buildbar("Chicken Curry Fried Rice")
      buildsummary("Chicken Curry Fried Rice")

      //Call function buildbar and buildsummary when a dish is selected in the second dropdown.
       function optionChanged2(val) {
          // console.log(val);
          buildbar(val)
          buildsummary(val)
        }
  