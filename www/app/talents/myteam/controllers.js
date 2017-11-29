angular.module('myteam.controllers', [])

.controller('MyTeamCtrl', function($ionicLoading, $rootScope, $scope,$state , AuthenticationService, Main) {
	  if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.goToDetails = function (idx) {
    	$state.go('app.myteamdetail',{'idx':idx});
    };

     $scope.refresh = function(){
        initMethod();
        $scope.$broadcast('scroll.refreshComplete');
    }

   
    $scope.team = [];
    var successProfile = function (res){
      $ionicLoading.hide();
      $scope.team = res;
      $rootScope.team = [];
      for(var i=0;i<$scope.team.length;i++) {
      	var obj = $scope.team[i];
      	obj.idx = i;
        
        if(obj.photoProfile == null || obj.photoProfile == '')
          obj.photoProfile = "img/1491892621_profle.png";

      	$rootScope.team.push(obj);
      }
      $scope.team = $rootScope.team;
    }

    var errorProfile = function (err, status){
      $ionicLoading.hide();
    	if(status == 401) {
    		var refreshToken = Main.getSession("token").refresh_token
    		Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
    	}else {
        if(status == -1) {
          $scope.errorAlert("Problem with your connection.");
        }else {
          $scope.errorAlert( err.message);
        }
        
      }
    }

   	var successRefreshToken = function(res){
   		Main.setSession("token",res);
   	}
   	var errRefreshToken = function(err, status) {
   	}

   	initMethod();
   	//31acd2e6-e891-4628-a24e-58e408664516
   	function initMethod(){
   		getTeam();
   	}
   	// invalid access token error: "invalid_token" 401
   	function getTeam(){
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
      });
   		var accessToken = Main.getSession("token").access_token;
   		var urlApi = Main.getUrlApi() + '/api/myprofile/team';
   		Main.requestApi(accessToken,urlApi,successProfile, errorProfile);
   	}
})


.controller('MyRequestCtrl', function($ionicPopover,$ionicLoading,$rootScope, $scope,$state , AuthenticationService, Main) {
  if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
  }

    $scope.requests = [];
    $scope.module = {};

    var i=0;
    var j=0;
    var size=Main.getDataDisplaySize();
    $scope.isLoadMoreBenefitShow = false;
    $scope.isLoadMorePersonalShow = false;
    $scope.confirmApprove = $ionicPopover.fromTemplate(contactTemplate, {
        scope: $scope
    });

    $scope.loadMorePersonal = function(){
        j++;
        console.log(j);
        getMyRequest('personalia',j);
    }

     $scope.loadMoreBenefit = function(){
        i++;
        console.log(i);
        getMyRequest('benefit',i);
    }

    $scope.chooseTab = function(tab){
        i=0;
        j=0;
        $scope.module.type = tab;
        if(tab === 'personalia'){
            $scope.requests = [];
            getMyRequest(tab,j);
        }else {
            $scope.benefitRequests = [];
            getMyRequest(tab,i);
        }
        
    }

    $scope.confirmReject = $ionicPopover.fromTemplate(contactTemplate, {
        scope: $scope
    });

    $scope.gotoDetailRequest = function(id){
      
        $state.go('app.requestdetail',{'id':id,'needApproval':false});
    }

    

    $scope.refresh = function(){
      $scope.chooseTab($scope.module.type);    
    }
    
    $scope.approval = function(action,id){
        var data = {"id":id,"status":action};
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/workflow/actionapproval';
        var data = JSON.stringify(data);

        Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);

    }

    $scope.goToDetails = function (idx) {
      $rootScope.requestSelected = $scope.requests[idx];
      $state.go('app.requestDetail',{'idx':idx});
    };

   
    var successRequest = function (res){
      
      for(var i=0;i<res.data.length;i++) {
        var obj = res.data[i];
        obj.idx = i;
        if($scope.module.type == 'personalia') {
            if(obj.task == 'CHANGEMARITALSTATUS') {
               var change = obj.data;
               var objData = JSON.parse(change);
               obj.taskDescription = "Change marital status " + " to " + objData.maritalStatus;
            }else if(obj.task == 'SUBMITADDRESS'){
                obj.taskDescription = "Add new Address";
            }else if(obj.task == 'SUBMITFAMILY'){
                obj.taskDescription = "Add new family";
            }
        }
        
          obj.employeeRequest.fullName = obj.employeeRequest.firstName;
          if(obj.employeeRequest.middleName != null)
            obj.employeeRequest.fullName += " " + obj.employeeRequest.middleName;

          if(obj.employeeRequest.lastName != null)
            obj.employeeRequest.fullName += " " + obj.employeeRequest.lastName;
        

        if($scope.module.type == 'personalia') {
            $scope.requests.push(obj);
        }else {
            $scope.benefitRequests.push(obj);
        }

        if($scope.module.type == 'personalia') {
          if($scope.requests.length == res.totalRecord) 
            $scope.isLoadMorePersonalShow = false;
          else
            $scope.isLoadMorePersonalShow = true;
        }else if($scope.module.type == 'benefit') {
          if($scope.benefitRequests.length == res.totalRecord) 
            $scope.isLoadMoreBenefitShow = false;
          else
            $scope.isLoadMoreBenefitShow = true;
        }

          
      }

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    }

    //initMethod();

    $scope.$on('$ionicView.beforeEnter', function () {
        initMethod();
    });


    function initMethod(){
        $scope.requests = [];
        $scope.benefitRequests = [];
        $scope.chooseTab('personalia');
    }
    
    // invalid access token error: "invalid_token" 401
    function getMyRequest(module,page){
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
          });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/workflow/myrequest?module='+module+'&page='+page+'&size='+size;
        Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }
})

.controller('RequestApprovalCtrl', function($ionicPopover,$ionicLoading,$rootScope, $scope,$state , AuthenticationService, Main) {
  if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
  }

    var i=0; // for benefit
    var j=0; // for personalia
    var h=0; //for attendance
    var size=Main.getDataDisplaySize();

    $scope.requests = [];
    $scope.benefitRequests = [];
    $scope.attendanceRequests = [];
    $scope.module = {};
    $scope.hasDataBenefit = false;
    $scope.isLoadMoreBenefitShow = false;
    $scope.isLoadMorePersonalShow = false;
    var profile = Main.getSession("profile");
    $scope.isHr = profile.isHr;
   
    $scope.goToSearch = function(){
      $state.go('app.formrequestsearching');
    }

    $scope.loadMorePersonal = function(){
        j++;
        console.log(j);
        getNeedApproval('personalia',j);
    }

     $scope.loadMoreBenefit = function(){
        i++;
        console.log(i);
        getNeedApproval('benefit',i);
    }

    $scope.$on('$ionicView.beforeEnter', function () {
        initMethod();
    });

    $scope.chooseTab = function(tab){
        i=0;
        j=0;
        h = 0;
        $scope.module.type = tab;
        if(tab === 'personalia'){
            $scope.requests = [];
            getNeedApproval(tab,j);
        }else if(tab === 'benefit'){
             $scope.benefitRequests = [];
             getNeedApproval(tab,i);
        }else if(tab === 'attendance'){
             $scope.attendanceRequests = [];
             getNeedApproval(tab,h);
        }
        getCountNeedApproval();
    }


    $scope.confirmApprove = $ionicPopover.fromTemplate(contactTemplate, {
        scope: $scope
    });

    $scope.confirmReject = $ionicPopover.fromTemplate(contactTemplate, {
        scope: $scope
    });

    $scope.gotoDetailRequest = function(id){
        $state.go('app.requestdetail',{'id':id,'needApproval':true});
    }

    $scope.refresh = function(){
      $scope.chooseTab($scope.module.type);    
    }
    
    $scope.approval = function(action,id){
        var data = {"id":id,"status":action};
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/workflow/actionapproval';
        var data = JSON.stringify(data);
        Main.postRequestApi(accessToken,urlApi,data,successRequest,$scope.errorRequest);

    }

    $scope.goToDetails = function (idx) {
      $rootScope.requestSelected = $scope.requests[idx];
      $state.go('app.requestDetail',{'idx':idx});
    };

   
    var successRequest = function (res){

      for(var i=0;i<res.data.length;i++) {
          var obj = res.data[i];
          obj.idx = i;
          if($scope.module.type == 'personalia') {
              if(res.data[i].task == 'CHANGEMARITALSTATUS') {
                 var change = obj.data;
                 var objData = JSON.parse(change);
                 obj.taskDescription = "Change marital status from "+obj.employeeRequest.maritalStatus + " to " + objData.maritalStatus;
              }else if(res.data[i].task == 'SUBMITFAMILY'){
                obj.taskDescription = "Add new family";
              }
          }

          obj.employeeRequest.fullName = obj.employeeRequest.firstName;
          if(obj.employeeRequest.middleName != null)
              obj.employeeRequest.fullName += " " + obj.employeeRequest.middleName;

          if(obj.employeeRequest.lastName != null)
              obj.employeeRequest.fullName += " " + obj.employeeRequest.lastName;
          
          if($scope.module.type == 'personalia') {
              $scope.requests.push(obj);
          }else if($scope.module.type == 'attendance'){
             $scope.attendanceRequests.push(obj);
          }else {
              $scope.benefitRequests.push(obj);
          }

          obj.photoProfile = "img/1491892511_profle.png";
          if(obj.employeeRequestPhotoProfile != null)
                obj.photoProfile = obj.employeeRequestPhotoProfile;
       }

      if($scope.module.type == 'personalia') {
          if($scope.requests.length == res.totalRecord) 
            $scope.isLoadMorePersonalShow = false;
          else
            $scope.isLoadMorePersonalShow = true;
      }else if($scope.module.type == 'benefit') {
          if($scope.benefitRequests.length == res.totalRecord) 
            $scope.isLoadMoreBenefitShow = false;
          else
            $scope.isLoadMoreBenefitShow = true;
      }

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    var successRequestCount = function (res){
        if(res!= null) {
            $rootScope.countApproval = res.count;
            $scope.general.countApproval = res.count;
        }
    }
    

    //initMethod();

    function initMethod(){
     $scope.requests = [];
      $scope.benefitRequests = [];
      $scope.attendanceRequests = [];
      $scope.chooseTab('personalia');
    }
    // invalid access token error: "invalid_token" 401
    function getCountNeedApproval(){
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/workflow/countneedapproval';
      Main.requestApi(accessToken,urlApi,successRequestCount, $scope.errorRequest);
    }

    function getNeedApproval(module,page){
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/workflow/needapproval?module='+module+'&page='+page+'&size='+size;
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }
})

.controller('RequestDetailCtrl', function(ionicSuperPopup,$ionicPopup,$ionicPopover,$ionicModal,$ionicLoading,$stateParams,$rootScope, $scope,$state , AuthenticationService, Main) {
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }
    $scope.data = {}
    $scope.data.amount = 0;

    $scope.needApproval = $stateParams.needApproval;
    var id = $stateParams.id;
    $scope.detail = {};
    $scope.confirm = {reasonReject:""};
    $scope.attachment = "img/placeholder.png";
    
    $scope.change = function(event,index){
      var value = event.target.value;
      value = value
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      $scope.data.amount = value;
    }

    $scope.viewMoreFamily = function(){
        $state.go('app.detailfamily',{'idx':$scope.detail.ref.id,'edit':'false'});
    }

    $scope.viewMoreAddress = function(){
        //console.log("$scope.detail",$scope.detail);
        $state.go('app.detailaddress',{'idx':$scope.detail.ref.id,'edit':'false'});
    }

    var successApprove = function(res){
        $ionicLoading.hide();
        $scope.successAlert(res.message);
        $rootScope.refreshRequestApprovalCtrl = true;
        $scope.goBack("app.requestapproval");
    }

    var sendApproval = function(action,id,reason){

        var data = {};
        if(action == 'approved'){
            var dataAmount  = null;
            if($scope.detail.ref != undefined && $scope.detail.ref.categoryType != undefined && $scope.detail.ref.categoryType == 'Medical Overlimit') {
                dataAmount =  $scope.data.amount.replace(/\./g,'');
                dataAmount = Number(dataAmount);
            }
            data = {"id":id,"status":action,"amount":dataAmount};
        } else{
            data = {"id":id,"status":action,"reasonReject":reason};
        }
          

        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/workflow/actionapproval';
        var data = JSON.stringify(data);
        Main.postRequestApi(accessToken,urlApi,data,successApprove,$scope.errorRequest);

    }
    
    $scope.confirmCancel = function (){
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
                sendApproval('cancelled',id,"");
             }
            
           
        });
    }

    $scope.confirmAccept = function (){
        if($scope.detail.ref != undefined && $scope.detail.ref.categoryType != undefined && $scope.detail.ref.categoryType == 'Medical Overlimit' && $scope.detail.currentApprovalLevel >0) {
          var validationAmount =  $scope.data.amount.replace(/\./g,'');
          validationAmount = Number(validationAmount);
          if(parseInt(validationAmount)<=1000) {
              $scope.warningAlert("Please fill out correct amount !!");
              return false;
          }
        }

        ionicSuperPopup.show({
           title: "Are you sure?",
           text: "Are you sure want to Approve this request ?",
           type: "warning",
           showCancelButton: true,
           confirmButtonColor: "#DD6B55",
           confirmButtonText: "Yes",
           closeOnConfirm: false
         },
        function(isConfirm){
             if (isConfirm) {
                sendApproval('approved',id,"");
             }
            
           
        });
    }

    $scope.confirmReject = function (){
        var confirmPopup = $ionicPopup.confirm({
            title: 'Reason Rejected',
            //template: '<input class="calm" type="text " ng-model="confirm.reasonReject" >',
            template: '<textarea rows="2" maxlength="50" class="calm" style="width:100%; border-color:#ddd; border: solid 2px #c9c9c9;border-radius:2px" ng-model="confirm.reasonReject" ></textarea>',
            cancelText: 'Cancel',
            scope: $scope,
            okText: 'Yes'
          }).then(function(res) {
              if (res) {
                  var reason = $scope.confirm.reasonReject;
                  if(reason == "")
                    $scope.warningAlert("Reason reject can not empty");
                  else
                    sendApproval('rejected',id,reason);
              }
              
          });
    }

   $ionicModal.fromTemplateUrl('app/intro/image-preview.html', {
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function (modal) {
        $scope.modalPopupImage = modal;
    });

    $scope.openImagePreview = function (item) {
        var product = {id:1,image:item};
        $scope.detailImage = product;
        $scope.modalPopupImage.show();
    };
    $scope.closeImagePreview = function () {
        $scope.detailImage = undefined;
        $scope.modalPopupImage.hide();
    };

    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.detail = res;

      if($scope.detail.task == 'SUBMITLEAVE') {
          $scope.detail.taskTitle = "Request Leave";
      }else if($scope.detail.task == 'CHANGEMARITALSTATUS'){
          $scope.detail.taskTitle = "Change Marital Status";
          var change = $scope.detail.data;
          var objData = JSON.parse(change);
          $scope.detail.taskDescription = "Change marital status from "+$scope.detail.employeeRequest.maritalStatus + " to " + objData.maritalStatus;
      }else if($scope.detail.task == 'SUBMITFAMILY' || $scope.detail.task == 'CHANGEFAMILY') {
           $scope.detail.taskTitle = "Add new Family";
           $scope.detail.taskDescription = "Add new family";
           $rootScope.family = [];
           if($scope.detail.task == 'CHANGEFAMILY' && $scope.detail.processingStatus == 'Reject')
              $scope.detail.ref = JSON.parse($scope.detail.data);

           $rootScope.family.push($scope.detail.ref);
      }else if($scope.detail.task == 'SUBMITADDRESS' || $scope.detail.task == 'CHANGEADDRESS') {
           $rootScope.address = [];
           if($scope.detail.task == 'CHANGEADDRESS' && $scope.detail.processingStatus == 'Reject')
              $scope.detail.ref = JSON.parse($scope.detail.data);

           $rootScope.address.push($scope.detail.ref);
      }else if($scope.detail.task == 'SUBMITBENEFIT' || $scope.detail.task == 'SUBMITBENEFIT1' || $scope.detail.task == 'SUBMITBENEFIT2' || $scope.detail.task == 'SUBMITBENEFIT3' || $scope.detail.task == 'SUBMITBENEFIT4' || $scope.detail.task == 'SUBMITBENEFIT5'  ){
          if($scope.detail.ref.categoryType == 'Medical') {
              var arrDetail = [];
              if($scope.detail.ref.details.length > 0) {
                arrDetail = JSON.parse($scope.detail.ref.details[0].data);
              }
              $scope.detail.ref.details = arrDetail;
          }else if($scope.detail.ref.categoryType == 'Medical Overlimit'){
              if($scope.detail.ref.details.length > 0){
                  var obj = $scope.detail.ref.details[0];
                  $scope.data.amount = ""+obj.amount;
                   $scope.data.amount =  $scope.data.amount.replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

              }
               
          }
      }

      $scope.detail.photoProfile = "img/1491892511_profle.png";
      if($scope.detail.employeeRequestPhotoProfile != null)
          $scope.detail.photoProfile = $scope.detail.employeeRequestPhotoProfile;
         

      $scope.detail.employeeRequest.fullName = $scope.detail.employeeRequest.firstName;
      if($scope.detail.employeeRequest.middleName != null)
          $scope.detail.employeeRequest.fullName += " " + $scope.detail.employeeRequest.middleName;

      if($scope.detail.employeeRequest.lastName != null)
          $scope.detail.employeeRequest.fullName += " " + $scope.detail.employeeRequest.lastName;
  
      if($scope.detail.attachments.length > 0){
    
          $scope.attachment = $scope.detail.attachments[0].image;
      }else{
        $scope.detail.attachments = [];
      } 


    }

   

    function getDetailRequest(){
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
      });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/workflow/dataapproval/'+id;
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }

    function initModule(){
        $scope.detail = {};
        $scope.attachment = "img/placeholder.png";
        getDetailRequest();
        
    }

     $scope.$on('$ionicView.beforeEnter', function () {
        initModule();
    });

    

    //initModule();

   // console.log(teamIdx);

})


.controller('MyRequestDetailCtrl', function($ionicPopup,$ionicPopover,$ionicModal,$ionicLoading,$stateParams,$rootScope, $scope,$state , AuthenticationService, Main) {
    
    if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }


    var id = $stateParams.id;
    $scope.detail = {};
    $scope.confirm = {reasonReject:""};

    $scope.attachment = "img/placeholder.png";

    var successApprove = function(res){
        $ionicLoading.hide();
        $scope.successAlert("Cancel your request Successfully");
        $scope.goBack("app.myrequestapproval");
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
    

    $scope.confirmCancel = function (){
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: '<h5>Are you sure want to Cancel this request ?</h5>',
            cancelText: 'Cancel',
            okText: 'Yes'
          }).then(function(res) {
              if (res) {
                  sendApproval('cancelled',id,"");
              }
              
          });
    }


   $ionicModal.fromTemplateUrl('app/intro/image-preview.html', {
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function (modal) {
        $scope.modalPopupImage = modal;
    });

    $scope.openImagePreview = function (item) {
        var product = {id:1,image:item};
        $scope.detailImage = product;
        $scope.modalPopupImage.show();
    };
    $scope.closeImagePreview = function () {
        $scope.detailImage = undefined;
        $scope.modalPopupImage.hide();
    };

    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.detail = res;

      if($scope.detail.task == 'SUBMITLEAVE') {
          $scope.detail.taskTitle = "Request Leave";
      }else if($scope.detail.task == 'CHANGEMARITALSTATUS'){
          $scope.detail.taskTitle = "Change Marital Status";
          var change = $scope.detail.data;
          var objData = JSON.parse(change);
          $scope.detail.taskDescription = "Change marital status from "+$scope.detail.employeeRequest.maritalStatus + " to " + objData.maritalStatus;
      }else if($scope.detail.task == 'SUBMITFAMILY') {
           $scope.detail.taskTitle = "Add new Family";
           obj.taskDescription = "Add new family";
      }

      
      $scope.detail.employeeRequest.fullName = $scope.detail.employeeRequest.firstName;
      if($scope.detail.employeeRequest.middleName != null)
          $scope.detail.employeeRequest.fullName += " " + $scope.detail.employeeRequest.middleName;

      if($scope.detail.employeeRequest.lastName != null)
          $scope.detail.employeeRequest.fullName += " " + $scope.detail.employeeRequest.lastName;
  
      if($scope.detail.attachments.length > 0){
        
          $scope.attachment = $scope.detail.attachments[0].image;
      }
          
    }

    var errorRequest = function (err, status){
      $ionicLoading.hide();
      if(status == 401) {
        var refreshToken = Main.getSession("token").refresh_token
        Main.refreshToken(refreshToken, successRefreshToken, errRefreshToken);
      }else {
        if(status == -1) {
          $scope.errorAlert("Problem with your connection.");
        }else {
          $scope.errorAlert( err.message);
        }
        
      }
    }

    var successRefreshToken = function(res){
      Main.setSession("token",res);
    }
    var errRefreshToken = function(err, status) {
    }

    function getDetailRequest(){
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
      });
      var accessToken = Main.getSession("token").access_token;
      var urlApi = Main.getUrlApi() + '/api/user/workflow/dataapproval/'+id;
      Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }

    function initModule(){
        $scope.detail = {};
        $scope.attachment = "img/placeholder.png";
        getDetailRequest();
        
    }
    

    initModule();

   // console.log(teamIdx);

})

.controller('FormRequestSearchingCtrl', function($ionicPopup,$ionicPopover,$ionicModal,$ionicLoading,$stateParams,$rootScope, $scope,$state , AuthenticationService, Main) {
    $scope.formSearching = {search:""};
    $scope.requests = [];
    $scope.actionFind = false;
    var successRequest = function (res){
      $ionicLoading.hide();
      $scope.requests = res;
    }

    $scope.find = function(){
        $scope.actionFind = true;
        var searchText = $scope.formSearching.search;
        if(searchText == "" ||  searchText.length < 5) {
            $scope.warningAlert("Min Request No must be of 5 characters length");
            return false;
        }
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });

        var accessToken = Main.getSession("token").access_token;
        var urlApi = Main.getUrlApi() + '/api/user/tmrequest/findRequestNo?requestNo='+$scope.formSearching.search;
        Main.requestApi(accessToken,urlApi,successRequest, $scope.errorRequest);
    }

    $scope.$on('$ionicView.beforeEnter', function (event,data) {
          if(data.direction != "back")
            initModule();
    });

    function initModule(){
        $scope.formSearching = {search:""};
        $scope.requests = [];
    }


})


.controller('DetailTeamCtrl', function($stateParams,$rootScope, $scope,$state , AuthenticationService, Main) {
	if(Main.getSession("token") == null || Main.getSession("token") == undefined) {
        $state.go("login");
    }

    $scope.detail = {};

    var teamIdx = $stateParams.idx;
    if(teamIdx != null && $rootScope.team != undefined && $rootScope.team[teamIdx] != undefined) {
    	$scope.detail = $rootScope.team[teamIdx];
    	$scope.detail.fullName = $scope.detail.firstName + " " + $scope.detail.lastName;
    }

   // console.log(teamIdx);

})

