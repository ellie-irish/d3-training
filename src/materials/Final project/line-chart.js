function buildChart(containerId) {
    // size globals
    var width = d3.select(containerId).node().parentNode.getBoundingClientRect().width * 0.8;
    var height = d3.select(containerId).node().parentNode.getBoundingClientRect().height;

    var margin = {
        top: 50,
        right: 210,
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
            console.log(BLL, 'line clean data')
            drawLine(BLL, 'Alabama');
    });

    // produces error message in console if data was not read in
    function readinError(error, msg) {
        if (error) {
            console.error(msg);
        }
    }

    // data cleaning step - coerces data to correct type
    function cleanData(data) {
        var new_data = data
            .map(function(d) {
                return {
                    year: String(d.Year),
                    state: String(d.State),
                    BLL5_9: parseInt(d['BLL 5 to 9'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL10_14: parseInt(d['BLL 10 to 14'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL15_19: parseInt(d['BLL 15 to 19'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL20_24: parseInt(d['BLL 20 to 24'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL25_44: parseInt(d['BLL 25 to 44'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL45_69: parseInt(d['BLL 45 to 69'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL70: parseInt(d['BLL greater or equal to 70'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100
                };

            });
        new_data.columns = ['year', 'state', 'BLL5_9', 'BLL10_14', 'BLL15_19', 'BLL20_24', 'BLL25_44', 'BLL45_69', 'BLL70']
        return new_data
    }

    function drawLine(BLL, selectedState) {

        var parseTime = d3.timeParse('%Y');
        console.log(parseTime);

        BLL.forEach(function(d) {
            d.year = parseTime(d.year);
        });

        var filteredData = BLL.filter(function(d) {
            return d.state == selectedState;
        });

        console.log(filteredData, 'filtered state data');

        var states = [];
        BLL.forEach(function (d) {
                states.push(d.state)
        });

        Array.prototype.unique = function () {
            return this.filter(function (value, index, self) {
                return self.indexOf(value) === index; // returns only those values that pass as 'true' given the callback function. 
            });
        }

        var uniqueStates = states.unique();
        console.log(uniqueStates, 'unique states');

        // populating the drop-down
        d3.select("#dropdown")
          .selectAll("option")
          .data(uniqueStates)
          .enter()
          .append("option")
          .attr("value", function(d) { return d; })
          .text(function(d) { return d; });
        
        //Organize data
        var by_BLL_type = BLL.columns.slice(2).map(function (d) {
            return {
                id: d,
                values: filteredData.map(function (p) {
                    return { year: p.year, BLL_type: p[d] };
                })
            };
        });

        console.log(by_BLL_type, 'BLL types');

        // x and y scales
        var x = d3
            .scaleTime()
            .domain(
                d3.extent(filteredData, function(d) {
                    return d.year;
                })
            )
            .range([0, innerWidth]);

        var y = d3
            .scaleLinear()
            .domain([
                d3.min(by_BLL_type, function (d) { return d3.min(d.values, function (d) { return d.BLL_type; }); }),
                d3.max(by_BLL_type, function (d) { return d3.max(d.values, function (d) { return d.BLL_type; }); })
            ])
            .range([innerHeight, 0]);

        // x-axis
        var xAxis = d3.axisBottom(x).ticks(d3.timeYear.every(1));
        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);

        // y-axis
        var yAxis = d3.axisLeft(y).ticks(5);
        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);

        // line generator
        var line = d3
            .line()
            .x(function (d) {
                return x(d.year);
            })
            .y(function (d) {
                return y(d.BLL_type);

            })
            .defined(function (d) {
                return !isNaN(d.BLL_type);
            });

       
        var years = [];
        filteredData.forEach(function(d) {
            years.push(d.year)
        });
        console.log(years, 'years');

        myColors = [d3.rgb('#ADD8E6'), d3.rgb('#87CEEB'), d3.rgb('#00BFFF'), d3.rgb('#4169E1'), d3.rgb('#0000FF'), d3.rgb('#00008B'), d3.rgb('#191970')]

        var colors = d3
            .scaleOrdinal() 
            .domain(filteredData, function(d) {
                return d.year;
            } )
            .range(myColors);

        var groups = g
            .selectAll('.path')
            .data(by_BLL_type)
            

        groups
            .enter()    
            .append('path')
            .datum(function (d) {
                return d;
            })
            .attr('class', 'BLL-line')
            .attr('fill', 'none')
            .attr('stroke', function (d) {
                return colors(d.id);
            })
            .attr('stroke-width', 3)
            .attr('d', function (d) {
                return line(d.values);
            });

        groups
            .transition()
            .duration(1500)
            .delay(500)
            .attr('stroke', function (d) {
                return colors(d.id);
            })
            .attr('stroke-width', 3)
            .attr('d', function (d) {
                return line(d.values);
            });

        // groups
        //    .selectAll('.year-point')
        //    .data(function (d) {
        //     return d;
        //     })
        //    .enter()
        //    .append('circle')
        //    .attr('class', 'year-point')
        //    .attr('fill', function (d) {
        //     return colors(d.id);
        //     })
        //    .attr('stroke', 'none')
        //    .attr('cx', function(d) {
        //        return x(d.year);
        //    })
        //    .attr('cy', function(d) {
        //        return y(d.values[1]);
        //    })
        //    .attr('r', 2);

        // axis labels
        var xAxistitle = d3.selectAll('.x-axis-label')
        
        xAxistitle
            .enter()
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .style('font-family', 'Calibri')
            .style('font-size', 26)
            .text('Year');
        
            xAxistitle
            .text('Year')
        
        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', -30)
            .attr('y', innerHeight / 2)
            .attr('transform', 'rotate(-90,-80,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-family', 'Calibri')
            .style('font-size', 26)
            .text('% of Children Tested in US');

        // title
        var chartTitle = 'Percent of Children with Specific BLL in ' + selectedState;

        var title = d3.selectAll('.title').data([chartTitle]);

        title
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 48)
            .style('font-weight', 'bold')
            .text(chartTitle);

        title
            .text(chartTitle)

    var legendData = []
    var categories = ['5 - 9 (ug/dl)', '10 - 14 (ug/dl)', '15 - 19 (ug/dl)', '20 - 24 (ug/dl)', '25 - 44 (ug/dl)', '45 - 69 (ug/dl)', '> 70 (ug/dl)']
    for(i=0; i<7; i++) {
        legendData.push({BLL: categories[i], myColor: myColors[i]})
    }

    console.log(legendData, 'legend data');

        legendGroups = g.selectAll('.legend-entries')
                .data(legendData)
                .enter()
                .append('g')
                .attr('transform', function(d, i) {
                    return 'translate(1140,' + (80 + 40*i) + ')';
                });

        legendGroups.append('circle')
            .attr('x', 18)
            .attr('y', 0)
            .attr('r', 10)
            .attr('fill', function(d) {
                return d.myColor;
            });

        legendGroups.append('text')
            .attr('class', 'line-legend-text')
            .attr('x', 20)
            .attr('y', 0)
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'central')
            .text(function(d) {
                return d.BLL;
            });

        //programmatically change with transition
        d3.select('#dropdown').on('change', function () {
            updateState(+this.value);
        });

        function updateState(state) {
            drawLine(BLL, state);
        }
    }
}

buildChart('#line-holder');
