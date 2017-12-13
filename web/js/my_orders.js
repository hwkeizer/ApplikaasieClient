/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var baseURL = "http://localhost:8080/Workshop3/webresources";

$(document).ready(function () {
    prepareOrderItemTable();

    $("#backToOverview").click(function (event) {
        $("#showMyOrders").show(500);
        $("#showOneOrder").hide(500);

    });

    showOrderList();
});

function showOrderList() {
    console.log("URL: " + baseURL + "/order1/" + sessionStorage.customerId + "/" + sessionStorage.user);
    $.ajax({
        method: "GET",
        url: baseURL + "/order1/" + sessionStorage.customerId + "/" + sessionStorage.user,
        dataType: "json",
        error: function () {
            console.log("error");
        },
        success: function (data) {
            editData(data);
            $("#myOrderTable").tabulator({
                layout: "fitColumns",
                columns: [
                    {title: "Besteldatum", field: "dateTime", headerFilter: "input"},
                    {formatter: "money", title: "Totaalprijs", field: "totalPrice", align: "right"},
                    {title: "Bestelstatus", field: "orderStatus", headerFilter: "input"}
                ],
                rowClick: function (e, row) {
                    $("#showMyOrders").hide(500);
                    $("#showOneOrder").show(500);
                    showOneOrder(row.getData());
                }
            });
            $("#myOrderTable").tabulator("setData", data);
        }
    });
}

function prepareOrderItemTable() {
    $("#orderItemTable").tabulator({
        layout: "fitColumns",
        columns: [
            {title: "Product", field: "product.name"},
            {title: "Aantal", field: "amount"},
            {formatter: "money", title: "Subtotaal", field: "subTotal", align: "right"}
        ]
    });
}

function showOneOrder(order) {
    $("#showOrder").html("");
    $("#showOrder").append("<table class=\"table\">" +
            "<tr><td>Besteldatum:</td><td>" + order.dateTime + "</td></tr>" +
            "<tr><td>Totaalprijs:</td><td>€" + order.totalPrice.toFixed(2) + "</td></tr>" +
            "<tr><td>Bestelstatus:</td><td>" + order.orderStatus + "</td></tr>" +
            "</table>");

//    $("#showOrder").html("");
//    $("#showOrder").append("<ul>" +
//            "<li>Besteldatum: " + order.dateTime + "</li>" +
//            "<li>Totaalprijs: €" + order.totalPrice.toFixed(2) + "</li>" +
//            "<li>Bestelstatus: " + order.orderStatus + "</li>" +
//            "</ul>");

    order.orderItemCollection.sort(compare);
    $("#orderItemTable").tabulator("setData", order.orderItemCollection);
}


function editData(data) {
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        date = new Date(row.dateTime);
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        row.dateTime = day + "-" + month + "-" + date.getFullYear();

        var orderStatus = row.orderStatus;
        if (orderStatus === "NIEUW") {
            row.orderStatus = "Nieuw";
        } else if (orderStatus === "IN_BEHANDELING") {
            row.orderStatus = "In behandeling";
        } else if (orderStatus === "AFGEHANDELD") {
            row.orderStatus = "Afgehandeld";
        }

    }
}

function compare(a, b) {
    if (a.product.name < b.product.name)
        return -1;
    if (a.product.name > b.product.name)
        return 1;
    return 0;
}

