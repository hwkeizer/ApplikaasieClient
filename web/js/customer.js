/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var baseURL = "http://localhost:8080/Workshop3/webresources";

$(document).ready(function(){
    showAllCustomers();
});

function showAllCustomers() {
    $.ajax({
        url:baseURL + "/customer",
        method: "GET",
        dataType: "json",
        error: function() {
            console.log("Error in function showAllAccounts");
        },
        success: function(data) {
            $("#customers").tabulator({
                layout:"fitColumns",
                columns:[
                    {title:"Voornaam", field:"firstName", headerFilter:"input"},
                    {title:"Tussenvoegsel", field:"lastNamePrefix", headerFilter:"input"},
                    {title:"Achternaam", field:"lastName", headerFilter:"input"},
                    {title:"Account", field:"accountId.username", headerFilter:"input"}
                ],
                rowClick:function(e, row){
                    // TODO moet edit functie worden!
                    $("#newCustomer").show();
                }
            });
            $("#customers").tabulator("setData", data);
        }       
    });   
}

function addCustomer() {
    $("#newCustomer").show();
}

$(document).on("submit", "form#newCustomer", function(event) {
    event.preventDefault();
    var customer = {"firstName":$("#firstName").val(),
        "lastNamePrefix":$("#lastNamePrefix").val(),
        "lastName":$("#lastName").val()        
    };
    console.log(customer.firstName);
    var customerJson = JSON.stringify(customer);
    console.log(customerJson);
    createCustomer(customerJson);
});

function createCustomer(customer) {
    $.ajax({
        url:baseURL + "/customer",
        method: "POST",
        data: customer,
        contentType: "application/json",
        error: function() {
            console.log("Error in function createCustomer");
        },
        success: function() {
//            window.location.href=baseURL + "/customer";
        }
    });
}

