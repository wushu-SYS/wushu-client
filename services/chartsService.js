app.service('chartsService', function ($window, $http, constants) {
    this.pieCharts = function (title) {
        return {
            chart: {
                type: 'pieChart',
                width: 450,
                height: 450,
                margin: {
                    right: 100
                },
                x: function (d) {
                    return d.key;
                },
                y: function (d) {
                    return d.y;
                },
                showLabels: true,
                duration: 400,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    updateState: false
                },
                legendPosition: 'bottom'

            },
            title: {
                enable: true,
                text: title
            }
        };
    }
    this.scatterChart = function (title, subTitle, xLabel, yLabel, forceX1, forceX2) {
        return {
            chart: {
                type: 'scatterChart',
                width: 550,
                height: 350,
                margin: {
                    right: 100
                },
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: false
                },
                showDistX: true,
                showDistY: true,
                tooltip: {
                    headerEnabled: true
                },
                tooltipContent: function (key) {
                    return '<h3>' + key + '</h3>';
                },
                forceX: [forceX1, forceX2],
                forceY: [0, 10],
                duration: 350,
                pointRange: [100, 100],
                showValues: true,
                xAxis: {
                    axisLabel: xLabel,
                    tickFormat: function (d) {
                        d = new Date(d)
                        return d.toLocaleString("he-IL", {dateStyle: "short"})
                    },
                    showMaxMin: true

                },
                yAxis: {
                    axisLabel: yLabel,
                    axisLabelDistance: -10,
                    tickFormat: function (d) {
                        return d3.format('.02f')(d);
                    },
                    showMaxMin: false,
                    ticks: 10,
                    axisLabelDistance: -5
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
            title: {
                enable: true,
                text: title
            },
            subtitle: {
                enable: true,
                text: subTitle
            }
        }

    }

    this.barChart = function (title, subTitle, xLabel, yLabel,forceX1,forceX2) {
        return {
            chart: {
                type: 'multiBarChart',
                height: 450,
                width :550,
                margin: {
                    right: 100,
                },
                clipEdge: true,
                duration: 500,
                stacked: false,
                showControls: false,
                forceY:[0,10],
                forceX: [forceX1, forceX2],
                xAxis: {
                    axisLabel: xLabel,
                    tickFormat: function (d) {
                        d = new Date(d)
                        return d.toLocaleString("he-IL", {dateStyle: "short"})
                    },
                    showMaxMin: true

                },
                yAxis: {
                    axisLabel: yLabel,
                    axisLabelDistance: -20,
                    tickFormat: function (d) {
                        return d3.format(',.1f')(d);
                    }
                }
            },
            title: {
                enable: true,
                text: title
            },
            subtitle: {
                enable: true,
                text: subTitle
            }
        };

    }
});
