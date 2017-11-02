/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var baseURL = "http://localhost:8080/Workshop3/webresources";
var sortAsc = true;

$(document).ready(function(){
    showAllAccounts();
});

function showAllAccounts() {
    $.ajax({
        url:baseURL + "/account",
        method: "GET",
        dataType: "json",
        error: function() {
            console.log("Error in function showAllAccounts");
        },
        success: function(data) {
            console.log(data);
            $("#accounts").tabulator({
                height:205,
                layout:"fitColumns",
                columns:[
                    {title:"Gebruikersnaam", field:"username", width:150},
                    {title:"Wachtwoord", field:"password"},
                    {title:"Type", field:"accountType"}
                ],
                rowClick:function(e, row){
                    alert("Op gebruiker " + row.getData().username + " geklikt!!!");
                }
            });
            $("#accounts").tabulator("setData", data);
        }       
    });
}
 