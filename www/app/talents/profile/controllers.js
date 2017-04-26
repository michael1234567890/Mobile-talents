angular.module('profile.controllers', [])
.controller('ProfileCtrl', function($ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.profile = Main.getSession("profile");
    console.log($scope.profile);
  

})