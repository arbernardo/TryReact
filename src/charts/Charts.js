/**
 * Created by j.lastrilla on 2/2/2017.
 */
import * as d3 from 'd3';
import legend from 'd3-svg-legend';
import d3tip from 'd3-tip';

/*bar chart renderer*/
var BarChart = function () {
    var _width,
        _height,
        _xTitle = 'X',
        _yTitle = 'Y Title',
        _xScale = d3.scaleBand(),
        _yScale = d3.scaleLinear(),
        _isAmount = function (val) {
            return val;
        },
        margin = {
            left: 50,
            bottom: 30,
            top: 20,
            right: 20
        };
    var chart = function (selection, data) {
        var svg = d3.select(selection).append('svg')
            .attr('width', _width)
            .attr('height', _height);

        var height = _height - (margin.top + margin.bottom),
            width = _width - (margin.left + margin.right);
        var g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var x = _xScale.rangeRound([0, width]).padding(0.1);
        var y = _yScale.rangeRound([height, 0]);


        x.domain(data.map(function (d) {
            return d.key;
        }));
        y.domain([0, d3.max(data, function (d) {
            return +d.value;
        })]);

        g.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + height + ')')
            .call(d3.axisBottom(x));

        var format = d3.format(".2s");
        g.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y).tickFormat((d)=> {
                    if(_isAmount(d)) {
                        return format(d).replace("G", "B");
                    } else {
                        return d;
                    }
                }
            ))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height/2))
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text(_yTitle);
        var tip = d3tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                var abscissa = _xTitle;
                var ordinate = _yTitle;
                var currency = "";
                return abscissa + ": " + d.key + "<br/>" + ordinate + ": "+currency+" "+d.value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            });

        g.call(tip);

        var bar = g.selectAll("rect")
            .data(data)
            .enter();

        bar.append("rect")
            .attr("class", "bar")
            .attr('fill', 'steelblue')
            .attr("x", function (d) {
                return x(d.key);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)
            .on("mousemove", function (d) {
                return tip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10 ) + "px");
            });

        //TODO: apply to all for the mean time
        if(true || data.length <= 10) {
            format = d3.format(".3s");
            //TODO: for label value on top of bar chart.
            bar.append("text")
                .attr("class","text")
                .attr("x",function (d) {
                    return  x(d.key) + (x.bandwidth()/2) - 20;
                })
                .attr("y",function (d) {
                    return y(d.value) - 10;
                })
                .attr("dy",".35em")
                .text(function (d) {
                    if(_isAmount(d)) {
                        return format(d.value).replace("G", "B");
                    } else {
                        return d.value;
                    }
                });
        }
    }

    chart.width = function (value) {
        if (!arguments.length) return _width;
        _width = value;
        return chart;
    }
    chart.height = function (value) {
        if (!arguments.length) return _height;
        _height = value;
        return chart;
    }
    chart.xTitle = function (value) {
        if (!arguments.length) return _xTitle;
        _xTitle = value;
        return chart;
    }
    chart.yTitle = function (value) {
        if (!arguments.length) return _yTitle;
        _yTitle = value;
        return chart;
    }
    chart.xScale = function (value) {
        if (!arguments.length) return _xScale;
        _xScale = value;
        return chart;
    }
    chart.isOrdinateAmount = function (value) {
        if (!arguments.length) return _isAmount;
        _isAmount = value;
        return chart;
    }
    return chart;
}

/*pie chart renderer*/
var PieChart = function () {
    var _width,
        _height,
        _xTitle = 'X',
        _yTitle = 'Y',
        _fill = 'green',
        _margin = {
            left: 50,
            bottom: 30,
            top: 20,
            right: 20
        },
        _scale = d3.scaleOrdinal;
    var chart = function (selection, data) {
        var color = _scale(d3.schemeCategory20b)
            .range(["#593C97", "#47AB5B", "#F9B565", "#8C75B5", "#96C69F", "#A5D4F3"]);;
        var radius = Math.min(_width, _height) / 2;
        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0)
        var labelArc = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        var pie = d3.pie()
            .sort(function (a, b) {
                return b.value - a.value;
            })
            .value(function (d) {
                return +d.value;
            });

        var svg = d3.select(selection).append('svg')
            .attr('width', _width)
            .attr('height', _height)
            .append('g')
            .attr('transform', 'translate(' + _width / 2 + ' ,' + _height / 2 + ' )');

        var g = svg.selectAll('.arc')
            .data(pie(data))
            .enter().append('g')
            .attr('class', 'arc');
        g.append('path')
            .attr('d', arc)
            .style('fill', function (d) {
                return color(d.data.key)
            });
        g.append('text')
            .attr('transform', function (d) {
                return 'translate(' + labelArc.centroid(d) + ')';
            })
            .attr('dy', '35.em')
            .text(function (d) {
                // return d.data.value;
            });

        svg.append("g")
            .attr("class", "legendLinear")
            .attr("transform", 'translate('+ _width / 4+', '+ -150 +')');

        var legendLinear = legend.legendColor()
            .scale(color)
            .orient('vertical')
            .shapeWidth(30);


        svg.select(".legendLinear")
            .call(legendLinear);
    }
    chart.width = function (value) {
        if (!arguments.length) return _width;
        _width = value;
        return chart;
    }
    chart.height = function (value) {
        if (!arguments.length) return _height;
        _height = value;
        return chart;
    }
    chart.xTitle = function (value) {
        if (!arguments.length) return _xTitle;
        _xTitle = value;
        return chart;
    }
    chart.yTitle = function (value) {
        if (!arguments.length) return _xTitle;
        _yTitle = value;
        return chart;
    }
    chart.margin = function (value) {
        if (!arguments.length) return _margin;
        _margin = value;
        return chart;
    }
    return chart;
}

var LineChart = function () {
    var _width,
        _height,
        _xTitle = 'X',
        _yTitle = 'Y Title',
        _xScale = d3.scalePoint(),
        _yScale = d3.scaleLinear(),
        margin = {
            left: 80,
            bottom: 30,
            top: 20,
            right: 20
        },
        _xLabelParser = function (val) {
            return val;
        },
        _isAmount = function (val) {
            return val;
        };
    var chart = function (selection, data) {
        var svg = d3.select(selection).append('svg')
            .attr('width', _width)
            .attr('height', _height);

        var height = _height - (margin.top + margin.bottom),
            width = _width - (margin.left + margin.right);

        var x = _xScale.range([0, width]),
            y = _yScale.rangeRound([height, 0]);

        //sort the data
        data.sort((a, b)=> {
            return a.key[0] - b.key[0];
        });
        //prepare for chart creation
        var _data = data.map((d)=> {
            return {
                key: d.key[1],
                value: +d.value
            };
        });
        var line = d3.line()
            .x((d)=> {
                return x(d.key);
            })
            .y((d)=> {
                return y(d.value);
            });

        x.domain(_data.map((d)=> {
            return d.key
        }));
        y.domain(d3.extent(_data, (d)=> {
            return d.value
        }));

        var g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        g.append('g')
            .attr('transform', 'translate(0, ' + height + ')')
            .call(d3.axisBottom(x).tickFormat((d)=> {
                return _xLabelParser(d);
            }))
            .select('.domain');

        var format = d3.format(".2s");
        g.append("g")
            .call(d3.axisLeft(y).tickFormat((d)=> {
                    if(_isAmount(d)) {
                        return format(d).replace("G", "B");
                    } else {
                        return format(d);
                    }
                }
            ))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height/2))
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text(_yTitle);

        g.append("path")
            .datum(_data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        var tip = d3tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                var abscissa = _xTitle;
                var ordinate = _yTitle;
                var currency = "";
                return abscissa + ": " + _xLabelParser(d.key) + "<br/>" + ordinate + ": "+currency+" "+d.value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            });

        g.call(tip);

        g.selectAll(".dot")
            .data(_data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function (d) {
                return x(d['key']);
            })
            .attr("cy", function (d) {
                return y(d['value']);
            })
            .style("fill", function (d) {
                return "#578ebe"
            })
            .on("mouseover", function (d) {
                tip.show(d)
            })
            .on("mousemove", function (d) {
                return tip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10 ) + "px");
            })
            .on("mouseout", function (d) {
                tip.hide(d)
            });

    }
    chart.width = function (value) {
        if (!arguments.length) return _width;
        _width = value;
        return chart;
    }
    chart.height = function (value) {
        if (!arguments.length) return _height;
        _height = value;
        return chart;
    }
    chart.xTitle = function (value) {
        if (!arguments.length) return _xTitle;
        _xTitle = value;
        return chart;
    }
    chart.yTitle = function (value) {
        if (!arguments.length) return _yTitle;
        _yTitle = value;
        return chart;
    }
    chart.xScale = function (value) {
        if (!arguments.length) return _xScale;
        _xScale = value;
        return chart;
    }
    chart.xLabelParser = function (value) {
        if (!arguments.length) return _xLabelParser;
        _xLabelParser = value;
        return chart;
    }
    chart.isOrdinateAmount = function (value) {
        if (!arguments.length) return _isAmount;
        _isAmount = value;
        return chart;
    }
    return chart;
}

var AreaChart = function () {
    var _width,
        _height,
        _xTitle = 'X',
        _yTitle = 'Y Title',
        _xScale = d3.scalePoint(),
        _yScale = d3.scaleLinear(),
        margin = {
            left: 60,
            bottom: 30,
            top: 20,
            right: 110
        },
        _xLabelParser = function (val) {
            return val;
        },
        _isAmount = function (val) {
            return val;
        };
    var chart = function (selection, _data) {
        var svg = d3.select(selection).append('svg')
            .attr('width', _width)
            .attr('height', _height);

        var height = _height - (margin.top + margin.bottom),
            width = _width - (margin.left + margin.right);

        //sort first dirty data
        var data = _data.sort((a, b)=> {
            return a.key[0] - b.key[0];
        }).map((d)=> {
            //then distill the array from the dirty data.
            var _d = {}
            Object.keys(d).forEach(function (_key) {
                if (_key == 'key') {
                    _d.x = d[_key][1];
                } else {
                    _d[_key] = d[_key];
                }
            });
            return _d;
        });
        var keys = d3.keys(data[0]).filter(function (d) {
            return d !== "x";
        });
        var maxYVal = d3.max(data, function (d) {
            var vals = keys.map(function (key) {
                return key !== "x" ? +d[key] : 0
            });
            return d3.sum(vals);
        });
        var x = _xScale
            .range([0, width])
            .domain(data.map(function (d) {
                return d.x;
            }));
        var y = _yScale
            .range([height, 0])
            .domain([0, maxYVal]);
        var z = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(keys);

        var stack = d3.stack()
        stack.keys(d3.keys(data[0]).filter(function (d) {
            return d !== "x";
        }));

        var g = svg.append('g')
            .attr('class', 'area')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var layer = g.selectAll(".layer")
            .data(stack(data))
            .enter().append("g")
            .attr("class", "layer");

        var area = d3.area()
            .x(function (d, i) {
                return x(d.data.x);
            })
            .y0(function (d) {
                return y(d[0]);
            })
            .y1(function (d) {
                return y(d[1]);
            });

        layer.append("path")
            .attr("class", "area")
            .style("fill", function (d) {
                return z(d.key);
            })
            .attr("d", area);

        layer.filter(function (d) {
            return d[d.length - 1][1] - d[d.length - 1][0] > 0.01;
        })
            .append("text")
            .attr("x", width - 6 + 50)
            .attr("y", function (d) {
                return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2);
            })
            .attr("dy", ".35em")
            .style("font", "10px sans-serif")
            .style("text-anchor", "end");
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat((d)=>{
                //temporary implementation for abscissa that is not periodicity in progress
                if(_xLabelParser(d) == 'undefined undefined') {
                    return d;
                } else {
                    return _xLabelParser(d);
                }
            }));

        var format = d3.format(".2s");
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).tickFormat((d)=> {
                if(_isAmount(d)) {
                    return format(d).replace("G", "B");
                } else {
                    return d;
                }
            }))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height/2))
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text(_yTitle);

        g.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate("+(width+10)+", 40)");

        var legendLinear = legend.legendColor()
            .scale(z)
            .orient('vertical')
            .shapeWidth(30);
        g.select(".legendLinear")
            .call(legendLinear);

    }
    chart.width = function (value) {
        if (!arguments.length) return _width;
        _width = value;
        return chart;
    }
    chart.height = function (value) {
        if (!arguments.length) return _height;
        _height = value;
        return chart;
    }
    chart.xTitle = function (value) {
        if (!arguments.length) return _xTitle;
        _xTitle = value;
        return chart;
    }
    chart.yTitle = function (value) {
        if (!arguments.length) return _yTitle;
        _yTitle = value;
        return chart;
    }
    chart.xScale = function (value) {
        if (!arguments.length) return _xScale;
        _xScale = value;
        return chart;
    }
    chart.xLabelParser = function (value) {
        if (!arguments.length) return _xLabelParser;
        _xLabelParser = value;
        return chart;
    }
    chart.isOrdinateAmount = function (value) {
        if (!arguments.length) return _isAmount;
        _isAmount = value;
        return chart;
    }
    return chart;
}

module.exports = {
    Bar: BarChart,
    Pie: PieChart,
    Line: LineChart,
    Area: AreaChart
}