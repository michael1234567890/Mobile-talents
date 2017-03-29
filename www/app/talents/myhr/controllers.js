angular.module('myhr.controllers', [])

.controller('MyHRCtrl',['$rootScope', '$scope','$state' , 'AuthenticationService', 'Main', function($rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    console.log(Main.getSession("token"));

    var successProfile = function (res){
    	console.log(res);
    }

    var errorProfile = function (err, status){
    	if(status == 401) {
    		var refreshToken = Main.getSession("token").refresh_token
    		console.log("need refresh token");
    		Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
    	}
    	console.log(err);
    	console.log(status);
    }

   	var successRefreshToken = function(res){
   		Main.setSession("token",res);
   		console.log("token session");
   		console.log(Main.getSession("token"));
   	}
   	var errRefreshToken = function(err, status) {
   		console.log(err);
   		console.log(status);
   	}

   	initMethod();
   	//31acd2e6-e891-4628-a24e-58e408664516
   	function initMethod(){
   		getProfile();
   	}
   	// invalid access token error: "invalid_token" 401
   	function getProfile(){
   		var accessToken = Main.getSession("token").access_token;
   		var urlApi = Main.getUrlApi() + '/api/myprofile';
   		Main.requestApi(accessToken,urlApi,successProfile, errorProfile);
   	}
    // Main.refreshToken("4c648f69-5158-4260-a47f-e7793c6a952e", resRefreshToken, errRefreshToken);

}])


.controller('PersonalCtrl',['$rootScope', '$scope','$state' , 'AuthenticationService', 'Main', function($rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.personal = {};

    console.log(Main.getSession("token"));

    var successRequest = function (res){
    	console.log(res);
    	$scope.personal = res;
    }

    var errorRequest = function (err, status){
    	if(status == 401) {
    		var refreshToken = Main.getSession("token").refresh_token
    		console.log("need refresh token");
    		Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
    	}else {
    		alert("Check your connection");
    	}
    	console.log(err);
    	console.log(status);
    }

   	var successRefreshToken = function(res){
   		Main.setSession("token",res);
   		console.log("token session");
   		console.log(Main.getSession("token"));
   	}
   	var errRefreshToken = function(err, status) {
   		console.log(err);
   		console.log(status);
   	}

   	initMethod();
   	//31acd2e6-e891-4628-a24e-58e408664516
   	function initMethod(){
   		getPersonal();
   	}
   	// invalid access token error: "invalid_token" 401
   	function getPersonal(){
   		var accessToken = Main.getSession("token").access_token;
   		var urlApi = Main.getUrlApi() + '/api/myprofile/personal';
   		Main.requestApi(accessToken,urlApi,successRequest, errorRequest);
   	}
    // Main.refreshToken("4c648f69-5158-4260-a47f-e7793c6a952e", resRefreshToken, errRefreshToken);

}])




.controller('FamilyCtrl', function($ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.family = {};

    console.log(Main.getSession("token"));

    var successRequest = function (res){
      $ionicLoading.hide();
      console.log(res);
      $scope.family = res;
    }

    var errorRequest = function (err, status){
      $ionicLoading.hide();
      if(status == 401) {
        var refreshToken = Main.getSession("token").refresh_token
        console.log("need refresh token");
        Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
      }else {
        alert("Check your connection");
      }
      console.log(err);
      console.log(status);
    }

    var successRefreshToken = function(res){
      Main.setSession("token",res);
      console.log("token session");
      console.log(Main.getSession("token"));
    }
    var errRefreshToken = function(err, status) {
      console.log(err);
      console.log(status);
    }

    initMethod();
    //31acd2e6-e891-4628-a24e-58e408664516
    function initMethod(){
      getFamily();
    }
    // invalid access token error: "invalid_token" 401
    function getFamily(){
      $ionicLoading.show({
          template: 'Loading...'
      });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/myprofile/family';
      Main.requestApi(accessToken,urlApi,successRequest, errorRequest);
    }
    // Main.refreshToken("4c648f69-5158-4260-a47f-e7793c6a952e", resRefreshToken, errRefreshToken);

})



.controller('AddFamilyCtrl', function($ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.family = {};
    $scope.selectRelationship = {};
    $scope.selectBloodType = {};
    $scope.selectGender = [];
    $scope.selectMaritalStatus = [];
    $scope.resetForm  = function(){
      $scope.family = {};
    }
    $scope.submitForm = function(){
        verificationForm();
        $ionicLoading.show({
          template: 'Processing...'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/myprofile/family';
        var data = JSON.stringify($scope.family);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);

        console.log($scope.family);
    }

    var successRequest = function (res){
      $ionicLoading.hide();
      alert(res.message);
      console.log(res);
      $scope.family = res;
    }

    var errorRequest = function (err, status){
      $ionicLoading.hide();
      if(status == 401) {
        var refreshToken = Main.getSession("token").refresh_token
        console.log("need refresh token");
        Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
      }else {
        alert("Check your connection");
      }
      console.log(err);
      console.log(status);
    }

    var successRefreshToken = function(res){
      Main.setSession("token",res);
      console.log("token session");
      console.log(Main.getSession("token"));
    }
    var errRefreshToken = function(err, status) {
      console.log(err);
      console.log(status);
    }

    initMethod();
    
    function initMethod(){
        $scope.selectRelationship = [{id:"Ayah"},{id:"Ibu"},{id:"Suami"},{id:"Istri"},{id:"Anak"},];
        $scope.selectBloodType = [{id:"A"},{id:"B"},{id:"AB"},{id:"O"}];
        $scope.selectGender = [{id:"Male"},{id:"Female"}];
        $scope.selectMaritalStatus = [{id:"Single"},{id:"Married"},{id:"Divorce"}];

    }
    // invalid access token error: "invalid_token" 401
    function verificationForm(){

    }

   

})




.controller('AddressCtrl', function($ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.address = {};

    console.log(Main.getSession("token"));

    var successRequest = function (res){
      $ionicLoading.hide();
      console.log(res);
      $scope.address = res;
    }

    var errorRequest = function (err, status){
      $ionicLoading.hide();
      if(status == 401) {
        var refreshToken = Main.getSession("token").refresh_token
        console.log("need refresh token");
        Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
      }else {
        alert("Check your connection");
      }
      console.log(err);
      console.log(status);
    }

    var successRefreshToken = function(res){
      Main.setSession("token",res);
      console.log("token session");
      console.log(Main.getSession("token"));
    }
    var errRefreshToken = function(err, status) {
      console.log(err);
      console.log(status);
    }

    initMethod();
    //31acd2e6-e891-4628-a24e-58e408664516
    function initMethod(){
      getAddress();
    }
    // invalid access token error: "invalid_token" 401
    function getAddress(){
      $ionicLoading.show({
          template: 'Loading...'
      });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/myprofile/address';
      Main.requestApi(accessToken,urlApi,successRequest, errorRequest);
    }
    // Main.refreshToken("4c648f69-5158-4260-a47f-e7793c6a952e", resRefreshToken, errRefreshToken);

})



.controller('AddAddressCtrl', function($ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
   
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.address = {};
    $scope.selectStayStatus = {};
    $scope.resetForm  = function(){
      $scope.address = {};
    }
    $scope.submitForm = function(){
        verificationForm();
        $ionicLoading.show({
          template: 'Submit...'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/myprofile/address';
        var data = JSON.stringify($scope.address);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);

        //console.log($scope.address);
    }

    var successRequest = function (res){
      $ionicLoading.hide();
      alert(res.message);
      console.log(res);
      //$scope.family = res;
    }

    var errorRequest = function (err, status){
      $ionicLoading.hide();
      if(status == 401) {
        var refreshToken = Main.getSession("token").refresh_token
        console.log("need refresh token");
        Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
      }else {
        alert("Check your connection");
      }
      console.log(err);
      console.log(status);
    }

    var successRefreshToken = function(res){
      Main.setSession("token",res);
      console.log("token session");
      console.log(Main.getSession("token"));
    }
    var errRefreshToken = function(err, status) {
      console.log(err);
      console.log(status);
    }

    initMethod();
    
    function initMethod(){
        $scope.selectStayStatus = [{id:"Owned"},{id:"Contract"},{id:"Live with parent"}];
    }
    // invalid access token error: "invalid_token" 401
    function verificationForm(){

    }

   

})


.controller('CertificationCtrl', function($ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    /*$scope.certification = [{
      name:"Salesforce.com Certification",
      principle:"Salesforce",
      expired:"3/24/2010",
      number: "SF-01219873",
      image: "img/certification.png"
    }];
*/
  if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.certification = {};

    console.log(Main.getSession("token"));

    var successRequest = function (res){
      $ionicLoading.hide();
      console.log(res);
      $scope.certification = res;
    }

    var errorRequest = function (err, status){
      $ionicLoading.hide();
      if(status == 401) {
        var refreshToken = Main.getSession("token").refresh_token
        console.log("need refresh token");
        Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
      }else {
        alert("Check your connection");
      }
      console.log(err);
      console.log(status);
    }

    var successRefreshToken = function(res){
      Main.setSession("token",res);
      console.log("token session");
      console.log(Main.getSession("token"));
    }
    var errRefreshToken = function(err, status) {
      console.log(err);
      console.log(status);
    }

    initMethod();
    //31acd2e6-e891-4628-a24e-58e408664516
    function initMethod(){
      getCertification();
    }
    // invalid access token error: "invalid_token" 401
    function getCertification(){
      $ionicLoading.show({
          template: 'Loading...'
      });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/myprofile/certification';
      Main.requestApi(accessToken,urlApi,successRequest, errorRequest);
    }
    


  })

.controller('AddCertificationCtrl', function($ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {



  if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.certification = {};
    $scope.selectRelationship = {};

    $scope.resetForm  = function(){
      $scope.certification = {};
    }
    $scope.submitForm = function(){
        verificationForm();
        $ionicLoading.show({
          template: 'Processing...'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/myprofile/certification';
        var data = JSON.stringify($scope.certification);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);

        console.log($scope.family);
    }

    var successRequest = function (res){
      $ionicLoading.hide();
      alert(res.message);
      console.log(res);
      //$scope.certification = res;
    }

    var errorRequest = function (err, status){
      $ionicLoading.hide();
      if(status == 401) {
        var refreshToken = Main.getSession("token").refresh_token
        console.log("need refresh token");
        Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
      }else {
        alert("Check your connection");
      }
      console.log(err);
      console.log(status);
    }

    var successRefreshToken = function(res){
      Main.setSession("token",res);
      console.log("token session");
      console.log(Main.getSession("token"));
    }
    var errRefreshToken = function(err, status) {
      console.log(err);
      console.log(status);
    }

    initMethod();
    
    function initMethod(){
        //$scope.selectRelationship = [{id:"Suami"},{id:"Istri"}];
    }

    // invalid access token error: "invalid_token" 401
    function verificationForm(){

    }


})

