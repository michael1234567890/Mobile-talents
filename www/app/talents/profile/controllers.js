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
    
    console.log($scope.profile);
  

})

.controller('EditProfileCtrl', function(appService,$cordovaCamera,$ionicActionSheet,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.imageData = $rootScope.user.photo;
    $scope.profile = Main.getSession("profile");
    $scope.image = "";
    console.log($scope.profile);

    var successRefreshToken = function(res){
      Main.setSession("token",res);
      console.log("token session");
      console.log(Main.getSession("token"));
    }

    var errRefreshToken = function(err, status) {
      console.log(err);
      console.log(status);
    }

    var successRequest = function (res){
        $ionicLoading.hide();
        alert(res.message);
        if($scope.image != "")
           $rootScope.user.photo = "data:image/jpeg;base64," + $scope.image;
        goBack("app.profile");
      
    }

    var errorRequest = function (err, status){
        $ionicLoading.hide();
        if(status == 401) {
          var refreshToken = Main.getSession("token").refresh_token
          console.log("need refresh token");
          Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
        }else {
            if(status==500)
              alert(err.message);
            else
              alert("Please Check your connection");
        }
        console.log(err);
        console.log(status);
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
                              $cordovaCamera.getPicture(appService.getCameraOptions()).then(function (imageData) {
                                  $scope.imageData = "data:image/jpeg;base64," + imageData;
                                  $scope.image = imageData;
                              }, function (err) {
                                  appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                              });
                          }, false);

                          break;
                      case 1: // Select From Gallery
                          document.addEventListener("deviceready", function () {
                              $cordovaCamera.getPicture(appService.getLibraryOptions()).then(function (imageData) {
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
          var data = {};
          if($scope.image != "") {
              $ionicLoading.show({
                  template: 'Processing...'
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
      console.log(res);
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
      console.log(err);
      console.log(status);
    }


    $scope.sendChangePassword = function(){
    	if(verificationForm($scope.password)){
            $ionicLoading.show({
              template: 'Processing...'
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