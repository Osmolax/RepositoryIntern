angular.module('starter.controllers', [])



.controller('AppCrtl', function ($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
    $scope.$on(AUTH_EVENTS.notAuthentificated, function (event) {
       AuthService.logout();
       $state.go('tab.dash');
       var alertPopup = $ionicPopup.alert({
         title: 'End Session',
         template: 'You have to login again'
       });
    });
})


//controller of the login page
.controller('loginCrtl', function ($scope, AuthService, $ionicPopup, $state) {
    //initier les params vide
    $scope.user = {
        login: '',
        passwrd: ''
      };

    //methode login qui fait appel au service
    $scope.login = function () {
            AuthService.login($scope.user).then(function (msg) {
            $state.go('menu.inside');
        }, function (errMsg) {
              var alertPopup = $ionicPopup.alert({
                title: 'Login failed',
                template: errMsg
              });
              alertPopup.then(function (res) {
                  console.log('Invalide login or password');
              });
            });

    };
})


.controller('menuCrtl',function ($scope, AuthService, API_ENDPOINT, $http, $state, $ionicPopup, $location) {
    $http.get(API_ENDPOINT.url+'/member').then(function (result) {
        $scope.member_info = result.data.user;
        //console.log($scope.membreInfo);
    });

    $scope.check_offers = function () {
        $state.go('menu.member_offer');

    }

    $scope.logout = function () {
        AuthService.logout();
        $state.go('tab.dash');
    };

    $scope.showPopupAddOffer = function () {
        var myPopup = $ionicPopup.show({
            template: '<input type="text" placeholder="">',
            title: 'Add new Offer',
            buttons:[{
                text: 'Cancel'
            }]
        })
    }

    $scope.go = function ( path ) {
        $location.path( path );
    };

})

.controller('InsideCrtl', function ($scope , AuthService, API_ENDPOINT, $http, $state, $ionicPopup) {
  //to destroy the session (destroy the token)
              $scope.destroySession = function () {
                    AuthService.logout();
                };


                $http.get(API_ENDPOINT.url+'/member').then(function (result) {
                    $scope.member_info = result.data.user;
                    //console.log($scope.membreInfo);
                });


                //return the info of the user from the REST api
                $scope.getInfo = function () {
                    $http.get(API_ENDPOINT.url+'/member').then(function (result) {
                        $scope.membreInfo = result.data.message;
                    });
                }

    })

.controller('MapsCtrl', function($scope, $ionicLoading) {
    google.maps.event.addDomListener(window, 'load', function() {

        var LatLingTechnopolice = {lat: 33.981979, lng: -6.726336};

        navigator.geolocation.getCurrentPosition(function(pos) {
            //33.993207, -6.721752
            var latLng = new google.maps.LatLng(33.993207,-6.721752);
            var marker = new google.maps.Marker({
                position: LatLingTechnopolice
            });
            var mapOptions = {
                center: latLng,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;
            directionsDisplay.setMap(map);
            DisplayRoute(directionsService, directionsDisplay);
            function DisplayRoute(directionsService,directionsDisplay) {
                directionsService.route({
                    origin: 'kenitra',
                    destination: 'rabat',
                    travelMode: 'DRIVING'
                },function (response, status) {
                    if (status == 'OK'){
                        directionsDisplay.setDirections(response);
                    }else {
                        window.alert('Error'+ status);
                    }
                });
            }

            marker.setMap(map);
            $scope.map = map;
        });
    })
})


