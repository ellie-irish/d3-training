function buildMap(containerId) {
    // size globals
    var width = 960;
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

    // create inner group element
    var g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // read in our data
    d3.json('us-states.json', function(error, geojson) {
        handleError(error, 'failed to read geoJSON data');
        console.log(geojson, 'geojson');
        
        d3.csv('NSRDB_StationsMeta.csv', function(error, stations) {
            handleError(error, 'failed to read station data');
            console.log(stations, 'stations');
                
                stations = cleanData(stations);
                console.log(stations, 'clean data')
                draw(geojson, stations);
            });
        });


    function handleError(error, msg) {
        if (error) {
            console.error(msg);
        }
    }

    function cleanData(data) {
        return data
            .map(function(d) {
                return {
                    stationClass: +d.CLASS,
                    abb: d.ST,
                    elevation: +d['NSRDB_ELEV (m)'],
                    loc: [+d.longitude, +d.latitude]
                };
                
            });
    }
            
    function draw(geojson, stations) {
    
        var classes = [];
        stations.forEach(function(d) {
            classes.push(d.stationClass)
        });
        console.log(classes, 'classes')
        
        Array.prototype.unique = function() {
                return this.filter(function (value, index, self) { 
                    return self.indexOf(value) === index; // returns only those values that pass as 'true' given the callback function. 
                });
            }

        var uniqueClasses = classes.unique();
        console.log('Unique classes', uniqueClasses); //create list of unique types

        var color_list = [d3.rgb('#FF0000'), d3.rgb('#FFFF00'), d3.rgb('#0625BD')]

        var colors = d3
            .scaleOrdinal() 
            .domain(uniqueClasses)
            .range(color_list);

        var elevations = d3
            .scaleLinear()
            .domain(d3.extent(stations, function(d) {
                        return d.elevation;
                    })
            )
            .range([2, 15]);

        var albersProj = d3
            .geoAlbersUsa()
            .scale(1100)
            .translate([innerWidth / 2, innerHeight / 2]);

        var location = stations.filter(function(d) {
            return albersProj(d.loc) !== null;
        })
        console.log(location, 'location data');
        var geoPath = d3.geoPath().projection(albersProj);

        g
            .selectAll('path')
            .data(geojson.features)
            .enter()
            .append('path')
            .attr('d', geoPath)
            .style('fill', 'white')
            .style('stroke', 'black')
            .style('stroke-width', 0.5);

        g
            .selectAll('circle')
            .data(location)
            .enter()
            .append('circle')
            .attr('cx', function(d) {
                return albersProj(d.loc)[0]
            })
            .attr('cy', function(d) {
                return albersProj(d.loc)[1]
            })
            .attr('r', function(d) {
                return elevations(d.elevation)
            })
            .attr('fill', function(d) {
                return colors(d.stationClass)
            })
            .attr('stroke', 'grey')
            .attr('opacity', 1);

        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 24)
            .text('US Weather Station Map');
        g
            .append('text')
            .attr('class', 'legend title')
            .attr('x', 820)
            .attr('y', 390)
            .attr('text-anchor', 'middle')
            .style('font-size', 14)
            .text('Weather station class legend')

    var legendData = []
    for(i=0; i<3; i++) {
        legendData.push({myClass: uniqueClasses[i], myColor: color_list[i]})
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
                return d.myClass;
    });
    }
}

buildMap('#map-holder');