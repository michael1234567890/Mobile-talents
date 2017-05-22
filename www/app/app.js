
angular.module('talent', ['ionic', 'ngCordova','onezone-datepicker','ngStorage','profile.controllers','leave.controllers','selfservice.controllers','others.controllers','home.controllers','myteam.controllers','myhr.controllers','intro.controllers','talent.controllers', 'talent.routes', 'main.services', 'authentication.services','talent.services', 'talent.directives'])

  .run(function ($ionicPlatform, appService) {

    $ionicPlatform.ready(function () {
      
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        // $cordovaKeyboard.hideAccessoryBar(true);
        // cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });

    // Disable BACK button on home
    $ionicPlatform.registerBackButtonAction(function (event) {
      if($state.current.name=="app.home"){
        navigator.app.exitApp();
      }
      else {
        navigator.app.backHistory();
      }
    }, 100);
  


  })