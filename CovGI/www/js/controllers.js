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
.controller('memberOfferCrtl', function($scope){
    $scope.deleteItem = function (trajectUser) {
        $scope.trajetsUser.splice($scope.trajetsUser.indexOf(trajectUser), 1);
    };
})
.controller('memberOfferCtrl', function ($scope ,AuthService, API_ENDPOINT, $http) {
    // var data=({"userId": $scope.member_info._id});


    $http.post(API_ENDPOINT.url+'/trajetUser',{'idUser':$scope.member_info._id}).then(function(result){
        console.log(result.data);
        console.log($scope.member_info._id);
        $scope.trajetsUser = result.data;
    });
        $scope.deleteItem = function (trajectUser) {
            $scope.trajetsUser.splice($scope.trajetsUser.indexOf(trajectUser), 1);
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

    $http.get(API_ENDPOINT.url+'/allOffre').then(function (result) {
        console.log('liste des trajets ', result.data);
        $scope.allOffer = result.data;
    });

    //console.log($location.path());
    /*$scope.$on('$stateChangeSuccess'), function(event, toState, toParams, fromState, fromParams){
        console.log('state changed to ', toState);
        if($location.path()=="#/menu/inside"){
            //$scope.refreshItems();
            console.log($location.path());
        }
        console.log($location.path());
    }*/
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

                $http.get(API_ENDPOINT.url+'/allOffre').then(function (result) {
                    console.log('liste des trajets '+ result.data);
                    $scope.allOffer = result.data;
                });


})

.controller('StaticCtrl', function ($scope, $rootScope) {
    $scope.countries = {
        'Salé' : {
            'Salé Ville' : ['CAFE RAMSIS DIAR', 'BAB SABTA', 'BAB CHAAFA', 'SOUNBOULA'],
            'Hay Chmaou/Said Hajji' : ['CENTRAL LAITIERE', 'CAFE ZAYTOUNA','COCA COLA','CAFE IMANE','T13','CAFE IHSANE'],
            'Hay Rahma' : ['CAFE HILTON', 'SUPER'],
            'Tabriket' : ['PHARMACIE IBTISSAM','BMCI','POSTE TABRIQUET','PHARMACIE DAHAB','GARE SALE TABRIKET','RESIDENCE NAKHIL'],
            'Hay Karima' : ['CAFE BOUCHRA'],
            'DOUAR CHEKH MFADAL' :['EN FACE DE DOUAR CHEKH MFADAL'],
            'HAY SALAM' : ['TIJARI WAFA BANQUE','PETIT PRINCE A COTER DE LA POSTE'],
            'Hay Inbiat' : ['terminus 14 cafe la lugua'],
            'La base' : ['EN FACE DE LA BASE'],
            'Rostal' : ['CAFE SOUK SALAM', 'PORTE RESIDENCE DOHA'],
            'Bettana' : ['TILIWIN','LYCEE OMAR IBN KHATAB','CONSERVATION FONCIERE','ECOLE ALAMA'],
            'Karia' : ['LYCEE IBN HASSAN WAZANI','BAB KARIA','METRO','CAFE HAJAR']
        }
    };



})

    
.controller('createDemandCtrl', function ($scope) {
    //$scope.map;
    $scope.suburb;
    $scope.logInfoTrajet = function () {
        console.log($scope.member_info);
        console.log($scope.LatSelectedPlace, $scope.LongSelectedPlace);
        console.log($scope.datetimeDemande);
        console.log($scope.suburb);
        console.log($scope.ville);

    };

    google.maps.event.addDomListener(window, 'load', function() {

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;

        var latLng = new google.maps.LatLng(33.993207,-6.721752);

        var mapOptions = {
            center: latLng,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        directionsDisplay.setMap(map);



        var onChangePlace = function () {
            if( document.getElementById('suburb').value == "string:PETIT PRINCE A COTER DE LA POSTE"){
                $scope.LatSelectedPlace = 34.042083;
                $scope.LongSelectedPlace = -6.793549;
            }else {
                //33.993005, -6.882308
                console.log(document.getElementById('suburb').value);
                $scope.lieu = document.getElementById('suburb').value;
                $scope.LatSelectedPlace = 33.993005;
                $scope.LongSelectedPlace = -6.882308;
            }
            DisplayRoute(directionsService,directionsDisplay);
        };


        document.getElementById('suburb').addEventListener('change', onChangePlace);

        function DisplayRoute(directionsService,directionsDisplay) {
            directionsService.route({
                origin: new google.maps.LatLng(33.981979,-6.726336),
                destination: new google.maps.LatLng($scope.LatSelectedPlace,$scope.LongSelectedPlace),
                travelMode: 'DRIVING'
            },function (response, status) {
                if (status == 'OK'){
                    directionsDisplay.setDirections(response);
                }else {
                    window.alert('Error'+ status);
                }
            });
        }


        $scope.map = map;


    })
})

.controller('InsideCrtl', function($scope, $location){
        console.log($location.path());
        $scope.$on('$stateChangeSuccess'), function(event, toState, toParams, fromState, fromParams){
            console.log('state changed to ', toState);
            if($location.path()=="#/menu/inside"){
                $scope.refreshItems();
            }
        }
})
.controller('MapsCtrl', function($scope, $ionicLoading, $rootScope, AuthService, $ionicPopup, $state, $http , API_ENDPOINT) {




    google.maps.event.addDomListener(window, 'load', function() {


            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;

            var latLng = new google.maps.LatLng(33.993207,-6.721752);

            var mapOptions = {
                center: latLng,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            directionsDisplay.setMap(map);



            var onChangePlace = function () {
                $scope.ville = document.getElementById('suburb').value;
                //console.log($scope.suburb);
                if( document.getElementById('suburb').value == "string:PETIT PRINCE A COTER DE LA POSTE"){
                    $scope.LatSelectedPlace = 34.042083;
                    $scope.LongSelectedPlace = -6.793549;
                    $scope.lieu = 'PETIT PRINCE A COTER DE LA POSTE';
                }else {
                    //33.993005, -6.882308
                    //console.log(document.getElementById('suburb').value);

                    $scope.LatSelectedPlace = 33.993005;
                    $scope.LongSelectedPlace = -6.882308;
                    $scope.lieu = 'TILIWIN';
                }
                console.log($scope.lieu);
                DisplayRoute(directionsService,directionsDisplay);

            };
            



            document.getElementById('suburb').addEventListener('change', onChangePlace);

            function DisplayRoute(directionsService,directionsDisplay) {
                directionsService.route({
                    origin: new google.maps.LatLng(33.981979,-6.726336),
                    destination: new google.maps.LatLng($scope.LatSelectedPlace,$scope.LongSelectedPlace),
                    travelMode: 'DRIVING'
                },function (response, status) {
                    if (status == 'OK'){
                        directionsDisplay.setDirections(response);
                    }else {
                        window.alert('Error'+ status);
                    }
                });
            }

            //var LatLingTechnopolice = {lat: 33.981979, lng: -6.726336};

            /*var marker = new google.maps.Marker({
                position: LatLingTechnopolice
            });*/

            //marker.setMap(map);
            $scope.map = map;


    })


    $scope.addOffer = function () {
        if($scope.lieu == null || $scope.dateTrajet == null || $scope.placeDispo == null){
            var alertPopup = $ionicPopup.alert({
                title: 'Erreur',
                template: 'Veuillez remplir tout les champs'
            });
        }else{
            userTrajet = {
                idUser: $scope.member_info._id,
                lieu: $scope.lieu,
                dateTrajet: $scope.dateTrajet,
                nombrePlace: $scope.placeDispo,
                lat: $scope.LatSelectedPlace,
                long: $scope.LongSelectedPlace
            };
            //console.log(userTrajet);
            $http.post(API_ENDPOINT.url+'/createUserTrajet',userTrajet).then(function (result) {
                //$scope.member_info = result.data.user;
                console.log('offre creer avec succes ');
                var alertPopup = $ionicPopup.alert({
                    title: 'Offre creer',
                    template: 'Votre offre a été creer avec succées'
                }).then(function () {
                    $state.go('menu.inside', {}, { reload:'menu.inside' ,inherit: false });
                });
            });
        }

    };
})


