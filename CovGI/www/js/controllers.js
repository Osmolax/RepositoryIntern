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


.controller('sendMailCrtl', function($scope,$ionicPlatform){
    $scope.sendMail = function () {

        $ionicPlatform.ready(function() {
            //$cordovaPlugin.someFunction().then(success, error);
            console.log(window.plugins);
            //console.log(cordova);
        });
        //console.log(cordova.plugins);

        //console.log(window.plugins.emailComposer);

        /*
        if(window.plugins && window.plugins.emailComposer){
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result){
                console.log('test the plugin');
            })
        }else{
            console.log('no plugin installed');
        }
        */
    };

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
            $state.go('menu.inside', {}, { reload: 'menu.inside' });
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

    .controller('modalCrtl', function ($scope, $rootScope) {

        //console.log('inside modalCrtl');


        /*google.maps.event.addDomListener(window, 'load', function() {
         var latLng = new google.maps.LatLng(33.993207,-6.721752);
         var mapOptions = {
         center: latLng,
         zoom: 14,
         mapTypeId: google.maps.MapTypeId.ROADMAP
         };
         var map = new google.maps.Map(document.getElementById("map"), mapOptions);
         console.log('load map on modal modalCrtl');
         })*/
    })

.controller('menuCrtl',function ($scope, AuthService, API_ENDPOINT, $http, $state, $ionicPopup, $location, $ionicModal, $window,$rootScope) {



        $http.get(API_ENDPOINT.url+'/member').then(function (result) {
            $scope.member_info = result.data.user;
        $window.localStorage.setItem("member_info", angular.toJson(result.data.user));
        //console.log('User from window.localStorage '+ JSON.parse($window.localStorage.getItem("member_info"))._id);


        //console.log($scope.member_info._id);
        //notify when new inscription

        setInterval(function(){
             console.log('run');
             $http.post(API_ENDPOINT.url+'/trajetUser',{'idUser':$scope.member_info._id}).then(function(result){
                 console.log(result.data);
                 $scope.trajetsUser = result.data;
                 if($scope.trajetsUser.length == 0){
                     console.log('vous n avez poster aucune offre');
                 }
                 else{
                     for(i=0;i<$scope.trajetsUser.length;i++){
                         $http.post(API_ENDPOINT.url+'/getDInscription',{'idOffer':$scope.trajetsUser[i]._id}).then(function(result){
                             console.log(result.data);

                             if(result.data.length == 0){
                                 console.log('is empty');
                             }else{
                                 for(i=0;i<result.data.length;i++){
                                     $scope.idDemande = result.data[i]._id;
                                     //console.log(result.data[i].statusDemande);
                                     if(result.data[i].statusDemande == 0 && result.data[i].seen == false){
                                         $http.post(API_ENDPOINT.url+'/getUserById',{'_id':result.data[i].idDemandeur}).then(function(result){
                                             //console.log(result.data);
                                             $scope.Demandeur = result.data;
                                         });
                                         //console.log(result.data[i]);
                                         var newInscriptionPopup = $ionicPopup.show({
                                             template: 'Vous avez reçu une nouvelle demande d\'inscription de la part de '+$scope.Demandeur.login,
                                             title: 'Nouvelle inscription',
                                             buttons:[{
                                                 text: 'Cancel',
                                                 onTap: function(){
                                                     $http.post(API_ENDPOINT.url+'/DInscriptionSeen',{'_id':$scope.idDemande}).then(function(result){
                                                         console.log('Notification seen');
                                                     });
                                                 }
                                             },{
                                                 text: 'Confirmer',
                                                 type: 'button-positive',
                                                 onTap: function(){
                                                     $http.post(API_ENDPOINT.url+'/DInscriptionAccepted',{'_id':$scope.idDemande}).then(function(result){
                                                         //console.log('Demande en cours d\'acceptation '+ result.data);
                                                         console.log('Demande '+$scope.idDemande+' accepted '+result.data[0].statusDemande);
                                                     });
                                                 }
                                             }]
                                         })
                                     }
                                 }
                             }
                         });
                     }
                 }

             });
         }, 10000)



    });






        $scope.check_offers = function () {
            $state.go('menu.member_offer');
        }

        $scope.check_demands = function () {
            $state.go('menu.member_demand');

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

    /*  $scope.showPopupAddOffer = function () {
            var myPopup = $ionicPopup.show({
                template: '<input type="text" placeholder="">',
                title: 'Add new Offer',
                buttons:[{
                    text: 'Cancel'
                }]
            })
        }*/

        $scope.go = function ( path ) {
            $location.path( path );
        };

        $http.get(API_ENDPOINT.url+'/allOffre').then(function (result) {
            //console.log('liste des trajets ', result.data);
            $scope.allOffer = result.data;

        });

        $http.get(API_ENDPOINT.url+'/allDemand').then(function (result) {
            //console.log('liste des demandes ', result.data);
            $scope.allDemand = result.data;
        });




        $ionicModal.fromTemplateUrl('templates/modal.html', {
            scope: $scope,
            controller: 'modalCrtl'
        }).then(function(modalOffre) {
            $scope.modalOffre = modalOffre;

        });


        $ionicModal.fromTemplateUrl('templates/modalDemande.html', {
            scope: $scope,
            controller: 'modalCrtl'
        }).then(function(modalDemande) {
            $scope.modalDemande = modalDemande;

        });


        $rootScope.initMap = function(){

            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: {clickable: false}});

            var latLng = new google.maps.LatLng(33.993207,-6.721752);

            var mapOptions = {
                center: latLng,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };



            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            directionsDisplay.setMap(map);



        google.maps.event.addListener(map, 'click', function(event) {
            placeMarker(event.latLng);
         });

        var marker;


        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;

        function placeMarker(location) {
            imgMarker = $scope.member_info.marker;
            if(!marker){
                marker = new google.maps.Marker({
                position: location,
                map: map,
                animation: google.maps.Animation.DROP,
                icon : imgMarker,
                draggable : true});
            }
            else{
                marker.setPosition(location);
            }

            google.maps.event.addListener(marker, 'dragend', function (evt) {
                //document.getElementById('current').innerHTML = '<p>Marker dropped: Current Lat: ' + evt.latLng.lat() + ' Current Lng: ' + evt.latLng.lng() + '</p>';
                $scope.latMarker = evt.latLng.lat();
                $scope.lngMarker = evt.latLng.lng();
                var latLangMarker = {lat: $scope.latMarker ,lng: evt.latLng.lng()};
                geocoder.geocode({'location':latLangMarker}, function(results, status){
                    if(results[1]){
                        infowindow.setContent(results[0].formatted_address);
                        infowindow.open(map, marker);
                        //console.log(results[0].formatted_address);
                    }
                    else{
                        window.alert('No results found');
                    }
                })
            });
        }



        $http.post(API_ENDPOINT.url+'/LatLangLieu',{'nomLieu':$scope.lieuOffre}).then(function(result){
            //console.log(result.data);
                $scope.LatSelectedPlace = result.data[0].latitude;
                $scope.LongSelectedPlace = result.data[0].longitude;
                DisplayRoute(directionsService,directionsDisplay);
            });


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

        }

        $rootScope.initMapDemande = function(){

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


            google.maps.event.addListener(directionsDisplay, 'mouseover', function(){
                alert("moused over straight line!");
            });



            $http.post(API_ENDPOINT.url+'/LatLangLieu',{'nomLieu':$scope.lieuDemande}).then(function(result){
                console.log(result.data);
                $scope.LatSelectedPlace = result.data[0].latitude;
                $scope.LongSelectedPlace = result.data[0].longitude;
                DisplayRoute(directionsService,directionsDisplay);
            });


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
        }


        $scope.openModalOffer = function(offre){

            $scope.lieuOffre = offre.lieu;
            $scope.dateOffre = offre.dateTrajet;
            $scope.nbrPlaceOffre = offre.nombrePlace;
            $scope.idUserOffer = offre.idUser;

            $scope.idOffer = offre._id;

            $scope.latMarker = null;
            $scope.lngMarker = null;


            console.log(offre.idUser);
            //console.log($scope.member_info);
            $http.post(API_ENDPOINT.url+'/getUserById',{'_id':offre.idUser}).then(function(result){
                console.log(result.data);
                $scope.UserOffer= result.data;

            });

            $scope.modalOffre.show();
            $rootScope.initMap();
        }

        $scope.openModalDemande = function(demand){

            $scope.lieuDemande = demand.lieu;
            $scope.dateDemande = demand.dateTrajet;
            $scope.modalDemande.show();
            $rootScope.initMapDemande();
        }


        $scope.inscriptionOfferDirect = function (offre) {

            $http.post(API_ENDPOINT.url+'/getUserById',{'_id':offre.idUser}).then(function(result){
                console.log(result.data);
                $scope.UserOffer= result.data;

            }).then($scope.inscriptionOffer(offre));

        }
        
        $scope.inscriptionOffer = function (offre) {

            if($scope.UserOffer._id == $scope.member_info._id){
                var ownOffer = $ionicPopup.alert({
                    title: 'Attention',
                    template: 'Vous ne pouvez pas etre inscrit à votre propre offre'
                }).then(function() {
                    $scope.modalOffre.hide();
                });
            }else{
                if($scope.nbrPlaceOffre == 0){
                    var noPlaceDispo = $ionicPopup.alert({
                        title: 'Info',
                        template: 'Désolé, il n\'y a plus de place disponible pour le moment'
                    });
                }else {
                    $http.post(API_ENDPOINT.url+'/getDInscription',{'idOffer':$scope.idOffer}).then(function(result){
                        //console.log(result.data);
                        //console.log(result.data);
                        if(result.data.length == 0){
                            var confirmationInscriptionPopup = $ionicPopup.show({
                                title:'Confirmation',
                                template: 'Êtes-vous sûr de vouloir envoyer votre demande à '+ $scope.UserOffer.login,
                                buttons:[
                                    {
                                        text: 'Annuler'
                                    },{
                                        text: 'Confirmer',
                                        type: 'button-positive',
                                        onTap: function(){
                                            $http.post(API_ENDPOINT.url+'/inscriptionOffer',{'idOffer':$scope.idOffer, 'idDemandeur': $scope.member_info._id,'latDemande': $scope.latMarker, 'lngDemande':$scope.lngMarker, 'dateInscription': new Date()}).then(function(result){
                                                $scope.idDInscription = result.data._id;
                                                //console.log('id DInscription '+$scope.idDInscription);
                                                //console.log('id de la demande d\'inscription est '+result.data);
                                            });
                                            var inscriptionSucessPopup = $ionicPopup.alert({
                                                title: 'Demande envoyée',
                                                template: 'Votre demande d\'inscription a été envoyée à '+ $scope.UserOffer.login
                                            }).then(function () {
                                                $scope.modalOffre.hide();
                                            });
                                        }
                                    }
                                ]
                            }).then(ifDemandeAccepted = setInterval(function(){
                                $http.post(API_ENDPOINT.url+'/getDInscriptionById',{'_id':$scope.idDInscription}).then(function(result){
                                    if(result.data[0].statusDemande == 1){
                                        clearInterval(ifDemandeAccepted);
                                        var inscriptionAccepted = $ionicPopup.alert({
                                            title: 'Demande acceptée',
                                            template: $scope.UserOffer.login+ ' a accepté votre demande d\'inscription a son offre'
                                        });
                                    }else {
                                        console.log('not accepted yet');
                                    }
                                });
                            },1000));
                        }else{
                            var already = false;
                            for(i=0;i<result.data.length;i++){
                                //console.log(result.data[i]);
                                //idDemandeur
                                if(result.data[i].idDemandeur == $scope.member_info._id){
                                    var oneIscription = $ionicPopup.alert({
                                        title: 'Alert',
                                        template: 'Vous etes deja inscris à cette offre'
                                    }).then(function () {
                                        $scope.modalOffre.hide();
                                        already = true;
                                    });
                                }
                            }
                            if(already == true){
                                var confirmationInscriptionPopup = $ionicPopup.show({
                                    title:'Confirmationnnn',
                                    template: 'Êtes-vous sûr de vouloir envoyer votre demande à '+ $scope.UserOffer.login,
                                    buttons:[
                                        {
                                            text: 'Annuler'
                                        },{
                                            text: 'Confirmer',
                                            type: 'button-positive',
                                            onTap: function(){
                                                $http.post(API_ENDPOINT.url+'/inscriptionOffer',{'idOffer':$scope.idOffer, 'idDemandeur': $scope.member_info._id,'latDemande': $scope.latMarker, 'lngDemande':$scope.lngMarker, 'dateInscription': new Date()}).then(function(result){
                                                    console.log('--------------------------'+result.data);
                                                    $scope.idDInscription = result.data._id;
                                                });

                                                var inscriptionSucessPopup = $ionicPopup.alert({
                                                    title: 'Demande envoyée',
                                                    template: 'Votre demande d\'inscription a été envoyée à '+ $scope.UserOffer.login
                                                }).then(function () {
                                                    $scope.modalOffre.hide();
                                                });
                                            }
                                        }
                                    ]
                                }).then(ifDemandeAccepted = setInterval(function(){
                                    $http.post(API_ENDPOINT.url+'/getDInscriptionById',{'_id':$scope.idDInscription}).then(function(result){
                                        if(result.data[0].statusDemande == 1){
                                            clearInterval(ifDemandeAccepted);
                                            var inscriptionAccepted = $ionicPopup.alert({
                                                title: 'Demande acceptée',
                                                template: $scope.UserOffer.login+ ' a accepté votre demande d\'inscription a son offre'
                                            });
                                        }else {
                                            console.log('not accepted yet');
                                        }
                                    });
                                },1000));
                            }
                        }
                    });
                }

            }
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
            'Rabat' : {
                'Menzeh' : ['Terminus 57'],
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
            },

            'Temara' : {
                'Harhoura' : ['Club Yasmine'],
                'Wifak' : ['Carrefour','Maroc Telecom'],
                'Temara Centre' : ['Acima','BMCE Temara Centre','Redal'],
                'Qrouch' : ['Chouwayate El Akhawayn'],
                'Hay Abbadi' : ['Mosque El Houda','Pharmacie Fadlallah','Pizzeria Venezia','Lignes 3 - 8M - 40'],
                'Massira' :['ISTA Temara','Milano','SGMB'],
                'Guich Oudaya' : ['Banque Populaire','Pharmacie Rim']
            },

            'Salé' : {
                'Salé Ville' : ['Bab Sabta', 'Résidence Diar', 'BAB CHAAFA', 'Gare Salé Medina'],
                'Hay Chmaou/Said Hajji' : ['Café Le relais du jour', 'Café Zaytouna','Mosquée Hay Chmaou','Hôpital public Hay Said Hajji','Lycée Abderrahim Bouabid','CAFE IHSANE'],
                'Hay Rahma' : ['Terminus Tramway Hay Rahma', 'Mosquée Arrahma'],
                'Tabriket' : ['Pharmacie Ibtissam','Bureau de poste Tabriquet','Mosquée Ohoud','PHARMACIE DAHAB','Résidence Nakhil'],
                'Hay Karima' : ['Terminus Tramway Hay Karima'],
                'DOUAR CHEKH MFADAL' :['Hôpital Chiekh Lamfadal'],
                'HAY SALAM' : ['Agence Maroc Telecom','Mosquée Al Qods'],
                'Hay Inbiat' : ['Pharmacie Inbiat'],
                'La base' : ['Cité militaire'],
                'Bettana' : ['Poste Bettana','CPGE Salmane El Farissi'],
                'Karia' : ['Hôpital Karia'],
                'Salé El Jadida' : ['ISTA Sala al Jadida','Mosquée Hassan II','Station TOTAL','Pharmacie des villas']
            }



        };



    })



    .controller('createDemandCtrl', function ($scope, $rootScope) {

        $scope.suburb;

        $scope.logInfoTrajet = function () {
            console.log($scope.member_info);
            console.log($scope.LatSelectedPlace, $scope.LongSelectedPlace);
            console.log($scope.datetimeDemande);
            console.log($scope.suburb);
            console.log($scope.ville);

        };

        $scope.$on( "$ionicView.enter", function( scopes, states ) {
            google.maps.event.trigger( map, 'resize' );
        });

    })


    .controller('MapsCtrl', function($scope, $ionicLoading, $rootScope, AuthService, $ionicPopup, $state, $http , API_ENDPOINT ) {



        $scope.init = function () {
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;

            var latLng = new google.maps.LatLng(33.993207,-6.721752);

            var mapOptions = {
                center: latLng,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };


            var map = new google.maps.Map(document.getElementById("map"), mapOptions);
            //google.maps.event.trigger( map, 'resize' );

            directionsDisplay.setMap(map);


            $scope.LatSelectedPlace= null;
            $scope.LongSelectedPlace= null;

            var onChangePlace = function () {

                $scope.lieu = document.getElementById('suburb').value
                $scope.lieuS = $scope.lieu.split(':');


                $http.post(API_ENDPOINT.url+'/LatLangLieu',{'nomLieu':$scope.lieuS[1]}).then(function(result){
                    console.log(result.data);
                    $scope.LatSelectedPlace = result.data[0].latitude;
                    $scope.LongSelectedPlace = result.data[0].longitude;
                    DisplayRoute(directionsService,directionsDisplay);
                });


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
        }




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
                                console.log(userTrajet);
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
            $scope.lieu = document.getElementById('suburb').value
            $scope.lieuS = $scope.lieu.split(':');
            if($scope.lieu == null || $scope.dateTrajet == null){
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
                    template: 'Êtes-vous sûr de vouloir ajouter cette demande ?',
                    buttons:[
                        {
                            text: 'Annuler'
                        },{
                            text: 'Confirmer',
                            type: 'button-positive',
                            onTap: function(){
                                userDemand = {
                                    idUser: $scope.member_info._id,
                                    lieu: $scope.lieuS[1],
                                    dateTrajet: $scope.dateTrajet,
                                    lat: $scope.LatSelectedPlace,
                                    long: $scope.LongSelectedPlace
                                };
                                //console.log(userTrajet);
                                $http.post(API_ENDPOINT.url+'/createUserDemand',userDemand).then(function (result) {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Demande Créée',
                                        template: 'Votre demande a été créée avec succès'
                                    }).then(function () {
                                        $state.go('menu.inside', {}, { reload: 'menu.inside' });
                                    });
                                });
                            }
                        }
                    ]
                });





            }

        };

    })


    .controller('memberOfferCtrl', function ($scope ,AuthService, API_ENDPOINT, $http, $ionicPopup, $window, $ionicModal,$rootScope) {

        $http.post(API_ENDPOINT.url+'/trajetUser',{'idUser':JSON.parse($window.localStorage.getItem("member_info"))._id}).then(function(result){
            $scope.trajetsUser = result.data;
            for(i=0;i<$scope.trajetsUser.length;i++){
                $http.post(API_ENDPOINT.url+'/getDInscription',{'idOffer':$scope.trajetsUser[i]._id}).then(function(result){
                    console.log(result.data);
                });
            }
        });

        $scope.deleteItem = function (trajectUser) {
            $scope.deleteItemWithID = trajectUser._id;
            $scope.trajetsUser.splice($scope.trajetsUser.indexOf(trajectUser), 1);
            $http.post(API_ENDPOINT.url+'/dropTrajetUser',{'_id':$scope.deleteItemWithID}).then(function(result){
                console.log(result.data);
            });
        };


        $ionicModal.fromTemplateUrl('templates/modal_member_offer.html', {
            scope: $scope,

        }).then(function(modalOffre) {
            $scope.modalMemberOffre = modalOffre;
        });

        $scope.openModalMemberOffer = function(trajectUser){
            $scope.trajetsUserInModal = trajectUser;
            $scope.modalMemberOffre.show();
            $rootScope.initMapMemberOffer(trajectUser);
        }


        $rootScope.initMapMemberOffer = function(trajectUser){

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


            $http.post(API_ENDPOINT.url+'/LatLangLieu',{'nomLieu':trajectUser.lieu}).then(function(result){
                console.log(result.data);
                $scope.LatSelectedPlaceMembreOffer = result.data[0].latitude;
                $scope.LongSelectedPlaceMembreOffer = result.data[0].longitude;
                DisplayRoute(directionsService,directionsDisplay);
            });

            latDemande = [];
            lngDemande = [];


       /*     $http.post(API_ENDPOINT.url+'/getDInscription',{'idOffer':trajectUser._id}).then(function(result){
                var i;
                for(i=0;i<result.data.length;i++){
                    if(result.data[i].statusDemande == 1 && result.data[i].latDemande != null && result.data[i].lngDemande != null){
                        latDemande[i] = result.data[i].latDemande;
                        lngDemande[i] = result.data[i].lngDemande;
                        var myLatLng = {lat: latDemande[i], lng: lngDemande[i]};
                        //myLatLng[0] = {lat: 33.9950385520165, lng: -6.7701530456543};
                        //myLatLng[1] = {lat: 34.031180658938, lng: -6.83838844299316};

                        var imgMarker;

                                $http.post(API_ENDPOINT.url+'/getUserById',{'_id':result.data[i].idDemandeur}).then(function(result2){
                                    //console.log('marker demandeur '+result.data);
                                    imgMarker = {url: result2.data.marker};
                                //    console.log('image marker user '+imgMarker.url);
                                    console.log('result::::'+result2);

                                    var marker = new google.maps.Marker({
                                        position: myLatLng,
                                        map: map,
                                        animation: google.maps.Animation.DROP,
                                        icon : imgMarker
                                    });
                                })



                    }
                }
            });*/

            $http.post(API_ENDPOINT.url+'/getDInscription',{'idOffer':trajectUser._id}).then(function(result){
                var i;
                var myLatLng;
                var imgMarker;
                for(i=0;i<result.data.length;i++) {

                    if (result.data[i].statusDemande == 1 && result.data[i].latDemande != null && result.data[i].lngDemande != null) {
                        latDemande[i] = result.data[i].latDemande;
                        lngDemande[i] = result.data[i].lngDemande;
                        myLatLng = {lat: latDemande[i], lng: lngDemande[i]};
                        //myLatLng[0] = {lat: 33.9950385520165, lng: -6.7701530456543};
                        //myLatLng[1] = {lat: 34.031180658938, lng: -6.83838844299316};




                    $http.post(API_ENDPOINT.url + '/getUserById', {'_id': result.data[i].idDemandeur}).then(function (result2) {
                        //console.log('marker demandeur '+result.data);
                        imgMarker = {url: result2.data.marker};
                         console.log('image marker user '+imgMarker.url);

                    });

                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        animation: google.maps.Animation.DROP,
                        icon:imgMarker
                    });

                    }
                }


        });


            function DisplayRoute(directionsService,directionsDisplay) {
                directionsService.route({
                    origin: new google.maps.LatLng(33.981979,-6.726336),
                    destination: new google.maps.LatLng($scope.LatSelectedPlaceMembreOffer,$scope.LongSelectedPlaceMembreOffer),
                    travelMode: 'DRIVING'
                },function (response, status) {
                    if (status == 'OK'){
                        directionsDisplay.setDirections(response);
                    }else {
                        window.alert('Error'+ status);
                    }
                });
            }
        }

    })

    .controller('memberDemandCtrl', function ($scope ,AuthService, API_ENDPOINT, $http, $ionicPopup) {
        // var data=({"userId": $scope.member_info._id});


        $http.post(API_ENDPOINT.url+'/trajetDemande',{'idUser':$scope.member_info._id}).then(function(result){
            console.log(result.data);

            $scope.trajetsDemande = result.data;
        });


        $scope.deleteItem = function (trajectDemande) {
            $scope.deleteItemWithID = trajectDemande._id;
            $scope.trajetsDemande.splice($scope.trajetsDemande.indexOf(trajectDemande), 1);
            $http.post(API_ENDPOINT.url+'/dropDemandeUser',{'_id':$scope.deleteItemWithID}).then(function(result){
                console.log(result.data);
            });
        };

    })

