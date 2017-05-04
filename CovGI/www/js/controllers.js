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


    .controller('menuCrtl',function ($scope, AuthService, API_ENDPOINT, $http, $state, $ionicPopup, $location, $ionicModal) {
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

        $scope.createOffer = function () {
            $state.go('menu.createOffer');
        };

        $scope.createDemand = function () {
            $state.go('menu.createDemand');
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

        $http.get(API_ENDPOINT.url+'/allDemand').then(function (result) {
            console.log('liste des demandes ', result.data);
            $scope.allDemand = result.data;
        });

        $ionicModal.fromTemplateUrl('templates/modal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openModalOffer = function(offre){
            $scope.lieuOffre = offre.lieu;
            $scope.dateOffre = offre.dateTrajet;
            $scope.nbrPlaceOffre = offre.nombrePlace;
            $scope.modal.show();
        }

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

        $http.get(API_ENDPOINT.url+'/allDemand').then(function (result) {
            console.log('liste des demandes '+ result.data);
            $scope.allDemand = result.data;
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
            },

            'Rabat' : {
                'Menzeh' : ['Terminus 57','Hay Nahda'],
                'Qamra' : ['Résidence Assabah','Total Msarni','Qamra'],
                'Hay Nahda' : ['ISTA Hay Nahda','Dar Al Khoubz'],
                'Hay El Fath' : ['Terminus 30','Résidence Mimoza','Café Cata Atlas','CCM'],
                'Hay Riad' : ['Label Vie','Bank Al Maghrib','CDG','Croisement Av.Mehdi Benbarka et Almelia'],
                'Rabat Ville' :['Gare Rabat'],
                'Diour Jamaa' : ['Auto Hall'],
                'Ocean' : ['4ème arrondissement'],
                'Akkari' : ['Hôpital Moulay Youssef'],
                'Agdal' : ['Crédit du Maroc face à Amazone'],
                'Takadom' : ['Château'],
                'Youssoufia' : ['Mini Parc']
            }

        };



    })


    .controller('createDemandCtrl', function ($scope) {
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

                $scope.lieu = document.getElementById('suburb').value
                $scope.lieuS = $scope.lieu.split(':');

                console.log($scope.lieuS[1]);
                $http.post(API_ENDPOINT.url+'/LatLangLieu',{'nomLieu':$scope.lieuS[1]}).then(function(result){
                    console.log(result.data);
                    $scope.LatSelectedPlace = result.data[0].latitude;
                    $scope.LongSelectedPlace = result.data[0].longitude;
                });

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

                $scope.lieu = document.getElementById('suburb').value
                $scope.lieuS = $scope.lieu.split(':');

                $http.post(API_ENDPOINT.url+'/LatLangLieu',{'nomLieu':$scope.lieuS[1]}).then(function(result){
                    console.log(result.data);
                   $scope.LatSelectedPlace = result.data[0].latitude;
                    $scope.LongSelectedPlace = result.data[0].longitude;
                });

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


        $scope.addOffer = function () {
            $scope.lieu = document.getElementById('suburb').value
            $scope.lieuS = $scope.lieu.split(':');
            if($scope.lieu == null || $scope.dateTrajet == null || $scope.placeDispo == null){
                var alertPopup = $ionicPopup.alert({
                    title: 'Erreur',
                    template: 'Veuillez remplir tout les champs'
                });
            }else if(new Date() > $scope.dateTrajet ){
                console.log('Entrez une date supérieure à la date d\'aujourd\'hui');
                var alertPopup = $ionicPopup.alert({
                    title: 'Erreur sur la date',
                    template: 'Veuillez entrer une date supérieure à la date d\'aujourd\'hui'
                });
            }
            else{
                var confirmationPopup = $ionicPopup.show({
                    title:'Confirmation',
                    template: 'Êtes-vous sûr de vouloir ajouter cette offre ?',
                    buttons:[
                        {
                            text: 'Annuler'
                        },{
                            text: 'Confirmer',
                            type: 'button-positive',
                            onTap: function(){
                                userTrajet = {
                                    idUser: $scope.member_info._id,
                                    lieu: $scope.lieuS[1],
                                    dateTrajet: $scope.dateTrajet,
                                    nombrePlace: $scope.placeDispo,
                                    lat: $scope.LatSelectedPlace,
                                    long: $scope.LongSelectedPlace
                                };
                                //console.log(userTrajet);
                                $http.post(API_ENDPOINT.url+'/createUserTrajet',userTrajet).then(function (result) {
                                    //$scope.member_info = result.data.user;
                                    console.log('offre créée avec succès ');
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Offre creer',
                                        template: 'Votre offre a été créée avec succès'
                                    }).then(function () {
                                        $state.go('menu.inside', {}, { reload:'menu.inside' ,inherit: false });
                                    });
                                });
                            }
                        }
                    ]
                });





            }

        };


        $scope.addDemand = function () {
            userDemand = {
                idUser: $scope.member_info._id,
                lieu: $scope.lieu,
                dateTrajet: $scope.dateTrajet,
                nombrePlace: $scope.placeDispo,
                lat: $scope.LatSelectedPlace,
                long: $scope.LongSelectedPlace
            };

            console.log(userDemand);

            $http.post(API_ENDPOINT.url+'/createUserDemand',userDemand).then(function (result) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Demande Créée',
                    template: 'Votre demande a été créée avec succès'
                }).then(function () {
                    $state.go('menu.inside', {}, { reload: 'menu.inside' });
                });
            });


        };




    })

    .controller('memberOfferCtrl', function ($scope ,AuthService, API_ENDPOINT, $http, $ionicPopup) {
        // var data=({"userId": $scope.member_info._id});


        $http.post(API_ENDPOINT.url+'/trajetUser',{'idUser':$scope.member_info._id}).then(function(result){
            console.log(result.data);

            $scope.trajetsUser = result.data;
        });


        $scope.deleteItem = function (trajectUser) {
            $scope.deleteItemWithID = trajectUser._id;
            $scope.trajetsUser.splice($scope.trajetsUser.indexOf(trajectUser), 1);
           $http.post(API_ENDPOINT.url+'/dropTrajetUser',{'_id':$scope.deleteItemWithID}).then(function(result){
                console.log(result.data);
            });
        };

    })

