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
    $.validator.addMethod('postcode', function (value) { 
    return /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(value); 
}, 'Geef aub een geldige postcode');
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
        addressType: {
            required: true
        },
        streetname: {
            required: true,
            maxlength: 16
        },
        number: {
            required: true,
            digits: true,
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
            postcode: true
        }
    };
    addressValidationObject.messages = {
        addressType: {
            required: 'Dit veld is vereist'
        },
        streetname: {
            maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
            required: 'Dit veld is vereist'
        },
        number: {
            maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
            digits: 'Dit veld mag alleen cijfers bevatten',
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
                validationObject.submitHandler = (form) => changeCustomer(form);
                break;
            }
            case "newCustomer" : {
                validationObject = getCustomerValidationObject();
                validationObject.submitHandler = (form) => addCustomer(form); 
                break;
            }
            case "newAddress" : {
                validationObject = getAddressValidationObject();
                validationObject.submitHandler = (form) => addNewAddress(form);
                break;
            }
            case "postAddress" : {
                validationObject = getAddressValidationObject();
                validationObject.submitHandler = (form) => changePostAddress(form);
                break;
            }
            case "factuurAddress" : {
                validationObject = getAddressValidationObject();
                validationObject.submitHandler = (form) => changeFactuurAddress(form);
                break;
            }
            case "bezorgAddress" : {
                validationObject = getAddressValidationObject();
                validationObject.submitHandler = (form) => changeBezorgAddress(form);
                break;
            }              
        } 
        // Validate and submit the form if valide
        $("form[id=\"" + formName + "\"]").validate(validationObject);
    }
}

function changeCustomer(form) {
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
            if (account.username !== form["email"].value) {
                account = {
                    "id":account.id,
                    "username":form["email"].value,
                    "password":account.password,
                    "accountType":account.accountType
                };
            } 
            customer = {
                "id": selectedCustomer.id,
                "account": account,
                "firstName":form["firstName"].value,
                "lastNamePrefix":form["lastNamePrefix"].value,
                "lastName":form["lastName"].value,
                "email":form["email"].value
            }; 
            editCustomer(selectedCustomer.id, customer);              
        }).catch((error) => {
            console.log("error " + error);
        });                
    } else { // should not happen since every customer should have an account
        // Customer has no account so it should not get updated
        customer = {
            "id": selectedCustomer.id,
            "firstName":form["firstName"].value,
            "lastNamePrefix":form["lastNamePrefix"].value,
            "lastName":form["lastName"].value,
            "email":form["email"].value
            };
        editCustomer(selectedCustomer.id, customer);
    }
}

function addCustomer(form) {
    let account = {"username":form["email"].value,
            "password":generatePassword(),
            "accountType":"KLANT"};
    let customer = {"firstName":form["firstName"].value,
            "lastNamePrefix":form["lastNamePrefix"].value,
            "lastName":form["lastName"].value,
            "email":form["email"].value,
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
    $('#customerDetails').find("[name='firstName']").val(selectedCustomer.firstName);
    $('#customerDetails').find("[name='lastNamePrefix']").val(selectedCustomer.lastNamePrefix);
    $('#customerDetails').find("[name='lastName']").val(selectedCustomer.lastName);
    $('#customerDetails').find("[name='email']").val(selectedCustomer.email);
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
                        $('#postAddress').find("[name='streetname']").val(data[i].streetname);
                        $('#postAddress').find("[name='number']").val(data[i].number);
                        $('#postAddress').find("[name='addition']").val(data[i].addition);
                        $('#postAddress').find("[name='city']").val(data[i].city);
                        $('#postAddress').find("[name='postalcode']").val(data[i].postalcode);
                        $("#postAddress").show();
                        break;
                    }
                    case "FACTUURADRES": {
                        factuurAddress = data[i]; // save factuurAddress globally
                        $('#factuurAddress').find("[name='streetname']").val(data[i].streetname);
                        $('#factuurAddress').find("[name='number']").val(data[i].number);
                        $('#factuurAddress').find("[name='addition']").val(data[i].addition);
                        $('#factuurAddress').find("[name='city']").val(data[i].city);
                        $('#factuurAddress').find("[name='postalcode']").val(data[i].postalcode);
                        $("#factuurAddress").show();
                        break;
                    }
                    case "BEZORGADRES": {
                        bezorgAddress = data[i]; // save bezorgAddress globally
                        $('#bezorgAddress').find("[name='streetname']").val(data[i].streetname);
                        $('#bezorgAddress').find("[name='number']").val(data[i].number);
                        $('#bezorgAddress').find("[name='addition']").val(data[i].addition);
                        $('#bezorgAddress').find("[name='city']").val(data[i].city);
                        $('#bezorgAddress').find("[name='postalcode']").val(data[i].postalcode);
                        $("#bezorgAddress").show(); 
                        break;                            
                    }
                }                                        
            }
        }
    });
}

function changePostAddress(form) {
    postAddress.streetname = form["streetname"].value;
    postAddress.number = form["number"].value;
    postAddress.addition = form["addition"].value;
    postAddress.city = form["city"].value;
    postAddress.postalcode = form["postalcode"].value;
    editAddress(postAddress.id, postAddress);
}

function changeFactuurAddress(form) {
    factuurAddress.streetname = form["streetname"].value;
    factuurAddress.number = form["number"].value;
    factuurAddress.addition = form["addition"].value;
    factuurAddress.city = form["city"].value;
    factuurAddress.postalcode = form["postalcode"].value;
    editAddress(factuurAddress.id, factuurAddress);
}

function changeBezorgAddress(form) {
    bezorgAddress.streetname = form["streetname"].value;
    bezorgAddress.number = form["number"].value;
    bezorgAddress.addition = form["addition"].value;
    bezorgAddress.city = form["city"].value;
    bezorgAddress.postalcode = form["postalcode"].value;
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

function addNewAddress(form) {
    address = {"addressType":form["addressType"].value,
            "streetname":form["streetname"].value,
            "number":form["number"].value,
            "addition":form["addition"].value,
            "city":form["city"].value,
            "postalcode":form["postalcode"].value,
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
