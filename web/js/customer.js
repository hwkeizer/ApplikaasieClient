/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const baseURL = "http://localhost:8080/Workshop3/webresources";
let selectedCustomer;
let postAddress = null;
let factuurAddress = null;
let bezorgAddress = null;

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
                    $("#newAddress").hide();
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
                        $('#customerDetails').find('#firstName').val(selectedCustomer.firstName);
                        $('#customerDetails').find('#lastNamePrefix').val(selectedCustomer.lastNamePrefix);
                        $('#customerDetails').find('#lastName').val(selectedCustomer.lastName);
                        $('#customerDetails').find('#email').val(selectedCustomer.email);
                    });
                    $("#buttons").hide();
                    $(".edit_instruction").hide();
                    $("#newCustomer").hide();
                    $("#customerDetails").show();                   
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
            console.log("In Klant wijzigen");
            if (selectedCustomer.account !== undefined) {            
                window.fetch(baseURL + "/account/" + selectedCustomer.account, {
                    method: "GET",
                    credentials: 'include',
                    headers: {
                        "Accept": "application/json",
                        "x-requested-with": "XMLHttpRequest"
                    }
                }).then(response => {
                    console.log("content response header: " + response.headers.get("content-type"));
                    return response.json();
                }).then(account => {
                    console.log("Selected Customer Account is: " + JSON.stringify(account));
                    customer = {
                        "id": selectedCustomer.id,
                        "account": account,
                        "firstName":$("#customerDetails #firstName").val(),
                        "lastNamePrefix":$("#customerDetails #lastNamePrefix").val(),
                        "lastName":$("#customerDetails #lastName").val(),
                        "email":$("#customerDetails #email").val()
                    };
                    editCustomer(selectedCustomer.id, customer);
                }).catch((error) => {
                    console.log("error " + error);
                });                
            } else {
                // Customer has no account so it should not get updated
                customer = {
                    "id": selectedCustomer.id,
                    "firstName":$("#customerDetails #firstName").val(),
                    "lastNamePrefix":$("#customerDetails #lastNamePrefix").val(),
                    "lastName":$("#customerDetails #lastName").val(),
                    "email":$("#customerDetails #email").val()
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
        case "Postadres wijzigen": changePostAddress(); break;
        case "Factuuradres wijzigen": changeFactuurAddress(); break;
        case "Bezorgadres wijzigen": changeBezorgAddress(); break;
        case "Adres toevoegen": addAddressPreparation(); break;
        case "Adres bevestigen" : addNewAddress(); break;
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
            alert("Error in function showAddressesCustomer");
        },
        success: function(data) {
            // No address found, show an empty postAddress form
            if (data.length === 0) {
                $("#postAddress")[0].reset();
                postAddress = null; // clear the global variable
                $(".postaddress").hide(); // hide the button to change postaddress (because we don't have one)
                $("#postAddress").show();
            }
            // If we have three addresses no more addresses can be added so hide the button
            if (data.length === 3) {
                $(".addaddress").hide();
            } else {
                $(".addaddress").show();
            }
            for (i=0; i<data.length; i++) {
                switch (data[i].addressType) {
                    case "POSTADRES": {
                        $(".postaddress").show(); // we have a postaddress so show the change postaddress button
                        postAddress = data[i]; // save postAddress globally
                        $('#postAddress').find('#p_streetname').val(data[i].streetname);
                        $('#postAddress').find('#p_number').val(data[i].number);
                        $('#postAddress').find('#p_addition').val(data[i].addition);
                        $('#postAddress').find('#p_city').val(data[i].city);
                        $('#postAddress').find('#p_postalcode').val(data[i].postalcode);
                        $("#postAddress").show();
                        break;
                    }
                    case "FACTUURADRES": {
                        factuurAddress = data[i]; // save factuurAddress globally
                        $('#factuurAddress').find('#f_streetname').val(data[i].streetname);
                        $('#factuurAddress').find('#f_number').val(data[i].number);
                        $('#factuurAddress').find('#f_addition').val(data[i].addition);
                        $('#factuurAddress').find('#f_city').val(data[i].city);
                        $('#factuurAddress').find('#f_postalcode').val(data[i].postalcode);
                        $("#factuurAddress").show();
                        break;
                    }
                    case "BEZORGADRES": {
                        bezorgAddress = data[i]; // save bezorgAddress globally
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

function changePostAddress() {
    postAddress.streetname = $('#postAddress').find('#p_streetname').val();
    postAddress.number = $('#postAddress').find('#p_number').val();
    postAddress.addition = $('#postAddress').find('#p_addition').val();
    postAddress.city = $('#postAddress').find('#p_city').val();
    postAddress.postalcode = $('#postAddress').find('#p_postalcode').val();
    editAddress(postAddress.id, postAddress);
}

function changeFactuurAddress() {
    factuurAddress.streetname = $('#factuurAddress').find('#f_streetname').val();
    factuurAddress.number = $('#factuurAddress').find('#f_number').val();
    factuurAddress.addition = $('#factuurAddress').find('#f_addition').val();
    factuurAddress.city = $('#factuurAddress').find('#f_city').val();
    factuurAddress.postalcode = $('#factuurAddress').find('#f_postalcode').val();
    editAddress(factuurAddress.id, factuurAddress);
}

function changeBezorgAddress() {
    bezorgAddress.streetname = $('#bezorgAddress').find('#b_streetname').val();
    bezorgAddress.number = $('#bezorgAddress').find('#b_number').val();
    bezorgAddress.addition = $('#bezorgAddress').find('#b_addition').val();
    bezorgAddress.city = $('#bezorgAddress').find('#b_city').val();
    bezorgAddress.postalcode = $('#bezorgAddress').find('#b_postalcode').val();
    editAddress(bezorgAddress.id, bezorgAddress);
}


function editAddress(addressId, address) {
    $.ajax({
        url:baseURL + "/address/" + addressId,
        method: "PUT",
        data: JSON.stringify(address),
        contentType: "application/json",
        error: function() {
            alert("Error in function editAddress");
        },
        success: function() {
            window.location.href="http://localhost:8080/customer.html#";
            location.reload();
            
        }
    });
}

function addAddress(address) {
    $.ajax({
        url:baseURL + "/address",
        method: "POST",
        data: JSON.stringify(address),
        contentType: "application/json",
        error: function() {
            alert("Error in function addAddress");
        },
        success: function() {
            window.location.href="http://localhost:8080/customer.html#";
            location.reload();
            
        }
    });
}

function addAddressPreparation() {
    // If there is no postAddress this address will be the postAddress
    if (postAddress === null) {
        address = {"addressType": "POSTADRES",
                    "streetname":$('#postAddress').find('#p_streetname').val(),
                    "number":$('#postAddress').find('#p_number').val(),
                    "addition":$('#postAddress').find('#p_addition').val(),
                    "city":$('#postAddress').find('#p_city').val(),
                    "postalcode":$('#postAddress').find('#p_postalcode').val(),
                    "customer": selectedCustomer
             };
        alert(JSON.stringify(address))
        addAddress(address);
    } else {
        if (factuurAddress !== null) {addressTypes = ['BEZORGADRES'];}
        else if (bezorgAddress !== null) {addressTypes = ['FACTUURADRES'];}
        else addressTypes = ['FACTUURADRES', 'BEZORGADRES'];
        var list = document.getElementById("addressTypes");
        addressTypes.forEach(function(item) {
            var option = document.createElement('option');
            option.value = item;
            list.appendChild(option);
        });
        $("#newAddress").show();
    }
}

function addNewAddress() {
    address = {"addressType":$('#newAddress').find('#n_addressType').val(),
                "streetname":$('#newAddress').find('#n_streetname').val(),
                "number":$('#newAddress').find('#n_number').val(),
                "addition":$('#newAddress').find('#n_addition').val(),
                "city":$('#newAddress').find('#n_city').val(),
                "postalcode":$('#newAddress').find('#n_postalcode').val(),
                "customer": selectedCustomer
         };
        alert(JSON.stringify(address))
        addAddress(address);
}