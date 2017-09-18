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
      var urlApi = Main.getUrlApi() + '/api/user/tmrequest/bystatus?module=attendance&status=pending';
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

.controller('AddLeaveCtrl', function($filter, $stateParams, $ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main,ionicDatePicker) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    var startDate = $filter('date')(new Date(),'yyyy-MM-dd');
    var endDate = $filter('date')(new Date(),'yyyy-MM-dd');
    var employee= Main.getSession("profile").employeeTransient.id;

    $scope.leaveType = {};
    $scope.leave = {remark:""};
    $scope.leave.startDate= new Date();
    $scope.leave.endDate= new Date();  
    
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
      $ionicLoading.hide();
      alert(res.message);
      console.log($scope.requests);
    }


    $scope.submitForm = function(){
        var strJson = {leaveType:$scope.leaveType.id,startTime:startDate,endTime:endDate,comment:$scope.leave.comment};
         $ionicLoading.show({
          template: 'Processing...'
        });
         $scope.leave.module="Attendance";
         $scope.leave.categoryType="Annual";
         $scope.leave.type="Annual";
         $scope.leave.startDate=$filter('date')(new Date($scope.leave.startDate),'yyyy-MM-dd');
         $scope.leave.endDate=$filter('date')(new Date($scope.leave.endDate),'yyyy-MM-dd');
         $scope.leave.workflow="SUBMITAT";
         $scope.leave.employee=employee;

        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmrequest/attendance';
        var data = JSON.stringify($scope.leave);
        console.log(data);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);

    }


     
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
      var urlApi = Main.getUrlApi() + '/api/user/tmrequest?module=Attendance';
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }
})