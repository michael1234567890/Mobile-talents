angular.module('intro.controllers', [])
.controller('LoginCtrl',function( $timeout,$ionicHistory, $ionicLoading, appService, $state,$localStorage, $rootScope, $scope, $location,  Main) {
	$scope.usertalent = {username:'',password:''};
	//$scope.email = "hendra.ramdhan@gmail.com";

    $scope.forgotAction = function(){
        alert("Forgot Action");
    }
  $scope.goToSignup = function () {
        $state.go('signup');
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
    }

    var successUserReference = function(res){
        $timeout(function () {
            $ionicLoading.hide();
            Main.setSession('profile',res);
            $state.go("app.myhr");
        }, 2000);

        // $ionicLoading.hide();
        // Main.setSession('profile',res);
        // $state.go("app.myhr");
    }

    var errorUserReference = function(res,status){
        if(status == 401) {
            $scope.goTo('login');
        }else if(status == 500) {
            alert("Problem with server. Please try again later.");
        }else {
            if(err != null)
              alert(err.message);
            else 
              alert("Please Check your connection.");
        }
        $ionicLoading.hide();
    }
    function getUserReference(){
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });

        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/profile';
        Main.requestApi(accessToken,urlApi,successUserReference,errorUserReference);
    }
	$scope.loginAction = function() {
			//alert("signin");
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });

            var formData = {
                username: $scope.usertalent.username,
                password: $scope.usertalent.password,
                grant_type:'password'
            }

           Main.signin(formData, function(res) {
                $ionicLoading.hide();
                if (res.type == false) {
                } else {
                    Main.setSession('token',res);
                    getUserReference();
                    $rootScope.dataUser = {};
                    //$state.go("app.home");
                }
            }, function(error, status) {
                $ionicLoading.hide();
                var err = "Failed to signin. Please check your internet connection";
                // $rootScope.error = 'Failed to signin';
                if(status == 400 || status==401) {
                    err = "Error : " + error.error_description;
                    
                    //appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                }else {
                    err = "Problem with server. Please try again later !"
                }

                // appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                appService.showAlert('Error', err, 'Close', 'button2', null);
               
            })
     };
})


.controller('RegisterCtrl',function($ionicNavBarDelegate, $ionicHistory,$ionicLoading, appService, $state,$localStorage, $rootScope, $scope, $location,  Main) {
    var messageValidation = "";
    $scope.user = {};
    
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
    
    $scope.goTo = function (page) {
        $state.go(page);
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
    }

    $scope.resetForm  = function(){
      $scope.user = {};
    }
    $scope.submitForm = function(){

        if(verificationForm($scope.user)){
            $ionicLoading.show({
              template: '<ion-spinner></ion-spinner>'
            });
            var accessToken = null;
            var urlApi = Main.getUrlApi() + '/api/register';
            var data = JSON.stringify($scope.user);
            Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);
        }else {
            alert(messageValidation);
        }    

    }

    var successRequest = function (res){
      $ionicLoading.hide();
      // $scope.goTo('tabs.thanks');
      alert(res.message);
      $scope.user = res;
      $scope.goBack("login");
    }

    var errorRequest = function (err, status){
      $ionicLoading.hide();
      if(status == 500) {
        alert(err.message);
      }else {
        alert("Check your connection");
      }
    }

    var successRefreshToken = function(res){
     
    }
    var errRefreshToken = function(err, status) {
    }

    initMethod();
    
    function initMethod(){
        $ionicNavBarDelegate.showBackButton(true);
    }
    // invalid access token error: "invalid_token" 401
    function verificationForm(dataUser){
     
        if(dataUser.companyCode == undefined){
            messageValidation = "Company code can't empty";
            // alert("Company code can't empty");
            return false;
        }

        if(dataUser.email == undefined){
            messageValidation = "Email code can't empty";
            // alert("Email code can't empty");
            return false;
        }

        if(dataUser.password == undefined){
            messageValidation = "Password code can't empty";
            //alert("Password code can't empty");
            return false;
        }

        if(dataUser.repassword == undefined){
            messageValidation = "Confirm Password code can't empty";
           // alert("Confirm Password code can't empty");
            return false;
        }   

        if(dataUser.password != dataUser.repassword){
            messageValidation = "Password and Confirm Password doesn't match";
            //alert("Password and Confirm Password doesn't match");
            return false;
        }

        return true;
          

    }

})




