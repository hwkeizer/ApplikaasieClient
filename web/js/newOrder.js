var baseURL = "http://localhost:8080/Workshop3/webresources";
var customer = {};
var availableProducts = [];
var selectedRows = [];
var productsLoaded = false;

$(document).ready(function () {
    $("#saveOrderButton").click(function (event) {
        if (selectedRows.length === 0)
            alert("U dient eerst producten te selecteren voordat een bestelling opgeslagen kan worden.");
        saveOrder();
    });

    $("#changeSelectedCustomer").click(function (event) {
        if (!confirm("Weet u zeker dat u een andere klant wilt selecteren?")) {
            return;
        }

        hideAll();
        $("#showCustomers").show();
    });

    showAllCustomers();
});



function showAllCustomers() {
    $.ajax({
        url: baseURL + "/customer",
        method: "GET",
        dataType: "json",
        error: function () {
            console.log("Error in function showAllCustomers");
        },
        success: function (data, textStatus, request) {
            if (request.getResponseHeader('REQUIRES_AUTH') === '1') {
                window.location.href = 'http://localhost:8080/login.html';
            }
            console.log(data);
            $("#customerTable").tabulator({
                layout: "fitColumns",
                columns: [
                    {title: "Voornaam", field: "firstName", headerFilter: "input"},
                    {title: "Tussenvoegsel", field: "lastNamePrefix", headerFilter: "input"},
                    {title: "Achternaam", field: "lastName", headerFilter: "input"},
                    {title: "Email", field: "email", headerFilter: "input"},
                    {title: "Account", field: "account.username", headerFilter: "input"}
                ],
                rowClick: function (e, row) {
                    customer = row.getData();
                    $("#showCustomers").hide(500);
                    $("#selectedCustomer").show(500);
                    showSelectedCustomer();
                    $("#showProducts").show(500);
                    if(!productsLoaded) {
                        showAllProducts();
                    }
                    if (selectedRows.length !== 0) {
                        $("#showSelectedProducts").show();
                    }
                }
            });
            $("#customerTable").tabulator("setData", data);
        }
    });
}

function showSelectedCustomer() {
    $("#showSelectedCustomer").html("");
    $("#showSelectedCustomer").append("<ul>" +
            "<li> Voornaam: " + customer.firstName + "</li>" +
            "<li> Tussenvoegsel: " + customer.lastNamePrefix + "</li>" +
            "<li> Achternaam: " + customer.lastName + "</li>" +
            "<li> Email: " + customer.email + "</li></ul>");
}

function showAllProducts() {
    $.ajax({
        method: "GET",
        url: baseURL + "/product/available",
        dataType: "json",
        error: function () {
            console.log("error");
        },
        success: function (data) {
            productsLoaded = true;
            availableProducts = data;
            $("#productTable").tabulator({
                layout: "fitColumns",
                columns: [
                    {title: "Product", field: "name", headerFilter: "input"},
                    {formatter: "money", title: "Prijs/stuk", field: "price"},
                    {title: "Voorraad", field: "stock"},
                    {title: "Product status", field: "productStatus", headerFilter: "input"},
                    {title: "Lege kolom", field: "amount", editor: true, validator: ["numeric"]},
                    {formatter: "buttonTick", title: "Toevoegen", align: "center", cellClick: function (e, cell) {

                            $("#showSelectedProducts").show(500);

                            rowData = cell.getRow().getData();

                            if (rowData.amount === undefined) {
                                alert("U dient eerst een aantal in te voeren voordat u dit product kunt toevoegen");
                                return;
                            }
                            if (rowData.amount < 1) {
                                alert("Om een product toe te voegen dient u een minimumaantal van '1' in te voeren");
                                return;
                            }
                            if (rowData.amount > rowData.stock) {
                                alert("Het is niet mogelijk om meer producten te bestellen dan de voorraad bevat");
                                return;
                            }

                            rowData.subTotal = rowData.amount * rowData.price;

                            selectedRows.push(rowData);
                            addRowToSelected(cell.getRow().getData());
                            $("#productTable").tabulator("deleteRow", cell.getRow());

                        }}
                ]
            });
            $("#productTable").tabulator("setData", data);
        }
    });
}

function addRowToSelected(data) {

    $("#selectedProductsTable").tabulator({
        layout: "fitColumns",
        columns: [
            {title: "Product", field: "name"},
            {formatter: "money", title: "Prijs/stuk", field: "price"},
            {title: "Aantal", field: "amount"},
            {formatter: "money", title: "Subtotaal", field: "subTotal"}
        ]
    });

    $("#selectedProductsTable").tabulator("setData", selectedRows);
}

function saveOrder() {
    if (confirm("Bestelling opslaan?")) {
        var orderItemColl = createOrderItemCollection();
        var order = {
            "customer": {
                "id": customer.id
            },

            "totalPrice": calculateTotalPrice(),
            "orderItemCollection": createOrderItemCollection()
        };

        var orderJson = JSON.stringify(order);
        console.log(orderJson);
        createOrder(orderJson);
    }

    function createOrder(order) {
        $.ajax({
            method: "POST",
            url: baseURL + "/order1",
            data: order,
            contentType: "application/json",
            error: function () {
                console.log("error");
            },
            success: function () {
                window.location.href = "/order.html";
            }
        });
    }
}

function createOrderItemCollection() {
    var orderItemCollection = [];
    for (var i = 0; i < selectedRows.length; i++) {
        var currentRow = selectedRows[i];
        var orderItem = {
            "amount": currentRow.amount,
            "subTotal": currentRow.subTotal,
            "product": {
                "id": currentRow.id
            }
        };

        orderItemCollection.push(orderItem);
    }
    return orderItemCollection;
}

function calculateTotalPrice() {
    var totalPrice = 0;
    for (var i = 0; i < selectedRows.length; i++) {
        totalPrice += selectedRows[i].subTotal;
    }
    ;
    return totalPrice;
}

function hideAll() {
    $("#showCustomers").hide(500);
    $("#selectedCustomer").hide(500);
    $("#showProducts").hide(500);
    $("#showSelectedProducts").hide(500);
}
