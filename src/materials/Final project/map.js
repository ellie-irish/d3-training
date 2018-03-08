function buildMap(containerId) {
    // size globals
    var width = d3.select(containerId).node().parentNode.getBoundingClientRect().width / 1.9;
    var height = d3.select(containerId).node().parentNode.getBoundingClientRect().height;

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
        .attr('class', 'map-svg')
        .attr('height', height)
        .attr('width', width);

    var svg2 = d3
        .select("#selections")
        .append("svg")
        .attr("width", 100)
        .attr("height", 100);

    // create inner group element
    var g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // read BLLs_data.csv
    d3.json('us-states.json', function(error, geojson) {
        readinError(error, 'failed to read geoJSON data');
        console.log(geojson, 'geojson data');
        
        d3.csv('BLLs_data.csv', function(error, data) {
            readinError(error, 'failed to read children BLL data');
            console.log(data, 'raw data');
                
                BLL = cleanData(data);
                console.log(BLL, 'clean map data');

                geojson.features.forEach(function (f) {
                    f.properties.data = {}
                    BLL.forEach(function (d) {
                        if (d.abb == f.properties.code) {
                            f.properties.data[d.year] = d
                        }
                    })
                });
                console.log(geojson, 'new geojson');

                draw(geojson, BLL, '2014', 'BLL5_9');
            });

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
                    completion: d['Data Set Completion'],
                    abb: d['State Abb'],
                    pop: parseInt(d['Population < 72 months old'].replace(/,/g, '')),
                    popTested: parseInt(d['# of Children Tested'].replace(/,/g, '')),
                    greater5: parseInt(d['Total greater or equal to 5'].replace(/,/g, '')),
                    greater10: parseInt(d['Total greater or equal to 10'].replace(/,/g, '')),
                    perGreater10: parseFloat(d['% greater or equal to 10']),
                    BLL5_9: parseInt(d['BLL 5 to 9'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL10_14: parseInt(d['BLL 10 to 14'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL15_19: parseInt(d['BLL 15 to 19'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL20_24: parseInt(d['BLL 20 to 24'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL25_44: parseInt(d['BLL 25 to 44'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL45_69: parseInt(d['BLL 45 to 69'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL70: parseInt(d['BLL greater or equal to 70'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100
                };
            });
    }

    // function that creates map and has transitions for data filtering
    

    function draw(geojson, BLL, selectedYear, selectedBLL) {

        console.log(geojson, 'geojson test');

        var albersProj = d3.geoAlbersUsa().scale(innerWidth*1.1).translate([innerWidth / 2, innerHeight / 2]);
        var geoPath = d3.geoPath().projection(albersProj);

        //var selectedBLL = 'BLL5_9';
        var filteredData = BLL.filter(function (d) {
            return d.year == selectedYear;
        });
        console.log(filteredData, 'filtered data');

        BLL.forEach(function(d) {
            if (d[selectedBLL] == 0) {
                d[selectedBLL] = NaN;
            }
        });

        var colorScale = d3
            .scaleLog()
            .domain(d3.extent(filteredData, function (d) {
                return d[selectedBLL];
            })
            )
            .range([d3.rgb('#ffffff'), d3.rgb('#870900')]);

        // map outline
        var paths = g
            .selectAll('path')
            .data(geojson.features)

        paths
            .enter()
            .append('path')
            .attr('d', geoPath)
            .style('fill', function (d) {
                if (d.properties.data[selectedYear] && d.properties.data[selectedYear][selectedBLL]) {
                    return colorScale(d.properties.data[selectedYear][selectedBLL]);
                }
                else { return 'lightgrey'; }
            })
            .style('stroke', 'black')
            .style('stroke-width', 0.5);

        paths
            .style('fill', function (d) {
                if (d.properties.data[selectedYear] && d.properties.data[selectedYear][selectedBLL]) {
                    return colorScale(d.properties.data[selectedYear][selectedBLL]);
                }
                else { return 'lightgrey'; }
            })
            .style('stroke', 'black')
            .style('stroke-width', 0.5);


        // map title
        var mapTitle = 'US Children Blood Lead Levels in ' + selectedYear;
        
        var title = g.selectAll('.map-title').data([mapTitle]);

        title
            .enter()
            .append('text')
            .attr('class', 'map-title')
            .attr('x', innerWidth / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-family', 'Calibri')
            .style('font-size', 42)
            .text(mapTitle);

        title
            .text(mapTitle);

        //// Add legend

        //legendHeight = 500

        //legend = d3.select('#legend')
        //    .attr('width', 50)
        //    .attr('height', legendHeight)
        //    .append('g')
        //    .attr('transform', 'translate(' + 20 + ',' + 20 + ')');

        //    var gradient = legend.append('defs')
        //        .append('linearGradient')
        //        .attr('id', 'gradient')
        //        .attr('x1', '0%') // bottom
        //        .attr('y1', '100%')
        //        .attr('x2', '0%') // to top
        //        .attr('y2', '0%')
        //        .attr('spreadMethod', 'pad');

        //    //var pct = linspace(0, 100, scale.length).map(function (d) {
        //    //    return Math.round(d) + '%';
        //    //});

        //    //var colourPct = d3.zip(pct, scale);

        //    //colourPct.forEach(function (d) {
        //    //    gradient.append('stop')
        //    //        .attr('offset', d[0])
        //    //        .attr('stop-color', d[1])
        //    //        .attr('stop-opacity', 1);
        //    //});

        //    legend.append('rect')
        //        .attr('x1', 0)
        //        .attr('y1', 0)
        //        .attr('width', 50)
        //        .attr('height', legendHeight)
        //        .style('fill', 'url(#gradient)');

        //    // create a scale and axis for the legend
        //    var legendScale = d3.scale.linear()
        //        .domain(d3.extent(filteredData, function (d) {
        //            return d.BLL5_9;
        //        }))
        //        .range([legendHeight, 0]);

        //    var legendAxis = d3.svg.axis()
        //        .scale(legendScale)
        //        .orient("right")
        //        .tickValues(d3.extent(filteredData, function (d) {
        //            return d.BLL5_9;
        //        }))
        //        .tickFormat(d3.format("d"));

        //    legendSvg.append("g")
        //        .attr("class", "legend axis")
        //        .attr("transform", "translate(" + 50 + ", 0)")
        //        .call(legendAxis);

        //programmatically change with transition
        d3.select('#myYear').on('input.map', function () {
            d3.select("#myYear-label").text(this.value);
            draw(geojson, BLL, this.value, selectedBLL);
        });

        d3.selectAll('.radio-css').on('change', function () {
            if (this.checked) {
                draw(geojson, BLL, selectedYear, this.value);
            }
        })        


    }
}

buildMap('#map-holder');