angular.module('intro.controllers', [])
.controller('LoginCtrl',function( $ionicLoading, appService, $state,$localStorage, $rootScope, $scope, $location,  Main) {
	$scope.usertalent = {username:'',password:''};
	//$scope.email = "hendra.ramdhan@gmail.com";
	$scope.loginAction = function() {
			//alert("signin");
            $ionicLoading.show({
                template: 'Signing processing...'
            });

			console.log($scope.usertalent);
            var formData = {
                username: $scope.usertalent.username,
                password: $scope.usertalent.password,
                grant_type:'password'
            }

           Main.signin(formData, function(res) {
                $ionicLoading.hide();
                if (res.type == false) {
                    console.log(res)    
                } else {
                    
                    Main.setSession('token',res);
                    console.log(Main.getSession("token"));
                    $state.go("app.home");
                    ///window.location = "/";    
                }
            }, function(error, status) {
                $ionicLoading.hide();
                var err = "Failed to signin. Please check your internet connection";
                // $rootScope.error = 'Failed to signin';
                if(status == 400 || status==401) {
                    err = "Error : " + error.error_description;

                    //appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                }
                appService.showAlert('Error', err, 'Close', 'button-assertive', null);
               
            })
     };
})


.controller('RegisterCtrl',function( $ionicHistory,$ionicLoading, appService, $state,$localStorage, $rootScope, $scope, $location,  Main) {

    $scope.user = {};
    
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

        verificationForm();
        $ionicLoading.show({
          template: 'Processing...'
        });
        var accessToken = null;
        var urlApi = Main.getUrlApi() + '/api/register';
        var data = JSON.stringify($scope.user);
        console.log("User register");
        console.log(data);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);

    }

    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.goTo('tabs.thanks');
      alert(res.message);
      console.log(res);
      $scope.user = res;
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

    var successRefreshToken = function(res){
     
      console.log("token session");
      console.log(Main.getSession("token"));
    }
    var errRefreshToken = function(err, status) {
      console.log(err);
      console.log(status);
    }

    initMethod();
    
    function initMethod(){
        
    }
    // invalid access token error: "invalid_token" 401
    function verificationForm(){

    }

})




