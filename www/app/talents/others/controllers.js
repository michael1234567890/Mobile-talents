angular.module('others.controllers', [])

.controller('SupportCtrl',function($rootScope, $scope,$state , AuthenticationService, Main) {
 

 })

.controller('AboutCtrl',function($rootScope, $scope,$state , AuthenticationService, Main) {
        $scope.versionName = Main.getVersionName();
 })

.controller('MyCompanyCtrl',function($ionicLoading,$rootScope, $scope,$state , AuthenticationService, Main) {
     if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.company = [];
    
    var successRequest = function (res){
        $ionicLoading.hide();
        $scope.company = res;
    }

    $scope.refresh = function(){
        initModule();
    }

    function getCompanyInfo(){
        var urlApi = Main.getUrlApi() + '/api/user/company';
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }

    function initModule(){
        $scope.company = [];
        getCompanyInfo();
    }

    initModule();
 })

.controller('AnnouncementCtrl', function(Main,$ionicLoading,appService,$cordovaCamera,$ionicActionSheet,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.news = [];
    
    var successRequest = function (res){
        $ionicLoading.hide();
       	$scope.news = res;
        $scope.general.countAnnouncement = res.length;
    }

    $scope.refresh = function(){
        initModule();
    }

    function getCurrentNews(){
    	var urlApi = Main.getUrlApi() + '/api/user/news/current';
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });

        var accessToken = Main.getSession("token").access_token;
        Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }

    function initModule(){
        $scope.news = [];
    	getCurrentNews();
    }

    initModule();

})