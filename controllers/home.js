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
        var i;
        // var slides = document.getElementsByClassName("mySlides");
        // var dots = document.getElementsByClassName("demo");
        // var captionText = document.getElementById("caption");
        if (n > $scope.images.length) {$scope.slideIndex = 1}
        if (n < 1) {$scope.slideIndex = $scope.images.length}
        // for (i = 0; i < slides.length; i++) {
        //     slides[i].style.display = "none";
        // }
        // for (i = 0; i < dots.length; i++) {
        //     dots[i].className = dots[i].className.replace(" active", "");
        // }
        // slides[slideIndex-1].style.display = "block";
        // dots[slideIndex-1].className += " active";
        // captionText.innerHTML = dots[slideIndex-1].alt;
    }

});
