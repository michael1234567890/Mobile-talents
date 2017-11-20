angular.module('profile.controllers', [])
.controller('ProfileCtrl', function($ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.profile = {};
    function initModule() {
      $scope.profile =  Main.getSession("profile");
      $scope.profile.fullName = $scope.profile.employeeTransient.firstName;
      if($scope.profile.employeeTransient.middleName != null)
        $scope.profile.fullName += " " + $scope.profile.employeeTransient.middleName;

      if($scope.profile.employeeTransient.lastName != null)
        $scope.profile.fullName += " " + $scope.profile.employeeTransient.lastName;

    }
    $scope.$on('$ionicView.beforeEnter', function () {
        initModule();
    });    
})

.controller('EditProfileCtrl', function($timeout,appService,$cordovaCamera,$ionicActionSheet,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.imageData = $rootScope.user.photo;
    $scope.profile = Main.getSession("profile");
   
    $scope.image = "";
    $scope.data = {};
    $scope.data.handphone = $scope.profile.employeeTransient.mobilePhone;

    var successRequestInfo = function (res){
        $timeout(function () {
            if(res.image != null && res.image != ""){
              // $scope.general.userPhoto = res.image;
              // $scope.profile.image = res.image;
              $scope.general.userPhoto = $scope.imageData;
              $scope.profile.image =  $scope.imageData;
              Main.setSession('profile',$scope.profile);

            }
            $ionicLoading.hide();
            $scope.goBack("app.profile");
        }, 500);
    }

    function getInfo(){
      console.log("getInfo");
        var urlApi = Main.getUrlApi() + '/api/user/info';
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        Main.requestApi(accessToken,urlApi,successRequestInfo, $scope.errorRequest);
    }

    var successRequest = function (res){
        $ionicLoading.hide();
        $scope.successAlert(res.message);
        $scope.general.userPhoto = $scope.imageData;
        $scope.profile.image =  $scope.imageData;
        Main.setSession('profile',$scope.profile);

    }

    $scope.takePicture = function () {
    
          $ionicActionSheet.show({
              buttons: [{
                  text: 'Take Picture'
              }, {
                      text: 'Select From Gallery'
                  }],
              buttonClicked: function (index) {
                  switch (index) {
                      case 0: // Take Picture
                          document.addEventListener("deviceready", function () {
                              $cordovaCamera.getPicture(appService.getCameraOptionsProfile()).then(function (imageData) {
                                  $scope.imageData = "data:image/jpeg;base64," + imageData;
                                  $scope.image = imageData;
                              }, function (err) {
                                  appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                              });
                          }, false);

                          break;
                      case 1: // Select From Gallery
                          document.addEventListener("deviceready", function () {
                              $cordovaCamera.getPicture(appService.getLibraryOptionsProfile()).then(function (imageData) {
                                   $scope.imageData = "data:image/jpeg;base64," + imageData;
                                   $scope.image = imageData;
                              }, function (err) {
                                  appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                              });
                          }, false);
                          break;
                  }
                  return true;
              }
          });
    };


    $scope.save = function(){
          if($scope.image != "") {
              $ionicLoading.show({
                  template: '<ion-spinner></ion-spinner>'
              });
              $scope.data.image = $scope.image;
              var accessToken = Main.getSession("token").access_token;
              var urlApi = Main.getUrlApi() + '/api/user/profile/changeprofile';
              var data = JSON.stringify($scope.data);
              Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
        }
    }


  

})

.controller('ChangePasswordCtrl', function($timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    var messageValidation = "";
    $scope.password = {};
   
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.$on('$ionicView.enter', function(){
       initData();
      
    });


    function initData(){
        $scope.password = {oldPassword:"",newPassword:"",confirmPassword:""};
    }

    function changeSessionProfile(){
        $scope.profile.isChangePassword = true;
        Main.setSession('profile',$scope.profile);

    }

    var successRequest = function (res){
      changeSessionProfile();
      initData();
      $ionicLoading.hide();
      $scope.successAlert(res.message);
      $scope.goBack("app.profile");
    }

    var errorRequest = function (err, status){
      $ionicLoading.hide();
      if(status == 500) {
        alert(err.message);
      }else {
        alert("Check your connection");
      }
    }


    $scope.sendChangePassword = function(){
      if(verificationForm($scope.password)){
            $ionicLoading.show({
              template: '<ion-spinner></ion-spinner>'
            });
            var accessToken = Main.getSession("token").access_token;
            var urlApi = Main.getUrlApi() + '/api/myprofile/changepassword';
            var data = JSON.stringify($scope.password);
            Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
        }else {
            alert(messageValidation);
        }
    }

    
    function verificationForm(newPassword){
      if(newPassword.oldPassword == ""){
        messageValidation = "Old password can not empty";
        return false;
      }

      if(newPassword.newPassword == ""){
        messageValidation = "New password can not empty";
        return false;
      }

      if(newPassword.confirmPassword == ""){
        messageValidation = "Confirm New password can not empty";
        return false;
      }
      
        return true;
          

    }

})