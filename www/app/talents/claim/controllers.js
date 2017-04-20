angular.module('claim.controllers', [])

.controller('submitClaimCtrl',function($rootScope, $scope,$state , AuthenticationService, Main) {
 

 })

.controller('claimListCtrl',function($rootScope, $scope,$state , AuthenticationService, Main,Sets) {
  $scope.sets = Sets.all();

 })

