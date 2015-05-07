/* global Firebase */
angular.module('starter.controllers', [])

    .controller('AppCtrl', ['$scope', '$state', '$ionicSideMenuDelegate', '$ionicModal', '$ionicHistory', '$timeout', 'FBREF', function ($scope, $state, $ionicSideMenuDelegate, $ionicModal, $ionicHistory, $timeout, FBREF) {

    var vm = this;

    // Public Properties    
    vm.loggedIn = false;
    vm.loginData = {
        email: '',
        password: ''
    };
    
    // Public Methods
    vm.login = login;
    vm.logout = logout;

    FBREF.onAuth(authDataCallback);

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        vm.modal = modal;
    });

    function authDataCallback(authData) {
        if (authData) {
            vm.loggedIn = true;
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
        } else {
            vm.loggedIn = false;
            console.log("User is logged out");
        }
    }

    function login() {

        FBREF.authWithPassword(vm.loginData, function (err, authData) {
            if (err) {
                console.log(err);
                alert("Bad Email/Password");
            } else {
                console.log("Auth data = ");
                console.log(authData);

                vm.loginData = {
                    email: '',
                    password: ''
                };
                
                vm.modal.hide();
            }
        })
    };

    function logout() {
        $ionicHistory.nextViewOptions({
            'disableBack' : true,
            'historyRoot' : true
        });
        
        FBREF.unauth();
        $ionicSideMenuDelegate.toggleLeft(false);
        $state.go('app.survey');
    }
    
}])

    .controller('SurveyController', ['Questions', function (Questions) {

    var vm = this;
    
    // Public Properties
    vm.questions = Questions;
    
    // Public Methods
    vm.recordResponse = recordResponse;

    function recordResponse(question, answer) {

        // Special private property to prevent user from answering again
        question.$answered = true;
        
        // Increment the reslts
        question.results[answer]++;

        // Save the question.  NOTE : $answered will not be saved
        vm.questions.$save(question);
    }


}])

    .controller('QuestionsController', ['$scope', '$timeout', '$ionicModal', '$ionicListDelegate', 'FBREF', function ($scope, $timeout, $ionicModal, $ionicListDelegate, FBREF) {

    var vm = this;
    
    // Public Properties
    vm.questions = [];
    vm.currentQuestion = null;
    vm.currentQuestionKey = null;
    
    // Public Methods
    vm.saveQuestion = saveQuestion;
    vm.deleteQuestion = deleteQuestion;
    vm.openQuestionEditor = openQuestionEditor;
    vm.closeQuestionEditor = closeQuestionEditor;

    function attachQuestions(snapshot) {
        $timeout(function () {
            console.log("have new questions");
            vm.questions = snapshot.val();
            console.log(vm.questions);
        })
    }

    $scope.$on('$ionicView.beforeEnter', function () {
        FBREF.child('questions').on("value", attachQuestions);
    });

    $scope.$on('$ionicView.beforeLeave', function () {
        FBREF.child('questions').off("value", attachQuestions);
    });

    function saveQuestion() {

        if (vm.currentQuestionKey) {
            FBREF.child('questions').child(vm.currentQuestionKey).set(vm.currentQuestion);
        } else {
            FBREF.child('questions').push(vm.currentQuestion);
        }

        vm.closeQuestionEditor();

    }

    function deleteQuestion(questionKey) {
        console.log("Deleting question : " + questionKey);
        FBREF.child('questions').child(questionKey).set(null);
    }

    function openQuestionEditor(question, questionKey) {

        if (!question) {

            question = {
                question: '',
                results: {
                    'yes': 0,
                    'no': 0
                }
            };

        }

        vm.currentQuestion = question;
        vm.currentQuestionKey = questionKey;

        $ionicModal.fromTemplateUrl('templates/questionModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(
            function (modal) {
                vm.modal = modal;
                vm.modal.show();
            }
            )
    }

    function closeQuestionEditor() {
        vm.modal.hide();
        vm.modal.remove();

        $ionicListDelegate.closeOptionButtons();
    }


}]);