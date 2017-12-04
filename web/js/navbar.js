var min_width = $(window).width();
var top_navbar_dropdown = false;
var gegevens_hover = false;
let loginURL = "login.html";
let logoutURL = "logout.html";

function resizing() {
	let options = 0;
	login_status();
	$("[class^='top-navbar'] > a").each( function() {
		if($(this).css("display") !== "none")
		options ++;
	});
	if (sessionStorage.role !== undefined && (sessionStorage.role === "ADMIN" || sessionStorage.role === "MEDEWERKER")) {
		if (parseInt(min_width, 10) < 1040) {
		$("a[href = 'login.html'], a[href = 'logout.html'], a[href = 'account.html']").css("display", "none");
		options --;
		}
		if (parseInt(min_width, 10) < 850) {
			$("a[href = 'customer.html']").css("display", "none");
			options --;
		}
		if (parseInt(min_width, 10) < 750) {
			$("a[href = 'login.html'], a[href = 'logout.html'], a[href = 'account.html'], a[href = 'product.html']").css("display", "none");
			options --;
		}
		if (parseInt(min_width, 10) < 600) {
			$("[class*='top-navbar'] > a").css("text-align", "center");
			$("a[href = 'order.html']").css("display", "none");
			options -- ;
		}
		if (parseInt(min_width, 10) < 310) {
			$("[class*='top-navbar']:not([class*='gegevens']) > a").css("text-align", "initial");
			$("a[href = 'my_details.html']").css("display", "none");
		}
		resizetopbar((parseInt(min_width, 10) - (30 + (options-1) * 128)) / options, options);
	}
	else if (sessionStorage.role === undefined || sessionStorage.role === "NONE" || sessionStorage.role === "KLANT") {
		if (parseInt(min_width, 10) > 1283)
			resizetopbar((parseInt(min_width, 10) - (30 + (options-1) * 140)) / options, options);
		else if (parseInt(min_width, 10) > 618)
			resizetopbar((parseInt(min_width, 10) - (30 + (options-1) * 135)) / options, options);
		else {
			if (sessionStorage.role === undefined || sessionStorage.role === "NONE")
				$("a[href = 'login.html'], a[href = 'logout.html'], a[href = 'account.html']").css("display", "none");
			else
				$("a[href = 'login.html'], a[href = 'logout.html'], a[href = 'product.html']").css("display", "none");
			options --;
			resizetopbar((parseInt(min_width, 10) - (30 + (options-1) * 106)) / options, options);
		}
		if (parseInt(min_width, 10) < 310 && sessionStorage.role === "KLANT") {
			$("[class*='top-navbar']:not([class*='gegevens']) > a").css("text-align", "initial");
			$("a[href = 'my_details.html']").css("display", "none");
		}
	}
	finddisabled();
	setDropdownboxesWidth();
}
function resizetopbar(e, options) {
	if (e < 0)
		e = 0;
	if (options <= 2)
		options = 3;
	let max_width = (parseInt(min_width, 10) - 30) / (options - 2);
	$(".top-navbar:not([class*='gegevens']) a:not([href = 'home.html'])").each(function() {
		let smallerPadding = e;
		while (parseInt($(this).css("width"), 10) + 2 * smallerPadding > max_width) {
			smallerPadding -= 1;
			if (smallerPadding <= 0 ) {
				smallerPadding = 0;
				break;
			}
		}
		$(this).css("padding-left", smallerPadding + "px");
		$(this).css("padding-right", smallerPadding + "px");
	});
}
function showcontent() {
	top_navbar_dropdown = !top_navbar_dropdown;
	finddisabled();
}
function finddisabled() {
	if (top_navbar_dropdown) {
		$("[class^='top-navbar'] > a").each( function() {
			if($(this).css("display") === "none")
				enablePartner(this, "block");
			else
				enablePartner(this, "none");
		});
	}
	else
		$(".dropdown-content a").css("display", "none");
	setborders();
}
function enablePartner(e, enable) {
	var baseURL = "http://localhost:8080/";
	if (sessionStorage.role === undefined || 
		(sessionStorage.role !== "ADMIN" && sessionStorage.role !== "KLANT" && sessionStorage.role !== "MEDEWERKER")) {
		if(e.href == baseURL + "order.html" || e.href == baseURL + "customer.html" || e.href == baseURL + "my_details.html")
			return false;
	}
	else if (sessionStorage.role === "KLANT") {
		if (e.href == baseURL + "customer.html" || e.href == baseURL + "account.html" || e.href == baseURL + "order.html")
			return false;
	}
	$(".dropdown-content a").each( function() {
		if($(this).prop("href") == e.href) {
			$(this).css("display", enable);
		}
	});
}
function setborders() {
	$(".dropdown-content a").css("border-top", "0px solid rgb(88, 88, 88)");
	if (top_navbar_dropdown) {
		$("img[src='images/dropdown arrow.png']").prop("src", "images/dropdown arrowup.png");
		$(".dropdown-content a").each(function() {
			if ($(this).css("display") == "block") {
				$(this).css("border-top", "2px solid rgb(70, 70, 70)");
				return false;
			}
		});
	}
	else {
		$("img[src='images/dropdown arrowup.png']").prop("src", "images/dropdown arrow.png");
		$(".dropdown-content a").css("border-top", "0px solid rgb(88, 88, 88)");
	}
}
function showgegevens() {
	if (top_navbar_dropdown)
		showcontent();
	gegevens_hover = true;
	$(".gegevens-dropdown-content a").css("display", "block");
}
function hidegegevens(e) {
	if (!$(".gegevens-dropdown-content a:hover").length && (!gegevens_hover))
		$(".gegevens-dropdown-content a").css("display", "none");
	if (e == 1)
		gegevens_hover = false;
}
function setDropdownboxesWidth() {
	var gegevens_width = parseInt($("[class^='top-navbar'] > a[href='customer.html']").css("width"))
	+ 2*(parseInt($("[class^='top-navbar'] > a[href='customer.html']").css("padding-left"))) + "px";
	var dropdowncontent_pos = 0;
	$("[class^='top-navbar'] > a").each( function() {
		if($(this).css("display") !== "none" && $(this).attr("href") !== "javascript:showcontent()")
			dropdowncontent_pos += parseInt($(this).css("width")) + 2* parseInt($(this).css("padding-left"));
		else if ($(this).css("display") !== "none" && $(this).attr("href") === "javascript:showcontent()")
			dropdowncontent_pos += parseInt($(this).css("padding-left"));
	});
	$(".gegevens-dropdown-content").css("min-width", gegevens_width);
	$(".dropdown-content").css("left", dropdowncontent_pos);
}
function login_status() {
	resetOptions();
	if (sessionStorage.user !== undefined) {
        $(".user_status").text("Uitloggen");
        $(".user_status").attr("href", logoutURL);
		$("a[href = 'account.html']").text("Accounts");
		$("a[href = 'my_details.html']").css("display", "block");
		if (sessionStorage.role !== undefined && sessionStorage.role !== "KLANT") {
                    $("a[href = 'customer.html']").css("display", "block");
                    $("a[href = 'order.html']").css("display", "block");
        }
		else
			$("a[href = 'account.html']").css("display", "none");
    } 
	else {
        $(".user_status").text("Inloggen");
        $(".user_status").attr("href", loginURL);
		$("a[href = 'account.html']").text("Account aanmaken");
		$("a[href = 'my_details.html']").css("display", "none");
    }
	$(".gegevens-dropdown-content a").css("display", "none");
}
function resetOptions() {
	$("a[href = 'product.html']").css("display", "block");
	$("a[href = 'login.html'], a[href = 'logout.html']").css("display", "block");
	$("a[href = 'order.html']:not([class*='gegevens'])").css("display", "none");
	$("a[href = 'customer.html']").css("display", "none");
	$("a[href = 'account.html']:not([class*='gegevens'])").css("display", "block");
	$("a[href = 'my_details.html']").css("display", "block");
}
$(window).resize(function() {
	min_width = $(window).width();
	resizing();
});
$(document).mousemove(function(event){ 
	hidegegevens(0);
});
jQuery(document).ready(function() {
	jQuery(document).ready(function() {
		min_width = $(window).width();
		resizing();
		$("#0001").css("display", "initial");
		resizing();
	});
});