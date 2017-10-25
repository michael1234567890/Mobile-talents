angular.module('leave.controllers', [])
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
        $state.go("app.addleave",{'category':category});
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
        Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }

    function initModule() {

        if(Main.getSession("tmCategoryType") == undefined)
            getListCategory();
        else
          $scope.categories = Main.getSession("tmCategoryType");
        
    }

    $scope.$on('$ionicView.beforeEnter', function (event,data) {
          initModule();
      
    });

})


.controller('LeaveConfirmationCtrl', function(appService,$ionicActionSheet,$cordovaCamera,$stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
      var leaveVerification = $rootScope.data.requestLeaveVerification;
      $scope.defaultImage = "img/placeholder.png";
      $scope.images = [];  
      $scope.requestHeader = {};
      $scope.requestHeader.attachments = []; 

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
          if($scope.requestHeader.attachments.length > -1) {
              $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
              });
              var accessToken = Main.getSession("token").access_token;
              var urlApi = Main.getUrlApi() + '/api/user/tmrequestheader/leave';
              var attachment = [];
              
              /*if($scope.requestHeader.attachments.length > 0) {
                  for (var i = $scope.requestHeader.attachments.length - 1; i >= 0; i--) {
                      var objAttchament = {"image":$scope.requestHeader.attachments[i].image};
                      attachment.push(objAttchament);
                  };
              }*/
              leaveVerification = $rootScope.data.requestLeaveVerification;
              leaveVerification.startDate = $filter('date')(new Date(leaveVerification.startDate),'yyyy-MM-dd');
              leaveVerification.endDate = $filter('date')(new Date(leaveVerification.endDate),'yyyy-MM-dd');
              if(leaveVerification.attendanceInTime != undefined && leaveVerification.attendanceOutTime != undefined ){
                  leaveVerification.attendanceInTime = $filter('date')(new Date(leaveVerification.attendanceInTime),'yyyy-MM-dd HH:mm:dd');
                  leaveVerification.attendanceOutTime = $filter('date')(new Date(leaveVerification.attendanceOutTime),'yyyy-MM-dd HH:mm:dd');
              }
              
              // leaveVerification.attachments = attachment; 

              var data = JSON.stringify(leaveVerification);
              Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);
          }else {
              alert("You must add at least 1 attachment.");
          }
      }

      function initData(){
          $scope.total = 0;
          $scope.totalBalance =0;
          $scope.type = "-";
          $scope.categoryType = "-";
          $scope.images = [];  
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
                console.log("leaveVerification new",leaveVerification);
          
          }
      }
      
      initMethod();

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
        inputTime: 50400,   //Optional
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
        inputTime: 50400,   //Optional
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
        $scope.balance = res;
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

    $scope.submitForm = function(){
         
       // $ionicLoading.show({
       //      template: '<ion-spinner></ion-spinner>'
       //  });
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
            dataPost.startDate = $scope.leave.startDate;
            dataPost.typeDesc = $scope.labelType;
            dataPost.endDate = dataPost.startDate;
            dataPost.remark = $scope.leave.remark;
            //dataPost.type = "Overtime";
            dataPost.overtimeIn = (parseInt($scope.leave.overtimeinhour) * 60) + parseInt($scope.leave.overtimeinmin) ;
            dataPost.overtimeOut = (parseInt($scope.leave.overtimeouthour) * 60) + parseInt($scope.leave.overtimeoutmin) ;
        }else {
            dataPost.typeDesc = $scope.labelType;
            dataPost.startDate = $scope.leave.startDate;
            dataPost.endDate = $scope.leave.endDate;
            dataPost.remark = $scope.leave.remark;
            dataPost.substituteToEmployment = $scope.leave.substituteToEmployment;
            
        }
        console.log("objCategory",objCategory);
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
        // console.log(data);
        // return false;
        Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);

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

    initMethod();

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
})

.controller('DetailLeaveCtrl', function($ionicPopup,$stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
   
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
   
    var id = $stateParams.id;
    $scope.leave = {};
    
    function successRequest(res) {
        $ionicLoading.hide();
        if(res != undefined && res.details.length > 0) {
            $scope.leave = res.details[0];
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
    
    function initModule(){
      id = $stateParams.id;
      $scope.leave = {};
      getDetailHeader(id);
    }
    $scope.$on('$ionicView.beforeEnter', function (event,data) {
          initModule();
      
    });

    initModule();
 })