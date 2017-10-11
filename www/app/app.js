
angular.module('talent', ['ionic', 'ionic-timepicker','ionic-modal-select','ngCordova','onezone-datepicker','ngStorage','profile.controllers','leave.controllers','selfservice.controllers','others.controllers','home.controllers','myteam.controllers','myhr.controllers','intro.controllers','talent.controllers', 'talent.routes', 'main.services', 'authentication.services','talent.services', 'talent.directives'])

  .run(function ($ionicPlatform, appService,$ionicHistory) {

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
    $ionicPlatform.registerBackButtonAction(function(e) {
      e.preventDefault();
      function showConfirm() {
        var lastTimeBackPress=0;
        var timePeriodToExit=2000;
        function onBackKeyDown(e){
           e.preventDefault();
           e.stopPropagation();
          if(new Date().getTime() - lastTimeBackPress < timePeriodToExit){
              navigator.app.exitApp();
          }else{
              window.plugins.toast.showWithOptions(
                {
                  message: "Press again to exit.",
                  duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                  position: "bottom",
                  addPixelsY: -40 // added a negative value to move it up a bit (default 0)
                }
              );

              lastTimeBackPress=new Date().getTime();
          }
        };
        document.addEventListener("backbutton", onBackKeyDown, false);
      };

      if ($ionicHistory.backView()) {
        $ionicHistory.backView().go();
      } else {
        showConfirm();
      }

      return false;
      }, 101);
  })