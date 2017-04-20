angular.module('leave.controllers', [])

.controller('leaveRequestCtrl',function($rootScope, $scope,$state , AuthenticationService, Main,Aprvs) {
   $scope.aprvs=Aprvs.all();

 })

.controller('requestLeaveCtrl',function($rootScope, $scope,$state , AuthenticationService, Main,Absents) {
  $scope.absents=Absents.all();
  
 })

.controller('approvalCtrl',function($rootScope, $scope,$state , AuthenticationService, Main,Approves) {
   $scope.approves=Approves.all();

 })

angular.module('starter', ['ionic', 'ionic-modal-select'])