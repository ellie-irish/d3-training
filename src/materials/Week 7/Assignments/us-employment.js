function buildMap(containerId) {
    // size globals
    var width = 2000;
    var height = 600;

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

    // read in our data
    d3.json('us-counties.json', function(error, geojson) {
        console.log(geojson);
        handleError(error, 'failed to read geoJSON data');

        d3.csv('laucnty12.csv', function(error, year2012) {
            handleError(error, 'failed to read 2012 data');

            d3.csv('laucnty13.csv', function(error, year2013) {
                handleError(error, 'failed to read 2013 data');

                d3.csv('laucnty14.csv', function(error, year2014) {
                    handleError(error, 'failed to read 2014 data');

                    d3.csv('laucnty15.csv', function(error, year2015) {
                        handleError(error, 'failed to read 2015 data');

                        d3.csv('laucnty12.csv', function(error, year2016) {
                            handleError(error, 'failed to read 2012 data');

                    console.log(year2016, 'year 2016')
                    draw(geojson, year2012, margin.left, 'US Unemployment in 2012');
                    draw(geojson, year2013, 600, 'US Unemployment in 2013');
                    
                        });
                    });
                });
            });
        });
    });  

    function handleError(error, msg) {
        if (error) {
            console.error(msg);
        }
    }

    function draw(geojson, data, shiftLeft, mapTitle) {

        // create inner group element
        var g = svg
            .append('g')
            .attr('transform', 'translate(' + shiftLeft + ',' + margin.top + ')');

        data.forEach(function(d) {
        d['ids'] = d.StateCode + d.CountyCode
        });

        colorList = ["#f2f0f7", "#dadaeb", "#9e9ac8", "#756bb1", "#54278f"]
        categories = ['ok', 'fine', 'normal', 'bad', 'worst']

        var unemploymentPer = d3.scaleQuantize()
        .domain(d3.extent(data, function(d) {
                        return +d.Percent;
                    })
            )
        .range(categories);


        var colors = d3
                .scaleLinear() 
                .domain(unemploymentPer)
                .range(colorList);

        var albersProj = d3
            .geoAlbersUsa()
            .scale(500)
            .translate([innerWidth / 2, innerHeight / 2]);

        var geoPath = d3.geoPath().projection(albersProj);


        g
            .selectAll('path')
            .data(geojson.features)
            .enter()
            .append('path')
            .attr('d', geoPath)
            .style('fill', function(d) {
                return colors(d.Percent)
            })
            .style('stroke', 'black')
            .style('stroke-width', 0.5);

        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 24)
            .text(mapTitle);
        g
            .append('text')
            .attr('class', 'legend title')
            .attr('x', 820)
            .attr('y', 390)
            .attr('text-anchor', 'middle')
            .style('font-size', 14)
            .text('US Unemployment legend')

    var legendData = []
    for(i=0; i<3; i++) {
        legendData.push({myCategory: categories[i], myColor: colorList[i]})
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
                return d.myCategory;
    });
    }
}

buildMap('#map-holder');

