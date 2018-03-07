function buildChart(containerId) {
    // size globals
    var width = 2000;
    var height = 1000;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
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
                    BLL5_9: parseInt(d['BLL 5 to 9'].replace(/,/g, '')),
                    BLL10_14: parseInt(d['BLL 10 to 14'].replace(/,/g, '')),
                    BLL15_19: parseInt(d['BLL 15 to 19'].replace(/,/g, '')),
                    BLL20_24: parseInt(d['BLL 20 to 24'].replace(/,/g, '')),
                    BLL25_44: parseInt(d['BLL 25 to 44'].replace(/,/g, '')),
                    BLL45_69: parseInt(d['BLL 45 to 69'].replace(/,/g, '')),
                    BLL70: parseInt(d['BLL greater or equal to 70'].replace(/,/g, ''))
                };

            });
        new_data.columns = ['year', 'state', 'BLL5_9']
        return new_data
    }

    function drawLine(BLL, selectedState) {

        selectedState = 'Alabama';
        var filteredData = BLL.filter(function(d) {
            return d.state == selectedState;
        });

        var parseTime = d3.timeParse('%Y');
        console.log(parseTime);

        BLL.forEach(function(d) {
            d.year = parseTime((d.year).toString());
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

        //filteredData.forEach(function (d) {
        //    delete d.state;
        //});
        

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
            .selectAll('.years')
            .data(by_BLL_type)
            .enter()
            .append('g')
            //.attr('class', 'country');

        // newData = filteredData.forEach(function(d) {
        //         return d3.entries(d);
        //     });

        //var groupedByYear = d3.nest()
        //  .key(function(d) { return d.year; })
        //  .entries(filteredData);

        //var groupedByYear = Array.from(groupedByYear);

        //// groupedByYear.forEach(function(d) {
        ////     d.values.splice(-1, 2);
        //// });

        //console.log(groupedByYear, 'new year data');



        groups
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
            .select('path')
            .attr('stroke', function (d) {
                return colors(d.id);
            })

        //groups
        //    .selectAll('.pop-point')
        //    .data(function(d) {
        //        return data.filter(function(r) {
        //            return r.key === d;
        //        });
        //    })
        //    .enter()
        //    .append('circle')
        //    .attr('class', 'pop-point')
        //    .attr('fill', function(d) {
        //        return colors(d.key);
        //    })
        //    .attr('stroke', 'gray')
        //    .attr('cx', function(d) {
        //        return x(d.year);
        //    })
        //    .attr('cy', function(d) {
        //        return y(d.value);
        //    })
        //    .attr('r', 2);

        // axis labels
 
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .style('font-family', 'Calibri')
            .style('font-size', 26)
            .text('Year');

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

        var title = d3.selectAll('.title')
            //.data([mapTitle]);

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
    for(i=0; i<3; i++) {
        legendData.push({BLL: years[i], myColor: myColors[i]})
    }

    console.log(legendData, 'legend data');

        legendGroups = g.selectAll('.legend-entries')
                .data(legendData)
                .enter()
                .append('g')
                .attr('transform', function(d, i) {
                    return 'translate(800,' + (400 + 20*i) + ')';
                });

        legendGroups.append('rect')
            .attr('x', 15)
            .attr('y', 0)
            .attr('width', 20)
            .attr('height', 10)
            .attr('fill', function(d) {
                return d.myColor;
            });

        legendGroups.append('text')
            .attr('x', 5)
            .attr('y', 0)
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'hanging')
            .style('font-size', 12)
            .text(function(d) {
                return d.BLL;
            });

        //programmatically change with transition
        d3.select('#dropdown').on('change', function () {
            updateState(+this.value);
        });


        function updateState(state) {
            draw(BLL, state);
        }
    }
}

buildChart('#line-chart-holder');
