(function () {

    'use strict'

    angular.module('main.services', [])
    .factory('Main', function($q, $timeout, $http, $localStorage){
        var baseUrl = "http://192.168.43.162:8080";
        //var baseUrl = "http://localhost:8080";
        var basicAuthentication = 'Basic dGFsZW50czpzZWNyZXQ=';
        var timeoutms = 15000; // 15 sec

        var takePictureOptions = {
            quality: 100,
            targetWidth : 750,
            targetHeight:550
        };

        var selectMaritalStatus = [{id:"Single"},{id:"Married"}];
        var selectBloodType = [{id:"A"},{id:"B"},{id:"AB"},{id:"O"}];
        var selectFamilyRelationShip = [{id:"Ayah"},{id:"Ibu"},{id:"Suami"},{id:"Istri"},{id:"Anak"}];
        var selectGender = [{id:"Male"},{id:"Female"}];

       
        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var currentUser = getUserFromToken();
        
         return {
            save: function(data, success, error) {
                $http.post(baseUrl + '/signin', data).success(success).error(error)
             },

             getUrlApi : function(){
                return baseUrl;
             },

             getSelectMaritalStatus : function(){
                return selectMaritalStatus;
             },
             getSelectBloodType : function(){
                return selectBloodType;
             },
             getSelectFamilyRelationShip : function(){
                return selectFamilyRelationShip;
             },
             getSelectGender : function(){
                return selectGender;
             },

            signin: function(data, success, error) {
                console.log(data);
                // $http.defaults.headers.common['Authorization'] = 'Basic dGFsZW50czpzZWNyZXQ=';
                $http.defaults.headers.common['Authorization'] = basicAuthentication;
                var deferred = $q.defer();
               // $http.post(baseUrl + '/oauth/token?grant_type=password&username='+data.username+'&password='+data.password, data)
                $http.post(baseUrl + '/oauth/token?grant_type=password&username='+data.username+'&password='+data.password, {headers:{'Authorization':'Basic dGFsZW50czpzZWNyZXQ='}, timeout:deferred.promise})
                .success(success)
                .error(error)

                $timeout(function() {
                    deferred.resolve(); // this aborts the request!
                }, timeoutms);

            },
            getProfile: function(token, success, error) {
                console.log(token);
                var url = '/api/myprofile';
               //  $http.defaults.headers.common['Authorization'] = 'Basic dGFsZW50czpzZWNyZXQ=';
                $http.defaults.headers.common['Authorization'] = basicAuthentication;
                var headers = {
                    'Authorization':'Basic dGFsZW50czpzZWNyZXQ=',
                    'Content-Type' : 'application/json'
                }
                var deferred = $q.defer();
               // $http.post(baseUrl + '/oauth/token?grant_type=password&username='+data.username+'&password='+data.password, data)
                $http.get(baseUrl + url, {headers:headers, timeout:deferred.promise})
                .success(success)
                .error(error)

                $timeout(function() {
                    deferred.resolve(); // this aborts the request!
                }, timeoutms);

            },

            refreshToken : function (refresh_token,success,error) {

                $http.defaults.headers.common['Authorization'] = 'Basic dGFsZW50czpzZWNyZXQ=';
                var url = baseUrl  + '/oauth/token?grant_type=refresh_token&refresh_token='+refresh_token;
                var deferred = $q.defer();
                $http.post(url, {headers:{'Authorization':basicAuthentication}, timeout:deferred.promise})
                .success(success)
                .error(error)
                $timeout(function() {
                    deferred.resolve(); // this aborts the request!
                }, timeoutms);
            },

            requestApi: function(access_token,url, success, error) {
                // var url = baseUrl + '/api/myprofile';
                var bearerAuthentication = 'Bearer '+ access_token;
                $http.get(url,{headers:{'Authorization':bearerAuthentication}}).success(success).error(error)
            },
            postRequestApi: function(access_token,url, data, success, error) {
                console.log(data);
                var bearerAuthentication = 'Bearer '+ access_token;
                var deferred = $q.defer();
               // $http.post(baseUrl + '/oauth/token?grant_type=password&username='+data.username+'&password='+data.password, data)
                $http.post(url, data, {headers:{'Authorization': bearerAuthentication}, timeout:deferred.promise})
                .success(success)
                .error(error)

                $timeout(function() {
                    deferred.resolve(); // this aborts the request!
                }, timeoutms);

            },
            requestUrl: function(url, success, error) {
                // var url = baseUrl + '/api/myprofile';
              
                $http.get(url).success(success).error(error)
            },
            logout: function(success) {
                changeUser({});
                delete $localStorage.token;
                success();
            },
            setSession : function(key,value){
                return localStorage.setItem(key,JSON.stringify(value));
            },
            getSession : function(key) {
                return JSON.parse(localStorage.getItem(key));
            },
            destroySession : function (key){
                return localStorage.removeItem(key);
            },
            getUrlApi : function(){
                return baseUrl;
            },
            getTakePictureOptions : function(){
                return takePictureOptions;
            }
            
        };


    });

       
})();

