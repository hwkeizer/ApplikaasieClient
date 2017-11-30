/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var baseURL = "http://localhost:8080/Workshop3/webresources";
let account;

$(document).ready(function(){
    getAccountDetails();
});

$(document).on("click", ":submit", function(event) {
    event.preventDefault();
    switch($(this).val()) {
        case "Wachtwoord wijzigen": {
                showChangePassword();
                break;
        }
        case "Bevestigen" : {
                changePassword();
                break;
        }
    }
});

function showChangePassword() {
    $("#changePassword").show();
}

function changePassword() {
    let newPassword = $("#changePassword #newpassword1").val();
    if (newPassword === $("#changePassword #newpassword2").val()) {
        account.password = newPassword;
        $.ajax({
            url:baseURL + "/account/cp",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(account),
            error: function() {
                console.log("Error in function changePassword");
            },
            success: function() {   
                $("#changeSuccesfull").show();
                setTimeout(function() {
                    window.location.href="http://localhost:8080/my_details.html#";               
                    location.reload(); 
                },2000);
            }
        });
    } else {
        $("#notEqual").show();
        setTimeout(function() {
            $("#changePassword")[0].reset();
            $("#notEqual").hide();
        }, 2000);
    }
}

//************************
//**  Backend requests  **
//************************

// Send get account details request to the backend
function getAccountDetails() {
    $.ajax({
        url:baseURL + "/account/my_details/" + sessionStorage.user,
        method: "GET",
        contentType: "application/json",
        error: function() {
            console.log("Error in function fetchAccountDetails");
        },
        success: function(data, textStatus, request) {            
            if (request.getResponseHeader('REQUIRES_AUTH') === '1'){ 
                window.location.href = 'http://localhost:8080/login.html';
            }
            else {
                console.log(data);
                account = data;
                $("#accountDetails #username").val(data.username);
                $("#accountDetails #accountType").val(data.accountType);
            }            
        }
    });
}

