var baseURL = "http://localhost:8080/Workshop3/webresources";

$(document).ready(function () {
    showAllOrders();
});

function showAllOrders() {
    $.ajax({
        method: "GET",
        url: baseURL + "/order1",
        dataType: "json",
        error: function () {
            console.log("error");
        },
        success: function (data) {
            $("#orderTable").tabulator({
//                layout:"fitDataFill",
                height: 300,
                layout: "fitColumns",
                columns: [
                    {title: "Klant", field: "customer.lastName", headerFilter: "input"},
                    {formatter: "money", title: "Totaalprijs", field: "totalPrice", align:"right"},
                    {title: "Bestelstatus", field: "orderStatus"},
                    {title: "Besteldatum", field: "dateTime", headerFilter: "input"}
                ],
                rowClick: function (e, row) {
                    alert("Clicked row: " + row.getData().id);
//                    hideAll();
//                    $("#showOneOrder").show(500);
//                    showOneProduct(row.getData());
                }
            });
            $("#orderTable").tabulator("setData", data);
        }
    });
}



// Utility method to hide all elements. Can be called in methods, followed by showX to show just 1 element

function hideAll() {
    $("#orderTable").hide(500);
    
}
