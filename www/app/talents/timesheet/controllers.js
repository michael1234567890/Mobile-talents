angular.module('timesheet.controllers', [])

.controller('DetailTimesheetCtrl',function(ionicDatePicker,ionicTimePicker,$stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {

 })

.controller('ListTimesheetCtrl',function(ionicDatePicker,ionicTimePicker,$stateParams,$ionicLoading, $compile,$filter,$timeout,$ionicHistory ,$ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {

 })


.controller('CalendarTimesheetCtrl',function($rootScope, $scope,$state , AuthenticationService, Main,$cordovaCamera,$ionicPopover,$ionicActionSheet) {
            
            initCalendar();

            function initCalendar() {
                $scope.calendarView = 'week';
                $scope.viewDate = new Date();
                $scope.events = $scope.notifications;

                $scope.eventClicked = function (event) {
                    //alert.show('Clicked', event);
                };

                $scope.eventEdited = function (event) {
                    //alert.show('Edited', event);
                };

                $scope.eventDeleted = function (event) {
                    //alert.show('Deleted', event);
                };

                $scope.eventTimesChanged = function (event) {
                    //alert.show('Dropped or resized', event);
                };

                $scope.toggle = function ($event, field, event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    event[field] = !event[field];
                };

                $scope.viewChangeClicked = function (nextView, date) {
                    $scope.viewDate = date;
                    $scope.seletedDateEvents = [];
                    if (nextView === 'day') {
                        angular.forEach($scope.events, function (value, key) {
                            var range = moment().range(value.startsAt, value.endsAt);
                            if (range.contains(date)) {
                                $scope.seletedDateEvents.push(value);
                            }
                        });
                        return false;
                    }
                };

                $scope.getDayEvents = function () {
                    $scope.selectedDate = new Date();
                    angular.forEach($scope.events, function (value, key) {
                        var range = moment().range(value.startsAt, value.endsAt);
                        if (range.contains(new Date())) {
                            $scope.seletedDateEvents.push(value);
                        }
                    });
                }

            }
})

.controller('AddTimesheetCtrl', function($ionicHistory , ionicDatePicker, ionicTimePicker, $ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
    $scope.leaveType = {};
    $scope.leave = {remark:""};
    $scope.leave.startDate= new Date();
    $scope.shift = ["Morning", "Afternoon", "Evening", "Night"];


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


    $scope.openDatePicker = function(){
        ionicDatePicker.openDatePicker(datepicker);
    };



    $scope.time = {remark:""};
    $scope.time.start= new Date();


      var ipObj1 = {
        callback: function (val) {      //Mandatory
            $scope.time.start = new Date(val * 1000) ;
            var hours = parseInt(val / 3600);
            var minutes = (val / 60) % 60;
          if (typeof (val) === 'undefined') {
            console.log('Time not selected');
          } else {
            console.log('Selected epoch is : ', val, 'and the time is ', $scope.time.start.getUTCHours(), ':', 
                                                                         $scope.time.start.getUTCMinutes(), 'in UTC');
          }
        },
        inputTime: 50400,   //Optional
        format: 24,         //Optional
        step: 5,           //Optional
        setLabel: 'Set'    //Optional
      };
  
    $scope.openTimePicker = function(){
        ionicTimePicker.openTimePicker(ipObj1);
    };
})

