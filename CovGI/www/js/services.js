angular.module('starter.services', [])

    .service('AuthService', function ($q, $http, API_ENDPOINT) {
        var TOKEN_KEY = 'cestlemotsecret';
        var isAuthenticated = false;
        var authToken;

        //load the user Creadentials if token call useCredentials
        function loadUserCredentials() {
            var token = window.localStorage.getItem(TOKEN_KEY);
            if(token){
                useCredentials(token);
            }
        };

        //user the user Credentials and set the token in the http header
        function useCredentials(token) {
            isAuthenticated = true;
            authToken = token;
            $http.defaults.headers.common.Authorization = authToken;
        };


        //store the user Credentials
        function storeUserCredentials(token) {
            window.localStorage.setItem(TOKEN_KEY, token);
            useCredentials(token);
        }







        function addUserTrajetOffer(userTrajet) {
            return $q(function (resolve, reject) {
                $http.post(API_ENDPOINT.url+'/createUserTrajet', userTrajet).then(function (result) {
                    if(result.data.success){
                        resolve(result.data.message);
                    }
                    else {
                        reject(result.data.message);
                    }
                });
            });
        }

        //destroy user Credentials set authToken to false and remove it from the http header
        function destroyUserCredentials() {
            authToken = undefined;
            isAuthenticated = false;
            $http.defaults.headers.common.Authorization = undefined;
            window.localStorage.removeItem(TOKEN_KEY);
        }

        //user the api authentication
        var login = function (user) {
            return $q(function (resolve, reject) {
                $http.post(API_ENDPOINT.url+'/authentication', user).then(function (result) {
                    if(result.data.succes){
                        storeUserCredentials(result.data.token);
                        resolve(result.data.message);
                    }
                    else{
                        reject(result.data.message);
                    }
                });
            });
        };

        var logout = function () {
            destroyUserCredentials();
        };

        loadUserCredentials();

        return{
            login : login,
            logout : logout,
            isAuthenticated: function () {return isAuthenticated;},
        };

    })


