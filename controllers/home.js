app.controller("homeController", function ($scope, $uibModal, $window, constants, $interval, $timeout, $filter, msgService) {
    $scope.showMessage = msgService.watchMsgDetails;

    $scope.changePassword = function () {
        $uibModal.open({
            templateUrl: "views/modalView/changePasswordModal.html",
            controller: "changePasswordController as changePassCtrl",
            backdrop: 'static',
            keyboard: false
        });
    };
    if ($window.sessionStorage.getItem('isFirstLogin') == 1)
        $scope.changePassword();


    getDisplayData();
    function getDisplayData(){
        msgService.getMessages()
            .then(function (result) {
                $scope.myTickerItems = [];
                result.data.forEach(msg  => {
                    $scope.myTickerItems.push({
                        id: msg.id,
                        text: msg.msg,
                        creationDate: $filter('date')(new Date(msg.createDate), "dd/MM/yyyy")
                    })
                })
            });
    }


    $scope.moving = false;
    $scope.moveLeft = function() {
        $scope.moving = true;
        $timeout($scope.switchFirst, 1000);
    };
    $scope.switchFirst = function() {
        if($scope.myTickerItems && $scope.myTickerItems.length > 0)
            $scope.myTickerItems.push($scope.myTickerItems.shift());
        $scope.moving = false;
        $scope.$apply();
    };
    $interval($scope.moveLeft, 2000);

    $scope.addNewMessage = function (){
        msgService.addNewMessageModal(addNewMessageToBoard)
    }
    function addNewMessageToBoard() {
            getDisplayData()
    }

    $scope.images = [
        {src: "./resources/images/gallery/img1.jpg"},
        {src: "./resources/images/gallery/img2.jpg"},
        {src: "./resources/images/gallery/img3.jpg"},
        {src: "./resources/images/gallery/img4.jpg"},
        {src: "./resources/images/gallery/img5.jpg"},
        {src: "./resources/images/gallery/img6.jpg"},
        {src: "./resources/images/gallery/img7.jpg"},
        {src: "./resources/images/gallery/img8.jpg"},
        {src: "./resources/images/gallery/img9.jpg"},
        {src: "./resources/images/gallery/img10.jpg"},
        {src: "./resources/images/gallery/img11.jpg"},
        {src: "./resources/images/gallery/img12.jpg"},
        {src: "./resources/images/gallery/img13.jpg"},
        {src: "./resources/images/gallery/img14.jpg"},
        {src: "./resources/images/gallery/img15.jpg"},
        {src: "./resources/images/gallery/img16.jpg"},
        {src: "./resources/images/gallery/img17.jpg"},
        {src: "./resources/images/gallery/img18.jpg"},
        {src: "./resources/images/gallery/img19.jpg"},
        {src: "./resources/images/icon.png"},
        ];

    $scope.slideIndex = 1;
    showSlides($scope.slideIndex);

// Next/previous controls
    $scope.plusSlides = function (n) {
        showSlides($scope.slideIndex += n);
    }

// Thumbnail image controls
    $scope.currentSlide = function (n) {
        showSlides($scope.slideIndex = n);
    }

    function showSlides(n) {
        if (n > $scope.images.length) {$scope.slideIndex = 1}
        if (n < 1) {$scope.slideIndex = $scope.images.length}

    }



    //
    // let slideIndex2 = 0;
    // $scope.image =$scope.images[slideIndex2].src
    // showSlides2();
    // let autoSlide = setInterval(showSlides2,2000)
    //
    // function showSlides2() {
    //     $scope.image =$scope.images[slideIndex2].src
    //     console.log($scope.image)
    //     slideIndex2 ++;
    //     if (slideIndex2 ==$scope.images.length)
    //         slideIndex2=0;
    // }
});
