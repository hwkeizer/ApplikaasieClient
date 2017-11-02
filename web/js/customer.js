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
            console.log(data);
            $("#customers").empty();
            $("#customers").tabulator({
                height:205,
                layout:"fitColumns",
                columns:[
                    {title:"Voornaam", field:"firstName"},
                    {title:"Tussenvoegsel", field:"lastNamePrefix"},
                    {title:"Achternaam", field:"lastName"},
                    {title:"Account", field:"accountId.username"}
                ],
                rowClick:function(e, row){
                    console.log("Data retour na klik " + row.toString());
                    alert("Op gebruiker " + row.getData().username + " geklikt!!!");
                }
            });
            $("#customers").tabulator("setData", data);
        }       
    });
}

