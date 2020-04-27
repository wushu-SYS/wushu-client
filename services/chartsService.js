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
                legend: {},
                legendPosition:'bottom'

            },
            title: {
                enable: true,
                text: title
            }
        };
    }
});
