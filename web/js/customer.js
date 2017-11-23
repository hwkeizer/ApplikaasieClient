/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const baseURL = "http://localhost:8080/Workshop3/webresources";
let selectedCustomer;

$(document).ready(function(){
    showAllCustomers();
    $("#addCustomer").click(function(){
        $("#buttons").hide();
        $("#newCustomer").show();
    });
    $("#editCustomer").click(function(){
        $(".edit_instruction").show();
    });
});

function showAllCustomers() {
    $.ajax({
        url:baseURL + "/customer",
        method: "GET",
        dataType: "json",
        error: function() {
            console.log("Error in function showAllCustomers");
        },
        success: function(data, textStatus, request) {
            if (request.getResponseHeader('REQUIRES_AUTH') === '1'){ 
                window.location.href = 'http://localhost:8080/login.html';
            }
            console.log(data)
            $("#customers").tabulator({
                layout:"fitColumns",
                columns:[
                    {title:"Voornaam", field:"firstName", headerFilter:"input"},
                    {title:"Tussenvoegsel", field:"lastNamePrefix", headerFilter:"input"},
                    {title:"Achternaam", field:"lastName", headerFilter:"input"},
                    {title:"Email", field:"email", headerFilter:"input"},
                    {title:"Account", field:"account.username", headerFilter:"input"},
                ],
                rowClick:function(e, row){
                    // hide all forms to start with
                    $("#postAddress").hide();
                    $("#factuurAddress").hide();
                    $("#bezorgAddress").hide();
                    $(function () {
                        selectedCustomer = {
                            'id' : row.getData().id,
                            'account' : row.getData().account.id,
                            'firstName' : row.getData().firstName,
                            'lastNamePrefix' : row.getData().lastNamePrefix,
                            'lastName' : row.getData().lastName,
                            'email' : row.getData().email
                        };                        
                        showAddressesCustomer(selectedCustomer.id);                        
                        $('#editOrRemoveCustomer').find('#firstName').val(selectedCustomer.firstName);
                        $('#editOrRemoveCustomer').find('#lastNamePrefix').val(selectedCustomer.lastNamePrefix);
                        $('#editOrRemoveCustomer').find('#lastName').val(selectedCustomer.lastName);
                        $('#editOrRemoveCustomer').find('#email').val(selectedCustomer.email);
                    });
                    $("#buttons").hide();
                    $(".edit_instruction").hide();
                    $("#newCustomer").hide();
                    $("#editOrRemoveCustomer").show();                   
                }
            });
            $("#customers").tabulator("setData", data);
        }       
    });   
}

// Process the forms
$(document).on("click", ":submit", function(event) {
    event.preventDefault();
    let customer;
    switch($(this).val()) {
        case "Klant wijzigen":           
            if (selectedCustomer.account !== undefined) {            
                window.fetch(baseURL + "/account/" + selectedCustomer.account, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                }).then(response => {
                    console.log("content response header: " + response.headers.get("content-type"));
                    return response.json();
                }).then(account => {
                    console.log("Selected Customer Account is: " + JSON.stringify(account));
                    customer = {
                        "id": selectedCustomer.id,
                        "account": account,
                        "firstName":$("#editOrRemoveCustomer #firstName").val(),
                        "lastNamePrefix":$("#editOrRemoveCustomer #lastNamePrefix").val(),
                        "lastName":$("#editOrRemoveCustomer #lastName").val(),
                        "email":$("#editOrRemoveCustomer #email").val()
                    };
                    editCustomer(selectedCustomer.id, customer);
                }).catch((error) => {
                    console.log("error " + error);
                });                
            } else {
                // Customer has no account so it should not get updated
                customer = {
                    "id": selectedCustomer.id,
                    "firstName":$("#editOrRemoveCustomer #firstName").val(),
                    "lastNamePrefix":$("#editOrRemoveCustomer #lastNamePrefix").val(),
                    "lastName":$("#editOrRemoveCustomer #lastName").val(),
                    "email":$("#editOrRemoveCustomer #email").val()
                    };
                editCustomer(selectedCustomer.id, customer);
            }
            break;
        case "Klant verwijderen":
            deleteCustomer(selectedCustomer.id);
            break;
        case "Klant toevoegen":
            customer = {"firstName":$("#newCustomer #firstName").val(),
                    "lastNamePrefix":$("#newCustomer #lastNamePrefix").val(),
                    "lastName":$("#newCustomer #lastName").val(),
                    "email":$("#newCustomer #email").val()
             };
            createCustomer(customer);
            break;
    } 
});

function editCustomer(customerId, customer) {
    $.ajax({
        url:baseURL + "/customer/" + customerId,
        method: "PUT",
        data: JSON.stringify(customer),
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
    console.log(customer);
    $.ajax({
        url:baseURL + "/customer",
        method: "POST",
        data: JSON.stringify(customer),
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

function showAddressesCustomer(customerId) {
        $.ajax({
            url:baseURL + "/customer/" + customerId + "/addresses",
            method: "GET",
            dataType: "json",
            error: function() {
                alert("Error in function showAllCustomers");
            },
            success: function(data) {
                for (i=0; i<data.length; i++) {
                    switch (data[i].addressType) {
                        case "POSTADRES": {                                
                            $('#postAddress').find('#p_streetname').val(data[i].streetname);
                            $('#postAddress').find('#p_number').val(data[i].number);
                            $('#postAddress').find('#p_addition').val(data[i].addition);
                            $('#postAddress').find('#p_city').val(data[i].city);
                            $('#postAddress').find('#p_postalcode').val(data[i].postalcode);
                            $("#postAddress").show();
                            break;
                        }
                        case "FACTUURADRES": {
                            $('#factuurAddress').find('#f_streetname').val(data[i].streetname);
                            $('#factuurAddress').find('#f_number').val(data[i].number);
                            $('#factuurAddress').find('#f_addition').val(data[i].addition);
                            $('#factuurAddress').find('#f_city').val(data[i].city);
                            $('#factuurAddress').find('#f_postalcode').val(data[i].postalcode);
                            $("#factuurAddress").show();                                
                            break;
                        }
                        case "BEZORGADRES": {
                            $('#bezorgAddress').find('#b_streetname').val(data[i].streetname);
                            $('#bezorgAddress').find('#b_number').val(data[i].number);
                            $('#bezorgAddress').find('#b_addition').val(data[i].addition);
                            $('#bezorgAddress').find('#b_city').val(data[i].city);
                            $('#bezorgAddress').find('#b_postalcode').val(data[i].postalcode);
                            $("#bezorgAddress").show();                                
                            break;                            
                        }
                    }                                        
                }
            }
        });
}