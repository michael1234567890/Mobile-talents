angular.module('intro.controllers', [])
.controller('LoginCtrl',function( Idle,$timeout,$ionicHistory, $ionicLoading, appService, $state,$localStorage, $rootScope, $scope, $location,  Main) {
	$scope.usertalent = {username:'',password:''};
	var messageValidation = "";
    $scope.inputType = 'password';
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

    }

     $scope.hideShowPassword = function(){
       if ($scope.inputType == 'password')
          $scope.inputType = 'text';
        else
          $scope.inputType = 'password';
     }

    function getUserReference(){
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });

        var accessToken = Main.getSession("token").access_token;
        //var urlApi = Main.getUrlApi() + '/api/user/profile';
        var urlApi = Main.getUrlApi() + '/api/user/profile?mobileversion=' + Main.getVersion();
        Main.requestApi(accessToken,urlApi,successUserReference,$scope.errorRequest);
    }
	$scope.loginAction = function() {

        if(verificationForm($scope.usertalent)) {
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
                    Idle.watch();
                    Main.setSession('token',res);
                    getUserReference();
                    $rootScope.dataUser = {};
                    //$state.go("app.home");
                }
            }, function(error, status) {
                $ionicLoading.hide();
                var err = "Failed to signin. Please check your internet connection";
                // $rootScope.error = 'Failed to signin';
                if(status == 400) {
                    err = "Error : " + error.error_description;
                }else if(status == 401){
                    err = "Could not process this operation. Please contact Admin.";
                }else {
                    err = "Can't connect to server. Please try again later !"
                }
                $scope.errorAlert(err);

               
            });
        }else {
            $scope.warningAlert(messageValidation);
        }
			
            
     };

    function initData(){
        $scope.usertalent = {username:'',password:''};
    }
    function initModule(){
        $timeout(function () {
          $ionicHistory.clearCache();
        }, 200) 
        initData();
        Main.cleanData();
    }
    function verificationForm(usertalent){
       
        if(usertalent.username == undefined || usertalent.username ==''){
            messageValidation = "Email can't be empty or wrong format.";
            return false;
        }else if(usertalent.password == undefined || usertalent.password ==''){
            messageValidation = "Password can't be empty";
            return false;
        }
        return true;
    }

    $scope.$on('$ionicView.beforeEnter', function (event,data) {
          initModule();
    });
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
            Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
        }else {
            $scope.warningAlert(messageValidation);
        }    

    }

    var successRequest = function (res){
      $ionicLoading.hide();
      // $scope.goTo('tabs.thanks');
      $scope.successAlert(res.message);
      $scope.user = res;
      $scope.goBack("login");
    }

   /* var errorRequest = function (err, status){
      $ionicLoading.hide();
      if(status == 500) {
        $scope.errorAlert(err.message);
      }else {
        $scope.errorAlert("Check your connection");
      }
    }*/

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




