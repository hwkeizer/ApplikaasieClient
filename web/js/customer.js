/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var baseURL = "http://localhost:8080/Workshop3/webresources";
var test;

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
                    $(function () {
                        var input_values = {
                            'id' : row.getData().id,
                            'accountId' : row.getData().accountId.id,
                            'firstName' : row.getData().firstName,
                            'lastNamePrefix' : row.getData().lastNamePrefix,
                            'lastName'   : row.getData().lastName,
                            'remove' : "Klant verwijderen",
                            'edit' : "Klant wijzigen"                            
                        };                        
                        $('#editCustomer').find('input').val(function () {
                            return input_values[this.id];
                        });
                    });
                    $("#editCustomer").show();                   
                }
            });
            $("#customers").tabulator("setData", data);
        }       
    });   
}

function addCustomer() {
    $("#newCustomer").show();
}

// Process the forms
$(document).on("click", ":submit", function(event) {
    event.preventDefault();
    let customer;
    switch($(this).val()) {
        case "Klant wijzigen":
            console.log("TESTEN WIJZIGEN KLANT voor aanroep findAccountById");            
            console.log("Account id is: " + $("#editCustomer #accountId").val());
            if ($("#editCustomer #accountId").val() !== '') {            
                window.fetch(baseURL + "/account/" + $("#editCustomer #accountId").val(), {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                }).then(response => {
                    console.log("content response header: " + response.headers.get("content-type"));
                    return response.json();
                }).then(account => {
                    console.log("TESTEN WIJZIGEN KLANT na window.fetch aanroep");
                    console.log("Account: " + JSON.stringify(account));
                    customer = {
                        "id": $("#editCustomer #id").val(),
                        "accountId": account,
                        "firstName":$("#editCustomer #firstName").val(),
                        "lastNamePrefix":$("#editCustomer #lastNamePrefix").val(),
                        "lastName":$("#editCustomer #lastName").val()
                    };
                    let customerJson = JSON.stringify(customer);
                    console.log("ID: " + $("#editCustomer #id").val() + " JSON: " + customerJson);
                    editCustomer($("#editCustomer #id").val(), customerJson);
                }).catch((error) => {
                    console.log("error " + error);
                });                
            } else {
                // Customer has no account so it should not get updated
                customer = {
                    "id": $("#editCustomer #id").val(),
                    "firstName":$("#editCustomer #firstName").val(),
                    "lastNamePrefix":$("#editCustomer #lastNamePrefix").val(),
                    "lastName":$("#editCustomer #lastName").val()
                    };
                let customerJson = JSON.stringify(customer);
                console.log("ID: " + $("#editCustomer #id").val() + " JSON: " + customerJson);
                editCustomer($("#editCustomer #id").val(), customerJson);
            }
            break;
        case "Klant verwijderen":
            deleteCustomer($("#editCustomer #id").val());
            break;
        case "Klant toevoegen":
            customer = {"firstName":$("#newCustomer #firstName").val(),
                    "lastNamePrefix":$("#newCustomer #lastNamePrefix").val(),
                    "lastName":$("#newCustomer #lastName").val()        
             };
            var customerJson = JSON.stringify(customer);
            console.log(customerJson);
            createCustomer(customerJson);
            break;
    } 
});

function editCustomer(customerId, customer) {
    $.ajax({
        url:baseURL + "/customer/" + customerId,
        method: "PUT",
        data: customer,
        contentType: "application/json",
        error: function() {
            alert("Error in function editCustomer");
        },
        success: function() {
            window.location.href="http://localhost:8080/customer.html#";
            location.reload();
            
        }
    });
}

function deleteCustomer(customerId) {
    $.ajax({
        url:baseURL + "/customer/" + customerId,
        method: "DELETE",
        contentType: "application/json",
        error: function() {
            console.log("Error in function deleteCustomer");
        },
        success: function() {
            window.location.href="http://localhost:8080/customer.html#";
            location.reload();
            
        }
    });
}

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
            window.location.href="http://localhost:8080/customer.html#";
            location.reload();
            
        }
    });
}

