
var app = angular.module('myApp', ['rzModule' ,'ngCookies','ngFileUpload']);



var total_payback_amount;
var amount_value;
var loanAvailability;
var file;


/*---------------------------login controller---------------------------------*/
app.controller('login_controller', function ($scope, $http, $window, $cookies) {


    /*--login function--*/
    $scope.login = function () {
        console.log("inside login function");
        if ($scope.Username == null || $scope.Password == null) {
            $window.alert("fields can not be left empty");
        }
        else {

            $http({
                method: 'POST',
                data: {
                    _id: $scope.Username,
                    password: $scope.Password,
                    user: 'null'
                },
                url: '/getHome'
            }).then(function successCallback(response) {


                    if (response.data.data.toString().includes("no personal info")) {
                        //generating the cookie
                        loggedin = true;
                        var now = new Date();
                        var Expire = new Date();
                        Expire.setMinutes(now.getMinutes() + 10);
                        $cookies.put('username', $scope.Username, {path: "/", expires: Expire});
                        $cookies.put('Loggedin', 'true', {path: "/", expires: Expire});
                        $window.location.href = '../../views/personal_information.html';
                    }
                    else if (response.data.data.toString().includes("personal info valid")) {
                        //generating the cookie
                        loggedin = true;
                        var now = new Date();
                        var Expire = new Date();
                        Expire.setMinutes(now.getMinutes() + 10);
                        $cookies.put('username', $scope.Username, {path: "/", expires: Expire});
                        $cookies.put('Loggedin', 'true', {path: "/", expires: Expire});
                        $window.location.href = '../../views/rapidly_home.html';
                    }
                    else {
                        alert("invalid username or password")
                    }

                },
                function errorCallback(response) {
                    console.log("error");
                    console.log(response);
                });

        }
    };


    /*---forgot pass word function--*/
    $scope.forgotPassword = function () {
        console.log("inside forgote password gunction");
        $http({
            method : 'GET',
            url : '/getForgotPassword'
        })
    }
});

/*----------------------------controller for making the registraion on rapidly tax site-----------------------------*/

app.controller('make_registration_controller', function ($scope, $http, $window) {
    console.log("inside controller");
    $scope.registration = function () {
        console.log("inside registration function");
        $http({
            method: 'GET',
            url: '/callRegistrationPage'
        }).then(function successCallback(response) {
                console.log("success call back");
                $window.location.href = '../../views/registration.html';
            },
            function errorCallback(response) {
                console.log("error");
                console.log(response);
            });

    }
});

/*----------------------------------controller for registration page---------------------------------------*/
app.controller('registration_controller', function ($scope, $http, $window, $cookies) {
    console.log("inside controller");
    $scope.show_passwrod_details = false;
    $scope.paswword_show_details = function () {
        $scope.show_passwrod_details = true;
    }
    $scope.register = function () {

        console.log($scope.termsAndCondition);
        if ($scope.registrationForm.passwordRegistration.$error.pattern){
            $window.alert("Password must contain at least 8 characters that includes number, upper case letter, lower case letters and special character");
        }

        else if ($scope.register_username == null || $scope.register_email == null || $scope.register_password == null || $scope.register_re_password == null) {
            $window.alert("fields can not be left empty");
        }
        else if ($scope.register_password != $scope.register_re_password) {
            $window.alert("Password do not match");
        }
        else if($scope.termsAndCondition == null){
            console.log("inside typchecked");
            $window.alert("Please check for the terms and condition");
        }
        else {
            $http({
                method: 'POST',
                url: '/submitRegistration',
                data: {
                    _id: $scope.register_username,
                    email_id: $scope.register_email,
                    password: $scope.register_password,

                }
            }).then(function successCallback(response) {
                if (response.data.data.toString().includes("saved to database")) {
                    console.log("entered if statement");
                    /*creating cookie*/
                    loggedin = true;
                    var now = new Date();
                    var Expire = new Date();
                    Expire.setMinutes(now.getMinutes() + 10);
                    $cookies.put('username', $scope.register_username, {path: "/", expires: Expire});
                    $cookies.put('Loggedin', 'true', {path: "/", expires: Expire});
                    console.log("loggedin changed to true:" + loggedin);
                    /*console.log($cookies.username);
                    $cookies.username = $scope.register_username;
                    console.log($cookies.username);*/
                    $window.location.href = '../../views/personal_information.html';
                }
                else if (response.data.data.toString().includes("data exist")) {

                    console.log("entered else if statement");
                    alert("this user name has already taken");

                }
                else if (response.data.data.toString().includes("email exist")) {

                        console.log("entered else if statement");
                        alert("this email has already taken");

                    }


            }, function errorCallback(response) {
                console.log('error');
            });


        }


    };
    $scope.terms_Condition = function () {
        $http({
            method : 'GET',
            url : '/getTermsAndCondition'
        }).then(function successCallback(response){
            console.log("successfull");
            $window.location.href = '../../views/termsAndCondition.html';
        }, function errorCallback(response) {
            console.log("error")
        });
    }


});

/*-------------------------After submitting the personal information form---------------------*/
app.controller('personal_info_form_controller', function ($scope, $http, $window, $cookies) {
    console.log($cookies.get("username"));
    $scope.submitForm = function () {
        if($scope.full_name == null ||$scope.phone_number == null ||$scope.address == null || $scope.city == null || $scope.state == null || $scope.pin_code == null || $scope.company_name==null || $scope.employer_name==null||$scope.employer_contact==null){
            window.alert("Marked Fields can not be left empty");
        }
        else {
            $http({
                method: 'POST',
                url: '/getIndex',
                data: {
                    _id : $cookies.get("username"),
                    name: $scope.full_name,
                    phone: $scope.phone_number,
                    address: $scope.address,
                    address_city: $scope.city,
                    address_state: $scope.state,
                    zipCode: $scope.pin_code,
                    company: $scope.company_name,
                    employer: $scope.employer_name,
                    employer_phone: $scope.employer_contact,
                    loan_reason: $scope.reason_for_loan,
                    hear_about_us: $scope.how_did_you_hear_about_us
                }
            }).then(function successCallback(response) {
                if(response.data.data.toString().includes("saved to database")){
                    console.log("success call back");
                    $window.location.href = '../../views/rapidly_home.html';
                }
                else {
                    $window.alert("OOPS! something went wrong");
                }
                },
                function errorCallback(response) {
                    console.log("error");
                    console.log(response);
                });
        }
    }
});



/*----------------------------controlling the home page of rapidly--------------------------*/
app.factory('loanAmountService', function () {
    var amount_value = this.amount_value;
    var total_payback_amount = this.total_payback_amount;

    return {
        getAmount: function () {
            console.log("coming here");
            console.log(amount_value);
            return amount_value;
        },
        getPayback: function () {
            return total_payback_amount;
        },
        setAmount: function(value1,value2) {
            amount_value = value1;
            total_payback_amount = value2;
            console.log(amount_value + total_payback_amount );
        }
    };


});

app.controller('home_page_controller', function ($scope, $http, $cookies,$window,loanAmountService) {
    $scope.loanSliderValue = 0;
   //after cookies is being created for login
    console.log($cookies.get("Loggedin"));
    if($cookies.get("Loggedin")!=null)
    {
        console.log("inside if users loggs in");
        console.log("LoggedIn cookie:"+$cookies.get("Loggedin"));
        $scope.userLogin = $cookies.get("Loggedin").includes("true")?false:true;

        $scope.userLogout = $cookies.get("Loggedin").includes("true")?true:false;
        console.log("checkUserLogout:"+$scope.userLogout);
        console.log("checkUserLogin:"+$scope.userLogin);
        $scope.sign_up_user= false;
    }
    else{
        console.log("inside if user is not looged in and we want to show the loggin button");
        $scope.userLogin = true;
        $scope.userLogout = false;
        $scope.user_welcome_note = false;
        $scope.submit_request_show = false;
        $scope.sign_up_user = true;
        console.log("checkUserLogout:"+$scope.userLogout);
        console.log("checkUserLogin:"+$scope.userLogin);
    }
    if($cookies.get("username")!=null)
    {

        $scope.userid=$cookies.get("username");
        $scope.user_welcome_note = true;
        $scope.submit_request_show = true;


    }

    //controlling the slider value



    console.log($scope.loanSliderValue);

    console.log(document.getElementsByName("loanSliderValue").value);
    console.log(amount_value);
    $scope.calculate_total_repayment_amount = function () {
        var typeChecked = document.getElementsByName("availability");
        if(typeChecked[0].checked){
            amount_value = $scope.loanSliderValue;
            total_payback_amount = amount_value + (amount_value * 0.4) ;
            loanAmountService.amount_value = amount_value;
            loanAmountService.total_payback_amount = total_payback_amount;
            loanAmountService.setAmount(amount_value , total_payback_amount);
            $scope.total_repayment_amount = total_payback_amount;
            loanAvailability = "Instantly";
        }
        else if (typeChecked[1].checked){
            amount_value = $scope.loanSliderValue;
            total_payback_amount = amount_value + (amount_value * 0.4) ;
            loanAmountService.amount_value = amount_value;
            loanAmountService.total_payback_amount = total_payback_amount;
            loanAmountService.setAmount(amount_value , total_payback_amount);
            $scope.total_repayment_amount = total_payback_amount;
            loanAvailability = "Within 24 Hours";
        }

    };

 $scope.submit_request = function () {

     console.log($scope.loanSliderValue);
     console.log(loanAvailability);
     if(loanAvailability == null){
         $scope.thankuModal = true;
         $scope.errorModal = true;
         $scope.amountErrormodal = false;
     }
     else if ($scope.loanSliderValue == NaN || $scope.loanSliderValue == 0){
         $scope.thankuModal = true;
         $scope.amountErrormodal = true;
         $scope.errorModal = false;

     }
     else {
         $scope.thankuModal = false;
         $scope.errorModal = false;
         $scope.amountErrormodal = false;
         $http({
             method : 'POST',
             data : {
                 _id : $cookies.get("username"),
                 amount : $scope.loanSliderValue,
                 name : 'null',
                 phone : 'null',
                 email : 'null',
                 employer_phone: 'null',
                 requiredTimeForLoan : loanAvailability,
                 payback_amount : total_payback_amount
             },
             url : '/submitForm'
         }).then(function successCallback(response) {

             $window.location.href = '../../views/upload_paystub.html';
         }, function errorCallback(response) {
             console.log("error");
             console.log(response);
         });
     }

 };
 
 $scope.logout = function () {
     $cookies.remove("Loggedin",{path:"/"});
     $cookies.remove("username",{path:"/"});
     console.log("loggedout");
     $scope.checkUserLogin =true ;
     $scope.checkUserLogout = false;
     console.log("inside logout funstion");
     $http({
        method : 'GET',
         url: '/logoutToHome'
     }).then(function sucessCallback(){
         $window.location.href = '../../views/rapidly_home.html';
     },function errorCallback(){
         console.log("error");
     });

 }
});


/*---------------------------------- forgot password controller -----------------------------------------------------*/
app.controller('Forgot_Password_Controller', function ($http,$scope, $window, $cookies) {
    console.log("inside forgot password pafe controller");
    $scope.reset_password = function () {
        if($scope.User_id == null){
            $window.alert("please enter the email address");

        }
        else if ($scope.password != $scope.re_password){
            $window.alert("password do not match");
        }
        else{
            $http({
                method: 'POST',
                data : {
                    userId : $scope.User_id,
                    password : $scope.password
                },
                url: '/resetPassword'
            }).then(function successCallback(response) {
                    if (response.data.data.toString().includes("valid user")) {
                        console.log("entered if statement");
                        $window.location.href = '../../views/index.html';
                    }
                    else if (response.data.data.toString().includes("No Such Account")) {

                        console.log("entered else if statement");
                        alert("OOPS! Sorry, No such user_id found ");

                    }
                },
                function errorCallback(response) {
                    console.log("error");
                    console.log(response);
                });
        }
    }

    $scope.getUserIdFunction = function () {
        $http({
            method : 'GET',
            url : '/getUserIdPage'
        }).then(function successCallback(response) {
                  $window.location.href = '../../views/getUserId.html';

            },
            function errorCallback(response) {
                console.log("error");
                console.log(response);
            });

    }
});

/*--------------------------------Get User Id Controller -------------------*/
app.controller('get_user_id_controller', function ($scope,$window,$http) {
   $scope.getUserId =  function () {
       $http({
           method : 'POST',
           data : {
               email_id : $scope.email
           },
           url : '/getUserId'
       }).then(function successCallback(response){
           if(response.data.data.toString().includes("Valid User.Message sent")){
               console.log("success call back");
               $window.alert("Mail Sent to your email Address");
           }
           else if (response.data.data.toString().includes("Valid User.Error sending mail")){
               $window.alert("There is some error in sending mail");
           }
           else if (response.data.data.toString().includes("empty")){
               $window.alert("No such email_id found");
           }

       });

   }

});

/*-----------------------Upload Pay Stub Controller----------------------------*/
var vm = this;
app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
                vm.file = changeEvent.target.files[0];
                console.log(vm.file);
            });
        }
    }
}]);

/*---------------------------------Uploading the paystub and getting authorized by plaid-------------------*/


app.controller('upload_paystub_controller',function (Upload,$scope,$window,$http,$cookies) {

    /*--------------------------makaing cookis for the login-----------------------------------*/
    console.log($cookies.get("Loggedin"));
    if($cookies.get("Loggedin")!=null)
    {
        console.log("User logged in ");
        $scope.login_first = $cookies.get("Loggedin").includes("true")?false:true;
        $scope.userLogout = $cookies.get("Loggedin").includes("true")?true:false;
        console.log("checkUserLogout:"+$scope.userLogout);
        console.log("checkUserLogin:"+$scope.login_first);
        $scope.nextStep = true;
    }
    else{
        console.log("inside if user is not looged in and we want to show the loggin button");
        $scope.login_first = true;
        $scope.userLogout = false;
        $scope.user_welcome_note = false;
        $scope.submit_request_show = false;
        $scope.nextStep = false;

    }
    if($cookies.get("username")!=null)
    {

        $scope.userid=$cookies.get("username");
        $scope.user_welcome_note = true ;



    }


    console.log("inside the paystub constroller");
    /*-------------------------Plaid popup for bank selection-------------*/
    var handler = Plaid.create({
        apiVersion: 'v2',
        clientName: 'Rapidly',
        env: 'sandbox',
        product: ['transactions'],
        key: '2a0023a032da393380f0c02941b814',
        onSuccess: function(public_token) {
            console.log("inside the onSuccess function");
            $http({
                method : 'POST',
                data : {publicToken: public_token,
                _id : $cookies.get("username")},
                url : '/get_access_token'
            }).then(function successCallback(response) {
                    $window.location.href = '../../views/loan_approval.html';

                },
                function errorCallback(response) {
                    console.log("error");
                    console.log(response);
                });
        }
    });


    /*-----------Uploading the file to databse----------------------*/
    console.log(vm.file);
    file = vm.file;
    $scope.submitPayStub = function(){

        console.log("inside the submit paystub function");
        console.log(file);
        vm.upload(vm.file);
        handler.open();
    };

    vm.upload = function (file) {
        console.log("inside th function to upload the file");
        Upload.upload({
            method : 'POST',
            url: '/uploadPaystub', //webAPI exposed to upload the file
            data:{file:file,
            username : $cookies.get("username")
            } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.data.toString().includes("Upload successfull")){
                //validate success and open the plaid handler


            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        });
    };

    /*----------------logout function------------------------*/
    $scope.logout = function () {
        $cookies.remove("Loggedin", {path: "/"});
        $cookies.remove("username", {path: "/"});
        console.log("loggedout");
        $scope.checkUserLogin = true;
        $scope.checkUserLogout = false;
        console.log("inside logout funstion");
        $window.location.href = '../../views/upload_paystub.html';
    }
});

/*----------------Loan_approval_controller----------------*/
app.controller('loan_approval_controller' , function ($scope,loanAmountService) {
    $scope.loanValue = loanAmountService.getAmount();
    $scope.paybackValue = loanAmountService.getPayback();
    console.log( "amount value is  : " + loanAmountService.getAmount() + " total valaue is :" + loanAmountService.getPayback());
});