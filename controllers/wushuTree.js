app.controller("wushuTree", function ($scope, $http, constants, chartsService, chartsDataService) {
    chartsDataService.wushuTreeData()
        .then((res) => {
            console.log(res)
            let childrenClubLevel = [];
            res.data.forEach((record) => {
                let childrenCoachLevel = [];
                record.data.forEach((coachSportsman) => {
                    let childrenSportsmanLevel = [];
                    coachSportsman.sportsman.forEach(sportsman => {
                        childrenSportsmanLevel.push({
                            text: {
                                name: sportsman.sportsmanFirstName + " " + sportsman.sportsmanLastName,
                                title: "ספורטאי",
                                contact: {
                                    val: "צפה בפרופיל",
                                    href: "#!/profile/sportsmanProfile/" + sportsman.sportsmanId,
                                    target: "_self"
                                }
                            },
                            image: sportsman.sportsmanPhoto
                        })
                    })
                    childrenCoachLevel.push({
                        text: {
                            name: coachSportsman.coach.firstName + " " + coachSportsman.coach.lastName,
                            title: "מאמן",
                            contact: {
                                val: "צפה בפרופיל",
                                href: "#!/profile/coachProfile/" + coachSportsman.coach.id,
                                target: "_self",
                            }
                        },
                        image: coachSportsman.coach.photo,
                        stackChildren: true,
                        children: childrenSportsmanLevel
                    })
                })
                childrenClubLevel.push({
                    text: {
                        name: record.club.name,
                        title: "מועדון",
                        contact: {
                            val: "צפה בפרופיל",
                            href: "#!/sportClubs/clubProfile/" + record.club.id,
                            target: "_self",
                        }
                    },
                    image: "././resources/images/symbol.jpg",
                    stackChildren: true,
                    children: childrenCoachLevel
                })
            });
            $scope.chart_config = {
                chart: {
                    container: "#basic-example",
                    connectors: {
                        type: 'step'
                    },
                    node: {
                        HTMLclass: 'nodeExample1'
                    }
                },
                nodeStructure: {
                    text: {
                        name: "התאחדות או-שו"
                    },
                    image: "./resources/images/icon.png",
                    children: childrenClubLevel
                }
            }
            new Treant($scope.chart_config)
        }).catch((err) => {
        console.log(err)
    })
});
