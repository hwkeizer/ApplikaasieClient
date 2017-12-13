var baseURL = "http://localhost:8080/Workshop3/webresources";
var orderItemTablePrepared = false;
var selectedOrder;

$(document).ready(function () {
//    prepareOrderItemTable();

    $("#backToOverview").click(function (event) {
        $("#showOrders").show(500);
        $("#showOneOrder").hide(500);
        $("#editOrder").hide(500);
    });

    $("#editOrderButton").click(function (event) {
        $("#editOrder").show(500);
    });

    $("#deleteOrderButton").click(function (event) {
        deleteOrder();
    });

    $("#submitEditOrder").click(function (event) {
        event.preventDefault();
        editOrder();
    });

    $("#cancelEditOrder").click(function (event) {
        event.preventDefault();
        $("#editOrder").hide(500);
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
                height: 300,
                layout: "fitColumns",
                columns: [
                    {title: "Klant", field: "customer.fullName", headerFilter: "input"},
                    {formatter: "money", title: "Totaalprijs", field: "totalPrice", align: "right"},
                    {title: "Bestelstatus", field: "orderStatus", headerFilter: "input"},
                    {title: "Besteldatum", field: "dateTime", headerFilter: "input"}
                ],
                rowClick: function (e, row) {
                    $("#showOrders").hide(500);
                    $("#showOneOrder").show(500);
                    selectedOrder = row.getData();
                    showOneOrder(row.getData());
                }
            });
            $("#orderTable").tabulator("setData", data);
        }
    });
}

function prepareOrderItemTable() {
    $("#orderItemTable").tabulator({
        layout: "fitColumns",
        columns: [
            {title: "Product", field: "product.name", headerFilter: "input"},
            {title: "Aantal", field: "amount"},
            {formatter: "money", title: "Subtotaal", field: "subTotal", align: "right"}
        ]
    });
}

function showOneOrder(order) {
    if (!orderItemTablePrepared) {
        console.log("First preparation orderItemTable");
        prepareOrderItemTable();
        orderItemTablePrepared = true;
    }

    $("#showOrder").html("");
    $("#showOrder").append("<table class=\"table\">" +
            "<tr><td>Klant:</td><td>" + order.customer.fullName + "</td></tr>" +
            "<tr><td>Totaalprijs:</td><td>€" + order.totalPrice.toFixed(2) + "</td></tr>" +
            "<tr><td>Bestelstatus:</td><td>" + order.orderStatus + "</td></tr>" +
            "<tr><td>Besteldatum:</td><td>" + order.dateTime + "</td></tr>" +
            "</table>");

    order.orderItemCollection.sort(compare);
    $("#orderItemTable").tabulator("setData", order.orderItemCollection);
}

function editOrder() {
    var order = {};
    order.id = selectedOrder.id;
    order.orderStatus = $("#order_status").val();

    var orderJSON = JSON.stringify(order);
    console.log(orderJSON);

    $.ajax({
        url: baseURL + "/order1/" + selectedOrder.id,
        method: "PUT",
        data: orderJSON,
        contentType: "application/json",
        error: function () {
            console.log("Error in function editOrder");
        },
        success: function () {
            window.location.href = "http://localhost:8080/order.html#";
            location.reload();
        }
    });
}

function deleteOrder() {
    console.log("Bestelstatus: " + selectedOrder.orderStatus);
    console.log("OrderId: " + selectedOrder.id);
    if (selectedOrder.orderStatus !== "Nieuw") {
        alert("U kunt alleen bestellingen met de bestelstatus \"Nieuw\" verwijderen.");
        return;
    }
    if (confirm("Klik op \"ok\" als u deze bestelling wilt verwijderen. De bestelling verdwijnt dan definitief uit het systeem!\n" +
            "Indien u de bestelling wenst te behouden, klik dan op \"Annuleren\".")) {
        console.log("Bestelling gaat verwijderd worden");

        $.ajax({
            url: baseURL + "/order1/" + selectedOrder.id,
            method: "DELETE",
            contentType: "application/json",
            error: function () {
                console.log("Error in function deleteOrder");
            },
            success: function () {
                window.location.href = "http://localhost:8080/order.html#";
                location.reload();
            }
        });
    }
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