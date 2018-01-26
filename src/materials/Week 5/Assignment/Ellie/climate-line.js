function buildChart(containerId) {
    // size globals
    var width = 960;
    var height = 500;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 60
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

    // read in climate data
    d3.json('climate.json', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('raw', data);

        // coerce data to numeric
        var parseTime = d3.timeParse('%Y');

        data.forEach(function(d) {
            d.temp = +d.temp;
            d.date = parseTime((+d.year).toString());
        });

        console.log('clean', data);

        // scales
        var x = d3
            .scaleTime()
            .domain(
                d3.extent(data, function(d) {
                    return d.date;
                })
            )
            .range([0, innerWidth]);

        console.log(x.domain(), x.range());

        var y = d3
            .scaleLinear()
            .domain(
                d3.extent(data, function(d) {
                    return d.temp;
                })
            )
            .range([innerHeight, 0]);

        console.log(y.domain(), y.range());

        // axes
        var xAxis = d3.axisBottom(x).ticks(d3.timeYear.every(2));

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0, '+ y(0) +')')
            .call(xAxis)
            .selectAll('text')
            .attr('dy', '-0.8em')
            .attr('dx', '0.8em')
            .attr('transform', 'rotate(90)')
            .style('text-anchor', 'start')
            .style('font-size', 8);

        g
            .select('text') // selects text nearest y-axis
            .attr('dy', '-1em'); // shifts text away from y-axis

        var yAxis = d3.axisLeft(y).ticks(10);

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
                return y(d.temp);
            });


        // add line
        g
            .append('path')
            .datum(data)
            .attr('class', 'climate-line')
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 1.5)
            .attr('d', line);

        // add points
        g
            .selectAll('.climate-point')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'climate-point')
            .attr('fill', 'red')
            .attr('stroke', 'none')
            .attr('cx', function(d) {
                return x(d.date);
            })
            .attr('cy', function(d) {
                return y(d.temp);
            })
            .attr('r', 3);

        // axis labels
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight - 5)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .text('Year');

        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', -30)
            .attr('y', innerHeight / 2)
            .attr('transform', 'rotate(-90,-40,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Temperature (C)');

        // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 24)
            .text('Climate Temperature Change by Year');
    });
}

buildChart('#chart-holder');