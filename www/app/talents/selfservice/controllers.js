angular.module('selfservice.controllers', [])
.controller('SelfServiceCtrl', function($ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
})

.controller('SubmitAttendanceCtrl', function($compile,$filter,$cordovaGeolocation,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    alert("This feature is not available");
    $scope.goBack('app.selfservice');
    /*var serverTime = $filter('date')(Date.now(), "yyyy-MM-dd HH:mm:ss");
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
        Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
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
        Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
    }

     function prepareSubmit(){
        var urlApi = Main.getUrlApi() + '/api/user/self/attendance/prepare';
        $ionicLoading.show({
          template: 'Loading ...'
        });
        var accessToken = Main.getSession("token").access_token;
        Main.requestApi(accessToken,urlApi,successPreRequest, $scope.errorRequest);
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

    initModule();*/
})

.controller('ChoicePayslipCtrl', function($ionicLoading,$compile,$filter,$cordovaGeolocation,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.selectMonth = Main.getSelectMonth();
   // $scope.selectYear = Main.getSelectYear();
    $scope.payslip = {};
    $scope.choice = {};
    $scope.choiceSelect="";
    $scope.choice.select = "monthly";
    $scope.payslipType = Main.getSession("profile").companySettings.payslipType;
    var arrCompanyRef = Main.getSession("profile").companyReference;
    var refYear = Main.getDataReference(arrCompanyRef,'payslip',null,'selectYear');
    var year ="0";
    var month = "0";
    var successRequest = function (res){
      $ionicLoading.hide();
      if(res.length == 0 ){
          alert("Data Not Found");
      }else {
        $rootScope.payslipSelected = res;
        $state.go("app.detailpayslip",{'year':year,'month':month,'type':$scope.choiceSelect});
      }
    }

    

    $scope.submitForm = function(choice){
      console.log(choice.select);
      $scope.choiceSelect = choice.select;
      $ionicLoading.show({
          template: 'Loading...'
      });
      var url = "";
      var strData="";
      var data="";
      if(choice.select == 'monthly') {
        url = Main.getUrlApi() + '/api/user/payroll';
        var strData ="";
        if($scope.payslipType == 'monthly') {
            month = Main.getIdfromValue($scope.selectMonth,$scope.payslip.month);
            year = $scope.payslip.year;
            strData = {payrollType:$scope.payslipType,month:month,year:year};
        } else {
            strData = {payrollType:$scope.payslipType};
        }
          
        data = JSON.stringify(strData);
      }else {
        url = Main.getUrlApi() + '/api/user/payroll/yearly';
      }
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/payroll';
      Main.postRequestApi(accessToken,url,data,successRequest,$scope.errorRequest);

    }

    var successLatestPeriod = function (res){
      $ionicLoading.hide();
      if(res!= null && res.periodDate != null) {
          arrPeriodDate = res.periodDate.split("-");
          console.log(arrPeriodDate);
          $scope.payslip.year = arrPeriodDate[0];
          $scope.payslip.month = Main.getValuefromId($scope.selectMonth,arrPeriodDate[1]);
          console.log($scope.payslip.month);
      }
      console.log(res);
    }

    function getLatestMonth(){
        var urlApi = Main.getUrlApi() + '/api/user/payroll/latestperiod';
        $ionicLoading.show({
          template: 'Loading ...'
        });
        var accessToken = Main.getSession("token").access_token;
        Main.requestApi(accessToken,urlApi,successLatestPeriod, $scope.errorRequest);
    }

    function initModule(){
        if(refYear != undefined && refYear != '') {
             $scope.selectYear = JSON.parse(refYear);
        }
        $scope.payslip.year = $filter('date')(new Date(),'yyyy');
        $scope.payslip.month = $filter('date')(new Date(),'MMM').toUpperCase();

        if($scope.payslipType == "latest"){
            getLatestMonth();
        }
          
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
    $scope.type = $stateParams.type;
    $scope.payslipType = Main.getSession("profile").companySettings.payslipType;
    function getPaySlip (){
        console.log($rootScope.payslipSelected);
        if($rootScope.payslipSelected != null) {
            $scope.listHeader = $rootScope.payslipSelected;
        }
    }
    function initMethod(){
      getPaySlip();
    }

    $scope.printPdf = function(type){
        console.log("type",type);
        console.log("$scope.payslipType",$scope.payslipType);
        
        var profile = Main.getSession("profile");
        if(profile.employeeTransient.assignment.employment == null) {
            alert("Employment is null");
            return false;
        }
        var employment_id = profile.employeeTransient.assignment.employment;
        var accessToken = Main.getSession("token").access_token;
        var url = "";
        if(type=='monthly'){
          url = Main.getPrintBaseUrl() + "/monthly/latest?employment_id="+employment_id+"&session_id="+accessToken;
          if($scope.payslipType == 'monthly') 
            url = Main.getPrintBaseUrl() + "/monthly?employment_id="+employment_id+"&year="+year+"&month="+month+"&session_id="+accessToken;
        
        }else{
          url = Main.getPrintBaseUrl() + "/yearly?employment_id="+employment_id+"&session_id="+accessToken;
        } 

        window.open(encodeURI(url), '_system', 'location=yes');
        return false;
    }
    

    initMethod();
    
})

.controller('SubmitClaimCtrl', function($ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    $scope.categoryType = [];

    $scope.gotoListType = function(name,extId,index){
        console.log("index " + index);
        if(index != undefined)
          $rootScope.selectedBenefitCategory = $rootScope.benefitCategory[index];
        if(name.toLowerCase() == 'spd advance'){
             $state.go("app.spdadvanceadd",{categoryType:name,extId:extId});
        }else if(name.toLowerCase() == 'perjalanan dinas'){
            $rootScope.needReportSelected = undefined;
            $state.go("app.benefitlisttype",{categoryType:name,extId:extId});
        }else {
            $state.go("app.benefitlisttype",{categoryType:name,extId:extId});
        }

        console.log("$rootScope.selectedBenefitCategory");
        console.log($rootScope.selectedBenefitCategory);
          
    }

    var successRequest = function (res){
      $ionicLoading.hide();
      if(res.length > 0) {
          $rootScope.benefitCategory = [];
          $rootScope.benefitCategory = res;
          $scope.categoryType = [];
          $scope.categoryType = $rootScope.benefitCategory;
          console.log($scope.categoryType);
          /*for(var i=0;i<res.length;i++){
             var objResponse = res[i];
             var obj = {id:objResponse.categoryTypeExtId,name:objResponse.categoryType,icon:objResponse.icon,directType:objResponse.directType,label:objResponse.label};
             $scope.categoryType.push(obj);
          }
          console.log($scope.categoryType);
          */
      }
    }
    
    function getListCategory(){
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmrequest/type';
        Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }


    function initModule() {
        if($rootScope.benefitCategory == undefined)
          getListCategory();
        else
          $scope.categoryType = $rootScope.benefitCategory;

        console.log("categoryType");
        console.log($scope.categoryType);
     
    }

    initModule();
})


.controller('BenefitListtypeCtrl', function(appService,$ionicActionSheet,$cordovaCamera,ionicDatePicker, $stateParams, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    var categoryType = $stateParams.categoryType;
    var categoryTypeExtId = $stateParams.extId;
    $scope.directType = false;
    $scope.labelCategory = "Label";
    var objDirectType = {};
    if($rootScope.selectedBenefitCategory != undefined){
        $scope.directType = $rootScope.selectedBenefitCategory.directType;
        $scope.labelCategory = $rootScope.selectedBenefitCategory.label;
        if($scope.directType == true) {
              if($rootScope.selectedBenefitCategory.listRequestType.length > 0)
                objDirectType =  $rootScope.selectedBenefitCategory.listRequestType[0];
        }
    }
      
    console.log('directType ' + $scope.directType);
    var sessionLopName = "kacamata"+"."+categoryType;
    $scope.defaultImage = "img/placeholder.png";
    $scope.checkLoginSession();
    $scope.arrLensa = [];
    $scope.listtype = []; 
    var listTypeSelected = [];
    $scope.title = categoryType;
    $scope.category = categoryType.toLowerCase();
    $scope.requestHeader = {};
    $scope.requestHeader.startDate = new Date();
    $scope.requestHeader.origin = "";
    $scope.requestHeader.destination = "";
    $scope.requestHeader.attachments = []; 
    $scope.images = []; 
    
    var datepicker = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.requestHeader.startDate = val;
      },
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      dateFormat:"yyyy-MM-dd",
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(datepicker);
    };

    $scope.change = function(event,index){
      var value = event.target.value;
      value = value
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      // alert(value);
      $scope.listtype[index].amount = value;
    }

    $scope.getTotal = function(){
        var total = 0;
        listTypeSelected = [];
        for(var i = 0; i < $scope.listtype.length; i++){
          var obj = $scope.listtype[i];
          var objpush = {};
          console.log('Amount : ' + obj.amount);
          if(obj.amount != null){
              var number = obj.amount.toString();
              if(number != '0'){
                  objpush = obj;
                  var amount = obj.amount;
                  //number  = obj.amount.replace('.','');
                  //obj.amount = number;
                  //listTypeSelected.push(obj);

                  obj.amount = number;
                  // number = amount.replace('.','');
                  number = amount.replace(/\./g,'');
//                  objpush.amount = number;

              }
              total += Number(number);
          }
            
          
        }
        return total;
    }
    $scope.removeChoice = function(){
        var lastItem = $scope.requestHeader.attachments.length-1;
        $scope.requestHeader.attachments.splice(lastItem);
        $scope.images.splice(lastItem);
    }

    $scope.addPicture = function () {
          if($scope.images.length > 2) {
            alert("Only 3 pictures can be upload");
            return false;
          }
          $ionicActionSheet.show({
              buttons: [{
                  text: 'Take Picture'
              }, {
                      text: 'Select From Gallery'
                  }],
              buttonClicked: function (index) {
                  switch (index) {
                      case 0: // Take Picture
                          document.addEventListener("deviceready", function () {
                              $cordovaCamera.getPicture(appService.getCameraOptions()).then(function (imageData) {
                                  $scope.images.push({'image':"data:image/jpeg;base64," + imageData});
                                  $scope.requestHeader.attachments.push({'image': imageData});
                              }, function (err) {
                                  appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                              });
                          }, false);

                          break;
                      case 1: // Select From Gallery
                          document.addEventListener("deviceready", function () {
                              $cordovaCamera.getPicture(appService.getLibraryOptions()).then(function (imageData) {
                                   $scope.images.push({'image':"data:image/jpeg;base64," + imageData});
                                   $scope.requestHeader.attachments.push({'image': imageData});
                              }, function (err) {
                                  appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                              });
                          }, false);
                          break;
                  }
                  return true;
              }
          });
      };



    var successRequest = function (res){
      $ionicLoading.hide();
      alert(res.message);
      $scope.goBack('app.submitclaim');
    }



    $scope.submitForm = function(){
       
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        
        $scope.requestHeader.module = "Benefit";
        $scope.requestHeader.startDate = $filter('date')(new Date($scope.requestHeader.startDate),'yyyy-MM-dd');
        $scope.requestHeader.categoryType = categoryType;
        $scope.requestHeader.categoryTypeExtId = categoryTypeExtId;
        // if($scope.category != 'medical overlimit') {
         if($scope.directType != true){
            var requestDetail = [];
            angular.forEach($scope.listtype, function(value, key){
                  var obj ={};
                  if(value.type == 'select'){
                    obj.type = value.value;
                  }else {
                    obj.type = value.name;
                  }
                  
                  var number = value.amount.toString();
                  if(number != '0'){
                      number = number.replace(/\./g,'');
                  }
                  obj.amount = number;
                  // obj.amount = value.amount;
                  
                  requestDetail.push(obj);
            })
            $scope.requestHeader.details = requestDetail;
            var attachment = [];
            if($scope.requestHeader.attachments.length > 0) {
                for (var i = $scope.requestHeader.attachments.length - 1; i >= 0; i--) {
                    var objAttchament = {"image":$scope.requestHeader.attachments[i].image};
                    attachment.push(objAttchament);
                };
            }
            $scope.requestHeader.attachments = attachment; 
        }else {
            var requestDetail = [];
            var obj = {};
            obj.type = objDirectType.type;
            obj.amount = 1;
            requestDetail.push(obj);
            $scope.requestHeader.details = requestDetail;
        }
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmrequestheader/benefit';
        var data = JSON.stringify($scope.requestHeader);
        
        Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
    }

   

    function initModule() {

        if($scope.category == 'kacamata') {
            var arrLensa = [{id:"Lensa Monofocus Non Cylindris"},{id:"Lensa Monofocus Cylindris"},{id:"Lensa Bifokus Non Cylindris"},{id:"Lensa Bifokus Cylindris"}];
            $scope.listtype = [{id:"frame",name:"Frame",amount:0},{id:"lensa", name:"Lensa",amount:0,type:"select",options:arrLensa}];
        }else if($scope.category == 'perjalanan dinas'){
            var uangsaku = [{id:"Uang Saku Dalam Negeri"},{id:"Uang Saku Luar Negeri"}];
            var uangmakan = [{id:"Uang Makan Dalam Negeri"},{id:"Uang Makan Luar Negeri"}];
            $scope.listtype = [{id:"taxi",name:"Taxi",amount:0},{id:"transport",name:"Transport",amount:0},{id:"hotel",name:"Hotel",amount:0},{id:"rentalmobil",name:"Rental Mobil",amount:0},{id:"mileage",name:"Mileage",amount:0},{id:"travelinsurance",name:"Travel Insurance",amount:0},{id:"dokperjalanan",name:"Dokumen Perjalanan",amount:0},{id:"uangmakan", name:"Uang Makan",amount:0,type:"select",options:uangmakan},{id:"uangsaku", name:"Uang Saku",amount:0,type:"select",options:uangsaku},{id:"telepon",name:"Telepon",amount:0},{id:"laundry",name:"Laundry",amount:0},{id:"tolparkirbensin",name:"Tol Parkir Bensin",amount:0},{id:"other",name:"Other",amount:0}];
        }else if($scope.category == 'reimbursement'){
            $scope.listtype = [{id:"personalexpenses",name:"Personal Expenses",amount:0},{id:"communication",name:"Communication (pulsa)",amount:0},{id:"sportmembership",name:"Sport membership",amount:0}];
        }else if($scope.category == 'other'){
            $scope.listtype = [{id:"sumbangankedukaan",name:"Sumbangan kedukaan",amount:0},{id:"cutibesar",name:"Cuti Besar",amount:0}];
        }else if($scope.category == 'medical'){
            $scope.listtype = [{id:"dokter",name:"Dokter",amount:0},{id:"obat",name:"Apotik / Obat",amount:0},{id:"lab",name:"Lab / R.S",amount:0},{id:"lainlain",name:"Lain-lain",amount:0}];
        }else if($scope.category == 'mutasi'){
            $scope.listtype = [{id:"perabot",name:"Sumbangan perabot",amount:0},{id:"sekolah",name:"Pendaftaran sekolah",amount:0},{id:"rumahoperasional",name:"Sumbangan rumah operasional",amount:0}];
        }

        console.log($rootScope.needReportSelected);
        if($rootScope.needReportSelected != undefined) {
            $scope.requestHeader.origin = $rootScope.needReportSelected.origin;
            $scope.requestHeader.destination = $rootScope.needReportSelected.destination;
            $scope.requestHeader.linkRefHeader = $rootScope.needReportSelected.id;
          
        }
        
        
    }

    initModule();
})

.controller('ClaimChoice', function($stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
 })

.controller('BenefitDetailCtrl', function($stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }


    $scope.header = {};
    var id = $stateParams.id;
    
    function successRequest(res) {
        $ionicLoading.hide();
        if(res != null){
            $scope.header = res;
            if($scope.header.categoryType == 'Medical') {
              var arrDetail = [];
              if($scope.header.details.length > 0) {
                arrDetail = JSON.parse($scope.header.details[0].data);
              }
              $scope.header.details = arrDetail;
          }
        }
            
    }

    function getDetailHeader (id){

        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
         });

        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmrequest/'+id;
        Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }
    
    function initMethod(){
      getDetailHeader(id);
    }
    initMethod();
 })

.controller('BenefitClaimListCtrl', function($ionicPopover,$ionicLoading,$rootScope, $scope,$state , AuthenticationService, Main) {
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.requests = [];
    $scope.needReportRequests = [];
    $scope.module = {};

    $scope.$on('$ionicView.beforeEnter', function () {
        console.log("$ionicView.beforeEnter");
        if( $rootScope.refreshRequestApprovalCtrl) {
            console.log("refresh AddressCtrl");
            initMethod();
        }
        $rootScope.refreshRequestApprovalCtrl = false;
    });

    $scope.chooseTab = function(tab){
        $scope.module.type = tab;
        if(tab === 'list')
          $scope.requests = [];
        else if(tab === 'needreport')
          $scope.needReportRequests = [];

        getListBenefit(tab);
        // getCountNeedApproval();
    }

    $scope.gotoListType = function(index){
          console.log("index " + index);
          $rootScope.needReportSelected = $scope.needReportRequests[index];
          var perjalananDinas = {id:"0124D0000008guqQAA",name:"Perjalanan Dinas"}
          $state.go("app.benefitlisttype",{categoryType:perjalananDinas.name,extId:perjalananDinas.id});
    }

    $scope.gotoBenefitDetail = function(index){
          $state.go("app.benefitdetail");
    }

    $scope.refresh = function(){
      $scope.chooseTab($scope.module.type);    
    }
   
    var successRequest = function (res){
      for(var i=0;i<res.length;i++) {
        var obj = res[i];
        obj.idx = i; 
        if($scope.module.type == 'list') {
            $scope.requests.push(obj);
        }else {
            $scope.needReportRequests.push(obj);
        }

       }

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    }
    initMethod();

    function initMethod(){
      $scope.chooseTab('list');
    }
   

    function getListBenefit(tab){
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/tmrequest?module=Benefit';
      if(tab == 'needreport')
          urlApi = Main.getUrlApi() + '/api/user/tmrequest/needreport?module=Benefit';
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }
})

.controller('SpdAdvanceAdd', function(ionicDatePicker,$stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    var categoryType = $stateParams.categoryType;
    var categoryTypeExtId = $stateParams.extId;
    $scope.requestHeader = {};
    $scope.detail = {amount:0,type:"Advance"};
    $scope.requestHeader.startDate = new Date();
    $scope.requestHeader.endDate = new Date();
    var messageValidation = "";
    var datepicker = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.requestHeader.startDate = val;
      },
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      dateFormat:"yyyy-MM-dd",
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    var datepicker1 = {
      callback: function (val) {  //Mandatory
        $scope.requestHeader.endDate = val;
      },
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      dateFormat:"yyyy-MM-dd",
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.change = function(event,index){
      var value = event.target.value;
      value = value
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      $scope.detail.amount = value;
    }

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(datepicker);
    };

    $scope.openDatePicker1 = function(){
      ionicDatePicker.openDatePicker(datepicker1);
    };

    var successRequest = function (res){
      $ionicLoading.hide();
      alert(res.message);
      $scope.goBack('app.submitclaim');
    }

    $scope.submitForm = function(){

       var detailSubmit = {};
       detailSubmit = $scope.detail;
       console.log("detailSubmit",detailSubmit);
    if(verificationForm(detailSubmit)){
       
       $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
       detailSubmit.amount = ""+detailSubmit.amount;
       var dataAmount;
        if(detailSubmit.amount.indexOf(".") !== -1) {
            dataAmount = detailSubmit.amount.replace(/\./g,'');
        }else {
            dataAmount = detailSubmit.amount;
        }
       // var dataAmount  = detailSubmit.amount.replace(/\./g,'');
        dataAmount = Number(dataAmount);
        // $scope.detail.amount = dataAmount; 
        detailSubmit.amount = dataAmount;  

        $scope.requestHeader.module = "Benefit";
        $scope.requestHeader.startDate = $filter('date')(new Date($scope.requestHeader.startDate),'yyyy-MM-dd');
        $scope.requestHeader.endDate = $filter('date')(new Date($scope.requestHeader.endDate),'yyyy-MM-dd');
        $scope.requestHeader.categoryType = categoryType;
        $scope.requestHeader.categoryTypeExtId = categoryTypeExtId;
        $scope.requestHeader.origin = $scope.detail.origin;
        $scope.requestHeader.destination = $scope.detail.destination;
        var requestDetail = [];
        // requestDetail.push($scope.detail);
        requestDetail.push(detailSubmit);
        $scope.requestHeader.details = requestDetail;
        
        /*var attachment = [];
        if($scope.requestHeader.attachments.length > 0) {
            for (var i = $scope.requestHeader.attachments.length - 1; i >= 0; i--) {
                var objAttchament = {"image":$scope.requestHeader.attachments[i].image};
                attachment.push(objAttchament);
            };
        }
        $scope.requestHeader.attachments = attachment; 
        */
        

        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmrequestheader/benefit';
        var data = JSON.stringify($scope.requestHeader);
        
        Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
      } else {
          alert(messageValidation);
      }
    }

    function verificationForm(dataSpd){
     
        if(dataSpd.origin == undefined){
            messageValidation = "Origin can't empty";
            return false;
        }

        if(dataSpd.destination == undefined){
            messageValidation = "Destination can't empty";
            return false;
        }

        if(dataSpd.amount == undefined || dataSpd.amount == 0){
            messageValidation = "Amount can't empty";
            return false;
        }

       
        return true;
          

    }


 })




