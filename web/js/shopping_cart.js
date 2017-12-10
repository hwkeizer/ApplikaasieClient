var baseURL = "http://localhost:8080/Workshop3/webresources";

var selectedProducts = [];

$(document).ready(function () {
    parseShoppingCart();

    console.log("SelectedProducts length: " + selectedProducts.length);
    if (selectedProducts.length === 0) {
        console.log("SelectedProducts.length was 0");
        $("#noItemsInShoppingCart").show();
    } else {
        $("#showOrder").show();
        showOrderDetails();
        $("#saveOrderButton").click(function (event) {
            console.log("saveOrderButton was clicked");
            saveOrder();
        });
    }
});

function showOrderDetails() {
    for(var i = 0; i < selectedProducts.length; i++) {
        selectedProducts[i].subTotal = selectedProducts[i].amount * selectedProducts[i].price;
    }
    
    $("#totalPrice").html("");
    $("#totalPrice").append("<ul>" +
            "<li>Totaalprijs: €" + calculateTotalPrice().toFixed(2) + "</li>" +
            "</ul>");

    $("#orderItemTable").tabulator({
        layout: "fitColumns",
        columns: [
            {title: "Product", field: "name", headerFilter: "input"},
            {title: "Aantal", field: "amount"},
            {formatter: "money", title: "Subtotaal", field: "subTotal", align: "right"}
        ]
    });
    $("#orderItemTable").tabulator("setData", selectedProducts);
}

function parseShoppingCart() {
    console.log("Entered unpacking method");
    console.log("length: " + sessionStorage.shoppingCart.length);
    if (sessionStorage.shoppingCart.length !== 0)
        selectedProducts = JSON.parse(sessionStorage.getItem("shoppingCart"));
    else
        selectedProducts = [];
}


function saveOrder() {
    if (confirm("Bestelling opslaan?")) {
        var order = {
            "customer": {
                "id": getCustomerId()
            },

            "orderItemCollection": createOrderItemCollection(),
            "totalPrice": calculateTotalPrice()
        };

        var orderJson = JSON.stringify(order);
        console.log(orderJson);
//        createOrder(orderJson);

        $.ajax({
            method: "POST",
            url: baseURL + "/order1",
            data: orderJson,
            contentType: "application/json",
            error: function () {
                console.log("error in saving order");
            },
            success: function () {
                console.log("order was saved!");
                $("#saveOrderButton").hide(500);
                $("#saveSuccesful").show(500);
                
                console.log("Shopping car was emptied, now length: " + sessionStorage.shoppingCart.length);
                sessionStorage.shoppingCart = "";
            }
        });
    }
}

function createOrderItemCollection() {
    var orderItemCollection = [];
    for (var i = 0; i < selectedProducts.length; i++) {
        var currentProduct = selectedProducts[i];
        selectedProducts[i].subTotal = currentProduct.amount * currentProduct.price;
        console.log("subtotal: " + selectedProducts[i].subTotal);
        var orderItem = {
            "amount": currentProduct.amount,
            "subTotal": selectedProducts[i].subTotal,
            "product": {
                "id": currentProduct.id
            }
        };

        orderItemCollection.push(orderItem);
    }
    return orderItemCollection;
}

function calculateTotalPrice() {
    var totalPrice = 0;
    for (var i = 0; i < selectedProducts.length; i++) {
        totalPrice += selectedProducts[i].subTotal;
    }
    ;
    console.log("total price: " + totalPrice);
    return totalPrice;
}

function getCustomerId() {
    return 6;
}
