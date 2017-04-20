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
        url: '/addfamily',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/family/add-family.html',
            controller: 'AddFamilyCtrl'
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


      .state('app.changepassword', {
        url: '/changepassword',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/profile/change-password.html',
            controller: 'appCtrl'
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
        url: '/addaddress',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myhr/address/add-address.html',
            controller: 'AddAddressCtrl'
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
            controller: 'appCtrl'
          }
        }
      })

      .state('app.myteamdetail', {
        url: '/myteamdetail',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/myteam/myteam-detail-home.html',
            controller: 'appCtrl'
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
            controller: 'appCtrl'
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


       .state('app.submitClaim', {
        url: '/submitClaim',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/claim/submitClaim.html',
            controller: 'submitClaimCtrl'
          }
        }
      })


       .state('app.claimList', {
        url: '/claimList',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/claim/claimList.html',
            controller: 'claimListCtrl'
          }
        }
      })


       .state('app.attendance', {
        url: '/attendance',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/attendance/attendance.html',
            controller: 'attendCtrl'
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

       .state('app.leaveRequest', {
        url: '/leaveRequest',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/leave/leaveRequest.html',
            controller: 'leaveRequestCtrl'
          }
        }
      })

       .state('app.requestLeave', {
        url: '/requestLeave',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/leave/requestLeave.html',
            controller: 'requestLeaveCtrl'
          }
        }
      })

       .state('app.approval', {
        url: '/approval',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/leave/approval.html',
            controller: 'approvalCtrl'
          }
        }
      })

      .state('app.edit-profile', {
        url: '/edit-profile',
        views: {
          'menuContent': {
            templateUrl: 'app/talents/profile/edit-profile.html',
            controller: 'appCtrl'
          }
        }
      })

    $urlRouterProvider.otherwise('/app/home')



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