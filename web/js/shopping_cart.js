var baseURL = "http://localhost:8080/Workshop3/webresources";

var selectedProducts = [];
var selectedProduct;
var totalPrice;

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

    $(window).bind('beforeunload', function () {
        storeShoppingCart();
    });

    $("#changeProductAmountButton").click(function (event) {
        updateAmount();
    });
    
    $("#cancelProductAmountButton").click(function (event) {
        event.preventDefault();
        $('#changeProductAmount').hide(500);
    });
});

function showOrderDetails() {
    for (var i = 0; i < selectedProducts.length; i++) {
        selectedProducts[i].subTotal = selectedProducts[i].amount * selectedProducts[i].price;
    }

    setTotalPrice();

    $("#orderItemTable").tabulator({
        layout: "fitColumns",
        columns: [
            {title: "Product", field: "name", headerFilter: "input", width: 300},
            {formatter: "money", title: "Prijs/stuk", field: "price"},
            {title: "Voorraad", field: "stock"},
            {title: "Aantal in winkelwagen", field: "amount"},
            {formatter: "money", title: "Subtotaal", field: "subTotal", align: "right"},
            {formatter: "buttonCross", title: "Product verwijderen", align: "center", cellClick: function (e, cell) {
                    e.stopPropagation();
                    
                    rowData = cell.getRow().getData();

                    for (var i = 0; i < selectedProducts.length; i++) {
                        if (rowData.id === selectedProducts[i].id) {
                            selectedProducts.splice(i, 1);
                        }
                    }
                    
                    setTotalPrice();
                    
                    if (selectedProducts.length === 0) {
                        sessionStorage.shoppingCart = "";
                        $("#showOrder").hide(500);
                        $("#noItemsInShoppingCart").show(500);
                        $("#changeProductAmount").hide(500);
                    }

                    $("#orderItemTable").tabulator("setData", selectedProducts);
                }}
        ],
        rowClick: function (e, row) {
            selectedProduct = null;
            selectedProduct = row.getData();
            $("#changeProductAmount").show(500);
            $("#changeProductAmount")[0].reset();
            showchangeProductAmount(row.getData());
        }
    });
    $("#orderItemTable").tabulator("setData", selectedProducts);
}

function showchangeProductAmount(product) {
    $('#changeProductAmount').find('#product_name').val(product.name);
    $('#changeProductAmount').find('#product_price').val(product.price.toFixed(2));
    $('#changeProductAmount').find('#product_stock').val(product.stock);
    $('#changeProductAmount').find('#product_amount').val(product.amount);
    $('#changeProductAmount').find('#new_product_amount').val(product.amount);

//    $("#changeProductAmountButton").click(function (event) {
//        event.preventDefault();
//        for (var i = 0; i < selectedProducts.length; i++) {
//
//            if (product.id === selectedProducts[i].id) {
//
//                if ($("#new_product_amount").val() < 1) {
//                    alert("Om een product toe te voegen dient u een minimumaantal van '1' in te voeren");
//                    return;
//                }
//                if ($("#new_product_amount").val() > product.stock) {
//                    alert("Het is niet mogelijk om meer producten te bestellen dan de voorraad toelaat");
//                    return;
//                }
//
//                selectedProducts[i].amount = $("#new_product_amount").val();
//                selectedProducts[i].subTotal = selectedProducts[i].amount * selectedProducts[i].price;
//                setTotalPrice();
//
//            }
//        }
//        $("#changeProductAmount").hide(500);
//        $("#orderItemTable").tabulator("setData", selectedProducts);
//    });
}

function updateAmount() {
    event.preventDefault();
    for (var i = 0; i < selectedProducts.length; i++) {

        if (selectedProduct.id === selectedProducts[i].id) {

            if ($("#new_product_amount").val() < 1) {
                alert("Om een product toe te voegen dient u een minimumaantal van '1' in te voeren");
                return;
            }
            if ($("#new_product_amount").val() > selectedProduct.stock) {
                alert("Het is niet mogelijk om meer producten te bestellen dan de voorraad toelaat");
                return;
            }

            selectedProducts[i].amount = $("#new_product_amount").val();
            selectedProducts[i].subTotal = selectedProducts[i].amount * selectedProducts[i].price;
            setTotalPrice();

        }

    }
    $("#changeProductAmount").hide(500);
    $("#orderItemTable").tabulator("setData", selectedProducts);
}

function parseShoppingCart() {
    console.log("Entered unpacking method");
    console.log("length: " + sessionStorage.shoppingCart.length);
    if (sessionStorage.shoppingCart !== "")
        selectedProducts = JSON.parse(sessionStorage.getItem("shoppingCart"));
    else
        selectedProducts = [];
}

function storeShoppingCart() {
    if (selectedProducts.length !== 0) {
        sessionStorage.setItem("shoppingCart", JSON.stringify(selectedProducts));
    } else {
        sessionStorage.shoppingCart = "";
    }
}

function saveOrder() {
    if (confirm("Bestelling opslaan?")) {
        var order = {
            "customer": {
                "id": sessionStorage.customerId
            },

            "orderItemCollection": createOrderItemCollection(),
            "totalPrice": calculateTotalPrice()
        };

        var orderJson = JSON.stringify(order);
        console.log(orderJson);

        $.ajax({
            method: "POST",
            url: baseURL + "/order1/" + sessionStorage.user,
            data: orderJson,
            contentType: "application/json",
            error: function () {
                console.log("error in saving order");
            },
            success: function () {
                console.log("order was saved!");
                $("#saveOrderButton").hide(500);
                $("#saveSuccesful").show(500);

                sessionStorage.shoppingCart = "";
                selectedProducts = [];
                console.log("Shopping car was emptied, now length: " + sessionStorage.shoppingCart.length);
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

function setTotalPrice() {
    totalPrice = calculateTotalPrice().toFixed(2);
    $("#totalPrice").html("");
    $("#totalPrice").append("<ul>" +
            "<li>Totaalprijs: €" + totalPrice + "</li>" +
            "</ul>");
}
