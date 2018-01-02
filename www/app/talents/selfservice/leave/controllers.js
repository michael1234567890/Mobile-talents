angular.module('leave.controllers', [])
.controller('DetailEmpDailyCtrl',function($filter, ionicTimePicker, $timeout, $ionicHistory , $stateParams,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    var empdailyIdx = $stateParams.idx;
    $scope.atempdaily = {};
    if(empdailyIdx != null)
      $scope.atempdaily = $rootScope.atempdaily[empdailyIdx];

    $scope.categories = [];
    $scope.leave = {};
    var messageValidation="";
    $scope.attendance = {};
    $scope.attendanceIn = $filter('date')(new Date($scope.atempdaily.actualInTime), 'HH:mm');
    $scope.attendanceOut = $filter('date')(new Date($scope.atempdaily.actualOutTime), 'HH:mm');
    var employee= Main.getSession("profile").employeeTransient.id;

    $scope.onSelectType = function() {
      setLabelType($scope.attendance.type,getListType("Attendance Edit"));
      
    }

    function setLabelType(type,arrType) {
      console.log("type : ", type);
      console.log("arrType : ", arrType);
        if(arrType.length != 0) {
            for (var i = 0; i < arrType.length; i++) {
              if(arrType[i].type == type) 
                  $scope.labelType = arrType[i].typeLabel;
            };
        }
    }

    function getCategory(categoryType) {
        var sessTmRequestType = Main.getSession("tmCategoryType");
        console.log("tmCategoryType",Main.getSession("tmCategoryType"));
         for (var i = 0; i < sessTmRequestType.length; i++) {
            if(sessTmRequestType[i].categoryType == categoryType){
                return sessTmRequestType[i];
                break;
            }
              
         };
         return undefined;
    }

    function getListType(categoryType){
        
        var objCategory = getCategory(categoryType);
        if(objCategory != undefined)
           return objCategory.listRequestType;
         else
           return [];
             
    }

    function initData(){
        $scope.selectType = getListType("Attendance Edit");
        $scope.labelType = "Select Type ..";
    }

    initData();

    $scope.openTimePicker1 = function(){
        ionicTimePicker.openTimePicker(timePickerComponent1);
    };

    var timePickerComponent1 = {
        callback: function(val){
            if(typeof(val) === 'undefined'){
                console.log('Time not selected');
            } else {
                var hours = parseInt(val / 3600);
                var minutes = (val / 60) % 60;
                var hourString = ""+hours;
                var minuteString = ""+minutes;

                if(hourString.length == 1)
                    hourString = "0"+hours;

                if(minuteString.length == 1)
                    minuteString = "0"+minutes;

                $scope.attendanceIn = hourString+":"+minuteString;
            }
        },
        inputTime: 32400,
        format: 24,
        step: 5,
        setLabel: 'Set'
    };

    $scope.openTimePicker2 = function(){
        ionicTimePicker.openTimePicker(timePickerComponent2);
    };

    var timePickerComponent2 = {
        callback: function(val){
            if(typeof(val) === 'undefined'){
                console.log('Time not selected');
            } else {
                var hours = parseInt(val / 3600);
                var minutes = (val / 60) % 60;
                var hourString = ""+hours;
                var minuteString = ""+minutes;

                if(hourString.length == 1)
                    hourString = "0"+hours;

                if(minuteString.length == 1)
                    minuteString = "0"+minutes;

                $scope.attendanceOut = hourString+":"+minuteString;
            }
        },
        inputTime: 32400,
        format: 24,
        step: 5,
        setLabel: 'Set'
    };

    var successRequest = function(res){
        $timeout(function(){
            $rootScope.data.requestLeaveVerification = res;
            $ionicLoading.hide();
            $state.go("app.leaveconfirmation");
        }, 1000);
    }


    $scope.submitForm = function(){
        if(verificationForm($scope.attendance)){
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });

            $scope.atempdaily.actualInTime = $filter('date')(new Date($scope.atempdaily.actualInTime), 'yyyy-MM-dd');
            $scope.atempdaily.actualOutTime = $filter('date')(new Date($scope.atempdaily.actualOutTime), 'yyyy-MM-dd');
            var dataPost = {};
            dataPost.startDate = $scope.atempdaily.workDate;
            dataPost.endDate = $scope.atempdaily.workDate;
            dataPost.remark = $scope.attendance.remark;
            dataPost.typeDesc = $scope.labelType;
            dataPost.attendanceInTime = dataPost.startDate + " " + $scope.attendanceIn + ":00";
            dataPost.attendanceOutTime = dataPost.endDate + " " + $scope.attendanceOut + ":00";
            dataPost.categoryType = "Attendance Edit";
            dataPost.type = $scope.attendance.type;
            dataPost.workflow="SUBMITAT";
            dataPost.module="Time Management";
            dataPost.employee = employee;
            dataPost.atempdaily = $scope.atempdaily.id;

            var accessToken = Main.getSession("token").access_token;
            var urlApi = Main.getUrlApi() + '/api/user/tmrequestheader/verificationleave';
            var data = JSON.stringify(dataPost);
            Main.postRequestApi(accessToken, urlApi, data, successRequest, $scope.errorRequest);

        } else {
            $scope.warningAlert(messageValidation);
        }
    }

    function verificationForm(attendance){
        if(attendance.type == undefined || attendance.type == ""){
            messageValidation = "Reason can't be empty";
            return false;
        }

        if(attendance.remark == undefined || attendance.remark == ""){
            messageValidation = "Remark can't be empty";
            return false;
        }
        return true;
    }
    
 })


.controller('ListEmpDailyCtrl',function(ionicDatePicker,ionicTimePicker,$stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {

    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    
    $scope.entryPage = true;
    $scope.year = [];
    $scope.month = Main.getSelectMonth();
    var arrCompanyRef = Main.getSession("profile").companyReference;
    var refYear = Main.getDataReference(arrCompanyRef,'payslip',null,'selectYear');
    $scope.selected = {};
    $scope.today = new Date();
    $scope.categories = [];

    var size = Main.getDataDisplaySize();
    $scope.atempdaily = [];
    $scope.show = function(){
      $scope.entryPage = false;
        if($scope.selected.year=='' || $scope.selected.month=='') {
            $scope.warningAlert("Please choose Month and Yeare");
            return false;
        }else {
            initMethod();
        }
        
    }

    $scope.goToAddTimesheet = function () {
        $state.go('app.addtimesheet');
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: false
        });
    }

    $scope.goToDetails = function (idx) {
      $state.go('app.detailempdaily',{'idx':idx});
    };

    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.atempdaily = res;
      
      $rootScope.atempdaily = [];
      for(var i=0;i<$scope.atempdaily.length;i++) {
        var obj = $scope.atempdaily[i];
        obj.idx = i;
        $rootScope.atempdaily.push(obj);
      }
      $scope.atempdaily = $rootScope.atempdaily;
      $scope.$broadcast('scroll.refreshComplete');
      $rootScope.refreshListTimesheetCtrl = true;
    }

    function initMethod(){
        $scope.atempdaily = [];
        getAtEmpDaily();
    }

    

    $scope.refresh = function(){

      $scope.atempdaily = [];
      getAtEmpDaily();
    }

    var successRequestss = function (res){
        $timeout(function () {
            if(res.length > 0) {
                Main.setSession("tmCategoryType",res);
                $scope.categories = res;
                
            }
            $ionicLoading.hide();
        }, 1000);
    }


    function getListCategory(){
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmrequest/category?module=time management';
        //var urlApi = Main.getUrlApi() + '/api/user/tmrequest/category?module=attendance';
        Main.requestApi(accessToken,urlApi,successRequestss, $scope.errorRequest);
    }

    function initModule() {
        $scope.selected.year = "";
        $scope.selected.month = "";
         $scope.entryPage = false;
        if(Main.getSession("tmCategoryType") == undefined)
            getListCategory();
        else
          $scope.categories = Main.getSession("tmCategoryType");
        
        // if( $rootScope.refreshListTimesheetCtrl) {
        //     initMethod();
        // }

        if(refYear != undefined && refYear != '') {
             $scope.year = JSON.parse(refYear);
        }

        $rootScope.refreshListTimesheetCtrl = false;
        console.log("$scope.categories",$scope.categories);
    }

    $scope.$on('$ionicView.beforeEnter', function (event,data) {
        if(data.direction != undefined && data.direction!='back')
            initModule();

    })

    
    function getAtEmpDaily(){

      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
      });

      var month = "";
      if($scope.selected.month != null || $scope.selected.year != null){
        var bulan = $scope.selected.month;
        var year = $scope.selected.year;
        var month = year + '-' + bulan;
      } else {
        var month = $filter('date')(new Date(), 'yyyy-MM');
      }
      
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/atempdaily/byperiod?type=monthly&month=' +month;
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }

 })

.controller('HomeLeaveCtrl', function($ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.leaves = [];
    $scope.total = {};
    $scope.refresh = function(){
      initMethod();
    }
    
    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.leaves = res;
      $scope.$broadcast('scroll.refreshComplete');

    }

    function getTotalFromArray(array,module,category){
        for (var i = array.length - 1; i >= 0; i--) {
            if(array[i].module.toLowerCase() == module && array[i].category.toLowerCase() == category )
              return array[i].total;
        };
        return "-";
    }
    var successTotalCategory = function (res){
      console.log("res total category",res);
      if(res != undefined && res.length > 0){
          $scope.total.sick = getTotalFromArray(res,"time management","sick");
          $scope.total.leave = getTotalFromArray(res,"time management","leave");
          $scope.total.permission = getTotalFromArray(res,"time management","permission");
      }
    }


    function getLeaves(){
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
      });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/tmrequest/bystatus?module=Time Management&status=pending';
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }

    function getTotalCategory(){
      $scope.total.permission = "-";
      $scope.total.leave = "-";
      $scope.total.sick = "-";
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/tmrequest/totalamount?fromdate=2017-01-01&todate=2017-31-12';
      Main.requestApi(accessToken,urlApi,successTotalCategory, $scope.errorRequest);
    }

    function initModule(){
      if(Main.getEnvironment() == 'production') {
          alert("This feature is not available");
          $scope.goBack('app.selfservice');
      }
      getLeaves(); 
      getTotalCategory();     
    }

    $scope.$on('$ionicView.beforeEnter', function (event,data) {
          initModule();
      
    });

    initModule();


})



.controller('ChooseLeaveCategoryCtrl', function($timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.categories = [];

    $scope.goToLeaveForm = function(category){
       
        if(category=='Attendance Edit') {
            $state.go("app.listempdaily");
        }else {
            $state.go("app.addleave",{'category':category});
        }
        
    }

    //$scope.categories = [{name:"Leave",description:"Leave Description"},{name:"Permission",description:"Permission Description"},{name:"Sick",description:"Sick Description"},{name:"Overtime",description:"Overtime Description"},{name:"Edit Attendance",description:"Edit Attendance Description"}];
    
    var successRequest = function (res){
        $timeout(function () {
            if(res.length > 0) {
                Main.setSession("tmCategoryType",res);
                $scope.categories = res;
                
            }
            $ionicLoading.hide();
        }, 1000);
    }


    function getListCategory(){
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmrequest/category?module=time management';
        //var urlApi = Main.getUrlApi() + '/api/user/tmrequest/category?module=attendance';
        Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }

    function initModule() {

        if(Main.getSession("tmCategoryType") == undefined)
            getListCategory();
        else
          $scope.categories = Main.getSession("tmCategoryType");
        console.log("$scope.categories",$scope.categories);
    }

    $scope.$on('$ionicView.beforeEnter', function (event,data) {
          initModule();
    });

})


.controller('LeaveConfirmationCtrl', function(appService,$ionicActionSheet,$cordovaCamera,$stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
      var leaveVerification = $rootScope.data.requestLeaveVerification;
      $scope.defaultImage = "img/placeholder.png";
      $scope.images = [];  
      $scope.imagesData = [];  
      $scope.requestHeader = {};
      $scope.requestHeader.attachments = []; 
      $scope.appMode = Main.getAppMode();
      console.log($scope.appMode);
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
                                  $scope.imagesData.push({'image': imageData});
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
                                   $scope.imagesData.push({'image': imageData});
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
          if($scope.requestType.requiredAttachment && $scope.requestHeader.attachments.length == 0) {
              $scope.warningAlert("You must add at least 1 attachment.");
              return false;
          }
          
          $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
          });
          var accessToken = Main.getSession("token").access_token;
          var urlApi = Main.getUrlApi() + '/api/user/tmrequestheader/leave';
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

          leaveVerification = $rootScope.data.requestLeaveVerification;
          leaveVerification.startDate = $filter('date')(new Date(leaveVerification.startDate),'yyyy-MM-dd');
          leaveVerification.endDate = $filter('date')(new Date(leaveVerification.endDate),'yyyy-MM-dd');

          if(leaveVerification.attendanceInTime != undefined && leaveVerification.attendanceOutTime != undefined ){
              leaveVerification.attendanceInTime = $filter('date')(new Date(leaveVerification.attendanceInTime),'yyyy-MM-dd HH:mm:dd');
              leaveVerification.attendanceOutTime = $filter('date')(new Date(leaveVerification.attendanceOutTime),'yyyy-MM-dd HH:mm:dd');
          }

          if(leaveVerification.startDateInTime != undefined && leaveVerification.endDateInTime != undefined ){
              leaveVerification.startDateInTime = $filter('date')(new Date(leaveVerification.startDateInTime),'yyyy-MM-dd HH:mm:dd');
              leaveVerification.endDateInTime = $filter('date')(new Date(leaveVerification.endDateInTime),'yyyy-MM-dd HH:mm:dd');
          }

          if(leaveVerification.startDateOutTime != undefined && leaveVerification.endDateOutTime != undefined ){
              leaveVerification.startDateOutTime = $filter('date')(new Date(leaveVerification.startDateOutTime),'yyyy-MM-dd HH:mm:dd');
              leaveVerification.endDateOutTime = $filter('date')(new Date(leaveVerification.endDateOutTime),'yyyy-MM-dd HH:mm:dd');
          }
          
          leaveVerification.attachments = attachment; 
          
          var data = JSON.stringify(leaveVerification);
          Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
      
      }

      function initData(){
          $scope.total = 0;
          $scope.totalBalance =0;
          $scope.type = "-";
          $scope.categoryType = "-";
          $scope.images = [];  
          $scope.imagesData = [];  
          $scope.requestHeader = {};
          $scope.requestHeader.attachments = []; 
          $scope.overtimeIn =0;
          $scope.overtimeOut = 0; 
          $scope.typeDesc = "-";
          $scope.attendanceInTime = 0;
          $scope.attendanceOutTime = 0;
          $scope.requestType = {};
      }

      function initMethod(){
          initData();
          leaveVerification = $rootScope.data.requestLeaveVerification;
          if(leaveVerification != null) {
                $scope.categoryType = leaveVerification.categoryType.toLowerCase();
                $scope.total = leaveVerification.total;
                $scope.type = leaveVerification.type;
                $scope.startDate = leaveVerification.startDate;
                $scope.endDate = leaveVerification.endDate;
                $scope.totalBalance = leaveVerification.totalBalance;
                $scope.overtimeIn = leaveVerification.overtimeIn;
                $scope.overtimeOut = leaveVerification.overtimeOut;
                $scope.attendanceInTime = leaveVerification.attendanceInTime;
                $scope.attendanceOutTime = leaveVerification.attendanceOutTime;
                $scope.typeDesc = leaveVerification.typeDesc;
                $scope.requestType = leaveVerification.requestType;
                $scope.startDateInTime = leaveVerification.startDateInTime;
                $scope.endDateInTime = leaveVerification.endDateInTime;
                $scope.startDateOutTime = leaveVerification.startDateOutTime;
                $scope.endDateOutTime = leaveVerification.endDateOutTime;
                $scope.atempdaily = leaveVerification.atempdaily;
               // console.log("leaveVerification new",leaveVerification);
          
          }
      }
      

 })

.controller('AddLeaveCtrl', function(ionicTimePicker,$timeout,$filter, $stateParams, $ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main,ionicDatePicker) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    var startDate = $filter('date')(new Date(),'yyyy-MM-dd');
    var endDate = $filter('date')(new Date(),'yyyy-MM-dd');
    var employee= Main.getSession("profile").employeeTransient.id;
    $scope.leaveCategory = $stateParams.category.toLowerCase();
    $scope.leaveType = {};
    $scope.selectHour = Main.getSelectHour();
    $scope.selectMinutes = Main.getSelectFiveteenMin();
    $scope.selectType = [];
    $scope.selectEmployeeSubstitute = [];
    $scope.labelSubstitute = "Select Substitute ..";
    $scope.labelType = "Select Type ..";
    $scope.leave = {};
    //$scope.leave = {remark:"",startDate:new Date(),endDate:new Date(),remark:"",type:""};
    $scope.balance = {balanceEnd:"-",balanceUsed:"-"};
    $scope.attendanceIn = "00:00";
    $scope.attendanceOut = "00:00"; 
    var module = "time management";
    var messageValidation="";


    //Overtime Component
    var timePickerOvertime1 = {
        callback: function (val) {  
            
          if (typeof (val) === 'undefined') {
                console.log('Time not selected');
           } else {
              var hours = parseInt(val / 3600);
              var minutes = (val / 60) % 60;
              var hourString = ""+hours;
              var minuteString = ""+minutes;

              if(hourString.length==1)
                  hourString = "0"+hours;

              if(minuteString.length==1)
                  minuteString = "0"+minutes;

              $scope.leave.startDateInTimeTime = hourString+":"+minuteString;
          }
        },
        inputTime: 32400,   //Optional
        format: 24,         //Optional
        step: 5,           //Optional
        setLabel: 'Set'    //Optional
    };
  
    $scope.openTimePickerOvertime1 = function(){
      ionicTimePicker.openTimePicker(timePickerOvertime1);
    };


    var timePickerOvertime2 = {
        callback: function (val) {  
            
          if (typeof (val) === 'undefined') {
                console.log('Time not selected');
           } else {
              var hours = parseInt(val / 3600);
              var minutes = (val / 60) % 60;
              var hourString = ""+hours;
              var minuteString = ""+minutes;

              if(hourString.length==1)
                  hourString = "0"+hours;

              if(minuteString.length==1)
                  minuteString = "0"+minutes;

              $scope.leave.endDateInTimeTime = hourString+":"+minuteString;
          }
        },
        inputTime: 32400,   //Optional
        format: 24,         //Optional
        step: 5,           //Optional
        setLabel: 'Set'    //Optional
    };
  
    $scope.openTimePickerOvertime2 = function(){
      ionicTimePicker.openTimePicker(timePickerOvertime2);
    };



    var datepickerOvertime1 = {
        callback: function (val) {  //Mandatory
          $scope.leave.startDateInTimeDate = val;
        },
        inputDate: new Date(),      //Optional
        mondayFirst: true,          //Optional
        dateFormat:"yyyy-MM-dd",
        closeOnSelect: false,       //Optional
        templateType: 'popup'       //Optional
    };

    $scope.openDatePickerOvertime1 = function(){
        ionicDatePicker.openDatePicker(datepickerOvertime1);
    };


    var datepickerOvertime2 = {
        callback: function (val) {  //Mandatory
          $scope.leave.endDateInTimeDate = val;
        },
        inputDate: new Date(),      //Optional
        mondayFirst: true,          //Optional
        dateFormat:"yyyy-MM-dd",
        closeOnSelect: false,       //Optional
        templateType: 'popup'       //Optional
    };

    $scope.openDatePickerOvertime2 = function(){
        ionicDatePicker.openDatePicker(datepickerOvertime2);
    };






    var timePickerComponent1 = {
        callback: function (val) {  
            
          if (typeof (val) === 'undefined') {
                console.log('Time not selected');
           } else {
              var hours = parseInt(val / 3600);
              var minutes = (val / 60) % 60;
              var hourString = ""+hours;
              var minuteString = ""+minutes;

              if(hourString.length==1)
                  hourString = "0"+hours;

              if(minuteString.length==1)
                  minuteString = "0"+minutes;

              $scope.attendanceIn = hourString+":"+minuteString;
          }
        },
        inputTime: 32400,   //Optional
        format: 24,         //Optional
        step: 5,           //Optional
        setLabel: 'Set'    //Optional
      };
  
    $scope.openTimePicker1 = function(){
      ionicTimePicker.openTimePicker(timePickerComponent1);
    };

     var timePickerComponent2 = {
        callback: function (val) {      //Mandatory
            $scope.leave.attendanceOut = new Date(val * 1000) ;
            var hours = parseInt(val / 3600);
            var minutes = (val / 60) % 60;
            if (typeof (val) === 'undefined') {
              console.log('Time not selected');
            } else {
                var hours = parseInt(val / 3600);
                var minutes = (val / 60) % 60;
                var hourString = ""+hours;
                var minuteString = ""+minutes;

                if(hourString.length==1)
                    hourString = "0"+hours;

                if(minuteString.length==1)
                    minuteString = "0"+minutes;

                $scope.attendanceOut = hourString+":"+minuteString;
            }
        },
        inputTime: 61200,   //Optional
        format: 24,         //Optional
        step: 5,           //Optional
        setLabel: 'Set'    //Optional
      };
  
    $scope.openTimePicker2 = function(){
      ionicTimePicker.openTimePicker(timePickerComponent2);
    };


   

    $scope.onSelectType = function() {
      // $scope.labelType = $scope.leave.type;
      setLabelType($scope.leave.type,getListType($stateParams.category))
      getCurrentBalanceType(module,$scope.leaveCategory,$scope.leave.type);
    }

    function setLabelSubstitute(employmentId,arrEmployee) {
        if(arrEmployee.length != 0) {
            for (var i = 0; i < arrEmployee.length; i++) {
              if(arrEmployee[i].employment == employmentId) 
                  $scope.labelSubstitute = arrEmployee[i].fullName;
            };
        }
    }

    function setLabelType(type,arrType) {
        if(arrType.length != 0) {
            for (var i = 0; i < arrType.length; i++) {
              if(arrType[i].type == type) 
                  $scope.labelType = arrType[i].typeLabel;
            };
        }
    }



    $scope.onSelectSubstitute = function(){
        setLabelSubstitute($scope.leave.substituteToEmployment,$rootScope.selectEmployeeSubstitute);
    }
    
    console.log(Main.getSession("profile"));

    var datepicker = {
        callback: function (val) {  //Mandatory
          $scope.leave.startDate = val;
        },
        inputDate: new Date(),      //Optional
        mondayFirst: true,          //Optional
        dateFormat:"yyyy-MM-dd",
        closeOnSelect: false,       //Optional
        templateType: 'popup'       //Optional
    };

    var datepicker1 = {
        callback: function (val) {  //Mandatory
          $scope.leave.endDate = val;
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

    var successRequest = function (res){
      $timeout(function () {
          $rootScope.data.requestLeaveVerification = res;
          $ionicLoading.hide();
          $state.go("app.leaveconfirmation");
        }, 1000);
    }

    var successGetBalance = function(res){
        $ionicLoading.hide();
        // $scope.balance = res;
        var balanceEnd =0;
        var balanceUsed=0;
        for(var i=0;i<res.length;i++) {
            balanceEnd += res[i].balanceEnd;
            balanceUsed += res[i].balanceUsed;
        }
        $scope.balance.balanceEnd = balanceEnd;
        $scope.balance.balanceUsed = balanceUsed;
    }
    var errorRequestBalance = function(res){
         $ionicLoading.hide();
    }
    function getCurrentBalanceType(module,category,type){
        $scope.balance = {balanceEnd:"-",balanceUsed:"-"};
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmbalance/currenttype?module='+module+'&category='+category+'&type='+type;
        Main.requestApi(accessToken,urlApi,successGetBalance, errorRequestBalance);
    }

    $scope.onChangeType = function(){
        $scope.balance = {balanceEnd:"-",balanceUsed:"-"};
        if($scope.leave.type != ""){
            getCurrentBalanceType(module,$scope.leaveCategory,$scope.leave.type);
        }
        
    }

    
    function diffTwoDateTimeMiliSecond(stringStartDate, stringEndDate){
        var startDate = (new Date(stringStartDate+"Z")).getTime();
        var endDate = (new Date(stringEndDate+"Z")).getTime();
        console.log(Math.floor(endDate - startDate));
        return Math.floor(endDate - startDate);
    }

    function diffTwoDateMinutes(stringStartDate, stringEndDate){
        var startDate = (new Date(stringStartDate+"Z")).getTime();
         console.log(startDate);
        var endDate = (new Date(stringEndDate+"Z")).getTime();
        console.log(endDate);
        var microSecondsDiff = Math.abs(endDate - startDate );
        console.log(endDate - startDate);
        console.log(microSecondsDiff);
        // Number of milliseconds per day =
        //   24 hrs/day * 60 minutes/hour * 60 seconds/minute * 1000 msecs/second
        var minuteDiff = Math.floor(microSecondsDiff/(1000 * 60));

        console.log(minuteDiff);
        return minuteDiff;

    }

    $scope.submitForm = function(){
      if($scope.leaveCategory=='overtime') {
          var startTimeOvertime = $scope.leave.startDateInTimeTime;
          var endTimeOvertime = $scope.leave.endDateInTimeTime;
          var startDateInTime = $filter('date')(new Date($scope.leave.startDateInTimeDate),'yyyy-MM-dd') + " " + startTimeOvertime+":00";
          var endDateInTime = $filter('date')(new Date($scope.leave.endDateInTimeDate),'yyyy-MM-dd') + " " + endTimeOvertime+":00";
          $scope.leave.startDateInTime = startDateInTime;
          $scope.leave.endDateInTime = endDateInTime;
      }
      
      //console.log($scope.leave.startDateInTimeDate + " " + $scope.leave.startDateInTimeTime+":00");
      console.log(startDateInTime);
      console.log(endDateInTime);
      //return false;
      if(verificationForm($scope.leave)){
          $ionicLoading.show({
               template: '<ion-spinner></ion-spinner>'
          });
         var objCategory = getCategory($stateParams.category);
         console.log("objCategory",objCategory);
         $scope.leave.categoryType=$stateParams.category;
         $scope.leave.startDate=$filter('date')(new Date($scope.leave.startDate),'yyyy-MM-dd');
         $scope.leave.endDate=$filter('date')(new Date($scope.leave.endDate),'yyyy-MM-dd');
          var dataPost = {};
          if($scope.leaveCategory == "attendance edit") {
              dataPost.startDate = $scope.leave.startDate;
              dataPost.endDate = dataPost.startDate;
              dataPost.remark = $scope.leave.remark;
              dataPost.typeDesc = $scope.labelType;
              //dataPost.type = "Edit Attendance";
              dataPost.attendanceInTime = dataPost.startDate + " " + $scope.attendanceIn + ":00";
              dataPost.attendanceOutTime = dataPost.startDate + " " + $scope.attendanceOut + ":00";

          }else if($scope.leaveCategory == 'overtime') {
              dataPost.startDate = $filter('date')(new Date($scope.leave.startDateInTimeDate),'yyyy-MM-dd');//$scope.leave.startDate;
              dataPost.typeDesc = $scope.labelType;
              dataPost.endDate = $filter('date')(new Date($scope.leave.endDateInTimeDate),'yyyy-MM-dd');//dataPost.startDate;
              dataPost.remark = $scope.leave.remark;
              //console.log("startDateInTime",startDateInTime+"07:00");
              //var dateStartDateInTime = calcTime(new Date(startDateInTime),'Jakarta','+7');//new Date(startDateInTime);
              //console.log("dateStartDateInTime",moment.utc(startDateInTime).local().format('dddd, MMMM Do YYYY, h:mm:ss a'));
              // console.log(moment(startDateInTime+"+07:00", "YYY-MM-DDTHH:mm:ssZ").toDate());
              //console.log("dateStartDateInTime",dateStartDateInTime);
              //return false;
              //dataPost.type = "Overtime";
              // dataPost.overtimeIn = (parseInt($scope.leave.overtimeinhour) * 60) + parseInt($scope.leave.overtimeinmin) ;
              // dataPost.overtimeOut = (parseInt($scope.leave.overtimeouthour) * 60) + parseInt($scope.leave.overtimeoutmin) ;
              dataPost.startDateInTime = $scope.leave.startDateInTime;
              dataPost.endDateInTime = $scope.leave.endDateInTime;
              dataPost.overtimeIn = diffTwoDateMinutes($scope.leave.startDateInTime,$scope.leave.endDateInTime);
          }else {
              dataPost.typeDesc = $scope.labelType;
              dataPost.startDate = $scope.leave.startDate;
              dataPost.endDate = $scope.leave.endDate;
              dataPost.remark = $scope.leave.remark;
              //dataPost.substituteToEmployment = $scope.leave.substituteToEmployment;
              
          }

          dataPost.categoryType = $scope.leave.categoryType;
          if(objCategory.directType) {
              var typeSelected = objCategory.listRequestType[0];
              dataPost.type = typeSelected.type;
              dataPost.typeDesc = typeSelected.typeDesc;
          }else {
              dataPost.type = $scope.leave.type;
          }


          dataPost.workflow="SUBMITAT";
          dataPost.module="Time Management";
          dataPost.employee = employee;
          
          var accessToken = Main.getSession("token").access_token;
          var urlApi = Main.getUrlApi() + '/api/user/tmrequestheader/verificationleave';
          
          var data = JSON.stringify(dataPost);
          
          Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
      } else {
         $scope.warningAlert(messageValidation);
      }
    }

    function verificationForm(leave){
       console.log("categoryType",$scope.leaveCategory);
        if(leave.type == undefined || leave.type == ""){
          messageValidation = "Type can't be empty";
          return false;
        }

        if(leave.remark == undefined || leave.remark  == ""){
            messageValidation = "Remark / Reason   can't be empty";
            if($scope.leaveCategory =='leave' || $scope.leaveCategory=='permission')
                messageValidation = "Substitute employee can't be empty";
            return false;
        }

        if($scope.leaveCategory=='overtime') {
              if(diffTwoDateTimeMiliSecond(leave.startDateInTime,leave.endDateInTime) <= 0){
                  messageValidation = "End time must be bigger than Start Time";
                  return false;   
              }
                
        }
  
        return true;
    }

    

    function getCategory(categoryType) {
        var sessTmRequestType = Main.getSession("tmCategoryType");
        console.log("tmCategoryType",Main.getSession("tmCategoryType"));
         for (var i = 0; i < sessTmRequestType.length; i++) {
            if(sessTmRequestType[i].categoryType == categoryType){
                return sessTmRequestType[i];
                break;
            }
              
         };
         return undefined;
    }
    function getListType(categoryType){
        
          var objCategory = getCategory(categoryType);
          if(objCategory != undefined)
             return objCategory.listRequestType;
           else
             return [];
    }
    function successGetSubstitute(res){
        $ionicLoading.hide();
        $rootScope.selectEmployeeSubstitute = res.data;
        $scope.selectEmployeeSubstitute = res.data;
    }

    function getEmployeeSubstitute(){
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/empassignment/byparam?param=organization&page=0&size=100';
        Main.requestApi(accessToken,urlApi,successGetSubstitute, $scope.errorRequest);
    
    }

    function initData(){
        $scope.leave = {remark:"",startDate:new Date(),endDate:new Date(),remark:"",attendanceIn:new Date(),attendanceOut:new Date()};
        $scope.balance = {balanceEnd:"-",balanceUsed:"-"};
        $scope.selectType = getListType($stateParams.category);
        $scope.labelSubstitute = "Select Substitute ..";
        $scope.labelType = "Select Type ..";
        $scope.leave.substituteToEmployment = undefined;
        $scope.leave.type = undefined;
        $scope.leave.overtimeinhour = '0';
        $scope.leave.overtimeinmin = '0';
        $scope.leave.overtimeouthour = '0';
        $scope.leave.overtimeoutmin = '0';
        $scope.leave.startDateInTimeDate = new Date();
        $scope.leave.startDateInTimeTime = $filter('date')(new Date(),'HH:mm');;
        $scope.leave.endDateInTimeDate = new Date();
        $scope.leave.endDateInTimeTime = $filter('date')(new Date(),'HH:mm');
    } 
    function initModule() {
        initData();
        
        if($rootScope.selectEmployeeSubstitute == undefined){
            getEmployeeSubstitute();
        }else {
            $scope.selectEmployeeSubstitute = $rootScope.selectEmployeeSubstitute;
        }

        
    }

    $scope.$on('$ionicView.beforeEnter', function (event,data) {
          if(data.direction != undefined && data.direction!='back')
            initModule();
    });
     
  })

.controller('ListLeaveCtrl', function($ionicPopover,$ionicLoading,$rootScope, $scope,$state , AuthenticationService, Main) {
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.leaves = [];
   
    $scope.goToDetailLeave = function(id){
          $state.go("app.detailleave",{id:id});
    }

    $scope.refresh = function(){
        initMethod();  
    }
   
    var successRequest = function (res){
      $scope.leaves = res;
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
      var urlApi = Main.getUrlApi() + '/api/user/tmrequest?module=Time Management';
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }

    $scope.$on('$ionicView.beforeEnter', function (event,data) {
          initMethod();
      
    });
})

.controller('DetailLeaveCtrl', function(ionicSuperPopup,$ionicPopup,$stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
   
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.isHr = Main.getSession("profile").isHr;
    var id = $stateParams.id;
    $scope.leave = {};
    $scope.header = {};
    
    function successRequest(res) {
        $scope.header = res;
        console.log("Header",$scope.header);
        $ionicLoading.hide();
        if(res != undefined && res.details.length > 0) {
            $scope.leave = res.details[0];
        }
        
    }

    var successApprove = function(res){
        $ionicLoading.hide();
        $scope.successAlert(res.message);
        $scope.goBack("app.leaves");
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

   $scope.confirmCancel = function (approvalId){
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
                sendApproval('cancelled',approvalId,"");
             }
            
           
        });
    }
    function getDetailHeader (id){
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
         });

        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmrequest/'+id;
        Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }
    
    function initModule(){
      id = $stateParams.id;
      $scope.leave = {};
      getDetailHeader(id);
    }
    $scope.$on('$ionicView.beforeEnter', function (event,data) {
          initModule();
      
    });

 })