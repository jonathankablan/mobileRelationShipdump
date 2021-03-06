angular.module('app.controllers', [])

.controller('homeCtrl', ['$scope', '$stateParams', '$ionicPopup', 'RelationFactory', 'UpdateFactory',
function ($scope, $stateParams, $ionicPopup, RelationFactory, UpdateFactory) {

  setInterval(function(){
    RelationFactory.getShowlove($scope.reponse.id).success(function(response) {
        $scope.partern = response[0];
    }).error(function(error) {
        $scope.partern = " ? ";
    });
  }, 1000);

  setInterval(function(){
    UpdateFactory.getUser($scope.reponse.id).success(function(response) {
      $scope.reponse.firstname = response.firstname ;
      $scope.reponse.lastname = response.lastname ;
      $scope.reponse.phone = response.phone ;
    }).error(function(error) {
      console.log("home get user");
    });
  }, 5000);

  $scope.break = function() {
    RelationFactory.getBreakup($scope.reponse.id).success(function(response) {
        $ionicPopup.alert({
            title: 'Information',
            template: response
        });
    }).error(function(error) {
        $ionicPopup.alert({
            title: 'Error',
            template: "Connexion lost ^_^ Home ^"
        });
    });
  };
}])

.controller('searchCtrl', ['$scope', '$stateParams', 'RelationFactory', 'AskFactory', '$ionicPopup',
function ($scope, $stateParams, RelationFactory, AskFactory, $ionicPopup) {

  $scope.add = function() {
     var Objetdata = {
         email: $scope.ask.email,
         myId: $scope.reponse.id
     };
     AskFactory.postAskRequest(Objetdata).success(function(response) {
       $ionicPopup.alert({
           title: 'Error',
           template: "Add love send"
       });
     }).error(function(error) {
         $ionicPopup.alert({
             title: 'Error',
             template: "echec action"
         });
     });
  };

  $scope.cancel = function() {
     var Objetdata = {
         email: $scope.ask.email,
         myId: $scope.reponse.id
     };
     AskFactory.postCancelRequest(Objetdata).success(function(response) {
         $ionicPopup.alert({
             title: 'Information',
             template: "Cancel Valide"
         });
     }).error(function(error) {
         $ionicPopup.alert({
             title: 'Error',
             template: "echec action"
         });
     });
  };

  setInterval(function(){
    RelationFactory.getSeeask($scope.reponse.id).success(function(response) {
      $scope.ask = [];
      $scope.askId = null;
      if (response[0]) {
        $scope.ask = response[0][0];
        $scope.askId = response[1];
      }
    }).error(function(error) {
      console.log("seeask");
    });
  }, 1000);


}])

.controller('settingCtrl', ['$scope', '$stateParams', 'UpdateFactory', '$ionicPopup', '$state',
function ($scope, $stateParams, UpdateFactory, $ionicPopup, $state) {

  setInterval(function(){
    $scope.firstname  = $scope.reponse.firstname;
    $scope.lastname = $scope.reponse.lastname;
    $scope.phone = $scope.reponse.phone;
    $scope.id = $scope.reponse.id;

    UpdateFactory.getUser($scope.reponse.id).success(function(response) {
      $scope.firstname  = response.firstname;
      $scope.lastname = response.lastname;
      $scope.phone = response.phone;
      $scope.id = response.id;
    }).error(function(error) {

    });
  }, 500);

  $scope.setting = function() {

      var Objetdata = {
          firstname: $scope.$$childTail.firstname,
          lastname: $scope.$$childTail.lastname,
          phone: $scope.$$childTail.phone
      };
      UpdateFactory.postUpdate(Objetdata, $scope.id).success(function(response) {
          $ionicPopup.alert({
              title: 'Information',
              template: "Update Valide"
          });
      }).error(function(error) {
        $ionicPopup.alert({
            title: 'Error',
            template: "Connexion lost ^_^ Setting"
        });
      });
  };

  $scope.settingpassword = function(){
    var Objetdata = {
        password: this.password
    };

    UpdateFactory.putUpdatePassword(Objetdata, $scope.id).success(function(response) {
        $ionicPopup.alert({
            title: 'Information',
            template: response
        });
    }).error(function(error) {
      $ionicPopup.alert({
          title: 'Error',
          template: "Connexion lost ^_^"
      });
    });
  };

}])

.controller('signupCtrl', ['$scope', '$stateParams', 'RegisterFactory', '$ionicPopup', '$state', '$http',
    function($scope, $stateParams, RegisterFactory, $ionicPopup, $state, $http) {

        function checkEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        }
        $scope.register = function() {
            var error = "";

            if (typeof this.email == "undefined") { error = "E-mail is empty !"; }
            if (typeof this.lastname == "undefined") { error = "Lastname is empty !"; }
            if (typeof this.firstname == "undefined") { error = "Firstname is empty !"; }
            if (typeof this.birth == "undefined") { error = "Birthday is empty !"; }
            if (typeof this.username == "undefined") { error = "Username is empty !"; }
            if (typeof this.phone == "undefined") { error = "Phone is empty !"; }
            if (typeof this.password == "undefined") { error = "Password is empty !"; }
            if (this.password !== this.password_confirm) { error = "Password did not same !"; }

            if (typeof error !== "undefined") {
                if (true === checkEmail(this.email)) {
                    var Objetdata = {
                        lastname: this.lastname,
                        firstname: this.firstname,
                        email: this.email,
                        birth: this.birth,
                        username: this.username,
                        phone: this.phone,
                        password: this.password
                    };
                    RegisterFactory.getRegister(Objetdata).success(function(response) {
                        $ionicPopup.alert({
                            title: 'Information',
                            template: response
                        });
                    }).error(function(error) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: error
                        });
                    });
                } else {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'E-mail is not Valide !'
                    });
                }
            } else {
                $ionicPopup.alert({
                    title: 'Error',
                    template: error
                });
            }
        };

    }
])

.controller('loginCtrl', ['$scope', '$stateParams', 'LoginFactory', '$ionicPopup', '$state', '$http','$timeout', '$ionicLoading',
    function($scope, $stateParams, LoginFactory, $ionicPopup, $state, $http, $timeout, $ionicLoading) {
        function checkEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        }

        $scope.connexion = function() {
            // Setup the loader
            $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
            });

            if (typeof this.email !== "undefined" && typeof this.password !== "undefined") {
                if (true === checkEmail(this.email)) {
                    var Objetdata = {
                        email: this.email,
                        password: this.password
                    };
                    LoginFactory.getConnexion(Objetdata).success(function(response) {
                      if (response[0].id) {
                        $ionicLoading.hide();
                        $state.go('tabs.home', { 'datas': response });
                      }else{
                        $ionicPopup.alert({
                            title: 'Error',
                            template: "Email or Password is invalid"
                        });
                        $ionicLoading.hide();
                      }

                    }).error(function(error) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: "Connexion failed"
                        });
                        $ionicLoading.hide();
                    });

                } else {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'E-mail is not Valide !'
                    });
                    $ionicLoading.hide();
                }
            } else {
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'E-mail or Password is Empty !'
                });
                $ionicLoading.hide();
            }
        };
    }
])

.controller('addRelationCtrl', ['$scope', '$stateParams', 'AskFactory', '$ionicPopup',
function ($scope, $stateParams, AskFactory, $ionicPopup) {

  $scope.email = '';
  $scope.id = $scope.reponse.id;
  $scope.ask = function() {
      var Objetdata = {
          email: this.email,
          myId: $scope.id,
      };

      if (this.email != '') {
        AskFactory.postRequest(Objetdata, $scope.id).success(function(response) {
            $ionicPopup.alert({
                title: 'Information',
                template: 'LOve request send'
            });
        }).error(function(error) {
            $ionicPopup.alert({
                title: 'Error',
                template: 'Echec : love request not send'
            });
        });
      }else{
        $ionicPopup.alert({
            title: 'Information',
            template: "Email is empty !"
        });
      }
  };

}])

.controller('seeallCtrl', ['$scope', '$stateParams', 'UpdateFactory',
function ($scope, $stateParams, UpdateFactory) {

  UpdateFactory.getAllUser().success(function(response) {
    $scope.resultats = response;
  }).error(function(error) {
    console.log("home All get user");
  });

}])

.controller('tabsCtrl', ['$scope', '$stateParams', '$state', '$timeout', '$ionicLoading', '$ionicHistory', '$ionicLoading',
    function($scope, $stateParams, $state, $timeout, $ionicLoading, $ionicHistory) {

        $scope.reponse = $state.params.datas[0];
        setInterval(function(){ $scope.reponse }, 3000);

        $scope.logout = function() {
          // Setup the loader
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });

            $scope.reponse = "";
            $ionicLoading.show({template:'Logging out....'});
            $timeout(function () {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
                $state.go('login', {}, {reload: true});
                $ionicLoading.hide();
                //location.reload();
            },30);
        }
    }
])
