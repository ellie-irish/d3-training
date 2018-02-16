function buildMap(containerId) {
    // size globals
    var width = 3000;
    var height = 900;

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
        handleError(error, 'failed to read geoJSON data');
        
        
        d3.csv('laucnty12.csv', function(error, year2012) {
            handleError(error, 'failed to read 2012 data');
            draw(geojson, year2012, margin.left + 50, 'US Unemployment in 2012', 'Y');

            d3.csv('laucnty13.csv', function(error, year2013) {
                handleError(error, 'failed to read 2013 data');
                draw(geojson, year2013, margin.left + 350, 'US Unemployment in 2013', 'N'); 

                d3.csv('laucnty14.csv', function(error, year2014) {
                    handleError(error, 'failed to read 2014 data');
                    draw(geojson, year2014, margin.left + 650, 'US Unemployment in 2014', 'N');

                    d3.csv('laucnty15.csv', function(error, year2015) {
                        handleError(error, 'failed to read 2015 data');
                        draw(geojson, year2015, margin.left + 950, 'US Unemployment in 2015', 'N');

                        d3.csv('laucnty12.csv', function(error, year2016) {
                            handleError(error, 'failed to read 2012 data');

                            console.log(year2016, 'year 2016');
                            draw(geojson, year2016, margin.left + 1250, 'US Unemployment in 2016', 'N');
                    
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

    function draw(geojson, data, shiftLeft, mapTitle, legend) {

        // create inner group element
        var g = svg
            .append('g')
            .attr('transform', 'translate(' + shiftLeft + ',' + margin.top + ')');

        data.forEach(function(d) {
        d['ids'] = d.StateCode + d.CountyCode
        });

        geojson.features.forEach(function(d) {
            data.forEach(function(r) {
                if (+r.ids === +d.id) {
                    d.properties.Percent = +r.Percent;
                }
            })

        })

        console.log(geojson, 'test');

        colorList = [d3.rgb('#F2F0F7'), d3.rgb('#DADAEB'), d3.rgb('#9E9AC8'), d3.rgb('#756BB1'), d3.rgb('#54278F')]
        categories = ['lowest', 'low', 'medium', 'high', 'highest']

        var extent = d3.extent(data, function(d) {
                        return +d.Percent;
                        })

        var unemploymentPer = d3.scaleQuantize()
        .domain(extent)
        .range(categories);

        var colors = d3
                .scaleOrdinal() 
                .domain(categories)
                .range(colorList);

        var albersProj = d3
            .geoAlbersUsa()
            .scale(800)
            .translate([shiftLeft + 100, innerHeight / 4.5]);

        var geoPath = d3.geoPath().projection(albersProj);

        g
            .selectAll('path')
            .data(geojson.features)
            .enter()
            .append('path')
            .attr('d', geoPath)
            .style('fill', function(d) {
                return colors(unemploymentPer(d.properties.Percent))
            })
            .style('stroke', 'black')
            .style('stroke-width', 0.5);

        g
            .append('text')
            .attr('class', 'title')
            .attr('x', shiftLeft + 100)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 24)
            .text(mapTitle);

    
    if (legend === 'Y') {

        g
            .append('text')
            .attr('class', 'legend title')
            .attr('x', 320)
            .attr('y', 385)
            .attr('text-anchor', 'middle')
            .style('font-size', 16)
            .text('US Unemployment legend')

        var legendData = []
        for(i=0; i<5; i++) {
            legendData.push({myCategory: categories[i], myColor: colorList[i]})
        }

        console.log(legendData, 'legend data');

            legendGroups = g.selectAll('.legend-entries')
                    .data(legendData)
                    .enter()
                    .append('g')
                    .attr('transform', function(d, i) {
                        return 'translate(300,' + (400 + 20*i) + ')';
                    });

            legendGroups.append('rect')
                .attr('x', 5)
                .attr('y', 0)
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', function(d) {
                    return d.myColor;
                })
                .attr('stroke', 'gray');

            legendGroups.append('text')
                .attr('x', 20)
                .attr('y', 0)
                .attr('text-anchor', 'start')
                .attr('alignment-baseline', 'hanging')
                .style('font-size', 14)
                .text(function(d) {
                    return d.myCategory;
        });
    } 
    }
}

buildMap('#map-holder');

