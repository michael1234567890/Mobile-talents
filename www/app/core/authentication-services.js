(function () {

    'use strict'

angular.module('authentication.services', [])

.factory('AuthenticationService',['$rootScope','$localStorage',function($rootScope,$localStorage){
/*
  var isAuthenticated = function(){
      if(window.localStorage.getItem("user") !== undefined )
          return false;

      return true;
  };
  var login = function (){
      isAuthenticated = true;
  };

  var logout = function (){
      isAuthenticated = false;
      destroyUserData();
  };

  var destroyUserData = function(){
      $rootScope.activityOnProgress = false;
      $rootScope.activityId = 0;
      $rootScope.jobProgress = false;
      $rootScope.jobId = 0;
      window.localStorage.setItem("user",undefined)
      
  }

  return {
    login : login,
    logout : logout,
    //isAuthenticated : function(){ return isAuthenticated;},
    isAuthenticated : isAuthenticated,
    destroyUserData : destroyUserData
  }*/

  var console = function (){
    console.log("console");
  }

  return console;

}])

})();
