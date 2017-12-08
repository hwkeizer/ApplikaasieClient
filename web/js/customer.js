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
    
    jQuery.validator.setDefaults({
        errorPlacement: function(error, element) {
            if (element.attr("name") === "cd_firstName")
                error.appendTo('#cd_firstNameError');
            if (element.attr("name") === "cd_lastNamePrefix")
                error.appendTo('#cd_lastNamePrefixError');
            if (element.attr("name") === "cd_lastName")
                error.appendTo('#cd_lastNameError');
            if (element.attr("name") === "cd_email")
                error.appendTo('#cd_emailError');
            if (element.attr("name") === "nc_firstName")
                error.appendTo('#nc_firstNameError');
            if (element.attr("name") === "nc_lastNamePrefix")
                error.appendTo('#nc_lastNamePrefixError');
            if (element.attr("name") === "nc_lastName")
                error.appendTo('#nc_lastNameError');
            if (element.attr("name") === "nc_email")
                error.appendTo('#nc_emailError');
            if (element.attr("name") === "pa_streetname")
                error.appendTo('#pa_streetnameError');
            if (element.attr("name") === "pa_number")
                error.appendTo('#pa_numberError');
            if (element.attr("name") === "pa_addition")
                error.appendTo('#pa_additionError');
            if (element.attr("name") === "pa_city")
                error.appendTo('#pa_cityError');
            if (element.attr("name") === "pa_postalcode")
                error.appendTo('#pa_postalcodeError');
            if (element.attr("name") === "na_streetname")
                error.appendTo('#na_streetnameError');
            if (element.attr("name") === "na_number")
                error.appendTo('#na_numberError');
            if (element.attr("name") === "na_addition")
                error.appendTo('#na_additionError');
            if (element.attr("name") === "na_city")
                error.appendTo('#na_cityError');
            if (element.attr("name") === "na_postalcode")
                error.appendTo('#na_postalcodeError');
            if (element.attr("name") === "fa_streetname")
                error.appendTo('#fa_streetnameError');
            if (element.attr("name") === "fa_number")
                error.appendTo('#fa_numberError');
            if (element.attr("name") === "fa_addition")
                error.appendTo('#fa_additionError');
            if (element.attr("name") === "fa_city")
                error.appendTo('#fa_cityError');
            if (element.attr("name") === "fa_postalcode")
                error.appendTo('#fa_postalcodeError');
            if (element.attr("name") === "ba_streetname")
                error.appendTo('#ba_streetnameError');
            if (element.attr("name") === "ba_number")
                error.appendTo('#ba_numberError');
            if (element.attr("name") === "ba_addition")
                error.appendTo('#ba_additionError');
            if (element.attr("name") === "ba_city")
                error.appendTo('#ba_cityError');
            if (element.attr("name") === "ba_postalcode")
                error.appendTo('#ba_postalcodeError');
        }
    });
    
    $('form[id="customerDetails"]').validate({
        rules: {
            cd_firstName: {
                required: true,
                maxlength: 16
            },
            cd_lastName: {
                required: true,
                maxlength: 16
            },
            cd_email: {
                required: true,
                email: true
            }
        },
        messages: {
            cd_firstName: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            cd_lastName: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            cd_email: {
                required: 'Dit veld is vereist',
                email: 'Geef een geldig email adres'
            }            
        },
        submitHandler: function(form) {            
            changeCustomer();
        }
    });
    
    $('form[id="newCustomer"]').validate({
        rules: {
            nc_firstName: {
                required: true,
                maxlength: 16
            },
            nc_lastName: {
                required: true,
                maxlength: 16
            },
            nc_email: {
                required: true,
                email: true
            }
        },
        messages: {
            nc_firstName: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            nc_lastName: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            nc_email: {
                required: 'Dit veld is vereist',
                email: 'Geef een geldig email adres'
            }            
        },
        submitHandler: function(form) {            
            addCustomer();
        }
    });
    
    $('form[id="postAddress"]').validate({
        rules: {
            pa_streetname: {
                required: true,
                maxlength: 16
            },
            pa_number: {
                required: true,
                maxlength: 16
            },
            pa_addition: {
                required: false,
                maxlength: 16
            },
            pa_city: {
                required: true,
                maxlength: 16
            },
            pa_postalcode: {
                required: true,
                maxlength: 16
            }
        },
        messages: {
            pa_streetname: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            pa_number: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            pa_addition: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            pa_city: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            }, 
            pa_postalcode: {
                required: 'Dit veld is vereist',
                email: 'Geef een geldige postcode'
            }   
        },
        submitHandler: function(form) {  
            changePostAddress();
        }
    });
    
    $('form[id="newAddress"]').validate({
        rules: {
            na_addressType: {
                required: true
            },
            na_streetname: {
                required: true,
                maxlength: 16
            },
            na_number: {
                required: true,
                maxlength: 16
            },
            na_addition: {
                required: false,
                maxlength: 16
            },
            na_city: {
                required: true,
                maxlength: 16
            },
            na_postalcode: {
                required: true,
                maxlength: 16
            }
        },
        messages: {
            na_addressType: {
                required: 'Dit veld is vereist'
            },
            na_streetname: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            na_number: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            na_addition: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            na_city: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            }, 
            na_postalcode: {
                required: 'Dit veld is vereist',
                email: 'Geef een geldige postcode'
            }   
        },
        submitHandler: function(form) {  
            addNewAddress();
        }
    });
    
    $('form[id="factuurAddress"]').validate({
        rules: {
            fa_streetname: {
                required: true,
                maxlength: 16
            },
            fa_number: {
                required: true,
                maxlength: 16
            },
            fa_addition: {
                required: false,
                maxlength: 16
            },
            fa_city: {
                required: true,
                maxlength: 16
            },
            fa_postalcode: {
                required: true,
                maxlength: 16
            }
        },
        messages: {
            fa_streetname: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            fa_number: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            fa_addition: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            fa_city: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            }, 
            fa_postalcode: {
                required: 'Dit veld is vereist',
                email: 'Geef een geldige postcode'
            }   
        },
        submitHandler: function(form) {  
            changeFactuurAddress();
        }
    });
    
    $('form[id="bezorgAddress"]').validate({
        rules: {
            ba_streetname: {
                required: true,
                maxlength: 16
            },
            ba_number: {
                required: true,
                maxlength: 16
            },
            ba_addition: {
                required: false,
                maxlength: 16
            },
            ba_city: {
                required: true,
                maxlength: 16
            },
            ba_postalcode: {
                required: true,
                maxlength: 16
            }
        },
        messages: {
            ba_streetname: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            ba_number: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            ba_addition: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            },
            ba_city: {
                maxlength: 'Dit veld mag maximaal 16 tekens bevatten',
                required: 'Dit veld is vereist'
            }, 
            ba_postalcode: {
                required: 'Dit veld is vereist',
                email: 'Geef een geldige postcode'
            }   
        },
        submitHandler: function(form) {  
            changeBezorgAddress();
        }
    });

});

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
            customer = {
                "id": selectedCustomer.id,
                "account": account,
                "firstName":$("#cd_firstName").val(),
                "lastNamePrefix":$("#cd_lastNamePrefix").val(),
                "lastName":$("#cd_lastName").val(),
                "email":$("#cd_email").val()
            };
            // If email is changed the account username will change accordingly
            account.username = customer.email;
            editAccount(account.id, account);
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
            console.log()
        },
        success: function(data, textStatus, request) {
            if (request.getResponseHeader('REQUIRES_AUTH') === '1'){ 
                window.location.href = 'http://localhost:8080/login.html';
            } else {
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
    if (selectedCustomer === null) {
        alert("geen klant geselecteerd");
    }
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
            alert("Error in function showAddressesCustomer");
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
            alert("Error in function editCustomer");
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
            alert("Error in function editAddress");
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
            alert("Error in function addAddress");
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
    alert("DELETING account " + accountId);
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
