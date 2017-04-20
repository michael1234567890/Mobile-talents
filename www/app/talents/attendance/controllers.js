angular.module('attendance.controllers', [])

.controller('attendCtrl',function($rootScope, $scope,$state , AuthenticationService, Main) {
 

 })

.controller('TimeCtrl', function($scope, $interval) {

var tick = function(){

  $scope.clock = Date.now();
}
tick();
$interval(tick,1000);
})


