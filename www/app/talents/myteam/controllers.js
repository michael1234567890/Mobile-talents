angular.module('myteam.controllers', [])
.controller('MyTeamCtrl', function($rootScope, $scope,$state , AuthenticationService, Main) {
	if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.goToDetails = function (idx) {
    	$state.go('app.myteamdetail',{'idx':idx});
    };

   
    $scope.team = {};
    var successProfile = function (res){
      $scope.team = res;
      $rootScope.team = [];
      for(var i=0;i<$scope.team.length;i++) {
      	var obj = $scope.team[i];
      	obj.idx = i;
      	$rootScope.team.push(obj);
      }
      $scope.team = $rootScope.team;
      console.log($scope.team);
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
   		getTeam();
   	}
   	// invalid access token error: "invalid_token" 401
   	function getTeam(){
   		var accessToken = Main.getSession("token").access_token;
   		var urlApi = Main.getUrlApi() + '/api/myprofile/team';
   		Main.requestApi(accessToken,urlApi,successProfile, errorProfile);
   	}
})

.controller('DetailTeamCtrl', function($stateParams,$rootScope, $scope,$state , AuthenticationService, Main) {
	if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.detail = {};

    var teamIdx = $stateParams.idx;
    if(teamIdx != null && $rootScope.team[teamIdx] != null) {
    	$scope.detail = $rootScope.team[teamIdx];
    	$scope.detail.fullName = $scope.detail.firstName + " " + $scope.detail.lastName;
    	console.log($scope.detail);
    }

   // console.log(teamIdx);

})

