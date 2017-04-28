// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])



//trigerred when change the state or the url
//$on to catch the broadcast with the name $stateChangeStart
/*.run(function ($rootScope, $state, AuthService) {
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
      //Interdiction: Si l'utilisateur n'est pas authentifier et qu'il essaie d'acceder a une page autre que login
      if (!AuthService.isAuthenticated()){
            //console.log(next.name);
            if (next.name != 'tab.dash'){
              event.preventDefault();
              $state.go('tab.dash');
            }
        }
    });
})
*/

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})



.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        //controller: 'DashCtrl'
        controller: 'loginCrtl'
      }
    }
  })


.state('menu',{
      cache: false,
      url: '/menu',
      //abstract: true,
      templateUrl: '/templates/sideMenu.html',
      controller: 'menuCrtl'
})



  //after login
.state('menu.inside',{
    cache: false,
    url: '/inside',
    views:{
      'menuContent':{
          templateUrl: '/templates/inside.html'
      }
    }
})


.state('menu.createOffer',{
  url: '/createOffer',
  views:{
      'menuContent':{
          templateUrl:'templates/create_offer.html',

      }
  }
})

.state('menu.member_offer',{
  url: '/createOffer',
  views:{
      'menuContent':{
          templateUrl:'templates/member_offer.html',
      }
  }
})
.state('menu.createDemand',{
  url: '/createDemand',
  views:{
      'menuContent':{
          templateUrl:'templates/create_demand.html',

      }
  }
})
/* .state('inside.offre-tab',{
  url: '/offre',
  views:{
    'offre-tab':{
        templateUrl: '/templates/offre-tab.html',
    }
  }
})*/

.state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          //controller: 'ChatsCtrl'
        }
      }
})




.state('tab.sendMail', {
      url: '/sendMail',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-sendMail.html',
        }
      }
})


.state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        //controller: 'AccountCtrl'
      }
    }
});

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

})



