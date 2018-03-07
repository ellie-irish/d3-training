function buildChart(containerId) {
    // size globals
    var width = 500;
    var height = 700;

    var margin = {
        top: 100,
        right: 50,
        bottom: 100,
        left: 200
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
    var barChart = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // read BLLs_data.csv 
        d3.csv('BLLs_data.csv', function(error, data) {
            readinError(error, 'failed to read children BLL data');
            console.log(data, 'raw data');
                
            BLL = cleanData(data);
            console.log(BLL, 'clean data')
            drawBar(BLL, '2014');
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
                    BLL5_9: parseInt(d['BLL 5 to 9'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL10_14: parseInt(d['BLL 10 to 14'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL15_19: parseInt(d['BLL 15 to 19'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL20_24: parseInt(d['BLL 20 to 24'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL25_44: parseInt(d['BLL 25 to 44'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL45_69: parseInt(d['BLL 45 to 69'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100,
                    BLL70: parseInt(d['BLL greater or equal to 70'].replace(/,/g, '')) / parseInt(d['# of Children Tested'].replace(/,/g, '')) * 100
                };
            })
    }

    function drawBar(BLL, selectedYear) {
        
        //var selectedBLL = 'BLL5_9';
        var filteredData = BLL.filter(function(d) {
            return d.year == selectedYear;
        })[0];

        barData = d3.entries(filteredData).filter(function (d) {
            return d.key.substr(0, 3) == 'BLL';
        })

        console.log(barData, 'filtered bar data');

        // scales
        var x = d3
            .scaleBand()
            .domain(
                barData.map(function(d) {
                    return d.key;
                })
            )
            .range([0, innerWidth])
            .padding(0.2);

        console.log(x.domain());

        var y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(barData, function(d) {
                    return d.value;
                })
            ])
            .range([innerHeight, 0]);

        console.log(y.domain(), y.range());

        // axes
        var xAxis = d3.axisBottom(x);

        barChart
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);

        var yAxis = d3.axisLeft(y).ticks(15);

        barChart
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);

        // bars
       var bars = barChart
            .selectAll('.bar')
            .data(barData)

       colors = [d3.rgb('#ADD8E6'), d3.rgb('#87CEEB'), d3.rgb('#00BFFF'), d3.rgb('#4169E1'), d3.rgb('#0000FF'), d3.rgb('#00008B'), d3.rgb('#191970')]

       bars
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) {
                return x(d.key);
            })
            .attr('y', function(d) {
                return y(d.value);
            })
            .attr('width', x.bandwidth())
            .attr('height', function(d) {
                return innerHeight - y(d.value);
            })
            .attr("fill", function(d) {
                if (d.key == 'BLL5_9') {
                    return colors[0];
                } else if (d.key == 'BLL10_14') {
                    return colors[1];
                } else if (d.key == "BLL15_19") {
                    return colors[2];
                } else if (d.key == "BLL20_24") {
                    return colors[3];
                } else if (d.key == "BLL25_44") {
                    return colors[4];
                } else if (d.key == "BLL45_69") {
                    return colors[5];
                } else if (d.key == "BLL70") {
                    return colors[6];
                }
              })
           .attr('stroke', 'grey');

       bars
           .attr('x', function (d) {
               return x(d.key);
           })
           .attr('y', function (d) {
               return y(d.value);
           })
           .attr('width', x.bandwidth())
           .attr('height', function (d) {
               return innerHeight - y(d.value);
           })
           .attr("fill", function(d) {
                if (d.key == 'BLL5_9') {
                    return colors[0];
                } else if (d.key == 'BLL10_14') {
                    return colors[1];
                } else if (d.key == "BLL15_19") {
                    return colors[2];
                } else if (d.key == "BLL20_24") {
                    return colors[3];
                } else if (d.key == "BLL25_44") {
                    return colors[4];
                } else if (d.key == "BLL45_69") {
                    return colors[5];
                } else if (d.key == "BLL70") {
                    return colors[6];
                }
              })
           .attr('stroke', 'grey');

        // axis labels
        var barxAxis = barChart.selectAll('.x-axis-label');

        barxAxis
           .enter()
           .append('text')
            .attr('class', 'bar-x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .style('font-family', 'Calibri')
            .style('font-size', 26)
               .text('log[Blood Lead Level (ug/dl)]');

        barxAxis
           .text('log[Blood Lead Level (ug/dl)]');

        var baryAxis = barChart.selectAll('.y-axis-label');
        baryAxis
            .enter()
            .append('text')
            .attr('class', 'bar-y-axis-label')
            .attr('x', -50)
            .attr('y', innerHeight / 2)
            .attr('transform', 'rotate(-90,-50,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-family', 'Calibri')
            .style('font-size', 26)
            .text('% of Children Tested in US');
        
        baryAxis
            .text('% of Children Tested in US')
            

        // title
        var barTitle = '% of Children with Specific BLL in ' + selectedYear;
        
        var myBartitle = barChart.selectAll('.bar-title').data([barTitle]);
        
        myBartitle
            .enter()    
            .append('text')
            .attr('class', 'bar-title')
            .attr('x', innerWidth / 2)
            .attr('y', -60)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-family', 'Calibri')
            .style('font-size', 48)
            .style('font-weight', 'bold')
            .text(barTitle);
        
        myBartitle
            .text(barTitle);

        //programmatically change with transition
        d3.select('#myYear').on('input', function () {
            updateYear(+this.value);
        });


        function updateYear(selectedYear) {
            drawBar(BLL, selectedYear);
        }

        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
            focus.select("text").text(formatCurrency(d.close));
        }
    }
}

buildChart('#first-level-holder');
