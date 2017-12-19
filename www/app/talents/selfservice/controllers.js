angular.module('selfservice.controllers', [])
.controller('SelfServiceCtrl', function($ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    var arrCompanyRef = Main.getSession("profile").companyReference;
    var refMenu = Main.getDataReference(arrCompanyRef,'menu','right','selfservice');

    function initMethod(){
         if(refMenu != undefined && refMenu != '') {
              $scope.menu = JSON.parse(refMenu);
        }
    }
    
    initMethod();
    
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
    var messageValidation="";
    $scope.selectMonth = Main.getSelectMonth();
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
          $scope.warningAlert("Data Not Found");
      }else {
        $rootScope.payslipSelected = res;
        $state.go("app.detailpayslip",{'year':year,'month':month,'type':$scope.choiceSelect});
      }
    }

    

    $scope.submitForm = function(choice){
      $scope.choiceSelect = choice.select;
      if(verificationForm(choice.select,$scope.payslip)){
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

      }else {
          $scope.warningAlert(messageValidation);
      }
      

    }

    var successLatestPeriod = function (res){
      $ionicLoading.hide();
      if(res!= null && res.periodDate != null) {
          arrPeriodDate = res.periodDate.split("-");
          $scope.payslip.year = arrPeriodDate[0];
          $scope.payslip.month = Main.getValuefromId($scope.selectMonth,arrPeriodDate[1]);
      }
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
        console.log("$scope.payslip.month",$scope.payslip.month);
        if($scope.payslipType == "latest"){
            getLatestMonth();
        }
          
    }

    function verificationForm(type,payroll){
       if(type == 'monthly') {
            console.log(payroll);
            if(payroll.year == undefined || payroll.year == ""){
              messageValidation = "Year can't be empty";
              return false;
            }

            if(payroll.month == undefined || payroll.month == ""){
              messageValidation = "Month can't be empty";
              return false;
            }
        }
        return true;
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
        if($rootScope.payslipSelected != null) {
            $scope.listHeader = $rootScope.payslipSelected;
        }
    }
    function initMethod(){
      getPaySlip();
    }

    $scope.printPdf = function(type){
        
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
        console.log("URL PDF",url);
        window.open(encodeURI(url), '_system', 'location=yes');
        return false;
    }
    

    initMethod();
    
})

.controller('SubmitClaimCtrl', function($ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    $scope.categoryType = [];

    $scope.gotoListType = function(name,extId,index,workflow){
        
        $rootScope.needReportSelected = undefined;
        if(index != undefined)
            $rootScope.selectedBenefitCategory = Main.getSession("categoryType")[index]; //$rootScope.benefitCategory[index];
        
        if(name.toLowerCase() == 'spd advance'){
             $state.go("app.spdadvanceadd",{categoryType:name,extId:extId,workflow:workflow});
        }else if(name.toLowerCase() == 'perjalanan dinas'){
            $state.go("app.benefitlisttype",{categoryType:name,extId:extId,workflow:workflow});
        }else if(name.toLowerCase() == 'reimbursement'){
            $state.go("app.benefitlisttype",{categoryType:name,extId:extId,workflow:workflow,singleinput:true});
        }else {
            $state.go("app.benefitlisttype",{categoryType:name,extId:extId,workflow:workflow});
        }
          
    }

    var successRequest = function (res){
        $timeout(function () {
            if(res.length > 0) {
                Main.setSession("categoryType",res);
                $scope.categoryType = res;
                
            }
            $ionicLoading.hide();
        }, 1000);
    }

    var successBalance = function (res){

      if(res.length > 0) {
          var sessionBalance = [];
          for (var i = res.length - 1; i >= 0; i--) {
              var type = res[i].type;
              var value = res[i].balanceEnd;
              var obj = {id:type.toLowerCase(),name:value};
              sessionBalance.push(obj);
          };
          Main.setSession("balance",sessionBalance);
      }
    }
    
    function getBalanceSaveToSession(){
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmbalance/type';
        var body ={"module":"Benefit"};
        var data = JSON.stringify(body);
        Main.postRequestApi(accessToken,urlApi,data,successBalance,$scope.errorRequest);
    }

    function getListCategory(){
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmrequest/category?module=benefit';
        Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }


    function initModule() {
        if(Main.getSession("categoryType") == undefined)
            getListCategory();
        else
          $scope.categoryType = Main.getSession("categoryType");
        
        if(Main.getSession("balance") == undefined)
          getBalanceSaveToSession();
    }

     $scope.$on('$ionicView.beforeEnter', function (event,data) {
          initModule();
      
    });
})

.controller('BenefitListtypeCtrl', function($timeout,appService,$ionicActionSheet,$cordovaCamera,ionicDatePicker, $stateParams, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    var categoryType = $stateParams.categoryType;
    var categoryTypeExtId = $stateParams.extId;
    var workflow = $stateParams.workflow;
    var messageValidation = "";
    $scope.directType = false;
    $scope.labelCategory = "Label";
    $scope.defaultValue = 1;
    $scope.total = 0;
    var objDirectType = {};
    $scope.defaultImage = "img/placeholder.png";
    $scope.checkLoginSession();
    $scope.arrLensa = [];
    $scope.listtype = []; 
    $scope.images = []; 

    var listTypeSelected = [];
    $scope.titleCategory = categoryType;
    $scope.category = categoryType.toLowerCase();
    $scope.requestHeader = {};
    $scope.arrSpdType = [{id:"regular"},{id:"pulang kampung"},{id:"mutasi"},{id:"training"},{id:"assessment"}];
    
    $scope.$on('$ionicView.beforeEnter', function (event,data) {
        if(data.direction != undefined && data.direction!='back')
          initModule();
    });

    var datepicker = {
        callback: function (val) {  //Mandatory
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

    $scope.openDatePicker = function(){
        ionicDatePicker.openDatePicker(datepicker);
    };

    $scope.openDatePicker1 = function(){
        ionicDatePicker.openDatePicker(datepicker1);
    };

    $scope.changeBalance = function(selected,index) {
        var qty = $scope.listtype[index].qty;
        changeMultiple(selected,qty,index);
    }

    $scope.change = function(event,index){
      var value = event.target.value;
      value = value
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      if($scope.listtype[index] != undefined)
          $scope.listtype[index].amount = value;
    }

    function getBalance(type){
        type = type.toLowerCase();
        if(Main.getSession("balance") != undefined) {
            return Main.getValuefromId(Main.getSession("balance"),type);
        }
        return 0;
    }

    function changeMultiple (name,qty,index){
        var balance = getBalance(name);
        if(balance == undefined || balance == 0)
          balance = 1;
        else
          balance = Number(balance);

        if(qty!=undefined && qty!=""){
            value = ""+qty * balance;
            value= value
              .replace(/\D/g, "")
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            $scope.listtype[index].amount = value;
        }
        
    }
    $scope.multiple = function(event,index){

        var value = event.target.value;
        var name = $scope.listtype[index].name;
        
        if(name == 'Hotel')
          return false;

        if($scope.listtype[index].type == "select"){
            name = $scope.listtype[index].value;
        }

        var balance = getBalance(name);
        if(balance == undefined || balance == 0)
          balance = 1;
        else
          balance = Number(balance);

        value = ""+value * balance;
        
        value= value
          .replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        $scope.listtype[index].amount = value;
    }

    $scope.getTotal = function(){
        var total = 0;
        listTypeSelected = [];
        for(var i = 0; i < $scope.listtype.length; i++){
          var obj = $scope.listtype[i];
          var objpush = {};
          if(obj.amount != null){
              var number = obj.amount.toString();
              if(number != '0'){
                  objpush = obj;
                  var amount = obj.amount;
                  obj.amount = number;
                  number = amount.replace(/\./g,'');
              }
              total += Number(number);
          }
          
        }
        return total;
    }
    
    
    var successRequest1 = function (res){
        $ionicLoading.hide();
        alert(res.message);
        $scope.goBack('app.submitclaim');
    }

    var successRequest = function (res){
        $timeout(function () {
            $rootScope.data.requestBenefitVerification = res;
            $ionicLoading.hide();
            if($scope.requestHeader.categoryType.toLowerCase() == 'medical overlimit'){
                $scope.goTo("app.selfservicesuccess");
            }else {
                $state.go("app.benefitconfirmation");
            }
        }, 1000);

    }

    function verificationForm(reqHeader){
       if(reqHeader.categoryType == 'Perjalanan Dinas') {
            if(reqHeader.origin == undefined || reqHeader.origin == ""){
              messageValidation = "Origin can't be empty";
              return false;
            }

            if(reqHeader.destination == undefined || reqHeader.destination == ""){
                messageValidation = "Destination can't be empty";
                return false;
            }

            if(reqHeader.remark == undefined || reqHeader.remark == ""){
                messageValidation = "Remark can't be empty";
                return false;
            }

            if(reqHeader.spdType == undefined || reqHeader.spdType == ""){
                messageValidation = "SPD Type can't be empty";
                return false;
            }
      }
        return true;
    }



    $scope.submitForm = function(){
        
        $scope.requestHeader.module = "Benefit";
        $scope.requestHeader.startDate = $filter('date')(new Date($scope.requestHeader.startDate),'yyyy-MM-dd');
        $scope.requestHeader.endDate = $filter('date')(new Date($scope.requestHeader.endDate),'yyyy-MM-dd');
        $scope.requestHeader.categoryType = categoryType;
        $scope.requestHeader.categoryTypeExtId = categoryTypeExtId;
        $scope.requestHeader.workflow = workflow;

        if(verificationForm($scope.requestHeader)){
            $ionicLoading.show({
              template: '<ion-spinner></ion-spinner>'
            });
            
            // if($scope.category != 'medical overlimit') {
             if($scope.directType != true || $scope.defaultValue==0){
                var requestDetail = [];
                angular.forEach($scope.listtype, function(value, key){
                      var obj ={};
                      if(value.type == 'select'){
                        obj.type = value.value;
                      }else {
                        obj.type = value.name;
                      }
                      
                      if(value.amount != undefined) {
                           var number = value.amount.toString();
                            if(number != '0'){
                                number = number.replace(/\./g,'');
                            }
                            obj.amount = number; 
                      }
                     
                      
                      if(value.qty != undefined)
                        obj.qty = value.qty;
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
                obj.amount = $scope.defaultValue;
                requestDetail.push(obj);
                $scope.requestHeader.details = requestDetail;
            }

            var accessToken = Main.getSession("token").access_token;
            // var urlApi = Main.getUrlApi() + '/api/user/tmrequestheader/benefit';
            var urlApi = Main.getUrlApi() + '/api/user/tmrequestheader/verificationbenefit';
            if($scope.requestHeader.categoryType.toLowerCase() == 'medical overlimit'){
                urlApi = Main.getUrlApi() + '/api/user/tmrequestheader/benefit';
            }
            var data = JSON.stringify($scope.requestHeader);
            
            Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);

        }else {
          $scope.warningAlert(messageValidation);
        }
        
    }

   
    function initData(){
        $scope.requestHeader.startDate = new Date();
        $scope.requestHeader.endDate = new Date();
        $scope.requestHeader.origin = "";
        $scope.requestHeader.pulangKampung =false;
        $scope.requestHeader.destination = "";
        $scope.requestHeader.remark = "";
        $scope.requestHeader.attachments = []; 
        $scope.images = []; 
    }

    function initModule() {
        initData();
        $rootScope.data.requestBenefitVerification = {};
        if($scope.category == 'kacamata') {
            var arrLensa = [{id:"Lensa Monofocus Non Cylindris"},{id:"Lensa Monofocus Cylindris"},{id:"Lensa Bifokus Non Cylindris"},{id:"Lensa Bifokus Cylindris"}];
            $scope.listtype = [{id:"frame",name:"Frame"},{id:"lensa", name:"Lensa",type:"select",options:arrLensa,value:"Lensa Monofocus Non Cylindris"}];
        }else if($scope.category == 'perjalanan dinas'){
            var uangsaku = [{id:"Uang Saku Dalam Negeri"},{id:"Uang Saku Luar Negeri"}];
            var uangmakan = [{id:"Uang Makan Dalam Negeri"},{id:"Uang Makan Luar Negeri"}];
            $scope.listtype = [{id:"ticket",name:"Ticket"},{id:"taxi",name:"Taxi"},{id:"transport",name:"Transport"},{id:"hotel",name:"Hotel",input:true,satuan:"days"},{id:"rentalmobil",name:"Rental Mobil"},{id:"mileage",name:"Mileage",input:true,satuan:"KM"},{id:"uangmakan", name:"Uang Makan", value:"Uang Makan Dalam Negeri",type:"select",options:uangmakan, input:true,satuan:"days"},{id:"uangsaku", name:"Uang Saku",value:"Uang Saku Dalam Negeri",type:"select",options:uangsaku,input:true,satuan:"days"},{id:"laundry",name:"Laundry"},{id:"tolparkirbensin",name:"Tol Parkir Bensin"},{id:"other",name:"Other"}];
        }else if($scope.category == 'reimbursement'){
            $scope.listtype = [{id:"personalexpenses",name:"Personal Expenses"},{id:"communication",name:"Communication (pulsa)"},{id:"sportmembership",name:"Sport membership"}];
        }else if($scope.category == 'other'){
            $scope.listtype = [{id:"cutibesar",name:"Cuti Besar"}];
        }else if($scope.category == 'medical'){
            $scope.listtype = [{id:"dokter",name:"Dokter"},{id:"obat",name:"Apotik / Obat"},{id:"lab",name:"Lab / R.S"},{id:"lainlain",name:"Lain-lain"}];
        }else if($scope.category == 'mutasi'){
            $scope.listtype = [{id:"sekolah",name:"Pendaftaran sekolah"},{id:"rumahoperasional",name:"Sumbangan rumah operasional"}];
        }

        if($rootScope.selectedBenefitCategory != undefined){
            $scope.directType = $rootScope.selectedBenefitCategory.directType;
            $scope.labelCategory = $rootScope.selectedBenefitCategory.label;
            $scope.defaultValue = $rootScope.selectedBenefitCategory.defaultValue;
            if($scope.directType == true) {
                  if($scope.defaultValue != 0 && $rootScope.selectedBenefitCategory.listRequestType.length > 0)
                    objDirectType =  $rootScope.selectedBenefitCategory.listRequestType[0];

                  if($scope.defaultValue == 0){
                      var arrListType = $rootScope.selectedBenefitCategory.listRequestType;
                      $scope.listtype = [];
                      for (var i = arrListType.length - 1; i >= 0; i--) {
                          var obj = {name:arrListType[i].type};
                          $scope.listtype.push(obj);
                      };
                      
                  }
            }
        }




        if($rootScope.needReportSelected != undefined) {
            $scope.requestHeader.origin = $rootScope.needReportSelected.origin;
            $scope.requestHeader.remark = $rootScope.needReportSelected.remark;
            $scope.requestHeader.destination = $rootScope.needReportSelected.destination;
            $scope.requestHeader.spdType = $rootScope.needReportSelected.spdType;
            $scope.requestHeader.linkRefHeader = $rootScope.needReportSelected.id;
            $scope.requestHeader.startDate = $filter('date')(new Date($rootScope.needReportSelected.startDate),'yyyy-MM-dd');
            $scope.requestHeader.endDate = $filter('date')(new Date($rootScope.needReportSelected.endDate),'yyyy-MM-dd');
       
        }
        
        
    }
    initModule();
})

.controller('BenefitConfirmationCtrl', function(appService,$ionicActionSheet,$cordovaCamera,$stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
      var benefitVerification = $rootScope.data.requestBenefitVerification;
      $scope.defaultImage = "img/placeholder.png";
      $scope.images = [];  
      $scope.requestHeader = {};
      $scope.requestHeader.attachments = []; 
      $scope.appMode = Main.getAppMode();
      $scope.$on('$ionicView.beforeEnter', function (event,data) {
          initMethod();
      });

      var successRequest = function (res){
          $ionicLoading.hide();
          $scope.goTo("app.selfservicesuccess");
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


      $scope.submitForm = function(){
          if($scope.requestHeader.attachments.length > 0) {
              $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
              });
              var accessToken = Main.getSession("token").access_token;
              var urlApi = Main.getUrlApi() + '/api/user/tmrequestheader/benefit';
              var attachment = [];
              if($scope.requestHeader.attachments.length > 0) {
                  for (var i = $scope.requestHeader.attachments.length - 1; i >= 0; i--) {
                      var objAttachment = {'image':null};
                      if($scope.appMode=='mobile'){
                          objAttachment = {"image":$scope.requestHeader.attachments[i].image};
                      }else{
                          if($scope.requestHeader.attachments[i].compressed.dataURL != undefined) {
                              var webImageAttachment = $scope.requestHeader.attachments[i].compressed.dataURL.replace(/^data:image\/[a-z]+;base64,/, "");
                              objAttachment = {"image":webImageAttachment};
                          }
                          
                      }
                      attachment.push(objAttachment);
                  };
              }
              benefitVerification.startDate = $filter('date')(new Date(benefitVerification.startDate),'yyyy-MM-dd');
              benefitVerification.endDate = $filter('date')(new Date(benefitVerification.endDate),'yyyy-MM-dd');
              benefitVerification.attachments = attachment; 
              
              var data = JSON.stringify(benefitVerification);
              
              Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
          }else {
              $scope.warningAlert("You must add at least 1 attachment.");
          }
      }

      

      function initMethod(){
          benefitVerification = $rootScope.data.requestBenefitVerification;
          $scope.totalClaim = 0;
          $scope.totalSubmitedClaim = 0;
          $scope.totalCurrentClaim = 0;
          $scope.lastClaimDate = "";
          $scope.images = [];  
          $scope.requestHeader = {};
          $scope.requestHeader.attachments = []; 
          if(benefitVerification != null && benefitVerification.details.length > 0) {
             $scope.categoryType = benefitVerification.categoryType;
             
             for (var i = benefitVerification.details.length - 1; i >= 0; i--) {
                $scope.totalClaim += benefitVerification.details[i].totalClaim;
                $scope.totalSubmitedClaim += benefitVerification.details[i].totalSubmitedClaim;
                $scope.totalCurrentClaim += benefitVerification.details[i].totalCurrentClaim;
             };

             if(benefitVerification.details.length == 1){
                if(benefitVerification.details[0].lastClaimDate != undefined)
                  $scope.lastClaimDate = $filter('date')(new Date(benefitVerification.details[0].lastClaimDate),'yyyy-MM-dd');
             }

          }
      }
      
      initMethod();

 })


.controller('ClaimChoice', function($stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
 })

.controller('BenefitDetailCtrl', function(ionicSuperPopup,$ionicPopup,$stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    $scope.confirm = {};
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.isHr = Main.getSession("profile").isHr;
    $scope.header = {};
    var id = $stateParams.id;
    console.log(Main.getSession("profile"));
    
    var successApprove = function(res){
        $ionicLoading.hide();
        $scope.successAlert(res.message);
        $scope.goBack('app.formrequestsearching');

    }

    var successCancel = function(res){
        $ionicLoading.hide();
        $scope.successAlert(res.message);
        $scope.goBack('app.benefitclaimlist');

    }


    var sendApproval = function(action,id,reason){
        var data = {};
        if(action == 'approved')
          data = {"id":id,"status":action};
        else
          data = {"id":id,"status":action,"reasonReject":reason};

        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/workflow/actionapproval';
        var data = JSON.stringify(data);

        Main.postRequestApi(accessToken,urlApi,data,successApprove,$scope.errorRequest);

    }

     $scope.confirmCancel = function (idDataApproval){
        ionicSuperPopup.show({
           title: "Are you sure?",
           text: "Are you sure want to Cancel this request ?",
           type: "warning",
           showCancelButton: true,
           confirmButtonColor: "#DD6B55",
           confirmButtonText: "Yes",
           closeOnConfirm: false
         },
        function(isConfirm){
             if (isConfirm) {
                sendApproval('cancelled',idDataApproval,"");
             }
           
        });
    }

    $scope.confirmReject = function (idDataApproval){
        var confirmPopup = $ionicPopup.confirm({
            title: 'Reason Rejected',
            template: '<textarea rows="2" maxlength="50" class="calm" style="width:100%; border-color:#ddd; border: solid 2px #c9c9c9;border-radius:2px" ng-model="confirm.reasonReject" ></textarea>',
            cancelText: 'Cancel',
            scope: $scope,
            okText: 'Yes'
          }).then(function(res) {
              if (res) {
                  var reason = $scope.confirm.reasonReject;
                 
                  if(reason == undefined || reason == "")
                    alert("Reason reject can not empty");
                  else
                    sendApproval('rejected',idDataApproval,reason);
              }
              
          });
    }

    
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

    $scope.printReport = function (employee,uuid){
        
        var url = Main.getPrintReportUrl() + "/spd?employee="+employee+"&uuid="+uuid+"&category="+$scope.header.categoryType;
        window.open(encodeURI(url), '_system', 'location=yes');
        return false;
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


.controller('BenefitClaimNeedReportCtrl', function($ionicPopover,$ionicLoading,$rootScope, $scope,$state , AuthenticationService, Main) {
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }


    $scope.requests = [];
    $scope.needReportRequests = [];
    $scope.module = {};

    $scope.gotoListType = function(index){
        $rootScope.needReportSelected = $scope.needReportRequests[index];

        if(Main.getSession("categoryType") != undefined) {
            var arrCategoryType = Main.getSession("categoryType");
            var objPerjalananDinas = null;
            for (var i = 0; i < arrCategoryType.length; i++) {
                obj = arrCategoryType[i];
                if(obj.categoryType.toLowerCase() == "perjalanan dinas") 
                  objPerjalananDinas = obj;
            };  

            if(objPerjalananDinas!= null) {
                //var perjalananDinas = {id:"0124D0000008guqQAA",name:"Perjalanan Dinas",workflow:"SUBMITBENEFIT2"};
                $rootScope.selectedBenefitCategory = undefined;
                var perjalananDinas = {id:objPerjalananDinas.categoryTypeExtId,name:objPerjalananDinas.categoryType,workflow:objPerjalananDinas.workflow};
                $state.go("app.benefitlisttype",{categoryType:perjalananDinas.name,extId:perjalananDinas.id,workflow:perjalananDinas.workflow,singleinput:false});
            }
        }
        
        
    }

    $scope.gotoBenefitDetail = function(index){
        $state.go("app.benefitdetail");
    }

    $scope.refresh = function(){
      initMethod(); 
    }
   
    var successRequest = function (res){
      $scope.needReportRequests = [];
      for(var i=0;i<res.length;i++) {
          var obj = res[i];
          obj.idx = i; 
          $scope.needReportRequests.push(obj);
       }

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    }

     var successBalance = function (res){
      if(res.length > 0) {
          var sessionBalance = [];
          for (var i = res.length - 1; i >= 0; i--) {
              var type = res[i].type;
              var value = res[i].balanceEnd;
              var obj = {id:type.toLowerCase(),name:value};
              sessionBalance.push(obj);
          };
          Main.setSession("balance",sessionBalance);        
      }
    }

    function getBalanceSaveToSession(){
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmbalance/type';
        var body ={"module":"Benefit"};
        var data = JSON.stringify(body);
        Main.postRequestApi(accessToken,urlApi,data,successBalance,$scope.errorRequest);
    }


    initMethod();

    function initMethod(){
        getNeedReportList();
        if(Main.getSession('balance') == undefined)
            getBalanceSaveToSession();
    }
   

    function getNeedReportList(){
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
      var accessToken = Main.getSession("token").access_token;
      var     urlApi = Main.getUrlApi() + '/api/user/tmrequest/needreport?module=Benefit';
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }
})

.controller('BenefitClaimListCtrl', function($ionicPopover,$ionicLoading,$rootScope, $scope,$state , AuthenticationService, Main) {
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.requests = [];
    $scope.module = {};
    $scope.$on('$ionicView.beforeEnter', function (event,data) {        
        initMethod();
    });

    $scope.gotoBenefitDetail = function(index){
          $state.go("app.benefitdetail");
    }

    $scope.refresh = function(){
        initMethod();  
    }
   
    var successRequest = function (res){
      $scope.requests = [];
      for(var i=0;i<res.length;i++) {
          var obj = res[i];
          obj.idx = i; 
          $scope.requests.push(obj);
       }

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    }

    function initMethod(){
        getListBenefit();
    }
   

    function getListBenefit(){
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/tmrequest?module=Benefit';
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }
})

.controller('SpdAdvanceAdd', function(ionicDatePicker,$stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    var categoryType = $stateParams.categoryType;
    var categoryTypeExtId = $stateParams.extId;
    var workflow = $stateParams.workflow;
    $scope.requestHeader = {};
    var messageValidation = "";
    $scope.arrSpdType = [{id:"regular"},{id:"pulang kampung"},{id:"mutasi"},{id:"training"},{id:"assessment"}];
   

    var datepicker = {
      callback: function (val) {  //Mandatory
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


    $scope.$on('$ionicView.beforeEnter', function (event,data) {        
        initModule();
    });




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
       
        dataAmount = Number(dataAmount);
        detailSubmit.amount = dataAmount;  
        $scope.requestHeader.module = "Benefit";
        $scope.requestHeader.workflow = workflow;
        $scope.requestHeader.startDate = $filter('date')(new Date($scope.requestHeader.startDate),'yyyy-MM-dd');
        $scope.requestHeader.endDate = $filter('date')(new Date($scope.requestHeader.endDate),'yyyy-MM-dd');
        $scope.requestHeader.categoryType = categoryType;
        $scope.requestHeader.categoryTypeExtId = categoryTypeExtId;
        $scope.requestHeader.origin = $scope.detail.origin;
        $scope.requestHeader.spdType = $scope.detail.spdType;
        $scope.requestHeader.destination = $scope.detail.destination;
        $scope.requestHeader.remark = $scope.detail.remark;
        var requestDetail = [];
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
     
        if(dataSpd.origin == undefined || dataSpd.origin ==''){
            messageValidation = "Origin can't be empty";
            return false;
        }

        if(dataSpd.destination == undefined || dataSpd.destination == ''){
            messageValidation = "Destination can't be empty";
            return false;
        }

        if(dataSpd.spdType == undefined || dataSpd.spdType == ''){
            messageValidation = "SPD Type can't be empty";
            return false;
        }

        if(dataSpd.data == undefined || dataSpd.data == ''){
            messageValidation = "Estimated Expenses & Item can't be empty";
            return false;
        }

        if(dataSpd.amount == undefined || dataSpd.amount == 0){
            messageValidation = "Amount can't be empty";
            return false;
        }

        if(dataSpd.remark == undefined || dataSpd.remark == ""){
            messageValidation = "Remark can't be empty";
            return false;
        }

        return true;
          
    }

    function initModule(){
        $scope.detail = {amount:0,type:"Advance",remark:"",origin:"",destination:"",data:""};
        $scope.requestHeader.startDate = new Date();
        $scope.requestHeader.endDate = new Date();
    }


 })




