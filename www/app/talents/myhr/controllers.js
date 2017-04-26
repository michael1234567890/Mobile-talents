angular.module('myhr.controllers', [])

.controller('MyHRCtrl',['$rootScope', '$scope','$state' , 'AuthenticationService', 'Main', function($rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.profile = {};


    var successProfile = function (res){
    	
      $scope.profile = res;
      $scope.profile.fullname = $scope.profile.firstName + " " + $scope.profile.lastName;
      console.log($scope.profile);

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

    $scope.goChangeMaritalStatus = function (idx) {
      $state.go('app.changemaritalstatus',{'idx':idx});
    };

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




.controller('FamilyCtrl', function($ionicHistory,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.family = {};
    $scope.goToDetails = function (idx) {
      $state.go('app.detailfamily',{'idx':idx});
    };

    $scope.refresh = function(){
      initMethod();
    }

    
    $scope.goToAddFamily = function (page) {
       
        $state.go(page);
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: false
        });
    }
    console.log(Main.getSession("token"));

    var successRequest = function (res){
      $ionicLoading.hide();
      console.log(res);
      $scope.family = res;
      $rootScope.family = [];
      for(var i=0;i<$scope.family.length;i++) {
        var obj = $scope.family[i];
        obj.idx = i;
        $rootScope.family.push(obj);
      }
      $scope.family = $rootScope.family;
      $scope.$broadcast('scroll.refreshComplete');

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
    

})



.controller('DetailFamilyCtrl', function($stateParams,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    var familyIdx = $stateParams.idx;
    $scope.family = {};
    if(familyIdx != null)
      $scope.family = $rootScope.family[familyIdx];
    console.log(familyIdx);

})



.controller('AddFamilyCtrl', function($ionicHistory , $ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    function goBack  (ui_sref) {
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

        console.log(data);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);

        console.log($scope.family);
    }

    var successRequest = function (res){
      $ionicLoading.hide();
      alert(res.message);
      goBack('app.family');
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
        $scope.selectRelationship = [{id:"Ayah"},{id:"Ibu"},{id:"Suami"},{id:"Istri"},{id:"Anak"},];
        $scope.selectBloodType = [{id:"A"},{id:"B"},{id:"AB"},{id:"O"}];
        $scope.selectGender = [{id:"Male"},{id:"Female"}];
        $scope.selectMaritalStatus = [{id:"Single"},{id:"Married"},{id:"Divorce"}];

    }
    // invalid access token error: "invalid_token" 401
    function verificationForm(){

    }

   

})




.controller('AddressCtrl', function($ionicHistory,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.refresh = function(){
      initMethod();
    }


    $scope.address = {};
    
    $scope.goToAddAddress = function () {
       
        $state.go('app.addaddress');
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: false
        });
    }

    $scope.goToDetails = function (idx) {
      $state.go('app.detailaddress',{'idx':idx});
    };


    console.log(Main.getSession("token"));

    var successRequest = function (res){
      $ionicLoading.hide();
      console.log(res);
      $scope.address = res;
      
      $rootScope.address = [];
      for(var i=0;i<$scope.address.length;i++) {
        var obj = $scope.address[i];
        obj.idx = i;
        $rootScope.address.push(obj);
      }
      $scope.address = $rootScope.address;
      $scope.$broadcast('scroll.refreshComplete');

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

})



.controller('AddAddressCtrl', function($ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
   
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.address = {};
    $scope.selectStayStatus = {};
    $scope.selectProvince = [];
    $scope.selectCity=[];
    $scope.selectCountry=[];
    $scope.resetForm  = function(){
      $scope.address = {};
    }

    function goBack  (ui_sref) {
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
      goBack("app.address");
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
        $scope.selectProvince = [{id:"DKI Jakarta"},{id:"Jawa Barat"},{id:"Jawa Tengah"},{id:"Jawa Timur"}];
        $scope.selectCity = [{id:"Jakarta Selatan"},{id:"Jakarta Utara"},{id:"Jakarta Barat"},{id:"Jakarta Timur"}];
        $scope.selectCountry = [{id:"Indonesia"}];
    }
    // invalid access token error: "invalid_token" 401
    function verificationForm(){

    }

   

})



.controller('DetailAddressCtrl', function($stateParams,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    var addressIdx = $stateParams.idx;
    $scope.address = {};
    if(addressIdx != null)
      $scope.address = $rootScope.address[addressIdx];
   
})



.controller('CertificationCtrl', function($ionicHistory,$timeout,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
   
  if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
  }

  $scope.refresh = function(){
    initMethod();
  }

    $scope.certification = {};
    $scope.goToAdd = function () {
       
        $state.go('app.addcertification');
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: false
        });
    }


    $scope.goToDetails = function (idx) {
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
      });

      $timeout(function () {
          $ionicLoading.hide();
           $state.go('app.detailcertification',{'idx':idx});
      }, 1000);
     
    };

    var successRequest = function (res){
      $ionicLoading.hide();
      console.log(res);
      $scope.certification = res;
      $rootScope.certification = [];
      for(var i=0;i<$scope.certification.length;i++) {
        var obj = $scope.certification[i];
        obj.idx = i;
        $rootScope.certification.push(obj);
      }
      $scope.certification = $rootScope.certification;
      $scope.$broadcast('scroll.refreshComplete');

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

.controller('AddCertificationCtrl', function($ionicHistory,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {



  if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.certification = {};
    $scope.selectRelationship = {};

    $scope.resetForm  = function(){
      $scope.certification = {};
    }

    function goBack  (ui_sref) {
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
      goBack("app.certification");
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




.controller('DetailCertificationCtrl', function($stateParams,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    var certificationIdx = $stateParams.idx;
    $scope.certification = {};
    if(certificationIdx != null)
      $scope.certification = $rootScope.certification[certificationIdx];
   
})


.controller('ChangeMaritalStatusCtrl', function($stateParams,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  $scope.itens = [
        { title: "Item 1", checked: false },
        { title: "Item 2", checked: false },
        { title: "Item 3", checked: false },
    ];
    
    $scope.updateSelection = function(position, itens, title) {
        angular.forEach(itens, function(subscription, index) {
            if (position != index)
                subscription.checked = false;
                $scope.selected = title;
            }
        );
    }

})


