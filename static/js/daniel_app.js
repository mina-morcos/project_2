//Build dropdown list and table with our data.
function buildlist(){

    d3.csv("/static/Data/merged.csv").then(function(x) {
     //console.log(x)
    
    //Grabing region information from our data, then remove duplicates.
    var region = x.map(y => y.region)
    var uniqueregion = Array.from(new Set(region))
    
    //d3.select the dropdown in our html
    var dropdownMenu = d3.select("#selDataset3");
    
    //Append unique regions into our dropdown menu.
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
    //call buildlist function when initializing the page.
    buildlist()

//Function that build table base on user selection in the dropdown menu.
function buildTable(b){
        d3.csv("/static/Data/merged.csv").then(function(x) {
        //filter our data base on the region user selected.
        function filter_region(x) {
            return x.region === b;
          }
        var selected_region = x.filter(filter_region);
        //Grab information from filtered data.
        var dish = selected_region.map(y => y.title)
        var weightWatcherSmartPoints =  selected_region.map(y => y.weightWatcherSmartPoints)
        var pricePerServing =  selected_region.map(y => y.pricePerServing)
        var healthScore =  selected_region.map(y => y.healthScore)
        var aggregateLikes =  selected_region.map(y => y.aggregateLikes)
        var calories =  selected_region.map(y => y.calories)
        //d3.select tbody tag to append information in the future.
        var tbody = d3.select("#datatable").select("tbody");
        //empty tbody
        tbody.html("");
        //Loop through arrays and populate the empty table body.
      for (var i = 0; i < selected_region.length; i++) {
            var trow = tbody.append("tr");
            trow.append("th").text(dish[i]);
            trow.append("td").text(parseInt(weightWatcherSmartPoints[i]));
            trow.append("td").text(parseInt(pricePerServing[i]));
            trow.append("td").text(parseInt(healthScore[i]));
            trow.append("td").text(parseInt(aggregateLikes[i]));
            trow.append("td").text(parseInt(calories[i]));
        }
        //Call barchart building function written below.
        buildHighChart()
    }).catch(function(error) {
        console.log(error);
      });
    }

    //Build table when initializing the page.
    buildTable("chinese")

    //Run buildtable function when user select a region from dropdown.
   function optionChanged(b){
        buildTable(b)
   };

   //Build a bar chart with Highchart.js using the datatable in html.
   function buildHighChart() {
    Highcharts.chart('container', {
      data: {
          table: 'datatable'
      },
      chart: {
          type: 'column'
      },
      title: {
          text: ''
      },
      yAxis: {
          allowDecimals: false,
          title: {
              text: 'Units'
          }
      },
      tooltip: {
          formatter: function () {
              return '<b>' + this.series.name + '</b><br/>' +
                  this.point.y + ' ' + this.point.name.toLowerCase();
          }
      }
  });
   }