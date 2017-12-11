(function () {

    'use strict'

    angular.module('talent.controllers', [
        'mwl.calendar',
        'angularMoment',
        'ion-affix',
        'ngCordova',
        'monospaced.elastic',
        'ngLodash',
        'ion-datetime-picker',
        'ion-google-place',
        'chart.js',
        'ionic-datepicker',
        'ngImageCompress'

    ])

        .controller('appCtrl', function (Idle,ionicSuperPopup,$rootScope, $state, $scope, $stateParams, appService, $ionicHistory, $ionicPopover, $ionicModal,
            $ionicScrollDelegate, $ionicLoading, $ionicActionSheet, $cordovaCamera, $cordovaSocialSharing, $cordovaGeolocation, $timeout,AuthenticationService, Main) {
            
            $scope.$on('IdleStart', function() {

                console.log("Idle Start");
            });

            $scope.$on('IdleEnd', function() {
                console.log("Idle End");
            });

            $scope.$on('IdleTimeout', function() {
                $scope.signOut();
            });

            initData();
            initIntro();
            initProfile();
           
            
            initAnimate();
            $scope.globalprofile = {};
            $rootScope.$on('$stateChangeStart', function(event,next, nextParam,fromState){
                initProfile();
                
                // Idle.watch();
                console.log("Global change state");
            });

            function initAnimate() {
                function testAnim(x) {
                    $('#animationSandbox').removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                        $(this).removeClass();
                    });
                };

                $(document).ready(function () {
                    $('.js--triggerAnimation').click(function (e) {
                        e.preventDefault();
                        var anim = $('.js--animations').val();
                        testAnim(anim);
                    });

                    $('.js--animations').change(function () {
                        var anim = $(this).val();
                        testAnim(anim);
                    });
                });
            }
            // models
            function initData() {

                $scope.globalprofile = {
                    fullname : 'Hendra Ramdhan'
                }

                $rootScope.data = {};

                $rootScope.user = {
                    photo: 'img/1491892621_profle.png'
                }
                $scope.contacts = appService.getContacts();
                $scope.searchPopover = $ionicPopover.fromTemplate(searchTemplate, {
                    scope: $scope
                });
                $scope.rating = 4;
                $scope.getSearch = function (search) {
                    $scope.searchFilter = search;
                }
               
                /*

                $cordovaGeolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: true }).then(
                    function (position) {
                        $rootScope.currentLocation = [position.coords.latitude, position.coords.longitude];
                });
he
                */

                $scope.mapCreated = function (map) {
                    $scope.map = map;
                };

                $scope.goTo = function (page) {
                    $scope.closeAll();//Close all Modals
                    $state.go(page);
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });
                }
                $scope.goToPage = function (page) {
                    $state.go(page);
                }


                $scope.goBack = function (ui_sref) {
                    var currentView = $ionicHistory.currentView();
                    var backView = $ionicHistory.backView();

                    if (backView) {
                        //there is a back view, go to it
                        if (currentView.stateName == backView.stateName) {
                            //if not works try to go doubleBack
                            var doubleBackView = $ionicHistory.getViewById(backView.backViewId);
                            $state.go(doubleBackView.stateName, doubleBackView.stateParams);
                        } else {
                            backView.go();
                        }
                    } else {
                        $state.go(ui_sref);
                    }
                }

                $scope.errorAlert = function(message){
                    ionicSuperPopup.show("Error!", message, "error");
                }

                $scope.successAlert = function(message){
                    ionicSuperPopup.show("Success!", message, "success");
                }

                $scope.warningAlert = function(message){
                    ionicSuperPopup.show("Warning!", message, "warning");
                }


                $scope.errorRequest = function (err, status){
                  console.log("status",status);
                  if(status == 401) {
                        $scope.goTo('login');
                  }else if(status == 400){
                        $scope.errorAlert(err.message);
                  }else if(status == 500) {
                        $scope.errorAlert("Could not process this operation. Please contact Admin.");
                  }else  {
                        $scope.errorAlert("Please Check your connection.");
                  }
                  $ionicLoading.hide();
                }

                $scope.checkLoginSession = function(){
                    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
                        $state.go("login");
                    }
                }

                $scope.signOut = function () {
                    Idle.unwatch();
                    $ionicLoading.show({
                        template: 'Signing out...'
                    });
                    
                    Main.cleanData();
                    
                    

                    $timeout(function () {
                        $ionicHistory.clearCache();
                        $ionicLoading.hide();
                        $scope.goTo('login');
                    }, 2000);

                    var success = function(status) {
                       
                    };
                    var error = function(status) {
                    };
                    window.CacheClear(success, error);

                }

                if ($state.is('tabs.cards')) {
                    $scope.post = appService.getRandomObject($scope.news.items);
                }

            }
            // intro
            function initIntro() {
                
                $scope.goToUpdate = function(){
                    var url = $scope.profile.companySettings.mobileDownload;
                    window.open(encodeURI(url), '_system', 'location=yes');
                    $scope.modalUpdate.hide();
                    $scope.signOut();
                    return false;
                }

                $scope.showUpdateVersionModal = function(){
                    
                }

                $scope.forgot = {email:""};
                $scope.gotoHome = function () {
                    $scope.closeAll();
                    $ionicLoading.show({
                        template: '<ion-spinner></ion-spinner>'
                    });

                    $timeout(function () {
                        $ionicLoading.hide();
                        $state.go('app.home');
                    }, 2000);
                }

                $ionicModal.fromTemplateUrl('app/intro/update-version.html', {
                    scope: $scope,
                    animation: 'fade-in-scale',
                    backdropClickToClose: false
                }).then(function (modal) {
                    $scope.modalUpdate = modal;
                });
                
                


                // Login modal
                $ionicModal.fromTemplateUrl('app/intro/login.html', {
                    scope: $scope,
                    animation: 'fade-in-scale',
                    backdropClickToClose: false
                }).then(function (modal) {
                    $scope.modalLogin = modal;
                });

                $scope.openLogin = function () {
                    $scope.modalLogin.show();
                };
                $scope.closeLogin = function () {
                    $scope.modalLogin.hide();
                };

                // Sign up modal
                $ionicModal.fromTemplateUrl('app/intro/signup.html', {
                    scope: $scope,
                    animation: 'fade-in-scale',
                    backdropClickToClose: false
                }).then(function (modal) {
                    $scope.modalRegister = modal;
                });
                $scope.openRegister = function () {
                    $scope.modalRegister.show();
                };
                $scope.closeRegister = function () {
                    $scope.modalRegister.hide();
                };

                // Forgot Password modal
                $ionicModal.fromTemplateUrl('app/intro/forgot.html', {
                    scope: $scope,
                    animation: 'fade-in-scale',
                    backdropClickToClose: false
                }).then(function (modal) {
                    $scope.modalForgot = modal;
                });
                $scope.openForgot = function () {
                    $scope.modalForgot.show();
                };
                $scope.closeForgot = function () {
                    $scope.modalForgot.hide();
                };

                $scope.forgotAction = function(){
                    $ionicLoading.show({
                        template: 'Reset Passsword...'
                    });

                    var formData = {
                        email: $scope.forgot.email,
                    }
                    formData = JSON.stringify(formData);

                   Main.forgot(formData, function(res) {
                        $ionicLoading.hide();
                        $scope.modalForgot.hide();
                        $scope.successAlert(res.message);
                    }, function(error, status) {
                          $ionicLoading.hide();
                          if(status == 401) {
                                $scope.goTo('login');
                          }else if(status == 400){
                                $scope.errorAlert(error.message);
                          }else if(status == 500) {
                                $scope.errorAlert("Could not process this operation.");
                          }else  {
                                $scope.errorAlert("Please Check your connection.");
                          }
                          $scope.modalForgot.hide();
                            
                    })
                }

                $scope.uploadUserPhoto = function () {
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
                                            alert(imageData);
                                            $rootScope.user.photo = "data:image/jpeg;base64," + imageData;
                                        }, function (err) {
                                            appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                                        });
                                    }, false);

                                    break;
                                case 1: // Select From Gallery
                                    document.addEventListener("deviceready", function () {
                                        $cordovaCamera.getPicture(appService.getLibraryOptions()).then(function (imageData) {
                                            $rootScope.user.photo = "data:image/jpeg;base64," + imageData;
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

                $scope.closeAll = function () {
                    $scope.closeRegister();
                    $scope.closeForgot();
                    $scope.closeLogin();
                }
            }

            // profile
            function initProfile() {
                $scope.general = {};
                if(Main.getSession('profile')!=null && Main.getSession('profile') !=undefined ) {
                    Idle.watch();
                    $scope.profile = Main.getSession('profile');
                    $scope.profile.fullname = $scope.profile.employeeTransient.name;

                    if($rootScope.countApproval == undefined)
                        $scope.general.countApproval = $scope.profile.needApproval;
                    else 
                        $scope.general.countApproval = $rootScope.countApproval;

                    if($rootScope.countAnnouncement == undefined)
                        $scope.general.countAnnouncement = $scope.profile.countAnnouncement;
                    else 
                        $scope.general.countAnnouncement = $rootScope.countAnnouncement;
                    
                    if($rootScope.user == undefined)
                        $rootScope.user = {};

                    if($scope.profile.image != undefined) {
                        $rootScope.user.photo = $scope.profile.image;
                        $scope.general.userPhoto = $scope.profile.image;
                    }else {
                        $rootScope.user.photo = 'img/1491892621_profle.png';
                        $scope.general.userPhoto = 'img/1491892621_profle.png';
                    }
                          // Login modal
                    

                }
            }
        })



})();

moment.locale('en', {
    calendar: {
        lastDay: '[Yesterday]',
        sameDay: '[Today]',
        nextDay: '[Tomorrow, ] dddd Do MMM',
        lastWeek: '[Last] dddd Do MMM',
        nextWeek: 'dddd Do MMM',
        sameElse: 'L'
    }
})

var searchTemplate =
    '<ion-popover-view class="search">' +
    '<ion-content scroll="false">' +
    '<div class="list item-input-inset">' +
    '<label class="item-input-wrapper">' +
    '<i class="icon ion-ios-search placeholder-icon"></i>' +
    '<input type="search" placeholder="Search" ng-model="schoolSearch" ng-model-options="{ debounce: 550 }" ng-change="getSearch(schoolSearch)"></label>' +
    ' <i class="icon ion-close" ng-show="schoolSearch" ng-click="getSearch(\'\');popover.hide($event);schoolSearch=\'\'"></i>' +
    '</div>' +
    '</ion-content>' +
    '</ion-popover-view>';
    
var contactTemplate =
    '<ion-popover-view class="right large">' +
    '<ion-content>' +
    '<div class="list">' +
    '<div class="item item-avatar item-text-wrap" ng-click="contactPopover.hide($event);"ng-repeat="contact in contacts" ui-sref="tabs.chat({chat: contact})">' +
    '<img ng-src="{{contact.photo}}">' +
    '<h2 class="dark font-thin">{{contact.name}}</h2>' +
    '<p class="dark font-thin">{{contact.subject}}</p>' +
    '</div>' +
    '</div>' +
    '</ion-content>' +
    '</ion-popover-view>';

var newsTemplate =
    '<ion-popover-view class="medium right">' +
    '<ion-content>' +
    '<div class="list">' +
    '<div class="item item-icon-left item-text-wrap" ng-click="newsPopover.hide($event);">' +
    '<i class="icon ion-ios-paper-outline"></i>Share Item' +
    '</div>' +
    '<div class="item item-icon-left item-text-wrap" ng-click="newsPopover.hide($event);">' +
    '<i class="icon ion-ios-camera-outline"></i>Share Photo' +
    '</div>' +
    '<div class="item item-icon-left item-text-wrap" ng-click="newsPopover.hide($event);">' +
    '<i class="icon ion-ios-bell-outline"></i>Share Event' +
    '</div>' +
    '<div class="item item-icon-left item-text-wrap" ng-click="newsPopover.hide($event);">' +
    '<i class="icon ion-ios-musical-notes"></i>Share Voicenote' +
    '</div>' +
    '<div class="item item-icon-left item-text-wrap" ng-click="newsPopover.hide($event);">' +
    '<i class="icon ion-ios-location-outline"></i>Share Location' +
    '</div>' +
    '</div>' +
    '</ion-content>' +
    '</ion-popover-view>';

var reminderTemplate =
    '<ion-popover-view class="small center">' +
    '<ion-content>' +
    '<div class="list">' +
    '<div class="item item-text-wrap padding item-icon-left" ng-click="reminderPopover.hide($event);" ui-sref="create-edit-reminder({reminder: null, type: \'Add Call\'})"><i class="icon ion-ios-telephone-outline"></i>Add Call</div>' +
    '<div class="item item-text-wrap padding item-icon-left" ng-click="reminderPopover.hide($event);" ui-sref="create-edit-reminder({reminder: null, type: \'Add Email\'})"><i class="icon ion-ios-at"></i>Add Email</div>' +
    '<div class="item item-text-wrap padding item-icon-left" ng-click="reminderPopover.hide($event);" ui-sref="create-edit-reminder({reminder: null, type: \'Add Task\'})"><i class="icon ion-ios-checkmark-outline"></i>Add Task</div>' +
    '<div class="item item-text-wrap padding item-icon-left" ng-click="reminderPopover.hide($event);" ui-sref="create-edit-reminder({reminder: null, type: \'Add Event\'})"><i class="icon ion-ios-calendar-outline"></i>Add Event</div>' +
    '</div>' +
    '</ion-content>' +
    '</ion-popover-view>';

var customerTemplate =
    '<ion-modal-view class="ion-modal">' +
    '<ion-header-bar>' +
    '<h1 class="title">{{product.name}}</h1>' +
    '<button class="button button-icon icon ion-android-close" ng-click="closeModalCustomer();"></button>' +
    '</ion-header-bar>' +
    '<ion-content class="padding shop">' +
    '<label class="item item-input item-select">' +
    '<div class="input-label">Size:</div>' +
    '<select ng-options="size for size in sizes" ng-model="product.size"><option value="">Select Size</option> </select>' +
    '</label>' +
    '<label class="item item-input">' +
    '<span class="input-label">Amount:</span>' +
    '<input type="number" ng-model="product.amount">' +
    '</label>' +
    '<button class="button waves-effect waves-teal button-balanced button-outline button-block" ng-click="addToCartComplete(product);">Save</button>' +
    '</ion-content>' +
    '</ion-modal-view>';


