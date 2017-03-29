
angular.module('talent', ['ionic', 'ngStorage','others.controllers','home.controllers','myhr.controllers','intro.controllers','talent.controllers', 'talent.routes', 'main.services', 'authentication.services','talent.services', 'talent.directives'])

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
  })