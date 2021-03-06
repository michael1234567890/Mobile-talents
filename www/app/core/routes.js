angular.module('talent.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('tabs', {
        url: '/tabs',
        templateUrl: 'app/core/sidemenu.html',
        abstract: true
      })



      .state('authentication', {
        url: '/authentication',
        templateUrl: 'app/intro/authentication.html',
        controller: 'appCtrl',
      })

      .state('intro', {
        url: '/intro',
        templateUrl: 'app/intro/intro.html',
      })

      // talent 
      .state('app', {
        url: '/app',
        templateUrl: 'app/core/sidemenu.html',
        abstract: true
      })

      .state('login', {
        url: '/login',
        templateUrl: 'app/talents/intro/login-form.html',
        controller:'LoginCtrl'
      })


       .state('signup', {
        url: '/signup',
        controller:"RegisterCtrl",
        templateUrl: 'app/talents/intro/signup-form.html'
      })

      

       .state('app.forgot', {
        url: '/forgot',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/intro/forgot.html',
            controller: 'appCtrl'
          }
        }
      })

      .state('app.myhr', {
        url: '/myhr',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/myhr-home.html',
            controller: 'MyHRCtrl'
          }
        }
      })

      .state('app.biodata', {
        url: '/biodata',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/information/information.html',
            controller: 'PersonalCtrl'
          }
        }
      })

      .state('app.changemaritalstatus', {
        url: '/changemaritalstatus/:currentStatus/:dataApprovalId',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/information/changemaritalstatus.html',
            controller: 'ChangeMaritalStatusCtrl'
          }
        }
      })


      .state('app.changenpwp', {
        url: '/changenpwp/:currentStatus/:dataApprovalId',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/information/changenpwp.html',
            controller: 'ChangeNpwpCtrl'
          }
        }
      })


      .state('app.changenircno', {
        url: '/changenircno/:currentStatus/:dataApprovalId',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/information/changenircno.html',
            controller: 'ChangeNircNoCtrl'
          }
        }
      })


      .state('app.changektpname', {
        url: '/changektpname/:currentStatus/:dataApprovalId',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/information/changektpname.html',
            controller: 'ChangeKtpNameCtrl'
          }
        }
      })


      

      .state('app.changefamilycardno', {
        url: '/changefamilycardno/:currentStatus/:dataApprovalId',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/information/changefamilycard.html',
            controller: 'ChangeFamilyCardNoCtrl'
          }
        }
      })

      .state('app.edit-biodata', {
        url: '/edit-biodata',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/information/edit-biodata.html',
            controller: 'appCtrl'
          }
        }
      })



      .state('app.family', {
        url: '/family',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/family/family.html',
            controller: 'FamilyCtrl'
          }
        }
      })

      .state('app.addfamily', {
        url: '/addfamily/:id',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/family/add-family.html',
            controller: 'AddFamilyCtrl'
          }
        }
      })

      .state('app.editfamily', {
        url: '/editfamily/:idx',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/family/add-family.html',
            controller: 'EditFamilyCtrl'
          }
        }
      })

      .state('app.detailfamily', {
        url: '/detailfamily/:idx/:edit',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/family/detail-family.html',
            controller: 'DetailFamilyCtrl'
          }
        }
      })


      
       .state('app.certification', {
        url: '/certification',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/certification/certification.html',
            controller: 'CertificationCtrl'
          }
        }
      })

       .state('app.addcertification', {
        url: '/addcertification',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/certification/add-certification.html',
            controller: 'AddCertificationCtrl'
          }
        }
      })


       .state('app.detailcertification', {
        url: '/detailcertification/:idx',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/certification/detail-certification.html',
            controller: 'DetailCertificationCtrl'
          }
        }
      })

      .state('app.viewimagecertification', {
        url: '/viewimagecertification/:id',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/certification/view-image.html',
            controller: 'ViewImageCertificationCtrl'
          }
        }
      })


       .state('app.selfservice', {
        url: '/selfservice',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/selfservice-home.html',
            controller: 'SelfServiceCtrl'
          }
        }
      })

       .state('app.selfservicesuccess', {
        url: '/selfservicesuccess',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/selfservice-success.html',
            controller: 'SelfServiceCtrl'
          }
        }
      })

       .state('app.homeleave', {
        url: '/homeleave',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/leave/home-leave.html',
            controller: 'HomeLeaveCtrl'
          }
        }
      })

       .state('app.chooseleavecategory', {
        url: '/chooseleavecategory',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/leave/choose-category.html',
            controller: 'ChooseLeaveCategoryCtrl'
          }
        }
      })


      .state('app.addleave', {
        url: '/addleave/:category',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/leave/add-leave.html',
            controller: 'AddLeaveCtrl'
          }
        }
      })

      .state('app.leaves', {
        url: '/leaves',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/leave/leave.html',
            controller: 'ListLeaveCtrl'
          }
        }
      })

      .state('app.detailleave', {
        url: '/detailleave/:id',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/leave/detail-leave.html',
            controller: 'DetailLeaveCtrl'
          }
        }
      })

      .state('app.listempdaily', {
        url: '/listempdaily',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/leave/list-empdaily.html',
            controller: 'ListEmpDailyCtrl'
          }
        }
      })

      .state('app.detailempdaily', {
        url: '/detailempdaily/:idx',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/leave/detail-empdaily.html',
            controller: 'DetailEmpDailyCtrl'
          }
        }
      })


       .state('app.submitattendance', {
        url: '/submitattendance',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/attendance/attendance.html',
            controller: 'SubmitAttendanceCtrl'
          }
        }
      })

      

       .state('app.choicepayslip', {
        url: '/choicepayslip',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/payslip/choice-payslip.html',
            controller: 'ChoicePayslipCtrl'
          }
        }
      })

       .state('app.detailpayslip', {
        url: '/detailpayslip/:year/:month/:type',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/payslip/detail-payslip.html',
            controller: 'DetailPayslipCtrl'
          }
        }
      })


      .state('app.submitclaim', {
        url: '/submitclaim',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/claim/submitclaim.html',
            controller: 'SubmitClaimCtrl'
          }
        }
      })

      .state('app.claimchoice', {
        url: '/claimchoice',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/claim/claimchoice.html',
            controller: 'ClaimChoice'
          }
        }
      })

      .state('app.benefitclaimlist', {
        url: '/benefitclaimlist',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/claim/benefitclaimlist.html',
            controller: 'BenefitClaimListCtrl'
          }
        }
      })

      .state('app.benefitclaimneedreport', {
        url: '/benefitclaimneedreport',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/claim/benefitclaimneedreport.html',
            controller: 'BenefitClaimNeedReportCtrl'
          }
        }
      })

      

      .state('app.benefitdetail', {
        url: '/benefitdetail/:id',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/claim/benefitdetail.html',
            controller: 'BenefitDetailCtrl'
          }
        }
      })

      .state('app.spdadvanceadd', {
        url: '/spdadvanceadd/:categoryType/:extId/:workflow',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/claim/spdadvanceadd.html',
            controller: 'SpdAdvanceAdd'
          }
        }
      })

     
      .state('app.benefitlisttype', {
        url: '/benefitlisttype/:categoryType/:extId/:workflow/:singleinput',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/claim/benefitlisttype.html',
            controller: 'BenefitListtypeCtrl'
          }
        }
      })

      .state('app.benefitconfirmation', {
        url: '/benefitconfirmation',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/claim/benefitconfirmation.html',
            controller: 'BenefitConfirmationCtrl'
          }
        }
      })
      .state('app.leaveconfirmation', {
        url: '/leaveconfirmation',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/leave/leaveconfirmation.html',
            controller: 'LeaveConfirmationCtrl'
          }
        }
      })


      .state('app.changepassword', {
        url: '/changepassword',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/profile/change-password.html',
            controller: 'ChangePasswordCtrl'
          }
        }
      })

      .state('app.address', {
        url: '/address',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/address/address.html',
            controller: 'AddressCtrl'
          }
        }
      })

       .state('app.addaddress', {
        url: '/addaddress/:id',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/address/add-address.html',
            controller: 'AddAddressCtrl'
          }
        }
      })

       .state('app.editaddress', {
        url: '/editaddress/:idx',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/address/add-address.html',
            controller: 'EditAddressCtrl'
          }
        }
      })

       .state('app.detailaddress', {
        url: '/detailaddress/:idx/:edit',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/address/detail-address.html',
            controller: 'DetailAddressCtrl'
          }
        }
      })



      .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/home/dashboard.html',
            controller: 'HomeCtrl'
          }
        }
      })

      .state('app.myteam', {
        url: '/myteam',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myteam/myteam-home.html',
            controller: 'MyTeamCtrl'
          }
        }
      })

      .state('app.myteamdetail', {
        url: '/myteamdetail/:idx',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myteam/myteam-detail-home.html',
            controller: 'DetailTeamCtrl'
          }
        }
      })

      .state('app.requestapproval', {
        url: '/requestapproval',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myteam/request-approval.html',
            controller: 'RequestApprovalCtrl'
          }
        }
      })

      .state('app.formhistoryapproval', {
        url: '/formhistoryapproval',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myteam/approval/form-history-approval.html',
            controller: 'FormHistoryApprovalCtrl'
          }
        }
      })

      .state('app.historyapproval', {
        url: '/historyapproval/:startDate/:endDate',
        params: { data: null },
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myteam/approval/history-approval.html',
            controller: 'HistoryApprovalCtrl'
          }
        }
      })


      .state('app.myrequest', {
        url: '/myrequest',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myteam/request/myrequest.html',
            controller: 'MyRequestCtrl'
          }
        }
      })

      .state('app.requestdetail', {
        url: '/requestdetail/:id/:needApproval',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myteam/request/request-detail.html',
            controller: 'RequestDetailCtrl'
          }
        }
      })


      .state('app.myrequestdetail', {
        url: '/myrequestdetail/:id',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myteam/request/myrequest-detail.html',
            controller: 'RequestDetailCtrl'
          }
        }
      })

      .state('app.formrequestsearching', {
        url: '/formrequestsearching',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myteam/request/formrequestsearching.html',
            controller: 'FormRequestSearchingCtrl'
          }
        }
      })


      .state('app.contacts', {
        url: '/contacts',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/contacts/contacts.html',
            controller: 'appCtrl'
          }
        }
      })

       .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/profile/profile.html',
            controller: 'ProfileCtrl'
          }
        }
      })


       .state('app.about', {
        url: '/about',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/others/about.html',
            controller: 'AboutCtrl'
          }
        }
      })


       .state('app.support', {
        url: '/support',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/others/support.html',
            controller: 'SupportCtrl'
          }
        }
      })

      .state('app.announcement', {
        url: '/announcement',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/others/announcement.html',
            controller: 'AnnouncementCtrl'
          }
        }
      })

      .state('app.mycompany', {
        url: '/mycompany',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/others/mycompany.html',
            controller: 'MyCompanyCtrl'
          }
        }
      })



      .state('app.edit-profile', {
        url: '/edit-profile',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/profile/edit-profile.html',
            controller: 'EditProfileCtrl'
          }
        }
      })

      

      .state('app.addtimesheet', {
        url: '/addtimesheet',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/timesheet/add-timesheet.html',
            controller: 'AddTimesheetCtrl'
          }
        }
      })

      .state('app.detailtimesheet', {
        url: '/detailtimesheet',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/timesheet/detail-timesheet.html',
            controller: 'DetailTimesheetCtrl'
          }
        }
      })

      .state('app.calendartimesheet', {
        url: '/calendartimesheet',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/timesheet/calendar-timesheet.html',
            controller: 'CalendarTimesheetCtrl'
          }
        }
      })

      .state('app.listtimesheet', {
        url: '/listtimesheet',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/timesheet/list-timesheet.html',
            controller: 'ListTimesheetCtrl'
          }
        }
      })


      .state('app.choicesptai', {
        url: '/choicesptai',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/selfservice/sptai/choice-sptai.html',
            controller: 'ChoiceSptaiCtrl'
          }
        }
      })

    $urlRouterProvider.otherwise('/app/myhr')



  })

  .config(function ($ionicConfigProvider, calendarConfig, ChartJsProvider) {

    // $ionicConfigProvider.tabs.style('standard').position('top');
    // $ionicConfigProvider.navBar.alignTitle('center');

    ChartJsProvider.setOptions({ colours: ['#26a69a', '#29b6f6', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });

    calendarConfig.titleFormats.week = 'MMMM';
    calendarConfig.dateFormatter = 'moment';
    calendarConfig.allDateFormats.moment.date.hour = 'HH:mm';
    calendarConfig.allDateFormats.moment.title.day = 'ddd D MMM';
    calendarConfig.i18nStrings.weekNumber = 'Week {week}';
    calendarConfig.dateFormats.weekDay = 'ddd';
    calendarConfig.dateFormats.day = 'D';
    calendarConfig.displayAllMonthEvents = true;
    calendarConfig.displayEventEndTimes = true;
  })

//Uncomment to add styling to sliding box page buttons
  // .config(function ($provide) {
  //           $provide.decorator('ionPagerDirective', function ($delegate) {
  //               var directive = $delegate[0];
  //               var template = directive.template;
  //               directive.template = '<div class="slider-pager"><span class="slider-pager-page" ng-repeat="slide in numSlides() track by $index" ng-class="{active: $index == currentSlide}" ng-click="pagerClick($index)"><i class="icon ion-record" ng-show="$index !== currentSlide"></i><img class="slider-pager-img" src="img/dot_active.png" ng-show="$index == currentSlide"/></span></div>';


  //               return $delegate;
  //           });
  //       })