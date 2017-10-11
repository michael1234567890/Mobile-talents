angular.module('profile.controllers', [])
.controller('ProfileCtrl', function($ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.profile = Main.getSession("profile");
    $scope.profile.fullName = $scope.profile.employeeTransient.firstName;
    if($scope.profile.employeeTransient.middleName != null)
      $scope.profile.fullName += " " + $scope.profile.employeeTransient.middleName;

    if($scope.profile.employeeTransient.lastName != null)
      $scope.profile.fullName += " " + $scope.profile.employeeTransient.lastName;
    
})

.controller('EditProfileCtrl', function(appService,$cordovaCamera,$ionicActionSheet,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.imageData = $rootScope.user.photo;
    $scope.profile = Main.getSession("profile");
    console.log($scope.profile);
    $scope.image = "";
    $scope.data = {};
    $scope.data.handphone = $scope.profile.employeeTransient.mobilePhone;

    var successRefreshToken = function(res){
      Main.setSession("token",res);
    }

    var errRefreshToken = function(err, status) {
    }

    var successRequest = function (res){
        $ionicLoading.hide();
        alert(res.message);
        if($scope.image != "")
           $rootScope.user.photo = "data:image/jpeg;base64," + $scope.image;
        $scope.goBack("app.profile");
      
    }

    var errorRequest = function (err, status){
        $ionicLoading.hide();
        if(status == 401) {
          var refreshToken = Main.getSession("token").refresh_token
          Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
        }else {
            if(status==500)
              alert(err.message);
            else
              alert("Please Check your connection");
        }
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
              data.image = $scope.image;
              var accessToken = Main.getSession("token").access_token;
              var urlApi = Main.getUrlApi() + '/api/user/profile/changeprofile';
              data = JSON.stringify(data);
              Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);
        }
    }


  

})

.controller('ChangePasswordCtrl', function($ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    var messageValidation = "";
    $scope.password = {};
   
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.$on('$ionicView.enter', function(){
  		 $scope.password = {oldPassword:"",newPassword:"",confirmPassword:""};
	});


    $scope.goBack = function (ui_sref) {
        var currentView = $ionicHistory.currentView();
        var backView = $ionicHistory.backView();

        if (backView) {
            //there is a back view, go to it
            if (currentView.stateName == backView.stateName) {
                //if not works try to go doubleBack
                var doubleBackView = $ionicHistory.getViewById(backView.backViewId);
                $state.go(doubleBackView.stateName, doubleBackView.stateParams);
            } else {
                backView.go();
            }
        } else {
            $state.go(ui_sref);
        }
    }


    var successRequest = function (res){
      $ionicLoading.hide();
      // $scope.goTo('tabs.thanks');
      alert(res.message);
      $scope.user = res;
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
            Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);
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