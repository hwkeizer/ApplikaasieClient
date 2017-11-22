var baseURL = "http://localhost:8080/Workshop3/webresources";

$(document).ready(function () {
    $("#saveOrderButton").click(function (event) {
        if (selectedRows.length === 0)
            alert("U dient eerst producten te selecteren voordat een bestelling opgeslagen kan worden.");
        saveOrder();
    });

    showAllProducts();
});

var initialProducts = [];
var selectedRows = [];

function showAllProducts() {
    $.ajax({
        method: "GET",
        url: baseURL + "/product",
        dataType: "json",
        error: function () {
            console.log("error");
        },
        success: function (data) {
            initialProducts = data;
            $("#productTable").tabulator({
                height: 300,
                layout: "fitColumns",
                columns: [
                    {title: "Product", field: "name", headerFilter: "input"},
                    {formatter: "money", title: "Prijs/stuk", field: "price"},
                    {title: "Voorraad", field: "stock"},
                    {title: "Product status", field: "productStatus", headerFilter: "input"},
                    {title: "Lege kolom", field: "amount", editor: true, validator: ["numeric"]},
                    {formatter: "buttonTick", title: "Toevoegen", align: "center", cellClick: function (e, cell) {

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
                ],
                rowClick: function (e, row) {
                    $("#randomText").css("color", "red");
                    hideAll();
                    $("#showOneProduct").show(500);
                    showOneProduct(row.getData());
                }
            });
            $("#productTable").tabulator("setData", data);
        }
    });
}

function addRowToSelected(data) {

    $("#selectedProductsTable").tabulator({
        height: 300,
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
                "id": 1
            },

            "totalPrice": calculateTotalPrice(),
            "orderItemCollection": createOrderItemCollection()
        };
        
        var orderJson = JSON.stringify(order);
        alert(orderJson);
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
    };
    return totalPrice;
}
