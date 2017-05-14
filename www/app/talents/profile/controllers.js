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