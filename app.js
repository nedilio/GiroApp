(function () {
    'use strict';
    angular.module("CyclingModule", [])
        .controller('CyclingController', CyclingController)
        .service('CyclingService', CyclingService)
        .filter('secondsToTime', secondsToTime);

    CyclingController.$injector = ['CyclingService']

    function CyclingController(CyclingService) {
        var list = this;
        list.cyclist = [];
        CyclingService.getData()
            .then(function (result) {
                list.cyclist = result;
                for (var i = 0; i < list.cyclist.length; i++) {
                    var etapas = list.cyclist[i].accumulated_times.length;
                    var finalTime = list.cyclist[i].accumulated_times[etapas - 1];
                    list.cyclist[i].total_time = finalTime;
                };
                list.order = "ID";
            });
        list.finishers = [];
        list.finishOrder = function () {
            for (var i = 0; i < list.cyclist.length; i++) {
                if (list.cyclist[i].accumulated_times.length == 21) {
                    list.finishers.push(list.cyclist[i]);
                    console.log(list.finishers[i]);
                }
            }
            list.cyclist = list.finishers;
            list.order = "total_time";

        };

    };

    CyclingService.$injector = ['$http'];

    function CyclingService($http) {
        var service = this;
        service.getData = function () {
            return $http({
                    method: "GET",
                    //                                        url: 'data/riders_giro.json'
                    //                    url: 'data/domenico.json'
                    url: 'data/rider_results2016.json'
                })
                .then(function (result) {
                    var allItems = result.data;
                    return allItems;
                    //                return console.log(allItems);
                })
        };

    };

    function secondsToTime() {

        function padTime(t) {
            return t < 10 ? "0" + t : t;
        }

        return function (_seconds) {
            if (typeof _seconds !== "number" || _seconds < 0)
                return "00:00:00";

            var hours = Math.floor(_seconds / 3600),
                minutes = Math.floor((_seconds % 3600) / 60),
                seconds = Math.floor(_seconds % 60);

            return padTime(hours) + ":" + padTime(minutes) + ":" + padTime(seconds);
        };
    }
})();
