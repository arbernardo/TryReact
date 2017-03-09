/**
 * Created by j.lastrilla on 2/2/2017.
 */
var React = require('react');
var ReactDOM = require('react-dom');
import * as d3 from 'd3';

import {Bar, Pie, Line, Area} from './Charts';
import limitSort from './LimitSort';

var _month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    _quarter = ['1st', '2nd', '3rd', '4th'];

var _aliases = {
    r: 'rev', i: 'inv', f: 'fra', t: 'xmp', s: 'sta',
    st: 'stored', rg: 'registered', as: 'assessed', pa: 'paid', ex: 'exited', rl: 'released'
};
var LabelParser = function (prd) {
    var _prd = prd;
    var parser = function (val) {
        var _split = val.split(' '), label;
        if (_prd == 'daily') {
            label = _month[parseInt(_split[1]) - 1] + ' ' + _split[0] + ', ' + _split[2];
        } else if (_prd == 'monthly') {
            label = _month[parseInt(_split[0]) - 1] + ' ' + _split[1]
        } else if (_prd == 'quarterly') {
            label = _quarter[parseInt(_split[0]) - 1] + ' ' + _split[1]
        } else if (_prd == "yearly") {
            label = val;
        }
        return label;
    }
    return parser;
}

/**
 * Determines of the given ordinate is amount
 *
 * @param ordinate
 * @returns {parser}
 */
var OrdinateParser = function (ordinate) {
    var _ordinate = ordinate;

    var parser = function () {
        var temp;
        switch (_ordinate) {
            case 'r': case 'i': case 'f':
            case 't': case 's': temp = true; break;
            //its periodicity
            default: temp = false; break;
        }

        return temp;
    };

    return parser;
};

var Parse = function (data, name) {
    return data.map(function (d) {
        var alias = _aliases[name]
        var newVal = d[alias];
        return {
            key: d.key,
            value: +newVal
        };
    });
}

var PieComponent = React.createClass({
    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        xTitle: React.PropTypes.string,
        yTitle: React.PropTypes.string,
        context: React.PropTypes.object,
        data: React.PropTypes.array,
        dep: React.PropTypes.string,
        sortLimit: React.PropTypes.string,
        regime: React.PropTypes.array
    },
    componentWillMount: function () {
        this.data = limitSort(this.props.data,this.props);
        this.pie = Pie();
    },
    componentDidMount: function () {
        this.update();
    },
    componentWillReceiveProps: function (props) {
        this.data = limitSort(this.props.data,props);
        this.props = props;
        this.update();
    },
	componentWillUpdate: function (nextProps) {
        this.data = limitSort(nextProps.data,nextProps);
        this.props = nextProps;
        this.update();
    },
    update() {
        var el = this.root.querySelector('.chart svg');
        if (el) {
            el.remove();
        }
        var i = 0, other = 0;
        var data = this.data = Parse(this.data, this.props.dep)
            .sort(function (a,b) {
                return b.value - a.value;
            }).map(function(e) {
                if(i<5) {
                    i = i+1;
                return e;
                } else {
                    other+=e.value;
                }
            }).filter(function(element) {
                return element != undefined;
            });

        // TODO: incase they want to present others
        // data.push({key: 'Other', value: other});

        var pie_chart = this.pie
            .width(this.props.width)
            .height(this.props.height)
            .xTitle(this.props.xTitle)
            .yTitle(this.props.yTitle);
        pie_chart(this.root, data);
    },
    componentWillReceiveProps: function (props) {
        this.props = props;
        this.update();
    },
    render: function () {
        return (<div className='chart' ref={(node) => {
            this.root = node;
        }}/>);
    }
});

var BarComponent = React.createClass({
    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        xTitle: React.PropTypes.string,
        yTitle: React.PropTypes.string,
        context: React.PropTypes.object,
        data: React.PropTypes.array,
        dep: React.PropTypes.string,
        sortLimit : React.PropTypes.string,
        regime: React.PropTypes.array
    },
    componentWillMount: function () {
        this.data = limitSort(this.props.data,this.props);
        this.bar = Bar();
    },
    componentDidMount: function () {
        this.update();
    },
    componentWillReceiveProps: function (props) {
        this.data = limitSort(this.props.data,props);
        this.props = props;
        this.update();
    },
    componentWillUpdate: function (nextProps) {
        this.data = limitSort(nextProps.data,nextProps);
        this.props = nextProps;
        this.update();
    },
    update: function () {
        var el = this.root.querySelector('.chart svg');
        if (el) {
            el.remove();
        }

        var props = this.props;

        var data = Parse(this.data, this.props.dep)
            .sort(function (a, b) {
                //for top bottom sort by value
                if(props.sortLimit == 'All' || !props.sortLimit) {
                    return a['key'].localeCompare(b['key']);
                }
            });

        var bar_chart = this.bar
            .width(this.props.width)
            .height(this.props.height)
            .xTitle(this.props.xTitle)
            .yTitle(this.props.yTitle)
            .isOrdinateAmount(OrdinateParser(this.props.dep));

        bar_chart(this.root, data);
    },
    render: function () {
        return (<div className='chart' ref={(node) => {
            this.root = node;
        }}/>);
    }
});

var LineComponent = React.createClass({
    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        xTitle: React.PropTypes.string,
        yTitle: React.PropTypes.string,
        context: React.PropTypes.object,
        data: React.PropTypes.array,
        dep: React.PropTypes.string,
        prd: React.PropTypes.string,
        sortLimit : React.PropTypes.string
    },
    componentWillMount: function () {
        this.data = limitSort(this.props.data,this.props);
        this.line = Line();
    },
    componentDidMount: function () {
        this.update();
    },
    componentWillReceiveProps: function (props) {
        this.data = limitSort(this.props.data,props);
        this.props = props;
        this.update();
    },
    update: function () {
        var el = this.root.querySelector('.chart svg');
        if (el) {
            el.remove();
        }
        var data = Parse(this.data, this.props.dep);
        var parseTime = d3.timeParse("%d %m %Y");

        //convert the keys to format that can be sorted.
        data = data.map((d)=> {
            var text = d.key, temp = {};
            switch (this.props.prd) {
                case 'daily':
                    temp.key = [+parseTime(d.key).getTime(), text];
                    temp.value = d.value;
                    break;
                case 'yearly':
                    temp.key = [+parseInt(d.key), text];
                    temp.value = d.value;
                    break;
                case 'monthly':
                    var parts = d.key.split(' '),
                        month = parseInt(parts[0]),
                        year = parseInt(parts[1]);
                    temp.key = [+year + (+month / 12), text];
                    temp.value = d.value;
                    break;
                case 'quarterly':
                    var parts = d.key.split(' '),
                        quarter = parseInt(parts[0]),
                        year = parseInt(parts[1]);
                    temp.key = [year + (quarter / 4), text];
                    temp.value = d.value;
                    break;
            }
            return temp;
        });

        console.log("the data");
        console.log(data);

        var line_chart = this.line
            .width(this.props.width)
            .height(this.props.height)
            .xTitle(this.props.xTitle)
            .yTitle(this.props.yTitle)
            .xLabelParser(LabelParser(this.props.prd))
            .isOrdinateAmount(OrdinateParser(this.props.dep));

        line_chart(this.root, data);
    },
    render: function () {
        return (<div className='chart' ref={(node) => {
            this.root = node;
        }}/>);
    }
});

var AreaComponent = React.createClass({
    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        xTitle: React.PropTypes.string,
        yTitle: React.PropTypes.string,
        context: React.PropTypes.object,
        data: React.PropTypes.array,
        dep: React.PropTypes.string,
        prd: React.PropTypes.string,
        sortLimit : React.PropTypes.string,
        regime: React.PropTypes.array
    },
    componentWillMount: function () {
        this.data = limitSort(this.props.data,this.props);
        this.area = Area();
    },
    componentDidMount: function () {
        this.update();
    },
    componentWillReceiveProps: function (props) {
        this.data = limitSort(this.props.data,props);
        this.props = props;
        this.update();
    },
    update: function(){
        var el = this.root.querySelector('.chart svg'),
            _prd = this.props.prd,
            _dep = this.props.dep,
            parseTime = d3.timeParse("%d %m %Y"),
            _label = LabelParser(_prd);
        if (el) {
            el.remove();
        }
        var data = this.data.map(function (d) {
            var _values = {},
                text = d.key,
                alias = _aliases[_dep];
            //map present values.
            Object.keys(d).forEach((_key)=>{
                if (!['key', 'count','countStored'
                        ,'countRegistered','countAssessed'
                        ,'countPaid','countExited','countReleased'
                    ].includes(_key)) {
                    var _val = d[_key];
                    //zero is not accepted, explicit nullcheck will
                    // be used since zero is still used in the charts
                    if(_val != null){
                        _values[_key] = _val;
                    }
                }
            });
            switch (_prd) {
                case 'daily':
                    _values.key = [+parseTime(d.key), text];
                    break;
                case 'yearly':
                    _values.key = [+parseInt(d.key), text];
                    break;
                case 'monthly':
                    var parts = d.key.split(' '),
                        month = parseInt(parts[0]),
                        year = parseInt(parts[1]);
                    _values.key = [+year + (+month / 12), text];
                    break;
                case 'quarterly':
                    var parts = d.key.split(' '),
                        quarter = parseInt(parts[0]),
                        year = parseInt(parts[1]);
                    _values.key = [year + (quarter / 4), text];
                    break;
            }
            return _values;
        }).sort(function(a, b){ return a.x - b.x;});
        var area = this.area
            .width(this.props.width)
            .height(this.props.height)
            .xTitle(this.props.xTitle)
            .yTitle(this.props.yTitle)
            .xLabelParser(_label)
            .isOrdinateAmount(OrdinateParser(this.props.dep));
        area(this.root, data);
    },
    render: function(){
        return (<div className='chart' ref={(node) => {
            this.root = node;
        }}/>);
    }
});
module.exports = {
    Pie: PieComponent,
    Bar: BarComponent,
    Line: LineComponent,
    Area: AreaComponent
}