function buildChart(containerId) {
    // size globals
    var width = 2000;
    var height = 1000;

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

    // read BLLs_data.csv 
        d3.csv('BLLs_data.csv', function(error, data) {
            readinError(error, 'failed to read children BLL data');
            console.log(data, 'raw data');
                
            BLL = cleanData(data);
            console.log(BLL, 'clean data')
            drawBar(BLL);
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
            .filter(function(d) {
                return d['State Abb'] == 'Total'
            })
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
            })
        var keys = Object.keys(data);
    }

    function drawBar(BLL) {
        
        var selectedYear = d3.select('#myYear').node().value

        var selectedYear = '2014';
        
        //var selectedBLL = 'BLL5_9';
        var filteredData = BLL.filter(function(d) {
            return d.year == selectedYear;
        });
        console.log(filteredData, 'filtered data');

        // scales
        var x = d3
            .scaleBand()
            .domain(
                BLL.map(function(d) {
                    return d.State;
                })
            )
            .range([0, innerWidth])
            .padding(0.2);

        console.log(x.domain(), x.range());

        var y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(BLL, function(d) {
                    return d.Emissions;
                })
            ])
            .range([innerHeight, 0]);

        console.log(y.domain(), y.range());

        // axes
        var xAxis = d3.axisBottom(x);

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);

        var yAxis = d3.axisLeft(y).ticks(15);

        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);

        // bars
        g
            .selectAll('.bar')
            .data(BLL)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) {
                return x(d.State);
            })
            .attr('y', function(d) {
                return y(d.Emissions);
            })
            .attr('width', x.bandwidth())
            .attr('height', function(d) {
                return innerHeight - y(d.Emissions);
            })
            .attr("fill", function(d) {
                if (d.Region == 'South') {
                  return "red";
                } else if (d.Region == 'Northeast') {
                  return "blue";
                } else if (d.Region == "West") {
                  return "yellow";
                } else if (d.Region == "Midwest") {
                    return "green";
                }
              })
            .attr('stroke', 'none');

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
            .text('% of Children Tested in US');

        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', -50)
            .attr('y', innerHeight / 2)
            .attr('transform', 'rotate(-90,-50,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-family', 'Calibri')
            .style('font-size', 26)
            .text('Blood Lead Level (ug/dl)');
            

        // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-family', 'Calibri')
            .style('font-size', 48)
            .style('font-weight', 'bold')
            .text('Emissions by State');
    }
}

buildChart('#bar-chart-holder');
