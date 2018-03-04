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
            drawLine(BLL);
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
            .map(function(d) {
                return {
                    year: String(d.Year),
                    BLL5_9: parseInt(d['BLL 5 to 9'].replace(/,/g, '')),
                    BLL10_14: parseInt(d['BLL 10 to 14'].replace(/,/g, '')),
                    BLL15_19: parseInt(d['BLL 15 to 19'].replace(/,/g, '')),
                    BLL20_24: parseInt(d['BLL 20 to 24'].replace(/,/g, '')),
                    BLL25_44: parseInt(d['BLL 25 to 44'].replace(/,/g, '')),
                    BLL45_69: parseInt(d['BLL 45 to 69'].replace(/,/g, '')),
                    greater70: parseInt(d['BLL greater or equal to 70'].replace(/,/g, ''))
                };
            });
    }


    function drawLine(BLL) {

        var years = [];
        BLL.forEach(function(d) {
            years.push(d.year)
        });
        console.log(years, 'years');

        // scales
        var x = d3
            .scaleTime()
            .domain(
                d3.extent(years, function(d) {
                    return d;
                })
            )
            .range([0, innerWidth]);

        console.log(x.domain(), x.range());

        var y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(BLL, function(d) {
                    return d.pop;
                })
            ])
            .range([innerHeight, 0]);

        console.log(y.domain(), y.range());

        // axes
        var xAxis = d3.axisBottom(x).ticks(d3.timeYear.every(10));

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);

        var yAxis = d3.axisLeft(y).ticks(5);

        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);

        // line generator
        var line = d3
            .line()
            .x(function(d) {
                return x(d.date);
            })
            .y(function(d) {
                return y(d.pop);
            });

        var years = [];
        BLL.forEach(function(d) {
            years.push(d.year)
        });
        console.log(years, 'years');

        var colors = d3
            .scaleOrdinal() 
            .domain(countries)
            .range(d3.schemeRdYlBu[3]); // Replace range with number of countries in list

        var groups = g
            .selectAll('.country')
            .data(countries)
            .enter()
            .append('g')
            .attr('class', 'country');

        groups
            .append('path')
            .datum(function(d) {
                return data.filter(function(r) {
                    return r.country === d;
                });
            })
            .attr('class', 'pop-line')
            .attr('fill', 'none')
            .attr('stroke', function(d) {
                return colors(d[0].country);
            })
            .attr('stroke-width', 3)
            .attr('d', line);

        groups
            .selectAll('.pop-point')
            .data(function(d) {
                return data.filter(function(r) {
                    return r.country === d;
                });
            })
            .enter()
            .append('circle')
            .attr('class', 'pop-point')
            .attr('fill', function(d) {
                return colors(d.country);
            })
            .attr('stroke', 'gray')
            .attr('cx', function(d) {
                return x(d.date);
            })
            .attr('cy', function(d) {
                return y(d.pop);
            })
            .attr('r', 2);

        // axis labels
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .text('Year');

        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', -30)
            .attr('y', innerHeight / 2)
            .attr('transform', 'rotate(-90,-80,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Population (counts)');

        // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 24)
            .text('Population over Time for Various Countries');
    }
}

buildChart('#line-chart-holder');
