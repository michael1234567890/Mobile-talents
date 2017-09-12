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
      console.log(res);
      $scope.leaves = res;
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

    function getLeaves(){
      $ionicLoading.show({
          template: 'Loading ...'
      });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/leave/pending';
      Main.requestApi(accessToken,urlApi,successRequest, errorRequest);
    }

    function initMethod(){
      getLeaves();      
    }

    initMethod();


})

.controller('AddLeaveCtrl', function($filter, $stateParams, $ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    var startDate = $filter('date')(new Date(),'yyyy-MM-dd');
    var endDate = $filter('date')(new Date(),'yyyy-MM-dd');
    
    $scope.leaveType = {};
    $scope.leave = {comment:""}

    $scope.onezoneDatepicker = { 
        date: new Date(), 
        mondayFirst: false, 
        disablePastDays: false, 
        disableSwipe: false, 
        disableWeekend: false, 
        showDatepicker: false, 
        showTodayButton: true, 
        calendarMode: true, 
        hideCancelButton: false, 
        hideSetButton: false, 
        highlights: [ { date: new Date(2016, 6, 6), color: '#8FD4D9', textColor: '#f00', }], 
        callback: function(value) { 
            startDate = $filter('date')(new Date(value),'yyyy-MM-dd');
        } 
    }

    $scope.onezoneDatepicker2 = { 
        date: new Date(), 
        mondayFirst: false, 
        disablePastDays: false, 
        disableSwipe: false, 
        disableWeekend: false, 
        showDatepicker: false, 
        showTodayButton: true, 
        calendarMode: true, 
        hideCancelButton: false, 
        hideSetButton: false, 
        highlights: [ { date: new Date(2016, 6, 6), color: '#8FD4D9', textColor: '#f00', }], 
        callback: function(value) { 
            endDate = $filter('date')(new Date(value),'yyyy-MM-dd');
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

    var successRequest = function (res){
      $ionicLoading.hide();
      alert(res.message);
      console.log($scope.requests);
    }

    var errorRequest = function (err, status){
      $ionicLoading.hide();
      if(status == 401) {
        var refreshToken = Main.getSession("token").refresh_token
        console.log("need refresh token");
        Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
      }else {
        alert(err.message);
      }

      console.log(err);
      console.log(status);
    }


    $scope.sendRequestLeave = function(){
        var strJson = {leaveType:$scope.leaveType.id,startTime:startDate,endTime:endDate,comment:$scope.leave.comment};
         $ionicLoading.show({
          template: 'Processing...'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/leave';
        var data = JSON.stringify(strJson);
        console.log(data);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);

    }


     
     var leaveIdx = $stateParams.idx;
     console.log("leaveIdx " + leaveIdx);
     console.log($rootScope.leaveTypeChoose);
     if(leaveIdx != null && $rootScope.leaveTypeChoose != undefined) {
     		$scope.leaveType = $rootScope.leaveTypeChoose[leaveIdx];

     }

})


.controller('ListLeaveCtrl', function(appService,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.leaves = appService.getLeaves();
    console.log("leaves " + $scope.leaves.length);
   
   
    


})

.controller('DetailLeaveCtrl', function($ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
 
 
})

.controller('ChooseLeaveCtrl', function($ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    // $scope.leaveType = [{id:1, idx:0,name:"Casual",balance:10,used:2},{id:2,idx:1,name:"Pregnance",balance:30,used:10}];
    $scope.entitlement = [];
   // $rootScope.leaveTypeChoose = $scope.leaveType;

    $scope.goToLeave = function(idx){
    	$state.go('app.addleave',{'idx':idx});
    }

    $scope.refresh = function(){
      initMethod();
    }
    
    var successRequest = function (res){
      $ionicLoading.hide();
      console.log(res);
      $scope.team = res;
      $rootScope.leaveTypeChoose = [];
      for(var i=0;i<res.length;i++) {
        var obj = res[i];
        obj.idx = i;
        $rootScope.leaveTypeChoose.push(obj);
      }

      $scope.entitlement = $rootScope.leaveTypeChoose;
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

    function getEntitlement(){
      $ionicLoading.show({
          template: 'Loading ...'
      });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/leave/entitlement';
      Main.requestApi(accessToken,urlApi,successRequest, errorRequest);
    }

    function initMethod(){
      getEntitlement();      
    }

    initMethod();



})