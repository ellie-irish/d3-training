function buildMap(containerId) {
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
                console.log(BLL, 'clean data')
                draw(geojson, BLL);
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

    // function that creates map and has transitions for data filtering
    
    function draw(geojson, BLL) {
        
        geojson.features.forEach(function(f) {
            f.properties.data = {}
            BLL.forEach(function(d) {
                if (d.abb == f.properties.code) {
                    f.properties.data[d.year] = d}
            })
        });
        console.log(geojson, 'new geojson');

        var albersProj = d3.geoAlbersUsa().scale(1800).translate([innerWidth / 2, innerHeight / 2]);
        var geoPath = d3.geoPath().projection(albersProj);
        
        var selectedYear = '2014';

        var mapTitle = 'US Children Blood Lead Levels in ' + selectedYear;

        //var selectedBLL = 'BLL5_9';
        var filteredData = BLL.filter(function (d) {
            return d.year == selectedYear;
        });
        console.log(filteredData, 'filtered data');

        var colorScale = d3
            .scaleLog()
            .domain(d3.extent(filteredData, function (d) {
                return d.BLL5_9;
            })
            )
            .range([d3.rgb('#ffe0dd'), d3.rgb('#870900')]);

        // map outline
        g
            .selectAll('path')
            .data(geojson.features)
            .enter()
            .append('path')
            .attr('d', geoPath)
            .style('fill', function (d) {
                if (d.properties.data[selectedYear] && d.properties.data[selectedYear].BLL5_9) {
                    return colorScale(d.properties.data[selectedYear].BLL5_9);
                }
                else { return 'lightgrey'; }
            })
            .style('stroke', 'black')
            .style('stroke-width', 0.5);

        // map title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-family', 'Calibri')
            .style('font-size', 48)
            .style('font-weight', 'bold')
            .text(mapTitle);

        //programmatically change with transition
        d3.select('#myYear').on('input', function () {
            updateYear(+this.value);
        });

        updateYear('2014');

        function updateYear(myYear) {
            d3.select("#myYear").property("value", myYear);
            d3.select("#myYear-label").text(myYear);
            var selectedYear = myYear
        }
    }
}

buildMap('#map-holder');