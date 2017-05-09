angular.module('myteam.controllers', [])

.controller('MyTeamCtrl', function($ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
	  if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.goToDetails = function (idx) {
    	$state.go('app.myteamdetail',{'idx':idx});
    };

   
    $scope.team = [];
    var successProfile = function (res){
      $ionicLoading.hide();
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
      $ionicLoading.hide();
    	if(status == 401) {
    		var refreshToken = Main.getSession("token").refresh_token
    		console.log("need refresh token");
    		Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
    	}else {
        if(status == -1) {
          alert("Error : Problem with your connection.");
        }else {
          alert("Error : " + err.message);
        }
        
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
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
      });
   		var accessToken = Main.getSession("token").access_token;
   		var urlApi = Main.getUrlApi() + '/api/myprofile/team';
   		Main.requestApi(accessToken,urlApi,successProfile, errorProfile);
   	}
})

.controller('RequestApprovalCtrl', function($ionicLoading,$rootScope, $scope,$state , AuthenticationService, Main) {
  if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.requests = [];

    $scope.gotoDetailRequest = function(idx){
        $rootScope.requestSelected = $scope.requests[idx];
        $state.go('app.requestdetail',{'idx':idx});
    }

    $scope.refresh = function(){
      initMethod();
    }
    $scope.approval = function(action,id){
        var data = {"id":id,"status":action};
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/workflow/actionapproval';
        var data = JSON.stringify(data);

        console.log(data);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);

    }

    $scope.goToDetails = function (idx) {
      $rootScope.requestSelected = $scope.requests[idx];
      $state.go('app.requestDetail',{'idx':idx});
    };

   
    var successRequest = function (res){
      $scope.$broadcast('scroll.refreshComplete');
      for(var i=0;i<res.length;i++) {
        var obj = res[i];
        obj.idx = i;
        if(res[i].task == 'CHANGEMARITALSTATUS') {
           var change = res[i].data;
           var objData = JSON.parse(change);
           obj.taskDescription = "Change marital status from "+res[i].employeeRequest.maritalStatus + " to " + objData.maritalStatus;
        }else if(res[i].task == 'SUBMITFAMILY'){
          obj.taskDescription = "Add new family";
        }
        obj.employeeRequest.fullName = obj.employeeRequest.firstName;
          if(obj.employeeRequest.middleName != null)
            obj.employeeRequest.fullName += " " + obj.employeeRequest.middleName;

          if(obj.employeeRequest.lastName != null)
            obj.employeeRequest.fullName += " " + obj.employeeRequest.lastName;
        
        $scope.requests.push(obj);
       }

      $ionicLoading.hide();
      console.log($scope.requests);
    }

    var errorRequest = function (err, status){
      if(status == 401) {
        var refreshToken = Main.getSession("token").refresh_token
        console.log("need refresh token");
        Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
      }else if(status == 500) {
        alert("Problem with server. Please try again later.");
      }else {
        alert(err.message);
      }
      $ionicLoading.hide();
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
      $scope.requests = [];
      getNeedApproval();
    }
    // invalid access token error: "invalid_token" 401
    function getNeedApproval(){
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/workflow/needapproval';
      Main.requestApi(accessToken,urlApi,successRequest, errorRequest);
    }
})

.controller('RequestDetailCtrl', function($stateParams,$rootScope, $scope,$state , AuthenticationService, Main) {
  if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    var idx = $stateParams.idx;
    $scope.detail = {};
    function initModule(){
        if($rootScope.requestSelected != undefined) {
            $scope.detail = $rootScope.requestSelected;
            if($scope.detail.task == 'SUBMITLEAVE') {
                $scope.detail.taskTitle = "Request Leave";
            }else if($scope.detail.task == 'CHANGEMARITALSTATUS'){
                $scope.detail.taskTitle = "Change Marital Status";
            }else if($scope.detail.task == 'SUBMITLEAVE') {
                 $scope.detail.taskTitle = "Add new Family";
            }
            $scope.detail.employeeRequest.fullName = $scope.detail.employeeRequest.firstName;
            if($scope.detail.employeeRequest.middleName != null)
              $scope.detail.employeeRequest.fullName += " " + $scope.detail.employeeRequest.middleName;

            if($scope.detail.employeeRequest.lastName != null)
              $scope.detail.employeeRequest.fullName += " " + $scope.detail.employeeRequest.lastName;
        
        }
        console.log($scope.detail);
    }
    

    initModule();

   // console.log(teamIdx);

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

