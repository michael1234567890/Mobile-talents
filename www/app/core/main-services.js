(function () {

    'use strict'

    angular.module('main.services', [])
    .factory('Main', function($q, $timeout, $http, $localStorage,$rootScope){
        //var hostname = "http://192.168.43.132";
        //var hostname = "http://192.168.43.162";
        //var hostname = "http://45.76.147.40";
        var hostname = "http://localhost";
        var environment = "development"; // development , production
        var phphost =  hostname + "/talents";
        var printBaseUrl = hostname + "/talents/payslippdf";
        var printReportUrl = phphost + "/printpdf";
        var baseUrl = hostname + ":8080";
        
        var basicAuthentication = 'Basic dGFsZW50czpzZWNyZXQ=';
        var timeoutms = 15000; // 15 sec

        var takePictureOptions = {
            quality: 100,
            targetWidth : 750,
            targetHeight:550
        };
        var selectHour = [{id:0},{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10},{id:11},{id:12},{id:13},{id:14},{id:15},{id:16},{id:17},{id:18},{id:19},{id:20},{id:21},{id:22},{id:23},{id:24}];
        var selectFiveteenMin = [{id:0},{id:15},{id:30},{id:45}];
        var selectMaritalStatus = [{id:"Single"},{id:"Married"},{id:"Divorce"}];
        var selectBloodType = [{id:"A"},{id:"B"},{id:"AB"},{id:"O"}];
        var selectFamilyRelationShip = [{id:"Ayah"},{id:"Ibu"},{id:"Suami"},{id:"Istri"},{id:"Anak"}];
        var selectGender = [{id:"Male"},{id:"Female"}];
        var selectStayStatus = [{id:"Owned"},{id:"Contract"},{id:"Live with parent"}];
        var selectProvince = [{id:"Jakarta Special Capital Region"}];
        var selectCity = [{id:"South Jakarta"},{id:"North Jakarta"},{id:"West Jakarta"},{id:"East Jakarta"}];
        var selectCountry = [{id:"Indonesia"}];
        var selectMonth = [{name:"JAN",id:"01"},{name:"FEB",id:"02"},{id:"03",name:"MAR"},{id:"04",name:"APR"},{id:"05",name:"MAY"},{id:"06",name:"JUN"},{id:"07",name:"JUL"},{id:"08",name:"AUG"},{id:"09",name:"SEP"},{id:"10",name:"OCT"},{id:"11",name:"NOV"},{id:"12",name:"DES"}];  
        var selectYear = [{id:"2016"},{id:"2017"}]; 
        var dataDisplaySize=15;

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

        function getValuefromId(array,id){
            var val = "";
            for (var i = array.length - 1; i >= 0; i--) {
                if(array[i].id==id)
                    val = array[i].name;
            };
            return val;
        }

         function getIdfromValue(array,val){
            var id = "";
            for (var i = array.length - 1; i >= 0; i--) {
                if(array[i].name==val)
                    id = array[i].id;
            };
            return id;
        }

        var currentUser = getUserFromToken();
       // var getValuefromId = getValuefromId(array,id);
        
         return {
            save: function(data, success, error) {
                $http.post(baseUrl + '/signin', data).success(success).error(error)
             },
             
             getSelectHour : function(){
                return selectHour;
             },
             getSelectFiveteenMin : function(){
                return selectFiveteenMin;
             },
             
             getEnvironment : function(){
                return environment;
             },

             getDataDisplaySize : function(){
                return dataDisplaySize;
             },

             getValuefromId : function(array,id){
                return getValuefromId(array,id);
             },
             getIdfromValue : function(array,val){
                return getIdfromValue(array,val);
             },
             getSelectMonth : function(){
                return selectMonth;
             },

             getSelectYear : function(){
                return selectYear;
             },

             getPrintBaseUrl : function(){
                return printBaseUrl;
             },
             getPrintReportUrl : function(){
                return printReportUrl;
             },

             getUrlApi : function(){
                return baseUrl;
             },
             getSelectStayStatus : function(){
                return selectStayStatus;
             },
             getSelectProvince : function(){
                return selectProvince;
             },
             getSelectCity : function(){
                return selectCity;
             },
             getSelectCountry : function(){
                return selectCountry;
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

            },forgot: function(data, success, error) {
                console.log(data);
                var deferred = $q.defer();
                 $http.post(baseUrl + '/api/resetpassword',data,{timeout:deferred.promise})
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
                
                if(localStorage.getItem(key) === null || localStorage.getItem(key)=== undefined )
                    return null;
                else
                    return JSON.parse(localStorage.getItem(key));
            },
            destroySession : function (key){
                return localStorage.removeItem(key);
            },
            getTakePictureOptions : function(){
                return takePictureOptions;
            },
            getDataReference : function(dataRef,category,subCategory,field){
                var result = null;
                if(dataRef.length > 0) {
                    for (var i = dataRef.length - 1; i >= 0; i--) {
                        var obj = dataRef[i];
                        if(obj.category==category && obj.subCategory == subCategory && obj.field == field )
                            return obj.value;
                    };
                }
                return result;
            },
            cleanData : function(){
                    localStorage.removeItem("profile");
                    localStorage.removeItem("token");
                    localStorage.removeItem("balance");
                    localStorage.removeItem("categoryType");
                    localStorage.removeItem("tmCategoryType");
                    $rootScope.refreshRequestApprovalCtrl = true;
                    
                    if($rootScope.user != undefined) {
                        delete $rootScope.user;
                    }

                    if($rootScope.countApproval != undefined)
                        delete $rootScope.countApproval;
                    
                    if($rootScope.team != undefined)
                        delete $rootScope.team;
                    
                    if($rootScope.selectEmployeeSubstitute != undefined)
                        delete $rootScope.selectEmployeeSubstitute;

            }

            
        };


    });

       
})();

