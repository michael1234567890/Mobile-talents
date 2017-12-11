
angular.module('talent', ['ngIdle','ionic','cera.ionicSuperPopup', 'ionic-timepicker','ionic-modal-select','ngCordova','onezone-datepicker','ngStorage','profile.controllers','timesheet.controllers','leave.controllers','selfservice.controllers','others.controllers','home.controllers','myteam.controllers','myhr.controllers','intro.controllers','talent.controllers', 'talent.routes', 'main.services', 'authentication.services','talent.services', 'talent.directives'])

  .run(function (Idle,$ionicPlatform, appService,$ionicHistory) {
    
    $ionicPlatform.ready(function () {
      
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        
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

.filter('round', function() {
  return function(value, mult, dir) {
    dir = dir || 'nearest';
    mult = mult || 1;
    value = !value ? 0 : Number(value);
    if (dir === 'up') {
      return Math.ceil(value / mult) * mult;
    } else if (dir === 'down') {
      return Math.floor(value / mult) * mult;
    } else {
      return Math.round(value / mult) * mult;
    }
  };
})

.config(['KeepaliveProvider', 'IdleProvider', function(KeepaliveProvider, IdleProvider) {
  IdleProvider.idle(5*60);
  IdleProvider.timeout(30);
  KeepaliveProvider.interval(10);
}]);

