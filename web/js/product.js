var baseURL = "http://localhost:8080/Workshop3/webresources";

var availableProducts;
var selectedProducts = [];

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
//                    {title: "Aantal toe te voegen", field: "amount", editor: true, validator: ["numeric"]},
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
//                    {title: "Aantal toe te voegen", field: "amount", editor: true, validator: ["numeric"]},
                    {title: "Aantal toe te voegen", field: "amount", editable: true, editor: "number", validator: ["numeric"]},
                    {formatter: "buttonTick", title: "Toevoegen", align: "center", cellClick: function (e, cell) {

                            rowData = cell.getRow().getData();
                            console.log(rowData.name);

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

                            selectedProducts.push(cell.getRow().getData());
                            console.log("Pushed to selectedProducts");
                            rowData.chosen = "Reeds in winkelwagen";
                            console.log("Chosen message updated");

                            console.log("Selected products length" + selectedProducts.length);

                            setAvailable();
                            $("#showProducts").hide();
                            $("#showProducts2").show();
                            $("#linkToShoppingCart").show(500);
                            showAllProducts2();


                        }},
                    {title: "Status", field: "chosen"}
                ]
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
//                    {title: "Aantal toe te voegen", field: "amount", editor: true, validator: ["numeric"]},
            {title: "Aantal toe te voegen", field: "amount", editable: true, editor: "number", validator: ["numeric"]},
            {formatter: "buttonTick", title: "Toevoegen", align: "center", cellClick: function (e, cell) {

                    rowData = cell.getRow().getData();
                    console.log(rowData.name);

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

                    selectedProducts.push(cell.getRow().getData());
                    console.log("Pushed to selectedProducts");

                    setAvailable();
                    $("#productTable2").tabulator("setData", availableProducts);


                }},
            {title: "Status", field: "chosen"}
        ]
    });
    availableProducts.sort(compare);
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
                availableRow.chosen = "Reeds in winkelwagen";
                break;
            }
        }
    }
}

function parseShoppingCart() {
    console.log("Entered unpacking method");
    console.log("length: " + sessionStorage.shoppingCart.length);
    if (sessionStorage.shoppingCart.length !== 0)
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