function buildChart(containerId) {
    // size globals
    var width = 1100;
    var height = 1100;

    var margin = {
        top: 50,
        right: 50,
        bottom: 60,
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

    // read in our data
    d3.json("climate.json", function(data) {
                console.log(data);

        console.log('raw', data);

        // // coerce data to numeric
        data.forEach(function(d) {
            d.temp = +d.temp;
        });
        
        data.forEach(function(d) {
            d.year = +d.year;
        });

        console.log('clean', data);

        // scales
        var y = d3
            .scaleBand()
            .domain(
                data.map(function(d) {
                    return d.year;
                })
            )
            .range([innerHeight, 0])
            .paddingInner(2)
            .paddingOuter(3);

        console.log(y.domain(), y.range());

        var x = d3
            .scaleLinear()
            .domain(d3.extent(data, function(d) {
                return d.temp;
            }))
            .range([0, innerWidth]);

        console.log(x.domain(), x.range());

        // axes
        var xAxis = d3.axisBottom(x);

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);

        var yAxis = d3.axisLeft(y).ticks(10);

        g
            .append('g')
            .attr('class', 'y-axis')
            .attr('transform', 'translate('+ x(0) +',0)')
            .call(yAxis);

        // bars

        g
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('y', function(d) {
                return y(d.year);
            })
            .attr('x', function(d) {
                return x(Math.min(0, d.temp));
            })
            .attr('height', 5)
            .attr('width', function(d) {
                return Math.abs(x(d.temp)-x(0));
            })
            .attr("fill", function(d) {
                if (1880 <= d.year && d.year < 1890) {
                    return "darkred";
                } else if (1890 <= d.year && d.year < 1900) {
                    return "orangered";
                } else if (1900 <= d.year && d.year < 1910) {
                    return "orange";
                } else if (1910 <= d.year && d.year < 1920) {
                    return "yellow";
                } else if (1920 <= d.year && d.year < 1930) {
                    return "lime";
                } else if (1930 <= d.year && d.year < 1940) {
                    return "lightgreen";
                } else if (1940 <= d.year && d.year < 1950) {
                    return "teal";
                } else if (1950 <= d.year && d.year < 1960) {
                    return "lightskyblue";
                } else if (1960 <= d.year && d.year < 1970) {
                    return "navy";
                } else if (1970 <= d.year && d.year < 1980) {
                    return "blueviolet";
                } else if (1980 <= d.year && d.year < 1990) {
                    return "mediumvioletred";
                } else if (1990 <= d.year && d.year < 2000) {
                    return "pink";
                } else if (2000 <= d.year && d.year < 2010) {
                    return "mistyrose";
                } else if (2010 <= d.year && d.year < 2020) {
                    return "silver";
                }
            })


        // axis labels
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .style('font-size', 24)
            .text('Change in temperature (C)');

        // g
        //     .append('text')
        //     .attr('class', 'y-axis-label')
        //     .attr('x', -30)
        //     .attr('y', innerHeight / 2)
        //     .attr('transform', 'rotate(-90,-30,' + innerHeight / 2 + ')')
        //     .attr('text-anchor', 'middle')
        //     .attr('dominant-baseline', 'baseline')
        //     .text('Year');

        // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 36)
            .text('Global Temperatures by Year');

        g
            .selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('y', function(d) {
                return y(d.year);
            })
            .attr('x', function(d) {
                if (d.temp > 0) {
                    return x(-0.03);
                } else {
                    return x(0.01);
                }
            })
            .attr('dominant-baseline', 'hanging')
            .style('font-size', 8)
            .text(function(d) {
                return d.year;
            });
    });
}

buildChart('#chart-holder');
