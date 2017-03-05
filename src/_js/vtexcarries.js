// <script charset="UTF-8" type="text/javascript" src="/files/vtexcarries.shipping.js"></script>
// <script charset="UTF-8" type="text/javascript" src="/files/vtexcarries.payment.js"></script>
// =============================================================================================
// variables
var markers = [];
var map;
var mobile = undefined;
var vtex_carries = undefined;
var then = undefined;
var SLA = undefined;
var store_list_template = "{{#each this}}<li id='store-{{id}}' data-id='{{counter @index}}' data-name='{{name}}' data-lat='{{coord.latitude}}' data-log='{{coord.longitude}}'><div class='check'></div><div class='info'><input type='hidden' value='{{id}}' name='branch-id' id='branch-id' /><h3 class='name'>{{name}}</h3><address class='address'>{{address}}</address><p class='time'>{{#Time time}}{{this}}{{/Time}}</p><p class='phones'>{{#each phones}}<span class='phone-{{counter @index}}'>{{this}}</span>{{/each}}</p></div></li>{{/each}}";
var vtex_carries_html = "<div class='vtexcarries'><div class='vtexcarries-container'><div class='vtexcarries-content'><div class='vtexcarries-top'><h6 class='vtexcarries-title'>Elegí la sucursal más cercana</h6><span class='vtexcarries-close'><span class='close'></span></span></div><div class='vtexcarries-middle'><div class='vtexcarries-left'><div class='pulse-container'><div class='pin bounce'></div><div class='pulse'></div></div><ul class='vtexcarries-places'></ul></div><div class='vtexcarries-right'><div class='vtexcarries-back'><i class='fa fa-angle-left' aria-hidden='true'></i></div><div class='pulse-container'><div class='pin bounce'></div><div class='pulse'></div></div><div id='vtexcarries-map'></div><div class='vtexcarries-footer'><button class='vtexcarries-button'>Seleccionar sucursal</button></div></div></div></div></div></div>";
// start map
function initMap() {
	$("#vtexcarries-map").html("");
	map = new google.maps.Map(document.getElementById("vtexcarries-map"), {
		zoom: 4,
		center: new google.maps.LatLng(-38.416097, -63.616671999999994),
		disableDefaultUI: true,
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_TOP
		}
	});
	google.maps.Map.prototype.setCenterWithOffset = function(latlng, offsetX, offsetY) {
		map = this;
		var ov = new google.maps.OverlayView();
		ov.onAdd = function() {
			var proj = this.getProjection();
			var aPoint = proj.fromLatLngToContainerPixel(latlng);
			aPoint.x = aPoint.x + offsetX;
			aPoint.y = aPoint.y + offsetY;
			map.setCenter(proj.fromContainerPixelToLatLng(aPoint));
		};
		ov.draw = function() {};
		ov.setMap(this);
	};
}
// create html
function loadHTML() {
	$(vtex_carries_html).appendTo("body");
}
// handlebars
function handlebars(template, content, elemento) {
	var compiledTemplate = Handlebars.compile(template);
	// fix time
	Handlebars.registerHelper('Time', function(time) {
		return (time == null) ? "" : time;
	});
	// counter
	Handlebars.registerHelper("counter", function(index) {
		return index;
	});
	var html = compiledTemplate(content);
	$(elemento).html(html);
}
// ajax to create list for service vtexcarries
function createListStore(courierId) {
	var branch = "ANDREANI-BRANCH-WITHDRAWAL";
	$.ajax({
		type: "GET",
		url: "//dpvtex.lyracons.com/vtex/service/branch?courierId=" + branch,
		success: function(result) {
			handlebars(store_list_template, result, ".vtexcarries-places");
		},
		error: function(err) {
			$(".vtexcarries").hide();
		}
	});
	setTimeout(mobileCheck, 1000);
}
// close button
function closeButton() {
	$(document).on("click", ".vtexcarries-close", function() {
		deleteMarkers();
		$(".vtexcarries").hide();
		$(".vtexcarries-button").hide();
		$(".vtexcarries-footer .info").remove();
		$("label[for='seller-1-sla-EnvioaDomicilio']").trigger("click");
	});
}
// back button
function backButton() {
	$(document).on("click", ".vtexcarries-back", function() {
		deleteMarkers();
		$(".vtexcarries-left").show();
		$(".vtexcarries-right").hide();
		$(".vtexcarries-button").hide();
		$(".vtexcarries-footer .info").remove();
	});
}
// check sla
function checkSLA() {
	vtexjs.checkout.getOrderForm().done(function(orderForm) {});
}
// select SLA
function selectSLA() {
	$(document).on("click", ".vtexcarries-button", function() {
		deleteMarkers();
		var data_name = $(".vtexcarries-places .checked").data("name");
		$(this).hide();
		var attachments = "Retiro en Sucursal de Andreani: " + data_name;
		dataLayer.push({
			"vtexcarries": attachments
		});
		// sendAttachment(attachments);
		$(".vtexcarries").hide();
		$(".vtexcarries-button").hide();
		$(".vtexcarries-footer .info").remove();
	});
}
// sendattachment
function sendAttachment(obs) {
	vtexjs.checkout.getOrderForm().then(function(orderForm) {
		return vtexjs.checkout.sendAttachment('openTextField', {
			value: obs
		});
	}).done(function(orderForm) {
		setTimeout(function() {
			$("label[for='seller-1-sla-retirosucursalandreani']").trigger("click");
			setTimeout(function() {
				$("label[for='seller-1-sla-RetiroenSucursalAndreani']").addClass("active").find(".icon-circle-blank").removeClass("icon-circle-blank").addClass("icon-ok-circle");
			}, 1000);
		}, 1000);
		setTimeout(openModal, 1000);
	});
}
// select carrie
function selectCarrie() {
	$(document).on("click", ".vtexcarries-places [id^='store-']", function() {
		deleteMarkers();
		var $lat = $(this).data("lat");
		var $log = $(this).data("log");
		var $id = "#" + $(this).attr("id");
		var $latitude = new google.maps.LatLng($lat, $log);
		var $info = $(this).find(".info").html();
		$(".vtexcarries-footer .info").remove();
		$("<div />").addClass("info").html($info).prependTo(".vtexcarries-footer");
		if ($(document).width() <= 680) {
			$(".vtexcarries-left").hide();
			$(".vtexcarries-right").show();
		}
		google.maps.event.trigger(map, "resize");
		$(".vtexcarries-button").fadeIn("slow");
		marker = new google.maps.Marker({
			position: new google.maps.LatLng($lat, $log),
			map: map,
			animation: google.maps.Animation.DROP,
		});
		markers.push(marker);
		map.addListener('resize', function() {
			window.setTimeout(function() {
				if ($(document).width() > 680) {
					map.panTo(marker.getPosition());
				} else if ($(document).width() <= 680) {
					map.setCenterWithOffset($latitude, 0, 100);
				}
			}, 100);
		});
		map.setZoom(18);
		if ($(document).width() > 680) {
			map.setCenterWithOffset($latitude, 0, 0);
		} else if ($(document).width() <= 680) {
			map.setCenterWithOffset($latitude, 0, 100);
		}
		$(this).addClass("checked");
		$(this).siblings().removeClass("checked");
	});
}
// active map on click carrie andreani
function openModal() {
	$(document).on("click", "label[for='seller-1-sla-RetiroenSucursalAndreani']", function() {
		$(".vtexcarries").show();
		initMap();
		createListStore();
	});
	$(document).on("click", "label[for='seller-1-sla-retirosucursalandreani']", function() {});
	$(document).on("click", "label[for='seller-1-sla-EnvioaDomicilio']", function() {});
	$(document).on("click", "#change-other-shipping-option", function() {});
}
// delete markers
function deleteMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}
// mobile check
function mobileCheck() {
	if ($(document).width() > 680) {
		$(".vtexcarries-left").show();
		$(".vtexcarries-right").show();
	} else if ($(document).width() <= 680) {
		if ($(".vtexcarries-places [id^=store-].checked").length > 0) {
			$(".vtexcarries-left").hide();
			$(".vtexcarries-right").show();
		} else {
			$(".vtexcarries-left").show();
			$(".vtexcarries-right").hide();
		}
	}
}
// document ready
$(document).ready(function() {
	loadHTML(), openModal(), closeButton(), selectSLA(), backButton(), selectCarrie();
});
// ajax status
$(document).ajaxStart(function() {
	$(".pulse-container").show();
});
$(document).ajaxStop(function() {
	$(".pulse-container").hide();
});
$(document).ajaxComplete(function() {
	$(".pulse-container").hide();
});
$(document).ajaxSuccess(function(event, xhr, settings) {
	if (settings.url.match("api/checkout/pub/postal-code/") || settings.url.match("/attachments/shippingData") || settings.url.match("/api/checkout/pub/orderForm")) {}
});
$(window).resize(function() {
	google.maps.event.trigger(map, "resize");
	mobileCheck();
});