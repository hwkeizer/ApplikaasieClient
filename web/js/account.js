/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var baseURL = "http://localhost:8080/Workshop3/webresources";

$(document).ready(function(){
    showAllAccounts();
});

function showAllAccounts() {
    $.ajaxSetup({ cache: false });
    $.ajax({
        url:baseURL + "/account",
        method: "GET",
        dataType: "json",
        cache: false,
        error: function() {
            console.log("Error in function showAllAccounts");
        },
        success: function(data) {
            console.log("DATA: "+ data);
            $("#accounts").tabulator({
                layout:"fitColumns",
                columns:[
                    {title:"Gebruikersnaam", field:"username", headerFilter:"input"},
                    {title:"Wachtwoord", field:"password"},
                    {title:"Type", field:"accountType", headerFilter:"input"}
                ],
                rowClick:function(e, row){
                    console.log("Data retour na klik " + row.toString());
                    alert("Op gebruiker " + row.getData().username + " geklikt!!!");
                }
            });
            $("#accounts").tabulator("setData", data);
        }       
    });
}

//function findAccountById(id) { 
//        $.ajax({
//        url:baseURL + "/account/" + id,
//        method: "GET",
//        dataType: "json",
//        error: function() {
//            console.log("Error in function createCustomer");
//        },
//        success: function(data) { 
//            alert("TESTEN WIJZIGEN KLANT in aanroep findAccountById met data:" + JSON.stringify(data));
//            return data;
//        }
//    });
//
//} 