angular.module('leave.controllers', [])
.controller('HomeLeaveCtrl', function($ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.leaves = [];
    $scope.refresh = function(){
      initMethod();
    }
    
    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.leaves = res;
      console.log("leaves ....");
      console.log($scope.leaves );
      $scope.$broadcast('scroll.refreshComplete');

    }


    function getLeaves(){
      $ionicLoading.show({
          template: 'Loading ...'
      });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/tmrequest/bystatus?module=Time Management&status=pending';
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }

    function initMethod(){
      if(Main.getEnvironment() == 'production') {
          alert("This feature is not available");
          $scope.goBack('app.selfservice');
      }
      getLeaves();      
    }

    initMethod();


})

.controller('ChooseLeaveCategoryCtrl', function($ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.goToLeaveForm = function(category){
        $state.go("app.addleave",{'category':category});
    }

    $scope.categories = [{name:"Leave",description:"Leave Description"},{name:"Permission",description:"Permission Description"},{name:"Sick",description:"Sick Description"},{name:"Overtime",description:"Overtime Description"},{name:"Edit Attendance",description:"Edit Attendance Description"}];

})


.controller('LeaveConfirmationCtrl', function(appService,$ionicActionSheet,$cordovaCamera,$stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
      var leaveVerification = $rootScope.data.requestLeaveVerification;
      $scope.defaultImage = "img/placeholder.png";
      $scope.images = [];  
      $scope.requestHeader = {};
      $scope.requestHeader.attachments = []; 

      $scope.$on('$ionicView.beforeEnter', function (event,data) {
          initMethod();
      });

      var successRequest = function (res){
          $ionicLoading.hide();
          $scope.goTo("app.selfservicesuccess");
      }

      $scope.removeChoice = function(){
        var lastItem = $scope.requestHeader.attachments.length-1;
        $scope.requestHeader.attachments.splice(lastItem);
        $scope.images.splice(lastItem);
      }

    $scope.addPicture = function () {
          if($scope.images.length > 2) {
            alert("Only 3 pictures can be upload");
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
                                  $scope.images.push({'image':"data:image/jpeg;base64," + imageData});
                                  $scope.requestHeader.attachments.push({'image': imageData});
                              }, function (err) {
                                  appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                              });
                          }, false);

                          break;
                      case 1: // Select From Gallery
                          document.addEventListener("deviceready", function () {
                              $cordovaCamera.getPicture(appService.getLibraryOptions()).then(function (imageData) {
                                   $scope.images.push({'image':"data:image/jpeg;base64," + imageData});
                                   $scope.requestHeader.attachments.push({'image': imageData});
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


      $scope.submitForm = function(){
          if($scope.requestHeader.attachments.length > -1) {
              $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
              });
              var accessToken = Main.getSession("token").access_token;
              var urlApi = Main.getUrlApi() + '/api/user/tmrequestheader/leave';
              var attachment = [];
              
              /*if($scope.requestHeader.attachments.length > 0) {
                  for (var i = $scope.requestHeader.attachments.length - 1; i >= 0; i--) {
                      var objAttchament = {"image":$scope.requestHeader.attachments[i].image};
                      attachment.push(objAttchament);
                  };
              }*/
              leaveVerification = $rootScope.data.requestLeaveVerification;
              leaveVerification.startDate = $filter('date')(new Date(leaveVerification.startDate),'yyyy-MM-dd');
              leaveVerification.endDate = $filter('date')(new Date(leaveVerification.endDate),'yyyy-MM-dd');
              // leaveVerification.attachments = attachment; 

              var data = JSON.stringify(leaveVerification);
              Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
          }else {
              alert("You must add at least 1 attachment.");
          }
      }

      

      function initMethod(){
          leaveVerification = $rootScope.data.requestLeaveVerification;
          console.log("leaveVerification",leaveVerification);
          $scope.total = 0;
          $scope.totalBalance =0;
          $scope.type = "-";
          $scope.categoryType = "-";
          $scope.images = [];  
          $scope.requestHeader = {};
          $scope.requestHeader.attachments = []; 
          if(leaveVerification != null) {
                $scope.categoryType = leaveVerification.categoryType;
                $scope.total = leaveVerification.total;
                $scope.type = leaveVerification.type;
                $scope.startDate = leaveVerification.startDate;
                $scope.endDate = leaveVerification.endDate;
                $scope.totalBalance = leaveVerification.totalBalance;

          }
      }
      
      initMethod();

 })

.controller('AddLeaveCtrl', function($timeout,$filter, $stateParams, $ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main,ionicDatePicker) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    var startDate = $filter('date')(new Date(),'yyyy-MM-dd');
    var endDate = $filter('date')(new Date(),'yyyy-MM-dd');
    var employee= Main.getSession("profile").employeeTransient.id;
    $scope.leaveCategory = $stateParams.category;
    $scope.leaveType = {};
    $scope.selectHour = Main.getSelectHour();
    $scope.selectMinutes = Main.getSelectFiveteenMin();
    $scope.selectType = [{id:"Annual"}];
    $scope.leave = {remark:"",startDate:new Date(),endDate:new Date(),remark:"",type:""};
    $scope.balance = {balanceEnd:"-",balanceUsed:"-"};

    
    console.log(Main.getSession("profile"));

    var datepicker = {
        callback: function (val) {  //Mandatory
          $scope.leave.startDate = val;
        },
        inputDate: new Date(),      //Optional
        mondayFirst: true,          //Optional
        dateFormat:"yyyy-MM-dd",
        closeOnSelect: false,       //Optional
        templateType: 'popup'       //Optional
    };

    var datepicker1 = {
        callback: function (val) {  //Mandatory
          $scope.leave.endDate = val;
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

    $scope.openDatePicker1 = function(){
        ionicDatePicker.openDatePicker(datepicker1);
    };

    var successRequest = function (res){
      $timeout(function () {
          $rootScope.data.requestLeaveVerification = res;
         
          console.log(res);
          $ionicLoading.hide();
          $state.go("app.leaveconfirmation");
        }, 1000);
    }

    var successGetBalance = function(res){
        $ionicLoading.hide();
        $scope.balance = res;
    }
    function getCurrentBalanceType(module,category,type){
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmbalance/currenttype?module='+module+'&category='+category+'&type='+type;
        Main.requestApi(accessToken,urlApi,successGetBalance, $scope.errorRequest);
    }
    $scope.onChangeType = function(){
         $scope.balance = {balanceEnd:"-",balanceUsed:"-"};
        if($scope.leave.type != ""){
            var module = "time management";
            getCurrentBalanceType(module,$scope.leaveCategory,$scope.leave.type);
        }
        
    }

    $scope.submitForm = function(){
        var strJson = {leaveType:$scope.leaveType.id,startTime:startDate,endTime:endDate,comment:$scope.leave.comment};
         $ionicLoading.show({
          template: 'Processing...'
        });
         $scope.leave.module="Time Management";
         $scope.leave.categoryType="Leave";
         $scope.leave.type="Annual";
         $scope.leave.startDate=$filter('date')(new Date($scope.leave.startDate),'yyyy-MM-dd');
         $scope.leave.endDate=$filter('date')(new Date($scope.leave.endDate),'yyyy-MM-dd');
         $scope.leave.workflow="SUBMITAT";
         $scope.leave.employee=employee;
        var accessToken = Main.getSession("token").access_token;
        // var urlApi = Main.getUrlApi() + '/api/user/tmrequest/attendance';
        var urlApi = Main.getUrlApi() + '/api/user/tmrequestheader/verificationleave';
        var data = JSON.stringify($scope.leave);
        console.log(data);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);

    }

     var successRequestType = function (res){
        $timeout(function () {
            if(res.length > 0) {
                Main.setSession("tmRequestType",res);
                $scope.requestType = res;
                console.log(Main.getSession("tmRequestType"));
                
            }
            $ionicLoading.hide();
        }, 1000);
    }
    
    function getRequestType(){
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmrequest/type?module=time management';
        Main.requestApi(accessToken,urlApi,successRequestType, $scope.errorRequest);
    }


    function initModule() {
        $scope.leave = {remark:"",startDate:new Date(),endDate:new Date(),remark:"",type:""};
        $scope.balance = {balanceEnd:"-",balanceUsed:"-"};
        if(Main.getSession("tmRequestType") == undefined)
            getRequestType();
        else
          $scope.requestType = Main.getSession("tmRequestType");
        
    }

    $scope.$on('$ionicView.beforeEnter', function (event,data) {
          if(data.direction != undefined && data.direction!='back')
            initModule();
    });
     
  })

.controller('ListLeaveCtrl', function($ionicPopover,$ionicLoading,$rootScope, $scope,$state , AuthenticationService, Main) {
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.leaves = [];
   
    $scope.gotoBenefitDetail = function(index){
          $state.go("app.benefitdetail");
    }

    $scope.refresh = function(){
        initMethod();  
    }
   
    var successRequest = function (res){
      $scope.leaves = res;
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    }

    initMethod();

    function initMethod(){
        getListBenefit();
    }
   

    function getListBenefit(){
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/tmrequest?module=Time Management';
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }
})