var baseURL = "http://localhost:8080/Workshop3/webresources";

$(document).ready(function () {
    $("#backToOverview").click(function(event) {
       hideAll();
       $("#orderTable").show(500);
       
    });
    
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
            editData(data);
            $("#orderTable").tabulator({
//                layout:"fitDataFill",
                height: 300,
                layout: "fitColumns",
                columns: [
                    {title: "Klant", field: "customer.fullName", headerFilter: "input"},
                    {formatter: "money", title: "Totaalprijs", field: "totalPrice", align: "right"},
                    {title: "Bestelstatus", field: "orderStatus"},
                    {title: "Besteldatum", field: "dateTime"}
                ],
                rowClick: function (e, row) {
                    $("#orderTable").hide(500);
                    $("#showOneOrder").show(500);
                    showOneOrder(row.getData());
                }
            });
            $("#orderTable").tabulator("setData", data);
        }
    });
}

function showOneOrder(order) {
    $("#showOrder").html("");
    $("#showOrder").append("<ul>" +
            "<li>Klant: " + order.customer.fullName + "</li>" +
            "<li>Totaalprijs: €" + order.totalPrice.toFixed(2) + "</li>" +
            "<li>Bestelstatus: " + order.orderStatus + "</li>" +
            "<li>Besteldatum: " + order.dateTime + "</li>" +
            "</ul>");
    
    $("#orderItemTable").tabulator({
                layout: "fitColumns",
                columns: [
                    {title: "Product", field: "product.name", headerFilter: "input"},
                    {title: "Aantal", field: "amount"},
                    {formatter: "money", title: "Subtotaal", field: "subTotal", align: "right"}
                ]
//                rowClick: function (e, row) {
//                    hideAll();
//                    $("#showOneOrder").show(500);
//                    showOneOrder(row.getData());
//                }
            });
            $("#orderItemTable").tabulator("setData", order.orderItemCollection);
}

// Utility method to hide all elements. Can be called in methods, followed by showX to show just 1 element
function hideAll() {
    $("#orderTable").hide(500);
    $("#showOneOrder").hide(500);

}

// method to edit the dates to dd-MM-yyyy, combines the names of the customer into customer.fullName and presents the orderstatus in a non-capitalised form
function editData(data) {
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        date = new Date(row.dateTime);
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        row.dateTime = day + "-" + month + "-" + date.getFullYear();
        
        var lnPrefix = row.customer.lastNamePrefix !== 0 ? row.customer.lastNamePrefix + " " : "";
        var name = row.customer.firstName + " " + lnPrefix + row.customer.lastName;
        row.customer.fullName = name;
        
        var orderStatus = row.orderStatus;
        if(orderStatus === "NIEUW") {
            row.orderStatus = "Nieuw";
        }
        else if(orderStatus === "IN_BEHANDELING") {
            row.orderStatus = "In behandeling";
        }
        else if(orderStatus === "AFGEHANDELD") {
            row.orderStatus = "Afgehandeld";
        }
            
    }
}