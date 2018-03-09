function buildChart(containerId) {
    // size globals
    var width = d3.select(containerId).node().parentNode.getBoundingClientRect().width / 2.5;
    var height = d3.select(containerId).node().parentNode.getBoundingClientRect().height;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 100
    };

    // calculate dimensions without margins
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    // create svg element
    var svg = d3
        .select(containerId)
        .append('svg')
        .attr('height', height)
        .attr('width', width);

    // create inner group element
    var g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // read BLLs_data.csv 
        d3.csv('BLLs_data.csv', function(error, data) {
            readinError(error, 'failed to read children BLL data');
            console.log(data, 'raw data');
                
            BLL = cleanData(data);
            console.log(BLL, 'clean data')
            
            drawBar(BLL, '2014');
        });

  
    // produces error message in console if data was not read in
    function readinError(error, msg) {
        if (error) {
            console.error(msg);
        }
    }

    // data cleaning step - coerces data to correct type
    function cleanData(data) {
        return data
            .filter(function(d) {
                return d['State Abb'] == 'Total'
            })
            .map(function(d) {
                return {
                    year: String(d.Year),
                    'BLL 5 to 9': parseInt(d['BLL 5 to 9'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    'BLL 10 to 14': parseInt(d['BLL 10 to 14'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    'BLL 15 to 19': parseInt(d['BLL 15 to 19'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    'BLL 20 to 24': parseInt(d['BLL 20 to 24'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    'BLL 25 to 44': parseInt(d['BLL 25 to 44'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    'BLL 45 to 69': parseInt(d['BLL 45 to 69'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    'BLL > 70': parseInt(d['BLL greater or equal to 70'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100
                };
            })
    }

    function drawBar(BLL, selectedYear) {
        
        //var selectedBLL = 'BLL5_9';
        var filteredData = BLL.filter(function(d) {
            return d.year == selectedYear;
        })[0];

        barData = d3.entries(filteredData).filter(function (d) {
            return d.key.substr(0, 3) == 'BLL';
        })

        barData.forEach(function(d) {
            if (isNaN(d.value)) {
                d.value = 0;
            }
        });
        console.log(barData, 'filtered bar data');

        // scales
        var x = d3
            .scaleBand()
            .domain(
                barData.map(function(d) {
                    return d.key;
                })
            )
            .range([0, innerWidth])
            .padding(0.2);

        var y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(barData, function(d) {
                    return d.value;
                })
            ])
            .range([innerHeight, 0]);

        // axes
        var BarxAxis = d3.axisBottom(x);

        var xAxisbar = g.selectAll('.x-axis-bar').data([1]);

        xAxisbar
            .enter()
            .append('g')
            .attr('class', 'x-axis-bar')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(BarxAxis);

        var BaryAxis = d3.axisLeft(y).ticks(15);

        var yAxisbar = g
            .selectAll('.y-axis-bar')
            .data([1]);

        yAxisbar
            .enter()
            .append('g')
            .attr('class', 'y-axis-bar')
            .call(BaryAxis);

        yAxisbar
            .call(BaryAxis);

        // bars
       var bars = g
            .selectAll('.bar')
            .data(barData)

       colors = [d3.rgb('#ADD8E6'), d3.rgb('#87CEEB'), d3.rgb('#00BFFF'), d3.rgb('#4169E1'), d3.rgb('#0000FF'), d3.rgb('#00008B'), d3.rgb('#191970')]

       bars
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) {
                return x(d.key);
            })
            .attr('y', function(d) {
                if (isNaN(d.value)) { return y(0); }
                else { return y(d.value); }
            })
            .attr('width', x.bandwidth())
            .attr('height', function(d) {
                return innerHeight - y(d.value);
            })
            .attr("fill", function(d) {
                if (d.key == 'BLL 5 to 9') {
                    return colors[0];
                } else if (d.key == 'BLL 10 to 14') {
                    return colors[1];
                } else if (d.key == "BLL 15 to 19") {
                    return colors[2];
                } else if (d.key == "BLL 20 to 24") {
                    return colors[3];
                } else if (d.key == "BLL 25 to 44") {
                    return colors[4];
                } else if (d.key == "BLL 45 to 69") {
                    return colors[5];
                } else if (d.key == "BLL > 70") {
                    return colors[6];
                }
              })
           .attr('stroke', 'black');

       bars
           .attr('class', 'bar')
           .transition()
           .duration(2000)
           .delay(500)
           .attr('x', function (d) {
               return x(d.key);
           })
           .attr('y', function (d) {
               return y(d.value);
           })
           .attr('width', x.bandwidth())
           .attr('height', function (d) {
               return innerHeight - y(d.value);
           })
           .attr("fill", function(d) {
               if (d.key == 'BLL 5 to 9') {
                   return colors[0];
               } else if (d.key == 'BLL 10 to 14') {
                   return colors[1];
               } else if (d.key == "BLL 15 to 19") {
                   return colors[2];
               } else if (d.key == "BLL 20 to 24") {
                   return colors[3];
               } else if (d.key == "BLL 25 to 44") {
                   return colors[4];
               } else if (d.key == "BLL 45 to 69") {
                   return colors[5];
               } else if (d.key == "BLL > 70") {
                   return colors[6];
               }
              })
           .attr('stroke', 'black');

        // axis labels
        var barxAxis = g.selectAll('.x-axis-bar-label').data([1]);

        barxAxis
            .enter()
            .append('text')
            .attr('class', 'x-axis-bar-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .attr('fill', 'black')
            .style('font-family', 'Calibri')
            .style('font-size', 18)
            .text('log[Blood Lead Level (ug/dl)]');


        var baryAxis = g.selectAll('.y-axis-bar-label').data([1]);

        baryAxis
            .enter()
            .append('text')
            .attr('class', 'y-axis-bar-label')
            .attr('x', -50)
            .attr('y', innerHeight / 2)
            .attr('transform', 'rotate(-90,-50,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-family', 'Calibri')
            .style('font-size', 18)
            .text('% of Children Tested in US');
        
        baryAxis
            .text('% of Children Tested in US')
            

        // title
        var barTitle = '% of Children with Specific BLL in ' + selectedYear;
        
        var myBartitle = g.selectAll('.bar-title').data([barTitle]);
        
        myBartitle
            .enter()    
            .append('text')
            .attr('class', 'bar-title')
            .attr('x', innerWidth / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .attr('fill', 'black')
            .style('font-family', 'Calibri')
            .style('font-size', 28)
            .text(barTitle);
        
        myBartitle
            .text(barTitle)
            .raise();

        //programmatically change with transition
        d3.select('#myYear').on('input.bar', function () {
            updateYear(+this.value);
        });

        function updateYear(selectedYear) {
            drawBar(BLL, selectedYear);
        }
    }
}

buildChart('#bar-holder');
