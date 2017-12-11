var baseURL = "http://localhost:8080/Workshop3/webresources";

var availableProducts;
var selectedProducts = [];
var selectedProduct;

$(document).ready(function () {
    if (sessionStorage.role !== "KLANT") {
        console.log("Niet ingelogd als klant");
        $("#productsNotLoggedIn").show();
        showAllProductsNotLoggedIn();
    } else {
        console.log("Wel ingelogd als klant");
        $("#showProducts").show();
        $("#linkToShoppingCart").show();
        parseShoppingCart();
        console.log("parsing shopping cart finished");

        showAllProducts();

        console.log("selectedProducts length: " + selectedProducts.length);

        for (var i = 0; i < selectedProducts.length; i++) {
            console.log(selectedProducts[i]);
        }

        $(window).bind('beforeunload', function () {
            console.log("Reloading");
            storeShoppingCart();
        });
    }

    $("#changeProductAmountButton").click(function (event) {
        addProduct();
    });

    $("#cancelProductAmountButton").click(function (event) {
        event.preventDefault();
        $('#changeProductAmount').hide(500);
    });
});

function showAllProductsNotLoggedIn() {
    $.ajax({
        method: "GET",
        url: baseURL + "/product/available",
        dataType: "json",
        error: function () {
            console.log("error");
        },
        success: function (data) {
            availableProducts = data;
            setAvailable();
            $("#productTableNotLoggedIn").tabulator({
                layout: "fitColumns",
                columns: [
                    {title: "Product", field: "name", headerFilter: "input"},
                    {formatter: "money", title: "Prijs/stuk", field: "price"},
                    {title: "Voorraad", field: "stock"}
                ]
            });
            availableProducts.sort(compare);
            $("#productTableNotLoggedIn").tabulator("setData", availableProducts);

        }
    });
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
            availableProducts = data;
            setAvailable();
            $("#productTable").tabulator({
                layout: "fitColumns",
                columns: [
                    {title: "Product", field: "name", headerFilter: "input"},
                    {formatter: "money", title: "Prijs/stuk", field: "price"},
                    {title: "Voorraad", field: "stock"},
                    {title: "Status", field: "chosen"}
                ],
                rowClick: function (e, row) {
                    if (row.getData().chosen === "Beschikbaar") {
                        selectedProduct = null;
                        selectedProduct = row.getData();
                        $("#changeProductAmount").show(500);
                        showchangeProductAmount(row.getData());
                        $("#showProducts").hide();
                        $("#showProducts2").show();
                        showAllProducts2();
                    } else {
                        alert("U heeft dit product reeds aan uw winkelwagen toegevoegd. Bezoek de winkelwagenpagina voor meer opties.");
                    }
                }
            });
            availableProducts.sort(compare);
            $("#productTable").tabulator("setData", availableProducts);

        }
    });
}

function showAllProducts2() {
    $("#productTable2").tabulator({
        layout: "fitColumns",
        columns: [
            {title: "Product", field: "name", headerFilter: "input"},
            {formatter: "money", title: "Prijs/stuk", field: "price"},
            {title: "Voorraad", field: "stock"},
            {title: "Status", field: "chosen"}
        ],
        rowClick: function (e, row) {
            if (row.getData().chosen === "Beschikbaar") {
                selectedProduct = null;
                selectedProduct = row.getData();

                $("#changeProductAmount").show(500);
                showchangeProductAmount(row.getData());
            } else {
                alert("U heeft dit product reeds aan uw winkelwagen toegevoegd. Bezoek de winkelwagenpagina voor meer opties.");
            }
        }

    });
    availableProducts.sort(compare);
    $("#productTable2").tabulator("setData", availableProducts);
}

function showchangeProductAmount(product) {
    $("#changeProductAmount")[0].reset();
    $('#changeProductAmount').find('#product_name').val(product.name);
    $('#changeProductAmount').find('#product_price').val(product.price.toFixed(2));
    $('#changeProductAmount').find('#product_stock').val(product.stock);
    $('#changeProductAmount').find('#new_product_amount').val(0);
}

function addProduct() {
    event.preventDefault();
        selectedProduct.amount = $("#new_product_amount").val();

        if (selectedProduct.amount === undefined) {
            alert("U dient eerst een aantal in te voeren voordat u dit product kunt toevoegen");
            return;
        }
        if (selectedProduct.amount < 1) {
            alert("Om een product toe te voegen dient u een minimumaantal van '1' in te voeren");
            return;
        }
        if (selectedProduct.amount > selectedProduct.stock) {
            alert("Het is niet mogelijk om meer producten te bestellen dan de voorraad bevat");
            return;
        }

        selectedProducts.push(selectedProduct);

        $("#changeProductAmount").hide(500);
        setAvailable();
        $("#productTable2").tabulator("setData", availableProducts);
}

function setAvailable() {
    for (var i = 0; i < availableProducts.length; i++) {
        var availableRow = availableProducts[i];
        availableRow.chosen = "Beschikbaar";
        availableRow.amount = null;

        for (var j = 0; j < selectedProducts.length; j++) {
            var selectedRow = selectedProducts[j];

            if (availableRow.id === selectedRow.id) {
                console.log("i is: " + i + " and j is " + j);
                availableRow.chosen = selectedRow.amount + " stuks in winkelwagen";
                break;
            }
        }
    }
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
        sessionStorage.setItem("shoppingCart", JSON.stringify(""));
    }

}

function compare(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}