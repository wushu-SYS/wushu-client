app.service('chartsService', function ($window, $http, constants) {
    this.pieCharts = function (title) {
        return {
            chart: {
                type: 'pieChart',
                width: 450,
                height: 450,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                duration: 400,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    updateState:false
                },
                legendPosition:'bottom'

            },
            title: {
                enable: true,
                text: title
            }
        };
    }
    this.scatterChart =function (title,subTitle,xLabel,yLabel) {
        return {
            chart: {
                type: 'scatterChart',
                width: 450,
                height: 350,
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: false
                },
                showDistX: true,
                showDistY: true,
                tooltip :{
                    headerEnabled:false
                },
                tooltipContent: function(key) {
                    return '<h3>' + key + '</h3>';
                },
                forceX: [0, 10],
                forceY: [0, 10],
                duration: 350,
                xAxis: {
                    axisLabel: xLabel,
                    tickFormat: function(d){
                        return (d);
                    },
                    showMaxMin:false,
                    ticks:10
                },
                yAxis: {
                    axisLabel: yLabel,
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -5,
                    showMaxMin:false,
                    ticks :10
                },
                zoom: {
                    //NOTE: All attributes below are optional
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: false,
                    unzoomEventType: 'dblclick.zoom'
                }
            },
            title:{
                enable: true,
                text: title
            },
            subtitle:{
                enable: true,
                text: subTitle
            }
        }

    }
});
