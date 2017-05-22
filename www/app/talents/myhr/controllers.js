angular.module('myhr.controllers', [])

.controller('MyHRCtrl',['$rootScope', '$scope','$state' , 'AuthenticationService', 'Main', function($rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.profile = Main.getSession("profile");
    //$scope.profile = {};
    console.log("profile", $scope.profile);
    $scope.$on('$ionicView.beforeEnter', function () {
         $scope.profile = Main.getSession("profile");
    });

    $scope.refresh = function(){
        $scope.profile = Main.getSession("profile");
        $scope.$broadcast('scroll.refreshComplete');
    }


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
    	}else {
          if(status==500)
            alert(err.message);
          else
            alert("Please Check your connection");
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
      /*if(Main.getSession("profile") == null)
   		   getProfile();*/
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

    $scope.goChangeMaritalStatus = function (currentStatus,dataApprovalId) {
      $state.go('app.changemaritalstatus',{'currentStatus':currentStatus,'dataApprovalId':dataApprovalId});
    };

    $scope.personal = {};

    console.log(Main.getSession("token"));

    var successRequest = function (res){
    	console.log(res);
    	$scope.personal = res;
      $scope.personal.showMaritalStatus = $scope.personal.maritalStatus;
      if($scope.personal.maritalStatusDataApproval != null) {
          $scope.personal.showMaritalStatus = $scope.personal.changeMaritalStatus;
      }
      $scope.personal.addressShow = false;
      $scope.personal.addressFull = "";
      if(res.address != null){
          address = res.address;
          $scope.personal.addressFull += " " + address.address + " RT. " + address.rt + " RW. " + address.rw + " " + address.city + ", " + address.province;
          
      }
    }

    var errorRequest = function (err, status){
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

    $scope.family = [];
    $scope.$on('$ionicView.beforeEnter', function () {
        console.log("$ionicView.beforeEnter");
        if( $rootScope.refreshFamilyCtrl) {
           
            initMethod();
        }
        $rootScope.refreshFamilyCtrl = false;
    });

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
          if(status==500)
            alert(err.message);
          else
            alert("Please Check your connection");
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
      var urlApi = Main.getUrlApi() + '/api/user/family';
      Main.requestApi(accessToken,urlApi,successRequest, errorRequest);
    }
    

})



.controller('DetailFamilyCtrl', function($ionicHistory,$stateParams,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    var familyIdx = $stateParams.idx;
    $scope.family = {};
    if(familyIdx != null)
      $scope.family = $rootScope.family[familyIdx];
    
    $scope.goEditFamily = function () {
      $state.go('app.editfamily',{idx:familyIdx});
      $ionicHistory.nextViewOptions({
          disableAnimate: false,
          disableBack: false
      });
    }


})


.controller('EditFamilyCtrl', function($filter, $ionicHistory,$stateParams,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    var familyIdx = $stateParams.idx;
    console.log("familyIdx",familyIdx)
    $scope.familyData = {};
    if(familyIdx != null)
      $scope.family = $rootScope.family[familyIdx];
    if($scope.family.birthDate != null) 
      $scope.family.birthDate = new Date($scope.family.birthDate);
    else
      $scope.family.birthDate = new Date();

    $scope.selectMaritalStatus = Main.getSelectMaritalStatus();
    $scope.selectRelationship = Main.getSelectFamilyRelationShip();
    $scope.selectBloodType = Main.getSelectBloodType();
    $scope.selectGender = Main.getSelectGender();
    $scope.isEdit = true;
    var successRequest = function (res){
      $ionicLoading.hide();
      alert(res.message);
      $scope.goBack('app.family');
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
          if(status==500)
            alert(err.message);
          else
            alert("Please Check your connection");
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


    $scope.submitForm = function (){
        $ionicLoading.show({
          template: 'Processing...'
        });

        var birthDate = null;
        if($scope.family.birthDate != null) 
          birthDate = $filter('date')($scope.family.birthDate,'yyyy-MM-dd'); 

        var dataEdit = {name:$scope.family.name,birthPlace:$scope.family.birthPlace,birthDate:birthDate,gender:$scope.family.gender,relationship:$scope.family.relationship,address:$scope.family.address,maritalStatus:$scope.family.maritalStatus,bloodType:$scope.family.bloodType,occupation:$scope.family.occupation,phone:$scope.family.phone};
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/family/'+$scope.family.id;
        var data = JSON.stringify(dataEdit);
        console.log(data);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);

        console.log(dataEdit);
    }

    console.log("$scope.family",$scope.family)
    
})



.controller('AddFamilyCtrl', function($cordovaCamera,$ionicHistory , $ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    /*$(document).ready(function() {
        $('select').material_select();
    });*/

    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

   

    $scope.image = "img/placeholder.png";
    $scope.family = {};

    $scope.selectMaritalStatus = Main.getSelectMaritalStatus();
    $scope.selectRelationship = Main.getSelectFamilyRelationShip();
    $scope.selectBloodType = Main.getSelectBloodType();
    $scope.selectGender = Main.getSelectGender();

    $scope.imageData = null;
    $scope.isEdit = false;
    $scope.family.images = [];
    $scope.addPicture = function(){
        if($scope.family.images.length > 3) {
          alert("Only 3 pictures can be upload");
          return false;
        }
        $scope.family.images.push({'image':"img/placeholder.png"});
        console.log($scope.family.images);
    }
    $scope.takePicture = function(){
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            targetWidth : 750,
            targetHeight:550,
            encodingType: Camera.EncodingType.JPEG,
            saveToPhotoAlbum: true,
            correctOrientation:true
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.image = "data:image/jpeg;base64," + imageData;
            $scope.imageData = imageData;
        }, function (err) {
            // An error occured. Show a message to the user
            alert("an error occured while take picture");
        });
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

    $scope.resetForm  = function(){
      $scope.family = {};
    }

    $scope.submitForm = function(){
        verificationForm();
        $ionicLoading.show({
          template: 'Processing...'
        });
        var attachment = [];
        var objAttchament = {"image":$scope.imageData};
        attachment.push(objAttchament);
        if($scope.imageData != null)
          $scope.family.attachments = attachment;
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/family';
        var data = JSON.stringify($scope.family);
        console.log(data);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);

        console.log($scope.family);
    }

    var successRequest = function (res){
      $ionicLoading.hide();
      alert(res.message);
      $rootScope.refreshFamilyCtrl=true;
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
        if(status==500)
          alert(err.message);
        else
          alert("Please Check your connection");
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
        
    }
    // invalid access token error: "invalid_token" 401
    function verificationForm(){

    }

   

})




.controller('AddressCtrl', function($ionicHistory,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.$on('$ionicView.beforeEnter', function () {
        console.log("$ionicView.beforeEnter");
        if( $rootScope.refreshAddressCtrl) {
            console.log("refresh AddressCtrl");
            initMethod();
        }
        $rootScope.refreshAddressCtrl = false;
    });

    $scope.refresh = function(){
      initMethod();
    }


    $scope.address = [];
    
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
          if(status==500)
            alert(err.message);
          else
            alert("Please Check your connection");
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
      $scope.address = [];
      getAddress();      
    }
    // invalid access token error: "invalid_token" 401
    function getAddress(){
      $ionicLoading.show({
          template: 'Loading...'
      });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/address';
      Main.requestApi(accessToken,urlApi,successRequest, errorRequest);
    }

})


.controller('EditAddressCtrl', function($stateParams,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
   
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    var addressIdx = $stateParams.idx;
    $scope.address = {};
    if(addressIdx != null)
      $scope.address = $rootScope.address[addressIdx];

    console.log($scope.address);
    $scope.selectStayStatus = Main.getSelectStayStatus();
    $scope.selectProvince = Main.getSelectProvince();
    $scope.selectCity=Main.getSelectCity();
    $scope.selectCountry=Main.getSelectCountry();
   

    

    $scope.submitForm = function(){
        var dataSubmit = {address: $scope.address.address, rt: $scope.address.rt, rw:$scope.address.rw, country:$scope.address.country, province:$scope.address.province, city:$scope.address.city, zipCode:$scope.address.zipCode, phone: $scope.address.phone, stayStatus : $scope.address.stayStatus};
        verificationForm();
        $ionicLoading.show({
          template: 'Submit...'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/address/'+$scope.address.id;
        var data = JSON.stringify(dataSubmit);
        console.log("data Submit", data);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);

    }

    var successRequest = function (res){
      $ionicLoading.hide();
      alert(res.message);
      console.log(res);
      $scope.goBack("app.address");
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
        
    }
    // invalid access token error: "invalid_token" 401
    function verificationForm(){

    }

   

})


.controller('AddAddressCtrl', function($ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
   
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.address = {};
    

    $scope.selectStayStatus = Main.getSelectStayStatus();
    $scope.selectProvince = Main.getSelectProvince();
    $scope.selectCity=Main.getSelectCity();
    $scope.selectCountry=Main.getSelectCountry();

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
        var urlApi = Main.getUrlApi() + '/api/user/address';
        var data = JSON.stringify($scope.address);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);
        //console.log($scope.address);
    }

    var successRequest = function (res){
      $ionicLoading.hide();
      alert(res.message);
      console.log(res);
      $rootScope.refreshAddressCtrl = true;
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
          if(status==500)
            alert(err.message);
          else
            alert("Please Check your connection");
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
       
    }
    // invalid access token error: "invalid_token" 401
    function verificationForm(){

    }

   

})



.controller('DetailAddressCtrl', function($ionicHistory , $stateParams,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    var addressIdx = $stateParams.idx;
    $scope.address = {};
    if(addressIdx != null)
      $scope.address = $rootScope.address[addressIdx];

    
    $scope.goEditAddress = function () {
     
      $state.go('app.editaddress',{idx:addressIdx});
      $ionicHistory.nextViewOptions({
          disableAnimate: false,
          disableBack: false
      });
    }
   
})



.controller('CertificationCtrl', function($ionicHistory,$timeout,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
   
  
  $scope.certification = [];

  if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
  }

  $scope.refresh = function(){
    initMethod();
  }

  $scope.$on('$ionicView.beforeEnter', function () {
        console.log("$ionicView.beforeEnter");
      if( $rootScope.refreshCertificationCtrl) {
          console.log("refresh AddressCtrl");
          initMethod();
      }
      $rootScope.refreshCertificationCtrl = false;
  });


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
          if(status==500)
            alert(err.message);
          else
            alert("Please Check your connection");
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

      $scope.certification = [];
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

.controller('AddCertificationCtrl', function($cordovaCamera,$ionicHistory,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {



  if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.certification = {};
    $scope.selectRelationship = {};
    $scope.selectCertificationType =
    $scope.imageData = null;
    $scope.image = "img/placeholder.png";
    

    $scope.takePicture = function(){
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            targetWidth : 750,
            targetHeight:550,
            encodingType: Camera.EncodingType.JPEG,
            saveToPhotoAlbum: true,
            correctOrientation:true
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.image = "data:image/jpeg;base64," + imageData;
            $scope.imageData = imageData;
        }, function (err) {
            // An error occured. Show a message to the user
            alert("an error occured while take picture");
        });
    }

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
        var attachments = [];
        var objAttchament = {"image":$scope.imageData};
        attachments.push(objAttchament);
        $scope.certification.attachments = attachments;
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
      $rootScope.refreshCertificationCtrl = true;
      goBack("app.certification");
      
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
        // $scope.selectCertificationType = [{id:"Period"},{id:"Lifetime"}];
        $scope.selectCertificationType = [{id:"Lifetime"}];
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

    $scope.goToViewImage = function (id){
        $state.go('app.viewimagecertification',{'id':id});
    }
   
})

.controller('ViewImageCertificationCtrl', function($ionicModal,$stateParams,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $ionicModal.fromTemplateUrl('app/shop/product-preview.html', {
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function (modal) {
        $scope.modalPopupImage = modal;
    });

    $scope.openImagePreview = function (item) {
        console.log(item);
        var product = {id:1,image:item};
        $scope.detailImage = product;
        console.log($scope.detailImage);
        $scope.modalPopupImage.show();
    };
    
    $scope.closeImagePreview = function () {
        $scope.detailImage = undefined;
        $scope.modalPopupImage.hide();
    };


    var certificationId = $stateParams.id;
    $scope.attachments = [];
    $scope.image = "img/placeholder.png";
    
    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.attachments = res;
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


   

    function retreiveImage(certificationId){
        
        $ionicLoading.show({
          template: 'Retrieve Image ...'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/myprofile/certification/'+certificationId+'/attachments';
        Main.requestApi(accessToken,urlApi,successRequest, errorRequest);

    }
    if(certificationId != null){
        retreiveImage(certificationId);
    }else {
      alert("ID Certification can not be null");
    }

    
   
})



.controller('ChangeMaritalStatusCtrl', function($ionicHistory,$cordovaCamera,$stateParams,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    $scope.itens = [
          { title: "Single", checked: false },
          { title: "Married", checked: false },
          { title: "Divorce", checked: false },
    ];

    var dataapprovalId = $stateParams.dataApprovalId;
    $scope.currentStatus = $stateParams.currentStatus;
    $scope.showButton = true;
    $scope.dataApprovalStatus = null;
    console.log($stateParams);

    $scope.image = "img/placeholder.png";
    $scope.imageData ;
    $scope.takePicture = function(){
        var options =  {
            quality: Main.getTakePictureOptions().quality,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            targetWidth : Main.getTakePictureOptions().targetWidth,
            targetHeight:Main.getTakePictureOptions().targetHeight,
            encodingType: Camera.EncodingType.JPEG,
            saveToPhotoAlbum: true,
            correctOrientation:true
        };
        
        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.image = "data:image/jpeg;base64," + imageData;
            $scope.imageData = imageData;
            console.log("$scope.imageData");
            console.log($scope.imageData);
            //$scope.image =  imageData;
        }, function (err) {
            // An error occured. Show a message to the user
            alert("an error occured while take picture");
        });
    }


    $scope.updateSelection = function(position, itens, title) {
      
        angular.forEach(itens, function(subscription, index) {
            if (position != index)
                subscription.checked = false;
                $scope.selected = title;
            }
        );
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

    var successRequest = function (res){
      $ionicLoading.hide();
      alert(res.message);
      console.log(res);
      goBack("app.biodata");
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


    $scope.send = function (){
       var idRef = Main.getSession("profile").employee;
       var jsonData = '{"maritalStatus":"'+$scope.selected+'"}';
       var attachment = [];
       var objAttchament = {"image":$scope.imageData};
       attachment.push(objAttchament);
       var dataStr = {task:"CHANGEMARITALSTATUS",data:jsonData,idRef:idRef,attachments:attachment};
       
       $ionicLoading.show({
          template: 'Submit Request...'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/workflow/dataapproval';
        var data = JSON.stringify(dataStr);
        console.log(dataStr);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);

    }

    var successDataApproval = function (res){
      $ionicLoading.hide();
      var dataApproval = res;
      $scope.dataApprovalStatus = dataApproval.processingStatus; 
      if(dataApproval.processingStatus != null && dataApproval.processingStatus.toLowerCase()!='request'){
          $scope.showButton = false;
          
      }

      if(dataApproval.attachments != null && dataApproval.attachments.length > 0)
            $scope.image = dataApproval.attachments[0].image;
        

      console.log(res);
    }


    function getDataApproval (dataapprovalId) {
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/workflow/dataapproval/'+dataapprovalId;
        Main.requestApi(accessToken,urlApi,successDataApproval, errorRequest);
    }
    function initModule(){
       $scope.showButton = true;
      if(dataapprovalId != null && dataapprovalId !="" && dataapprovalId !="0" ){
          getDataApproval(dataapprovalId);
      }
    }

    initModule();

})


