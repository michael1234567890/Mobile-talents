angular.module('myhr.controllers', [])

.controller('MyHRCtrl',['$rootScope', '$scope','$state' , 'AuthenticationService', 'Main', function($rootScope, $scope,$state , AuthenticationService, Main) {

    $scope.$on('$ionicView.beforeEnter', function () {
         
         initMethod();
    });

    $scope.refresh = function(){
        $scope.profile = Main.getSession("profile");
        $scope.$broadcast('scroll.refreshComplete');
    }


    var successProfile = function (res){
      $scope.profile = res;
      $scope.profile.fullname = $scope.profile.firstName + " " + $scope.profile.lastName;

    }

   	function initMethod(){
      console.log("Profile",$scope.profile);
      if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
            $state.go("login");
      }
      
      $scope.profile = Main.getSession("profile");
      if($scope.profile == undefined)
   		   getProfile();
   	}
   	// invalid access token error: "invalid_token" 401
   	function getProfile(){
      if(Main.getSession("token") != null){
          var accessToken = Main.getSession("token").access_token;
          var urlApi = Main.getUrlApi() + '/api/myprofile';
          Main.requestApi(accessToken,urlApi,successProfile, $scope.errorRequest);
      }
   		
   	}
   
    initMethod();
}])


.controller('PersonalCtrl',['$ionicLoading','ionicSuperPopup','$rootScope','$scope','$state' , 'AuthenticationService', 'Main', function($ionicLoading,ionicSuperPopup,$rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.goChangeMaritalStatus = function (currentStatus,dataApprovalId) {
      $state.go('app.changemaritalstatus',{'currentStatus':currentStatus,'dataApprovalId':dataApprovalId});
    };

    $scope.personal = {};
    
    

    var successRequest = function (res){
      $ionicLoading.hide();
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
      $scope.$broadcast('scroll.refreshComplete');
    }

   	$scope.$on('$ionicView.beforeEnter', function (event,data) {
        //if(data.direction != undefined && data.direction!='back')
          initMethod();

    });
  
   function initMethod(){

   		getPersonal();
    }
  
   	function getPersonal(){
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
      });
   		var accessToken = Main.getSession("token").access_token;
   		var urlApi = Main.getUrlApi() + '/api/myprofile/personal';
   		Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
   	}
    // Main.refreshToken("4c648f69-5158-4260-a47f-e7793c6a952e", resRefreshToken, errRefreshToken);

}])




.controller('FamilyCtrl', function($ionicHistory,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.family = [];
    $scope.$on('$ionicView.beforeEnter', function (event,data) {
        if(data.direction != undefined && data.direction!='back')
            initMethod();

        if( $rootScope.refreshFamilyCtrl) {
            initMethod();
        }
        $rootScope.refreshFamilyCtrl = false;
      
    });

    $scope.goToAddFamily = function () {
      $state.go('app.addfamily',{'id':0});
    };


    $scope.goToDetails = function (idx) {
      $state.go('app.detailfamily',{'idx':idx,'edit':'true'});
    };

    $scope.refresh = function(){
      initMethod();
    }

    
    // $scope.goToAddFamily = function (page) {
       
    //     $state.go(page);
    //     $ionicHistory.nextViewOptions({
    //         disableAnimate: false,
    //         disableBack: false
    //     });
    // }

    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.family = res;
      $scope.$broadcast('scroll.refreshComplete');
    }


    initMethod();
    //31acd2e6-e891-4628-a24e-58e408664516
    function initMethod(){
      getFamily();
    }
    // invalid access token error: "invalid_token" 401
    function getFamily(){
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
      });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/family';
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }
    

})



.controller('DetailFamilyCtrl', function($ionicHistory,$stateParams,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.canEdit = $stateParams.edit;
    var familyId = $stateParams.idx;
    $scope.family = {};
    
    $scope.goEditFamily = function () {
      $state.go('app.addfamily',{id:familyId});
      $ionicHistory.nextViewOptions({
          disableAnimate: false,
          disableBack: false
      });
    }

    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.family = res;
    }

    function getDetailFamily(familyId){
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
      });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/family/'+familyId;
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }

    $scope.$on('$ionicView.beforeEnter', function (event,data) {
            initMethod();
    });

    function initMethod(){
        getDetailFamily(familyId);
    }


})


.controller('EditFamilyCtrl', function(ionicDatePicker,$filter, $ionicHistory,$stateParams,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    var genderEmp = Main.getSession("profile").employeeTransient.gender;
    var familyIdx = $stateParams.idx;
    var messageValidation = "";
    var arrCompanyRef = Main.getSession("profile").companyReference;
    var refSelectAlive = Main.getDataReference(arrCompanyRef,'myhr','family','alive');
    $scope.selectAliveStatus = []; // Main.getSelectProvince();
    
    $scope.familyData = {};

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
      $scope.successAlert(res.message);
      $scope.goBack('app.family');
    }

    var datepicker = {
      callback: function (val) {  //Mandatory
        $scope.family.birthDate = val;
      },
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      dateFormat:"yyyy-MM-dd",
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(datepicker);
    };

    // invalid access token error: "invalid_token" 401
    function verificationForm(family){
        if(family.name == undefined || family.name==''){
            messageValidation = "Name can't be empty";
            return false;
        }else if(family.birthPlace == undefined || family.birthPlace==''){
            messageValidation = "Place of Birth can't be empty";
            return false;
        }else if(family.birthDate == undefined){
            messageValidation = "Date of Birth can't be empty";
            return false;
        }else if(family.aliveStatus ==undefined || family.aliveStatus=='' ) {
            messageValidation = "Alive Status can't be empty";
            return false;
        }else if(family.gender ==undefined || family.gender=='') {
            messageValidation = "Gender can't be empty";
            return false;
        }else if(family.relationship ==undefined || family.relationship=='') {
            messageValidation = "Relationship can't be empty";
            return false;
        }else if(family.maritalStatus ==undefined || family.maritalStatus =='') {
            messageValidation = "Marital Status can't be empty";
            return false;
        }else if(family.bloodType ==undefined || family.bloodType=='' ) {
            messageValidation = "Blood Type can't be empty";
            return false;
        }

         if(genderEmp != undefined && family.relationship != undefined) {
            if(family.relationship == 'Suami' && genderEmp == "Male") {
                messageValidation = "You can't select this item in relationship. Your gender is '" + genderEmp + "'.";
                return false;
            }

            if(family.relationship == 'Istri' && genderEmp == "Female") {
                messageValidation = "You can't select this item in relationship. Your gender is '" + genderEmp + "'.";
                return false;
            }
        }

        return true;
    }


    $scope.submitForm = function (){
        if(verificationForm($scope.family)) {
           $ionicLoading.show({
              template: '<ion-spinner></ion-spinner>'
            });

            var birthDate = null;
            if($scope.family.birthDate != null) 
              birthDate = $filter('date')($scope.family.birthDate,'yyyy-MM-dd'); 

            var dataEdit = {aliveStatus:$scope.family.aliveStatus,name:$scope.family.name,birthPlace:$scope.family.birthPlace,birthDate:birthDate,gender:$scope.family.gender,relationship:$scope.family.relationship,address:$scope.family.address,maritalStatus:$scope.family.maritalStatus,bloodType:$scope.family.bloodType,occupation:$scope.family.occupation,phone:$scope.family.phone};
            var accessToken = Main.getSession("token").access_token;
            var urlApi = Main.getUrlApi() + '/api/user/family/'+$scope.family.id;
            var data = JSON.stringify(dataEdit);
            Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
        }else {
          $scope.warningAlert(messageValidation);
        }
    }
    function initMethod(){
         if(refSelectAlive != undefined && refSelectAlive != '') {
              $scope.selectAliveStatus = JSON.parse(refSelectAlive);
        }
    }
    initMethod();

    
})


.controller('AddFamilyCtrl', function($stateParams,ionicSuperPopup,$filter,ionicDatePicker,$ionicPopup,appService,$ionicActionSheet,$cordovaCamera,$ionicHistory , $ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    var genderEmp = Main.getSession("profile").employeeTransient.gender;
    var familyId = $stateParams.id;
    var arrCompanyRef = Main.getSession("profile").companyReference;
    console.log(arrCompanyRef);

    var refSelectAlive = Main.getDataReference(arrCompanyRef,'myhr','family','alive');
    var refSelectNationality = Main.getDataReference(arrCompanyRef,'myhr','family','nationality');
    var refSelectGender = Main.getDataReference(arrCompanyRef,'myhr','family','gender');
    var refSelectMaritalStatus = Main.getDataReference(arrCompanyRef,'myhr','family','maritalstatus');
    var refSelectRelationship = Main.getDataReference(arrCompanyRef,'myhr','family','relationship');
    console.log("refSelectNationality",refSelectNationality);
    $scope.image = "img/placeholder.png";
    $scope.family = {};
    console.log(Main.getSession("profile"));
   // $scope.selectMaritalStatus = Main.getSelectMaritalStatus();
    //$scope.selectRelationship = Main.getSelectFamilyRelationShip();
    $scope.selectBloodType = Main.getSelectBloodType();
    //$scope.selectGender = Main.getSelectGender();
    $scope.selectAliveStatus = []; // Main.getSelectProvince();
    $scope.selectNationality = [];
    $scope.selectGender = [];
    $scope.selectRelationship = [];
    $scope.selectMaritalStatus = [];
    $scope.imageData = null;
    $scope.isEdit = false;
    $scope.family.images = [];
    $scope.family.imagesData = [];
    var messageValidation = "";

    // $scope.family.birthDate = new Date();

    var datepicker = {
      callback: function (val) {  //Mandatory
        console.log(val);
        $scope.family.birthDate = val;
      },
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      dateFormat:"yyyy-MM-dd",
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(datepicker);
    };

    $scope.removeChoice = function(){
        var lastItem = $scope.family.imagesData.length-1;
        $scope.family.imagesData.splice(lastItem);
        $scope.family.images.splice(lastItem);
    }

    $scope.addPicture = function () {
          if($scope.family.images.length > 2) {
            $scope.errorAlert("Only 3 pictures can be upload");
            return false;
          }
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
                                  // alert(imageData);
                                  // $rootScope.user.photo = "data:image/jpeg;base64," + imageData;
                                  $scope.family.images.push({'image':"data:image/jpeg;base64," + imageData});
                                  $scope.family.imagesData.push({'image': imageData});
                              }, function (err) {
                                  appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                              });
                          }, false);

                          break;
                      case 1: // Select From Gallery
                          document.addEventListener("deviceready", function () {
                              $cordovaCamera.getPicture(appService.getLibraryOptions()).then(function (imageData) {
                                   $scope.family.images.push({'image':"data:image/jpeg;base64," + imageData});
                                   $scope.family.imagesData.push({'image': imageData});
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

    $scope.addPicture1 = function(){
        if($scope.family.images.length > 3) {
          $scope.errorAlert("Only 3 pictures can be upload");
          return false;
        }

        $scope.family.images.push({'image':"img/placeholder.png"});
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
            $scope.errorAlert("an error occured while take picture");
        });
    }

    $scope.resetForm  = function(){
      $scope.family = {};
    }

    function sendData() {
        $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
        });
        var attachment = [];
        if($scope.family.imagesData.length > 0) {
            for (var i = $scope.family.imagesData.length - 1; i >= 0; i--) {
                var objAttchament = {"image":$scope.family.imagesData[i].image};
                attachment.push(objAttchament);
            };
        }
        if($scope.family.birthDate != undefined)
            $scope.family.birthDate = $filter('date')(Date.now(), "yyyy-MM-dd");

        $scope.family.attachments = attachment;  
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/family';
         if($stateParams.id != undefined && $stateParams.id != '0') {
            urlApi = Main.getUrlApi() + '/api/user/family/'+$stateParams.id;
        }
        var data = JSON.stringify($scope.family);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
        
    }

    $scope.submitForm = function(){
     
      if(verificationForm($scope.family)){
        ionicSuperPopup.show({
           title: "Are you sure?",
           text: "Are you sure the data submitted is correct ?",
           type: "warning",
           showCancelButton: true,
           confirmButtonColor: "#DD6B55",
           confirmButtonText: "Yes",
           closeOnConfirm: false
         },
        function(isConfirm){
             if (isConfirm) {
                sendData();
             }
            
           
        });
      }else {
          $scope.warningAlert(messageValidation);
      }
    }

    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.successAlert(res.message);
      $rootScope.refreshFamilyCtrl=true;
      $scope.goBack('app.family');
    }

    var successDetailRequest = function (res){
      $ionicLoading.hide();
      $scope.family = res;
      $scope.family.images = [];
      $scope.family.imagesData = [];
    }

    function getDetailFamily(familyId){
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
      });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/family/'+familyId;
      Main.requestApi(accessToken,urlApi,successDetailRequest, $scope.errorRequest);
    }

    function initMethod(){
        if(refSelectAlive != undefined && refSelectAlive != '') {
              $scope.selectAliveStatus = JSON.parse(refSelectAlive);
        }

        if(refSelectNationality != undefined && refSelectNationality != '') {
              $scope.selectNationality = JSON.parse(refSelectNationality);
        }
        if(refSelectGender != undefined && refSelectGender != '') {
              $scope.selectGender = JSON.parse(refSelectGender);
        }
        
        if(refSelectMaritalStatus != undefined && refSelectMaritalStatus != '') {
              $scope.selectMaritalStatus = JSON.parse(refSelectMaritalStatus);
        }

        if(refSelectRelationship != undefined && refSelectRelationship != '') {
              $scope.selectRelationship = JSON.parse(refSelectRelationship);
        }
        
        if($stateParams.id != undefined && $stateParams.id != '0') {
            getDetailFamily($stateParams.id);
        }
    }
    
    // invalid access token error: "invalid_token" 401
    function verificationForm(family){
        if(family.name == undefined || family.name==''){
            messageValidation = "Name can't be empty";
            return false;
        }else if(family.birthPlace == undefined || family.birthPlace==''){
            messageValidation = "Place of Birth can't be empty";
            return false;
        }else if(family.birthDate == undefined){
            messageValidation = "Date of Birth can't be empty";
            return false;
        }else if(family.aliveStatus ==undefined || family.aliveStatus=='' ) {
            messageValidation = "Alive Status can't be empty";
            return false;
        }else if(family.gender ==undefined || family.gender=='') {
            messageValidation = "Gender can't be empty";
            return false;
        }else if(family.relationship ==undefined || family.relationship=='') {
            messageValidation = "Relationship can't be empty";
            return false;
        }else if(family.maritalStatus ==undefined || family.maritalStatus =='') {
            messageValidation = "Marital Status can't be empty";
            return false;
        }else if(family.nircNo ==undefined || family.nircNo =='') {
            messageValidation = "Identity Card No can't be empty";
            return false;
        }else if(family.familyCardNo ==undefined || family.familyCardNo =='') {
            messageValidation = "Family Card No can't be empty";
            return false;
        }else if(family.district ==undefined || family.district =='') {
            messageValidation = "District can't be empty";
            return false;
        }else if(family.subDistrict ==undefined || family.subDistrict =='') {
            messageValidation = "Sub District can't be empty";
            return false;
        }else if(family.rt ==undefined || family.rt =='') {
            messageValidation = "RT can't be empty";
            return false;
        }else if(family.rw ==undefined || family.rw =='') {
            messageValidation = "RW can't be empty";
            return false;
        }else if(family.address ==undefined || family.address =='') {
            messageValidation = "Address can't be empty";
            return false;
        }else if(family.nationality ==undefined || family.nationality =='') {
            messageValidation = "Nationality can't be empty";
            return false;
        }else if(family.bloodType ==undefined || family.bloodType=='' ) {
            messageValidation = "Blood Type can't be empty";
            return false;
        }

        if(genderEmp != undefined && family.relationship != undefined) {
            if(family.relationship == 'Suami' && genderEmp == "Male") {
                 messageValidation = "You can't select this item in relationship. Your gender is '" + genderEmp + "'.";
                 return false;
            }

            if(family.relationship == 'Istri' && genderEmp == "Female") {
                messageValidation = "You can't select this item in relationship. Your gender is '" + genderEmp + "'.";
               return false;
            }
        }

        return true;
    }


    initMethod();
    
})




.controller('AddressCtrl', function($stateParams,$ionicHistory,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    
    $scope.$on('$ionicView.beforeEnter', function (event,data) {
        if(data.direction != undefined && data.direction!='back')
            initMethod();

        if( $rootScope.refreshAddressCtrl) {
            initMethod();
        }
        $rootScope.refreshAddressCtrl = false;
      
    });




    $scope.refresh = function(){
      initMethod();
    }

    $scope.address = [];
    
    $scope.goToAddAddress = function () {
        $state.go('app.addaddress',{'id':0});
    };

    $scope.goToDetails = function (idx) {
      $state.go('app.detailaddress',{'idx':idx,'edit':'true'});
    };


    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.address = res;
      $scope.$broadcast('scroll.refreshComplete');

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
          template: '<ion-spinner></ion-spinner>'
      });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/address';
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }

})


.controller('EditAddressCtrl', function($stateParams,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
   
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    var addressIdx = $stateParams.idx;
    var messageValidation = "";
    $scope.address = {};
    if(addressIdx != null)
      //$scope.address = $rootScope.address[addressIdx];

    $scope.selectStayStatus = Main.getSelectStayStatus();
    var arrCompanyRef = Main.getSession("profile").companyReference;
    var refSelectProvince = Main.getDataReference(arrCompanyRef,'address','province','indonesia');
    $scope.selectProvince = []; // Main.getSelectProvince();
    $scope.selectCity=Main.getSelectCity();
    $scope.selectCountry=Main.getSelectCountry();
   
    $scope.submitForm = function(){
        if(verificationForm($scope.address)) {
            var dataSubmit = {address: $scope.address.address, rt: $scope.address.rt, rw:$scope.address.rw, country:$scope.address.country, province:$scope.address.province, city:$scope.address.city, zipCode:$scope.address.zipCode, phone: $scope.address.phone, stayStatus : $scope.address.stayStatus};
            $ionicLoading.show({
              template: '<ion-spinner></ion-spinner>'
            });
            var accessToken = Main.getSession("token").access_token;
            var urlApi = Main.getUrlApi() + '/api/user/address/'+$scope.address.id;
            var data = JSON.stringify(dataSubmit);
            Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
        }else {
            $scope.warningAlert(messageValidation);
        }
    }

    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.successAlert(res.message);
      $scope.goBack("app.address");
      //$scope.family = res;
    }

    initMethod();
    
    function initMethod(){
        if(refSelectProvince != undefined && refSelectProvince != '') {
              $scope.selectProvince = JSON.parse(refSelectProvince);
        }
        
    }

    function verificationForm(address){
        if(address.country == undefined || address.country ==''){
            messageValidation = "Country can't be empty";
            return false;
        }else if(address.province == undefined || address.province == ''){
            messageValidation = "Province can't be empty";
            return false;
        }else if(address.city == undefined || address.city == ''){
            messageValidation = "City can't be empty";
            return false;
        }else if(address.district == undefined || address.district == ''){
            messageValidation = "District can't be empty";
            return false;
        }else if(address.subdistrict == undefined || address.subdistrict == ''){
            messageValidation = "Sub District can't be empty";
            return false;
        }else if(address.rt == undefined || address.rt == ''){
            messageValidation = "RT can't be empty";
            return false;
        }else if(address.rw == undefined || address.rw == ''){
            messageValidation = "RW can't be empty";
            return false;
        }else if(address.address == undefined || address.address == ''){
            messageValidation = "Address can't be empty";
            return false;
        }else if(address.stayStatus == undefined || address.stayStatus == ''){
            messageValidation = "Stay Status can't be empty";
            return false;
        }
        return true;
    }

   

   

})


.controller('AddAddressCtrl', function(ionicSuperPopup,$stateParams, $ionicPopup, $ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
   
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    var messageValidation = "";
    //$scope.selectStayStatus = Main.getSelectStayStatus();
    var arrCompanyRef = Main.getSession("profile").companyReference;
    var refSelectProvince = Main.getDataReference(arrCompanyRef,'address','province','indonesia');
    var refStayStatus = Main.getDataReference(arrCompanyRef,'myhr','address','staystatus');
    $scope.selectProvince = []; // Main.getSelectProvince();
    $scope.selectStayStatus = [];
   

    // $scope.selectProvince = Main.getSelectProvince();
    $scope.selectCity=Main.getSelectCity();
    $scope.selectCountry=Main.getSelectCountry();

    $scope.resetForm  = function(){
      $scope.address = {};
    }

    $scope.onSelectProvince = function() {
        $scope.labelProvince = $scope.address.province;
    }

    function sendData(){
         $ionicLoading.show({
                    template: 'Submit...'
          });
          var accessToken = Main.getSession("token").access_token;
          var urlApi = Main.getUrlApi() + '/api/user/address';
          if($stateParams.id != undefined && $stateParams.id != '0') {
              urlApi = Main.getUrlApi() + '/api/user/address/'+ $stateParams.id;
          }

          var data = JSON.stringify($scope.address);
          Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
      
    }

    $scope.submitForm = function(){
      if(verificationForm($scope.address)){
        ionicSuperPopup.show({
           title: "Are you sure?",
           text: "Are you sure the data submitted is correct ?",
           type: "warning",
           showCancelButton: true,
           confirmButtonColor: "#DD6B55",
           confirmButtonText: "Yes",
           closeOnConfirm: false},
        function(isConfirm){
             if (isConfirm) {
                sendData();
             }
        });
      }else {
          $scope.warningAlert(messageValidation);
      }

    }

    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.successAlert(res.message);
      $rootScope.refreshAddressCtrl = true;
      $scope.goBack("app.address");
      //$scope.family = res;
    }

    
    
    function initData(){
        $scope.address = {};
        $scope.labelProvince = "Select Province";
    }

    function successDetailRequest(res){
        $ionicLoading.hide();
        $scope.address = res;
        $scope.labelProvince = res.province;
    }

    function getDetailAddress(id){
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/address/'+id;
        Main.requestApi(accessToken,urlApi,successDetailRequest, $scope.errorRequest);
    }


    function initModule(){
        initData();

        if(refSelectProvince != undefined && refSelectProvince != '') {
              $scope.selectProvince = JSON.parse(refSelectProvince);
        }

        if(refStayStatus != undefined && refStayStatus != '') {
              $scope.selectStayStatus = JSON.parse(refStayStatus);
        }
        

        if($stateParams.id != undefined && $stateParams.id != '0') {
            getDetailAddress($stateParams.id);
        }
    }
    // invalid access token error: "invalid_token" 401
    function verificationForm(address){
        if(address.country == undefined || address.country ==''){
            messageValidation = "Country can't be empty";
            return false;
        }else if(address.province == undefined || address.province == ''){
            messageValidation = "Province can't be empty";
            return false;
        }else if(address.city == undefined || address.city == ''){
            messageValidation = "City can't be empty";
            return false;
        }else if(address.district == undefined || address.district == ''){
            messageValidation = "District can't be empty";
            return false;
        }else if(address.subdistrict == undefined || address.subdistrict == ''){
            messageValidation = "Sub District can't be empty";
            return false;
        }else if(address.rt == undefined || address.rt == ''){
            messageValidation = "RT can't be empty";
            return false;
        }else if(address.rw == undefined || address.rw == ''){
            messageValidation = "RW can't be empty";
            return false;
        }else if(address.address == undefined || address.address == ''){
            messageValidation = "Address can't be empty";
            return false;
        }else if(address.stayStatus == undefined || address.stayStatus == ''){
            messageValidation = "Stay Status can't be empty";
            return false;
        }
        return true;
    }

    $scope.$on('$ionicView.beforeEnter', function (event,data) {
        if(data.direction != undefined && data.direction!='back')
            initModule();
    });
    initModule();

})



.controller('DetailAddressCtrl', function($ionicHistory , $stateParams,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
  
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    var addressIdx = $stateParams.idx;
    $scope.canEdit = $stateParams.edit;
    $scope.address = {};

    function successDetailRequest(res){
        $ionicLoading.hide();
        $scope.address = res;
    }

    function getDetailAddress(id){
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/address/'+id;
        Main.requestApi(accessToken,urlApi,successDetailRequest, $scope.errorRequest);
    }
    
    $scope.goEditAddress = function () {
     
       $state.go('app.addaddress',{'id':$stateParams.idx});
    }

 

     $scope.$on('$ionicView.beforeEnter', function (event,data) {
        getDetailAddress($stateParams.idx);
    });

   
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
      if( $rootScope.refreshCertificationCtrl) {
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
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }
  })

.controller('AddCertificationCtrl', function($filter,ionicDatePicker,$ionicPopup, appService,$ionicActionSheet,$cordovaCamera,$ionicHistory,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {

  if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.certification = {};
    $scope.selectRelationship = {};
    $scope.selectCertificationType ={};
    $scope.imageData = null;
    $scope.image = "img/placeholder.png";
    $scope.imageCertification = {};
    $scope.imageCertification.images = [];
    $scope.imageCertification.imagesData = [];
    $scope.certification.expired = new Date();
    var datepicker = {
        callback: function (val) {  //Mandatory
          $scope.certification.expired = val;
        },
        inputDate: new Date(),      //Optional
        mondayFirst: true,          //Optional
        dateFormat:"yyyy-MM-dd",
        closeOnSelect: false,       //Optional
        templateType: 'popup'       //Optional
    };

    $scope.openDatePicker = function(){
        ionicDatePicker.openDatePicker(datepicker);
    };

    var messageValidation = ""

    
    $scope.removeChoice = function(){
        var lastItem = $scope.imageCertification.imagesData.length-1;
        $scope.imageCertification.imagesData.splice(lastItem);
        $scope.imageCertification.images.splice(lastItem);
    }



    $scope.addPicture = function () {
          if($scope.imageCertification.images.length > 2) {
            $scope.warningAlert("Only 3 pictures can be upload");
            return false;
          }
        

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
                                  // alert(imageData);
                                  // $rootScope.user.photo = "data:image/jpeg;base64," + imageData;
                                  $scope.imageCertification.images.push({'image':"data:image/jpeg;base64," + imageData});
                                  $scope.imageCertification.imagesData.push({'image': imageData});
                              }, function (err) {
                                  appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                              });
                          }, false);

                          break;
                      case 1: // Select From Gallery
                          document.addEventListener("deviceready", function () {
                              $cordovaCamera.getPicture(appService.getLibraryOptions()).then(function (imageData) {
                                  // $rootScope.user.photo = "data:image/jpeg;base64," + imageData;
                                   $scope.imageCertification.images.push({'image':"data:image/jpeg;base64," + imageData});
                                   $scope.imageCertification.imagesData.push({'image': imageData});
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
            $scope.errorAlert("an error occured while take picture");
        });
    }

    $scope.resetForm  = function(){
      $scope.certification = {};
    }


    $scope.submitForm = function(){
      if(verificationForm($scope.certification)){

        if($scope.imageCertification.imagesData.length < 1) {
            $scope.errorAlert("You must add at least 1 attachment.");
            return false;
        }

        if($scope.certification.type != 'Period') {
            $scope.certification.expired = null;
        }else {
            $scope.certification.expired = $filter('date')(new Date($scope.certification.expired),'yyyy-MM-dd');
        }

       

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: '<h5>Are you sure the data submitted is correct ?</h5>',
            cancelText: 'Cancel',
            okText: 'Yes'
          }).then(function(res) {
              if (res) {
                  $ionicLoading.show({
                    template: 'Processing...'
                  });
                  var attachments = [];
                  if($scope.imageCertification.imagesData.length > 0) {
                      for (var i = $scope.imageCertification.imagesData.length - 1; i >= 0; i--) {
                          var objAttchament = {"image":$scope.imageCertification.imagesData[i].image};
                          attachments.push(objAttchament);
                      };
                  }

                  $scope.certification.attachments = attachments;

                  var accessToken = Main.getSession("token").access_token;
                  var urlApi = Main.getUrlApi() + '/api/myprofile/certification';
                  var data = JSON.stringify($scope.certification);
                  Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
              }
              
          });
      } else {
          $scope.warningAlert(messageValidation);
      }
      
    }

    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.successAlert(res.message);
      $rootScope.refreshCertificationCtrl = true;
      $scope.goBack("app.certification");
      
    }


    initMethod();
    
    function initMethod(){
        
        $scope.selectCertificationType = [{id:"Lifetime"},{id:"Period"}];
    }

    // invalid access token error: "invalid_token" 401
    function verificationForm(certification){
        if(certification.name == undefined || certification.name=='' ){
            messageValidation = "Name can't be empty";
            return false;
        }else if(certification.principle == undefined || certification.principle==''){
            messageValidation = "Principle can't be empty";
            return false;
        }else if(certification.type == undefined || certification.type==''){
            messageValidation = "Type can't be empty";
            return false;
        }
        return true;
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
        var product = {id:1,image:item};
        $scope.detailImage = product;
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
          Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
      }else {
          if(status==500)
            $scope.errorAlert(err.message);
          else
            $scope.errorAlert("Please Check your connection");
      }
     
    }

    var successRefreshToken = function(res){
      Main.setSession("token",res);
    }

    var errRefreshToken = function(err, status) {
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
      $scope.errorAlert("ID Certification can not be null");
    }

    
   
})



.controller('ChangeMaritalStatusCtrl', function(ionicSuperPopup,$ionicPopup, $ionicActionSheet,appService,$ionicHistory,$cordovaCamera,$stateParams,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {

    var arrCompanyRef = Main.getSession("profile").companyReference;
    var arrItens = Main.getDataReference(arrCompanyRef,'personal','information','maritalstatus');
    $scope.itens = JSON.parse(arrItens);
    var dataapprovalId = $stateParams.dataApprovalId;
    $scope.currentStatus = $stateParams.currentStatus;
    $scope.showButton = true;
    $scope.dataApprovalStatus = null;

    $scope.image = "img/placeholder.png";
    $scope.maritalStatus = {};
    $scope.maritalStatus.images = []; 
    $scope.maritalStatus.imagesData = []; 
    $scope.imageData ;
    var messageValidation = "";

    $scope.removeChoice = function(){
        var lastItem = $scope.maritalStatus.imagesData.length-1;
        $scope.maritalStatus.imagesData.splice(lastItem);
        $scope.maritalStatus.images.splice(lastItem);
    }

    $scope.addPicture = function () {
          if($scope.maritalStatus.images.length > 2) {
            $scope.errorAlert("Only 3 pictures can be upload");
            return false;
          }
        

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
                                  // alert(imageData);
                                  // $rootScope.user.photo = "data:image/jpeg;base64," + imageData;
                                  $scope.maritalStatus.images.push({'image':"data:image/jpeg;base64," + imageData});
                                  $scope.maritalStatus.imagesData.push({'image': imageData});
                              }, function (err) {
                                  appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                              });
                          }, false);

                          break;
                      case 1: // Select From Gallery
                          document.addEventListener("deviceready", function () {
                              $cordovaCamera.getPicture(appService.getLibraryOptions()).then(function (imageData) {
                                  // $rootScope.user.photo = "data:image/jpeg;base64," + imageData;
                                   $scope.maritalStatus.images.push({'image':"data:image/jpeg;base64," + imageData});
                                   $scope.maritalStatus.imagesData.push({'image': imageData});
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
           
            //$scope.image =  imageData;
        }, function (err) {
            // An error occured. Show a message to the user
            $scope.errorAlert("an error occured while take picture");
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
      $scope.successAlert(res.message);
      goBack("app.biodata");
    }

    var errorRequest = function (err, status){
      $ionicLoading.hide();
      if(status == 401) {
          var refreshToken = Main.getSession("token").refresh_token
          Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
      }else {
          if(status==500)
            $scope.errorAlert(err.message);
          else
            $scope.errorAlert("Please Check your connection");
      }
     
    }

    var successRefreshToken = function(res){
      Main.setSession("token",res);
    }

    var errRefreshToken = function(err, status) {
    }


    function validationForm(selected){
        if(selected == undefined || selected == ""){
            messageValidation = "You must pick your new marital status!";
            return false;
        }

        if(selected == $scope.currentStatus) {
            messageValidation = "You can't pick the same marital status!";
            return false;
        }
        return true;
    }

    function sendData(){
        var idRef = Main.getSession("profile").employeeTransient.id;
         var jsonData = '{"maritalStatus":"'+$scope.selected+'"}';
         var attachment = [];
         // var objAttchament = {"image":$scope.imageData};
         // attachment.push(objAttchament);

         if($scope.maritalStatus.imagesData.length > 0) {
              for (var i = $scope.maritalStatus.imagesData.length - 1; i >= 0; i--) {
                  var objAttchament = {"image":$scope.maritalStatus.imagesData[i].image};
                  attachment.push(objAttchament);
              };
          }

         var dataStr = {task:"CHANGEMARITALSTATUS",data:jsonData,idRef:idRef,attachments:attachment};
         
         $ionicLoading.show({
            template: 'Submit Request...'
          });
          var accessToken = Main.getSession("token").access_token;
          var urlApi = Main.getUrlApi() + '/api/user/workflow/dataapproval';
          var data = JSON.stringify(dataStr);
          Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);
    }

    $scope.send = function (){

      if(validationForm($scope.selected)){
         
        ionicSuperPopup.show({
           title: "Are you sure?",
           text: "Are you sure the data submitted is correct ?",
           type: "warning",
           showCancelButton: true,
           confirmButtonColor: "#DD6B55",
           confirmButtonText: "Yes",
           closeOnConfirm: false},
        function(isConfirm){
             if (isConfirm) {
                sendData();
             }
            
           
        });
      }else {
          $scope.warningAlert(messageValidation);
      }
      

       

    }

    var successDataApproval = function (res){
      $ionicLoading.hide();
      var dataApproval = res;
      $scope.dataApprovalStatus = dataApproval.processingStatus; 
      if(dataApproval.processingStatus != null && dataApproval.processingStatus.toLowerCase()=='request'){
          $scope.showButton = false;
          
      }

      if(dataApproval.attachments != null && dataApproval.attachments.length > 0)
            $scope.image = dataApproval.attachments[0].image;
        

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


