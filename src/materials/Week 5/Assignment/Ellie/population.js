function buildChart(containerId) {
    // size globals
    var width = 960;
    var height = 500;

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

    // read in population data
    d3.json('population.json', function(error, data) {
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('raw', data);

        // coerce data to numeric
        var parseTime = d3.timeParse('%B-%Y');
        console.log(parseTime);

        data.forEach(function(d) {
            d.pop = +d.pop;
            d.date = parseTime((d.year).toString());
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
            .domain([
                0,
                d3.max(data, function(d) {
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


        // multiple lines
        var countries = ['China', 'India']; // Add more countries to make chart scalable

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

        // legend

        g
            .append('text')
            .attr('class', 'legend')
            .attr('x', innerWidth / 10)
            .attr('y', 20)
            .style('font-size', 16)
            .text('China');
        g
            .append('text')
            .attr('class', 'legend')
            .attr('x', innerWidth / 10)
            .attr('y', 50)
            .style('font-size', 16)
            .text('India');

        g
            .append('circle')
            .attr('class', 'legend')
            .attr('cx', innerWidth / 11)
            .attr('cy', 14)
            .attr('r', 5)
            .attr('fill', function(d) {
                return d3.interpolateRdYlBu(0.2);
            });

        g
            .append('circle')
            .attr('class', 'legend')
            .attr('cx', innerWidth / 11)
            .attr('cy', 44)
            .attr('r', 5)
            .attr('fill', function(d) {
                return d3.interpolateRdYlBu(0.5);
            })
            .attr('stroke', 'gray');

    });
}

buildChart('#chart-holder');
