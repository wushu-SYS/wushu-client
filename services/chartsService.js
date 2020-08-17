/**
 * This service builds the options charts parameter
 */
app.service('chartsService', function ($window, $http, constants) {
    /**
     * builds options for pie chart
     * @param title - main title for the chart
     * @return {{title: {enable: boolean, text: *}, chart: {duration: number, margin: {right: number}, showLabels: boolean, labelThreshold: number, legend: {updateState: boolean}, width: number, x: (function(*): *), y: (function(*): *), labelSunbeamLayout: boolean, legendPosition: string, type: string, height: number}}}
     */
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

    /**
     * builds options for scatter chart
     * @param title - main title of the chart
     * @param subTitle - sub title of the chart
     * @param xLabel - label name for x axis
     * @param yLabel - label name for y axis
     * @param forceX1 - value range for x axis
     * @param forceX2 - value range for y axis
     * @return {{subtitle: {enable: boolean, text: *}, title: {enable: boolean, text: *}, chart: {margin: {right: number}, showValues: boolean, xAxis: {axisLabel: *, tickFormat: (function(*=): string), showMaxMin: boolean}, color: (void|*), tooltip: {headerEnabled: boolean}, zoom: {scaleExtent: number[], verticalOff: boolean, unzoomEventType: string, useNiceScale: boolean, useFixedDomain: boolean, horizontalOff: boolean, enabled: boolean}, tooltipContent: (function(*): string), type: string, duration: number, forceY: number[], forceX: [*, *], yAxis: {axisLabel: *, ticks: number, tickFormat: (function(*=): *), axisLabelDistance: number, showMaxMin: boolean}, pointRange: number[], scatter: {onlyCircles: boolean}, width: number, showDistX: boolean, showDistY: boolean, height: number}}}
     */
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

    /**
     * buils options for bar chart
     * @param title - main title of the chart
     * @param subTitle - sub title of the chart
     * @param xLabel - label name of x axis
     * @param yLabel - label name of y axis
     * @param forceX1 - value range for x axis
     * @param forceX2 - value range for y axis
     * @return {{subtitle: {enable: boolean, text: *}, title: {enable: boolean, text: *}, chart: {clipEdge: boolean, duration: number, forceY: number[], margin: {right: number}, forceX: [*, *], yAxis: {axisLabel: *, tickFormat: (function(*=): *), axisLabelDistance: number}, stacked: boolean, xAxis: {axisLabel: *, tickFormat: (function(*=): string), showMaxMin: boolean}, width: number, type: string, showControls: boolean, height: number}}}
     */
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
