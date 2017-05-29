angular.module('selfservice.controllers', [])
.controller('SelfServiceCtrl', function($ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }


})

.controller('SubmitAttendanceCtrl', function($compile,$filter,$cordovaGeolocation,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    var serverTime = $filter('date')(Date.now(), "yyyy-MM-dd HH:mm:ss");
    var clockTick = null;
    $scope.tickInterval = 1000;
    $scope.clock = "Load server time";
    $scope.actionStatus = 3; // default is 1 disabled checkin and checkout
    $scope.attendance = {};
    $scope.attendance.longitude ='106.827153';
    $scope.attendance.latitude = '-6.175392' ;
    $scope.attendance.address = "searching location ...";
    var whichTaken = 0;
    var options = {timeout: 10000, enableHighAccuracy: true};
    var tick = function() {
        //
        if(clockTick == null){
             $scope.clock = new Date(serverTime);
             clockTick = $scope.clock;
        }else {
            var time = new Date(clockTick).getTime();
            $scope.clock = new Date(time+1000);
            clockTick = $scope.clock ;
        }
        console.log("tick")
       
        //$scope.clock = Date.now() // get the current time
        $timeout(tick, $scope.tickInterval); // reset the timer
    }

    var successPreRequest = function (res){
      console.log("res " + res);
      $ionicLoading.hide();
      if( res!= null) {
            serverTime = $filter('date')(res.serverTime, "yyyy-MM-dd HH:mm:ss");
            $timeout(tick, $scope.tickInterval);
            console.log("res is not null");
            if(res.punchInUtcTime != null && res.punchOutUtcTime != null) {
                $scope.actionStatus = 3;
            }else {
                if(res.punchInUtcTime != null)
                    $scope.actionStatus = 2;
                else 
                    $scope.actionStatus = 1;
            }
      }
      
    }

    var errorPreRequest = function (err, status){
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
    


    var successRequest = function (res){
      $ionicLoading.hide();
      if(whichTaken == 1) 
        $scope.actionStatus = 2; 
      else
        $scope.actionStatus = 3;

      alert(res.message);
      //goBack('app.family');
      console.log(res);
      //$scope.family = res;
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

     

    $scope.checkin = function(){
        whichTaken = 1;
        //alert("Checkin");
        var strTime = $filter('date')(Date.now(), "yyyy-MM-dd HH:mm:ss"); 
        console.log("str Time "+ strTime);
        var obj = {mode:"in",punchInUserTime:strTime,longitudePunchIn:$scope.attendance.longitude,latitudePunchIn:$scope.attendance.latitude};
        $ionicLoading.show({
          template: 'Processing...'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/self/attendance';
        var data = JSON.stringify(obj);
        console.log(data);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);
    }

    $scope.checkout = function(){
       // alert("Ceckout");
        whichTaken =2;
        var strTime = $filter('date')(Date.now(), "yyyy-MM-dd HH:mm:ss"); 
        var obj = {mode:"out",punchOutUserTime:strTime,longitudePunchOut:$scope.attendance.longitude,latitudePunchOut:$scope.attendance.latitude};
        
        $ionicLoading.show({
          template: 'Processing...'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/self/attendance';
        var data = JSON.stringify(obj);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);
    }

     function prepareSubmit(){
        var urlApi = Main.getUrlApi() + '/api/user/self/attendance/prepare';
        $ionicLoading.show({
          template: 'Loading ...'
        });
        var accessToken = Main.getSession("token").access_token;
        Main.requestApi(accessToken,urlApi,successPreRequest, errorPreRequest);
    }


    
    function initialize(lat,lng) {
      console.log("Initialize " + lat + ","+lng);
      var mapOptions = {
        // the Teide ;-)
        center: {lat: parseFloat(lat), lng: parseFloat(lng)},
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
          mapTypeIds: []
        },
        panControl: false,
        streetViewControl: false,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        }
      };

      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var myLatlng = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
      //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

      $scope.map = map;
    }

    function getCurrentLocation(){  
         $cordovaGeolocation.getCurrentPosition(options).then(function(position){
            $scope.attendance.latitude = position.coords.latitude;
            $scope.attendance.longitude = position.coords.longitude;
            google.maps.event.addDomListener(window, 'load', initialize($scope.attendance.latitude, $scope.attendance.longitude));
            // createMap(position.coords.latitude, position.coords.longitude);
             getAddressLocation($scope.attendance.latitude, $scope.attendance.longitude);
        }, function(error){
            
            google.maps.event.addDomListener(window, 'load', initialize($scope.attendance.latitude, $scope.attendance.longitude));
            getAddressLocation($scope.attendance.latitude, $scope.attendance.longitude);
        });

    }


    function getAddressLocation(lat,lng){
        var googleAddressUrl = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBrOyfr9TYYTYArfbF4_DCG2T3m67Fuzco&latlng="+lat+","+lng;
        Main.requestUrl(googleAddressUrl,function(res){
          console.log(res);
          if(res.results[0] != undefined)
              $scope.attendance.address = res.results[0].formatted_address;
        }, function(err,status) {
          console.log(err);
            $scope.attendance.address = "Address not found. Please acitivate your GPS and try again";
        });
    }


    function initModule() {
       
        prepareSubmit();
        getCurrentLocation();
    }

    initModule();
})


.controller('SubmitPayslipCtrl', function($compile,$filter,$cordovaGeolocation,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    $scope.selectYear = [];
    $scope.selectMonth = [];
    $scope.payslip = {};
    $scope.payslip.payrollType = "monthly";

    var successRequest = function (res){
      $ionicLoading.hide();
      if(res.length == 0 ){
          alert("Data Not Found");
      }else {
        $rootScope.payslipSelected = res;
        $state.go("app.detailpayslip",{'year':$scope.payslip.year,'month':$scope.payslip.month});
      }
    }

    var errorRequest = function (err, status){
      $ionicLoading.hide();
      if(status == 401) {
        var refreshToken = Main.getSession("token").refresh_token
        console.log("need refresh token");
        Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
      }else {
         if(status==500)
            alert(err.message);
          else
            alert("Please Check your connection");
      }
      console.log(err);
      console.log(status);
    }

    function getPaySlip(payrollType,year,month){
      $ionicLoading.show({
          template: 'Loading...'
      });
      var strData = {payrollType:payrollType,year:year,month:month};
      var data = JSON.stringify(strData);
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/payroll';
      Main.postRequestApi(accessToken,urlApi,data,successRequest,errorRequest);

    }


    $scope.submitForm = function(){
        $rootScope.payslipSelected = null;
        getPaySlip($scope.payslip.payrollType,$scope.payslip.year,$scope.payslip.month);
        //$state.go('app.detailpayslip',{'year':$scope.payslip.year,'month':$scope.payslip.month});
        //$state.go("app.detailpayslip");
    }

    function initData(){
     $scope.selectYear = [{id:"2016"},{id:"2017"}];
     $scope.selectMonth = [{name:"JAN",id:"01"},{name:"FEB",id:"02"},{id:"03",name:"MAR"},{id:"04",name:"APR"},{id:"05",name:"MAY"},{id:"06",name:"JUN"},{id:"07",name:"JUL"},{id:"08",name:"AUG"},{id:"09",name:"SEP"},{id:"10",name:"OCT"},{id:"11",name:"NOV"},{id:"12",name:"DES"}];     
    }

    function initModule() {
      initData();
    }

    initModule();

    })

.controller('DetailPayslipCtrl', function($ionicLoading, $stateParams,$compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {

    $scope.listHeader = [];
    var year = $stateParams.year;
    var month = $stateParams.month;
    function getPaySlip (){
        console.log($rootScope.payslipSelected);
        if($rootScope.payslipSelected != null) {
            $scope.listHeader = $rootScope.payslipSelected;
        }
    }
    function initMethod(){
      getPaySlip();
    }

    $scope.printPdf = function(){
        var profile = Main.getSession("profile");
        if(profile.employeeTransient.assignment.employment == null) {
            alert("Employment is null");
            return false;
        }
        var employment_id = profile.employeeTransient.assignment.employment;
        var url = Main.getPrintBaseUrl() + "?employment_id="+employment_id+"&year="+year+"&month="+month;
        window.open(encodeURI(url), '_system', 'location=yes');
        //window.open(url, '_system', 'location=yes'); 
        //window.open(url, '_blank', 'location=no'); 
        return false;
    }
    

    initMethod();
    
})
    .controller('DateCtrl', function($scope, ionicDatePicker) {
        
      $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };
          var ipObj1 = {
      callback: function (val) {  //Mandatory
        datePickerCallback(val);
      },
    };


  $scope.datepickerObject = {
      titleLabel: 'Title',  //Optional
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 12, 31),
      showTodayButton: true,
      dateFormat: 'dd MM yyyy',
      disableWeekdays: [], 
      inputDate: new Date(),      
      mondayFirst: true,               
      closeOnSelect: false,       
      callback: function (val) {  //Mandatory
      datePickerCallback(val);
    }
  };

      var datePickerCallback = function (val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
      console.log('Selected date is : ', val)
      $scope.datepickerObject.inputDate = val;
    }
  };
  
})

.controller('SubmitClaimCtrl', function($compile,$filter,$cordovaGeolocation,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
       $(document).ready(function() {
        $('select').material_select();
      });

    $scope.options = [{name: 'Travel'},{name: 'Overtime'},{name: 'Lunch Meeting'}];
    $scope.selectedOption = $scope.options[1];

    $scope.selectYear = [];
    $scope.selectMonth = [];

    function initData(){
     $scope.selectYear = [{id:"2016"},{id:"2017"}];
     $scope.selectMonth = [{id:"JAN"},{id:"FEB"},{id:"MAR"},{id:"APR"},{id:"MAY"},{id:"JUN"}];     
    }

    function initModule() {
      initData();
    }

    initModule();
})




