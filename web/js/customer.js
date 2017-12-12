/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var baseURL = "http://localhost:8080/Workshop3/webresources";
let selectedCustomer = null;
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
    $("#removeCustomer").click(function(){
        removeCustomer();
    });
    $("#removeFactuurAddress").click(function(){
        removeFactuurAddress();
    });
    $("#removeBezorgAddress").click(function(){
        removeBezorgAddress();
    });
    $("#addAddress").click(function(){
        showNewAddressForm();
    });
    
    // Validation for forms
    jQuery.validator.setDefaults({
        errorPlacement: function(error, element) {
            error.appendTo(element.next());
        }
    });   
    validateAll();
    
});

function getCustomerValidationObject() {
    let customerValidationObject = {};
    customerValidationObject.rules = {
        firstName: {
            required: true,
            maxlength: 16
        },
        lastName: {
            required: true,
            maxlength: 16
        },
        email: {
            required: true,
            email: true
        }
    };
    customerValidationObject.messages = {
        firstName: {
            maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
            required: 'Dit veld is vereist'
        },
        lastName: {
            maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
            required: 'Dit veld is vereist'
        },
        email: {
            required: 'Dit veld is inderdaad vereist',
            email: 'Geef een geldig email adres'
        }
    };
    return customerValidationObject;
}

function getAddressValidationObject() {
    let addressValidationObject = {};
    addressValidationObject.rules = {
        streetname: {
            required: true,
            maxlength: 16
        },
        number: {
            required: true,
            maxlength: 16
        },
        addition: {
            required: false,
            maxlength: 16
        },
        city: {
            required: true,
            maxlength: 16
        },
        postalcode: {
            required: true,
            maxlength: 16
        }
    };
    addressValidationObject.messages = {
        streetname: {
            maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
            required: 'Dit veld is vereist'
        },
        number: {
            maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
            required: 'Dit veld is vereist'
        },
        addition: {
            maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
            required: 'Dit veld is vereist'
        },
        city: {
            maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
            required: 'Dit veld is vereist'
        }, 
        postalcode: {
            required: 'Dit veld is vereist',
            email: 'Geef een geldige postcode'
        }
    };
    return addressValidationObject;
}

function validateAll() {
    let formNames = [
        "customerDetails", 
        "newCustomer",
        "postAddress",
        "factuurAddress",
        "bezorgAddress",
        "newAddress"
    ];
    for (let formName of formNames) {
        let validationObject;
        // Get the correct validation properties for the form
        switch (formName) {
            case "customerDetails" : {
                validationObject = getCustomerValidationObject();
                validationObject.submitHandler = function(form) {changeCustomer();};
                break;
            }
            case "newCustomer" : {
                validationObject = getCustomerValidationObject();
                validationObject.submitHandler = function(form) {addCustomer();}; 
                break;
            }
            case "newAddress" : {
                validationObject = getAddressValidationObject();
                validationObject.submitHandler = function(form) {addNewAddress();};
                break;
            }
            case "postAddress" : {
                validationObject = getAddressValidationObject();
                validationObject.submitHandler = function(form) {changePostAddress();};
                break;
            }
            case "factuurAddress" : {
                validationObject = getAddressValidationObject();
                validationObject.submitHandler = function(form) {changeFactuurAddress();};
                break;
            }
            case "bezorgAddress" : {
                validationObject = getAddressValidationObject();
                validationObject.submitHandler = function(form) {changeBezorgAddress();};
                break;
            }              
        } 
        // Validate and submit the form if valide
        $("form[id=\"" + formName + "\"]").validate(validationObject);
    }
}

function changeCustomer() {
    let customer;
    if (selectedCustomer.account !== undefined) {
        window.fetch(baseURL + "/account/" + selectedCustomer.account, {
            method: "GET",
            credentials: 'include',
            contentType: "application/json",
            headers: {
                "Accept": "application/json",
                "x-requested-with": "XMLHttpRequest"
            }
        }).then(response => {
            console.log("content response header: " + response.headers.get("content-type"));
            return response.json();
        }).then(account => {
            // If email is changed the account username will change accordingly
            if (account.username !== $("#cd_email").val()) {
                account = {
                    "id":account.id,
                    "username":$("#cd_email").val(),
                    "password":account.password,
                    "accountType":account.accountType
                };
            } 
            customer = {
                "id": selectedCustomer.id,
                "account": account,
                "firstName":$("#cd_firstName").val(),
                "lastNamePrefix":$("#cd_lastNamePrefix").val(),
                "lastName":$("#cd_lastName").val(),
                "email":$("#cd_email").val()
            }; 
            editCustomer(selectedCustomer.id, customer);              
        }).catch((error) => {
            console.log("error " + error);
        });                
    } else { // should not happen since every customer should have an account
        // Customer has no account so it should not get updated
        customer = {
            "id": selectedCustomer.id,
            "firstName":$("#cd_firstName").val(),
            "lastNamePrefix":$("#cd_lastNamePrefix").val(),
            "lastName":$("#cd_lastName").val(),
            "email":$("#cd_email").val()
            };
        editCustomer(selectedCustomer.id, customer);
    }
}

function addCustomer() {
    let account = {"username":$("#nc_email").val(),
            "password":generatePassword(),
            "accountType":"KLANT"};
    let customer = {"firstName":$("#nc_firstName").val(),
            "lastNamePrefix":$("#nc_lastNamePrefix").val(),
            "lastName":$("#nc_lastName").val(),
            "email":$("#nc_email").val(),
            "account":account
    };
    createCustomer(customer);
    $("#newCustomer")[0].reset();
}

function removeCustomer() {
    if (postAddress !== null) {
        deleteAddress(postAddress.id);
    }
    removeFactuurAddress();
    removeBezorgAddress();
    deleteCustomer(selectedCustomer.id);
    deleteAccount(selectedCustomer.account);
}


function showAllCustomers() {
    $.ajax({
        url:baseURL + "/customer",
        method: "GET",
        contentType: "application/json",
//        dataType: "json",
        error: function() {
            console.log("Error in function showAllCustomers");
        },
        success: function(data, textStatus, request) {
            if (request.getResponseHeader('REQUIRES_AUTH') === '1'){ 
                window.location.href = 'http://localhost:8080/login.html';
            } else {
                $("#customers").tabulator({
                    layout:"fitColumns",
                    columns:[
                        {title:"Voornaam", field:"firstName", headerFilter:"input"},
                        {title:"Tussenvoegsel", field:"lastNamePrefix", headerFilter:"input"},
                        {title:"Achternaam", field:"lastName", headerFilter:"input"},
                        {title:"Email", field:"email", headerFilter:"input"},
                        {title:"Account", field:"account.username", headerFilter:"input"}
                    ],
                    rowClick:function(e, row){
                        resetAllForms();
                        $(function () {
                            selectedCustomer = {
                                'id' : row.getData().id,
                                'account' : row.getData().account.id,
                                'firstName' : row.getData().firstName,
                                'lastNamePrefix' : row.getData().lastNamePrefix,
                                'lastName' : row.getData().lastName,
                                'email' : row.getData().email
                            };   
                            showCustomerDetails();
                            showCustomerAddresses(selectedCustomer.id);                        
                        });
                        $("#buttons").hide();
                        $(".edit_instruction").hide();
                        $("#newCustomer").hide();
                        $("#customerDetails").show();                   
                    }
                });
                $("#customers").tabulator("setData", data);
            }
        }       
    });   
}

function showCustomerDetails() {
    $('#customerDetails').find('#cd_firstName').val(selectedCustomer.firstName);
    $('#customerDetails').find('#cd_lastNamePrefix').val(selectedCustomer.lastNamePrefix);
    $('#customerDetails').find('#cd_lastName').val(selectedCustomer.lastName);
    $('#customerDetails').find('#cd_email').val(selectedCustomer.email);
}

function showCustomerAddresses(customerId) {
    $.ajax({
        url:baseURL + "/customer/" + customerId + "/addresses",
        method: "GET",
        dataType: "json",
        error: function() {
            console.log("Error in function showAddressesCustomer");
        },
        success: function(data) {
            // No address found, show a new address form
            if (data.length === 0) {
                showNewAddressForm();
            }
            if (data.length === 3) {
                $(".addAddress").hide();
            } else {
                $(".addAddress").show();
            }
            for (i=0; i<data.length; i++) {
                switch (data[i].addressType) {
                    case "POSTADRES": {
                        postAddress = data[i]; // save postAddress globally
                        $('#postAddress').find('#pa_streetname').val(data[i].streetname);
                        $('#postAddress').find('#pa_number').val(data[i].number);
                        $('#postAddress').find('#pa_addition').val(data[i].addition);
                        $('#postAddress').find('#pa_city').val(data[i].city);
                        $('#postAddress').find('#pa_postalcode').val(data[i].postalcode);
                        $("#postAddress").show();
                        break;
                    }
                    case "FACTUURADRES": {
                        factuurAddress = data[i]; // save factuurAddress globally
                        $('#factuurAddress').find('#fa_streetname').val(data[i].streetname);
                        $('#factuurAddress').find('#fa_number').val(data[i].number);
                        $('#factuurAddress').find('#fa_addition').val(data[i].addition);
                        $('#factuurAddress').find('#fa_city').val(data[i].city);
                        $('#factuurAddress').find('#fa_postalcode').val(data[i].postalcode);
                        $("#factuurAddress").show();
                        break;
                    }
                    case "BEZORGADRES": {
                        bezorgAddress = data[i]; // save bezorgAddress globally
                        $('#bezorgAddress').find('#ba_streetname').val(data[i].streetname);
                        $('#bezorgAddress').find('#ba_number').val(data[i].number);
                        $('#bezorgAddress').find('#ba_addition').val(data[i].addition);
                        $('#bezorgAddress').find('#ba_city').val(data[i].city);
                        $('#bezorgAddress').find('#ba_postalcode').val(data[i].postalcode);
                        $("#bezorgAddress").show(); 
                        break;                            
                    }
                }                                        
            }
        }
    });
}

function changePostAddress() {
    postAddress.streetname = $('#postAddress').find('#pa_streetname').val();
    postAddress.number = $('#postAddress').find('#pa_number').val();
    postAddress.addition = $('#postAddress').find('#pa_addition').val();
    postAddress.city = $('#postAddress').find('#pa_city').val();
    postAddress.postalcode = $('#postAddress').find('#pa_postalcode').val();
    editAddress(postAddress.id, postAddress);
}

function changeFactuurAddress() {
    factuurAddress.streetname = $('#factuurAddress').find('#fa_streetname').val();
    factuurAddress.number = $('#factuurAddress').find('#fa_number').val();
    factuurAddress.addition = $('#factuurAddress').find('#fa_addition').val();
    factuurAddress.city = $('#factuurAddress').find('#fa_city').val();
    factuurAddress.postalcode = $('#factuurAddress').find('#fa_postalcode').val();
    editAddress(factuurAddress.id, factuurAddress);
}

function changeBezorgAddress() {
    bezorgAddress.streetname = $('#bezorgAddress').find('#ba_streetname').val();
    bezorgAddress.number = $('#bezorgAddress').find('#ba_number').val();
    bezorgAddress.addition = $('#bezorgAddress').find('#ba_addition').val();
    bezorgAddress.city = $('#bezorgAddress').find('#ba_city').val();
    bezorgAddress.postalcode = $('#bezorgAddress').find('#ba_postalcode').val();
    editAddress(bezorgAddress.id, bezorgAddress);
}

function removeFactuurAddress() {
    if (factuurAddress !== null) {
        deleteAddress(factuurAddress.id);
    }
}  

function removeBezorgAddress() {
    if (bezorgAddress !== null) {
        deleteAddress(bezorgAddress.id);
    }
}

function showNewAddressForm() {
        if (postAddress === null) {addressTypes = ['POSTADRES'];}
        else if (factuurAddress !== null) {addressTypes = ['BEZORGADRES'];}
        else if (bezorgAddress !== null) {addressTypes = ['FACTUURADRES'];}
        else addressTypes = ['FACTUURADRES', 'BEZORGADRES'];
        var list = document.getElementById("addressTypes");
        // Remove previously added elements
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        addressTypes.forEach(function(item) {
            var option = document.createElement('option');
            option.value = item;
            list.appendChild(option);
        });
        $("#newAddress").show();
//    }
}

function addNewAddress() {
    address = {"addressType":$('#newAddress').find('#na_addressType').val(),
                "streetname":$('#newAddress').find('#na_streetname').val(),
                "number":$('#newAddress').find('#na_number').val(),
                "addition":$('#newAddress').find('#na_addition').val(),
                "city":$('#newAddress').find('#na_city').val(),
                "postalcode":$('#newAddress').find('#na_postalcode').val(),
                "customer": selectedCustomer
         };
        addAddress(address);
}

// Reset all forms and global vars when a (different) customer is selected
function resetAllForms() {
    // hide all forms to start with
    $("#postAddress").hide();
    $("#factuurAddress").hide();
    $("#bezorgAddress").hide();
    $("#newAddress").hide();
    $("#newAddress")[0].reset();
    postAddress = null;
    factuurAddress = null;
    bezorgAddress = null;
    selectedCustomer = null;
}

function generatePassword() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

//************************
//**  Backend requests  **
//************************

// Send change customer request to the backend
function editCustomer(customerId, customer) {
    $.ajax({
        url:baseURL + "/customer/" + customerId,
        method: "PUT",
        data: JSON.stringify(customer),
        contentType: "application/json",
        error: function() {
            console.log("Error in function editCustomer");
        },
        success: function() {
            window.location.href="http://localhost:8080/customer.html#";
            location.reload();
            
        }
    });
}

// Send change account request to the backend
function editAccount(accountId, account) {
    $.ajax({
        url:baseURL + "/account/" + accountId,
        method: "PUT",
        data: JSON.stringify(account),
        contentType: "application/json",
        error: function() {
            console.log("Error in function editAccount");
        },
        success: function() {
            window.location.href="http://localhost:8080/customer.html#";
            location.reload();
            
        }
    });
}

// Send delete customer request to the backend
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

// Send new customer request to the backend
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

// Send change address request to the backend
function editAddress(addressId, address) {
    $.ajax({
        url:baseURL + "/address/" + addressId,
        method: "PUT",
        data: JSON.stringify(address),
        contentType: "application/json",
        error: function() {
            console.log("Error in function editAddress");
        },
        success: function() {
            window.location.href="http://localhost:8080/customer.html#";
            location.reload();
            
        }
    });
}

// Send new address request to the backend
function addAddress(address) {
    $.ajax({
        url:baseURL + "/address",
        method: "POST",
        data: JSON.stringify(address),
        contentType: "application/json",
        error: function() {
            console.log("Error in function addAddress");
        },
        success: function() {
            window.location.href="http://localhost:8080/customer.html#";
            location.reload();
            
        }
    });
}

// Send remove address to the backend
function deleteAddress(addressId) {
    $.ajax({
        url:baseURL + "/address/" + addressId,
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

// Send delete account to the backend
function deleteAccount(accountId) {
    $.ajax({
        url:baseURL + "/account/" + accountId,
        method: "DELETE",
        contentType: "application/json",
        error: function() {
            console.log("Error in function deleteAccount");
        },
        success: function() {
            window.location.href="http://localhost:8080/customer.html#";
            location.reload();            
        }
    });
}
