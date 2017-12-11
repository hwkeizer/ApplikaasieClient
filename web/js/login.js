/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const baseURL = "http://localhost:8080/Workshop3/webresources";
let username = null;

$(document).on("submit", "form#login", function(event) {
    event.preventDefault();
    username = $("#username").val();
    console.log("Username:" + $("#username").val());
    var login = {"username" : username,
            "password" : $("#password").val()};
    var loginJson = JSON.stringify(login);
    console.log(loginJson);
    
    $.ajax({
        url: "http://localhost:8080/Workshop3/login",
        method: "POST",
        data: loginJson,
        contentType: "application/json",
        error: function() {
            console.log("Error in function login");
        },
        success: function(data, textStatus, request) {
            if (request.getResponseHeader('AUTH_FAILED') === '1'){ 
                $("#login_failed").show();
            } else {
            
            // Keep username in local web session storage
            sessionStorage.user = username;
            sessionStorage.shoppingCart = "";
			sessionStorage.role = request.getResponseHeader('ROLE');
            sessionStorage.customerId = request.getResponseHeader('CUSTOMER_ID');
            console.log("customer id: " + sessionStorage.customerId);
            console.log("User " + sessionStorage.user + " stored in local session web storage");
            window.location.href="http://localhost:8080/home.html";
//            location.reload();
            }
        }       
    });
});
