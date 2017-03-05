if ($("script#storePickup").length > 1) {
	$("script#storePickup:last").parent().remove();
}

$(document).ready(function() {
	$("label.shipping-option-item").not($("label[for='seller-1-sla-Retiroensucursal']")).not($("label[for^='seller-1-sla-Sucursal']")).eq(0).removeClass("active").trigger("click");
});


function toggleSLA(time) {
	setTimeout(function() {
		if ($(".shipping-option-item.active[for^='seller-1-sla-Sucursal']").length > 0) {
			$("label[for='seller-1-sla-Retiroensucursal']").addClass("active").find(".icon-circle-blank").removeClass("icon-circle-blank").addClass("icon-ok-circle");
			$("#sp-info").show();
		} else if ($(".shipping-option-item.active").not($("label[for='seller-1-sla-Retiroensucursal']")).length < 1) {
			$("label.shipping-option-item").not($("label[for='seller-1-sla-Retiroensucursal']")).not($("label[for^='seller-1-sla-Sucursal']")).eq(0).removeClass("active").trigger("click");
			$("#sp-info").hide();
		} else {
			$(".shipping-option-item.active").addClass("tmpactive").removeClass("active").trigger('click');
		}
		$("label[for='seller-1-sla-Retiroensucursal'] .shipping-option-item-text-wrapper").attr("title", "A partir de 48hs hábiles");

	}, time);
}

toggleSLA(1000);

$(document).ajaxSuccess(function(event, xhr, settings) {
	if (settings.url.match("api/checkout/pub/postal-code/") || settings.url.match("/attachments/shippingData") || settings.url.match("/api/checkout/pub/orderForm")) {
		toggleSLA(300);
	}
});

String.prototype.clean = function() {
	str = this.toLowerCase();
	str = str.replace(/[\[\]\(\)\-\{\}\^\.\,]/g, "");
	str = str.replace(/[àáâãäåª]/g, "a");
	str = str.replace(/[éèëê]/g, "E");
	str = str.replace(/[íìïî]/g, "i");
	str = str.replace(/[óòöô]/g, "o");
	str = str.replace(/[úùüû]/g, "u");
	str = str.replace(/[ñ]/g, "n");
	str = str.replace(/[ç]/g, "c");
	str = str.replace(/ /g, "_");
	return str;
};

var map;
var w_map = 0;
var image = '/arquivos/marker-orange.png';
var image_current = '/arquivos/marker-green.png';
var geo_on = false;
var markers = [];
var markers_names = [];
var stores = {};
var pickupStoreID;
var lastMarker = null;

if (typeof loaded == "undefined") var loaded = false;

function initMap() {

	w_map = $("#map-canvas").width();

	if (w_map > 320) {
		var mapTypeControl = true;
		var panControl = true;
		var zoomControl = true;
		var scaleControl = true;
		var streetViewControl = true;
	} else {
		var mapTypeControl = false;
		var panControl = false;
		var zoomControl = false;
		var scaleControl = false;
		var streetViewControl = false;
	}


	var mapOptions = {
		center: new google.maps.LatLng(-37.7968617, -67.4661077),
		zoom: 4,
		mapTypeControl: mapTypeControl,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.BOTTOM_CENTER
		},
		panControl: panControl,
		panControlOptions: {
			position: google.maps.ControlPosition.TOP_RIGHT
		},
		zoomControl: zoomControl,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		scaleControl: scaleControl, // fixed to BOTTOM_RIGHT
		streetViewControl: streetViewControl,
		streetViewControlOptions: {
			position: google.maps.ControlPosition.RIGHT_TOP
		}
	}
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	google.maps.Map.prototype.setCenterWithOffset = function(latlng, offsetX, offsetY) {
		var map = this;
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

	make_stores();

	// Si ya tengo una preseleccionada, la marco
	/*if($("label.shipping-option-item.active").length == 2) {
	setTimeout(function() {

	var storeID = $("label.shipping-option-item.active[for*=ANDREANI]").find("input").val().substr(-4);

	var active_store = $(".s_selector.sucursal").find(".s_option").filter(function(i,e) {
	return $(e).data("id") == storeID;
	});

	var active_province = $(".s_selector.provincia").find(".s_option").filter(function(i,e) {
	return $(e).data("region") == active_store.closest(".s_filter").data("region");
	});

	active_province.trigger("click");
	active_store.trigger("click");

	}, 1000);

	}*/

}

function createSPOverlay(start) {

	if (!loaded) {

		loaded = true;
		var _wrapper = $(".storePickup");
		var _province_selector = _wrapper.find(".s_selector.provincia .s_option_wrapper");
		var _office_selector = _wrapper.find(".s_selector.sucursal");
		var _store_info = _wrapper.find(".store_info .stores");

		$.each(storePickupOffices, function(province_id, province_data) {

			// Si no tiene sucursales, no agrega la provincia
			if (province_data.offices.length < 1) return true;

			// Province selector
			$("<div />").addClass("s_option").data({
				region: province_id,
				lat: province_data.lat,
				lng: province_data.lng,
				zoom: province_data.zoom
			}).text(province_data.name).appendTo(_province_selector);

			// Office selector
			var filter = $("<div />").addClass("s_filter store").data("region", province_id);
			$("<div />").addClass("arrow").appendTo(filter);
			$("<div />").addClass("s_option default").text("Seleccionar").appendTo(filter);
			var wrapper = $("<div />").addClass("s_option_wrapper");

			$.each(province_data.offices, function(i, office) {

				$("<div />").addClass("s_option").data({
					lat: office.lat,
					lng: office.lng,
					id: office.id,
					info: office.name.clean()
				}).text(office.name).appendTo(wrapper);


				// Store info
				var store = $("<div />").addClass("store " + office.name.clean()).append('<div class="store_name">' + office.name + '</div>');
				if (typeof office.address != "undefined" && office.address != "") store.append('<div class="store_address"><span>Dirección: </span>' + office.address + '</div>');
				if (typeof office.phone != "undefined" && office.phone != "") store.append('<div class="store_phone"><span>Teléfono: </span>' + office.phone + '</div>');
				if (typeof office.schedule != "undefined" && office.schedule != "") store.append('<div class="store_schedule"><span>Horario: </span>' + office.schedule + '</div>');

				store.appendTo(_store_info);


			});

			// Append de todas las opciones de stores
			wrapper.appendTo(filter);
			filter.appendTo(_office_selector)

		});

	}

	if (start == true) initMap();

}

function make_stores() {
	$(".s_filter.store .s_option").each(function(i, e) {
		var lat = $(this).data("lat");
		var lng = $(this).data("lng");
		var info = $(this).data("info");
		var name = $(this).text();

		stores[info] = {
			name: name,
			lat: lat,
			lng: lng
		};
	});
}

function add_marker(latlng, info, name) {
	var name = name;
	var current = false;
	if (markers_names.indexOf(info) == -1) {
		markers_names.push(info);

		var infobox = new InfoBox({
			content: name + '<div class="arrow"></div>',
			disableAutoPan: true,
			pixelOffset: new google.maps.Size(-82, -65),
			infoBoxClearance: new google.maps.Size(1, 1),
			closeBoxURL: ""
		});

		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			icon: current == false ? image : image_current,
			animation: google.maps.Animation.DROP,
			store: name
		});

		google.maps.event.addListener(marker, 'mouseover', function() {
			infobox.open(map, this);
		});
		google.maps.event.addListener(marker, 'mouseout', function() {
			infobox.close(map, this);
		});
		google.maps.event.addListener(marker, 'click', function() {
			if (marker.getAnimation() != null) {
				marker.setAnimation(null);
			} else {
				marker.setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function() {
					marker.setAnimation(null);
				}, 1400)
			}

			var store = this.store.clean();

			var s = $(".s_filter.store .s_option").filter(function(i, e) {
				return $(e).data("info") == store;
			})

			var region = s.parentsUntil(".s_filter").parent().data("region");

			$(".s_selector.provincia .s_filter .s_option").filter(function(i, e) {
				return $(e).data("region") == region;
			}).trigger('click');

			s.trigger("click");

			if (lastMarker != null)
				lastMarker.setIcon(image);
			marker.setIcon(image_current);
			lastMarker = marker;
		});

		markers.push(marker);
	} else {
		var currentMarker = $.grep(markers, function(e) {
			return e.store == name;
		});
		if (currentMarker.length > 0) {
			if (lastMarker != null)
				lastMarker.setIcon(image);
			currentMarker[0].setIcon(image_current);
			lastMarker = currentMarker[0];
		}

	}
}

function get_stores_in_bounds() {

	var bounds = map.getBounds();

	var store_found = false;

	$.each(stores, function(i, e) {
		latlng = new google.maps.LatLng(e.lat, e.lng);
		if (bounds.contains(latlng)) {
			add_marker(latlng, i, e.name);
			store_found = true;
		}
	});
}

$(document).on("change", ".shipping-options .shipping-option-item input:radio", function() {
	w_map = $("#map-canvas").width();
});


$(document).on("click", ".s_option_wrapper .s_option", function() {

	var lat = $(this).data("lat");
	var lng = $(this).data("lng");
	var new_Latlng = new google.maps.LatLng(lat, lng);

	$(this).parent().hide().find(".active").removeClass("active");
	$(this).addClass("active");

	var opt_txt = $(this).text();
	$(this).parents(".s_filter").find(".s_option.default").text(opt_txt)

	if ($(this).parents(".s_filter").hasClass("region")) {
		var zoom = $(this).data("zoom");

		var region = $(this).data("region");

		$(".s_filter.store").hide();
		$(".s_selector.sucursal .s_filter.active, .s_selector.sucursal .s_filter .s_option").removeClass("active");

		$(".s_selector.sucursal .s_filter .s_option.default").text("Sucursal");

		$(".s_selector.sucursal .s_filter").filter(function(i, e) {
			return $(e).data("region") == region;
		}).show().addClass("active");

		$(".store_info .confirmStore").hide();

		$(".store_info .store").removeClass("active");
		$(".overlay.storePickup .left .info").show();
		$(".overlay.storePickup").removeClass("selected");
		get_stores_in_bounds();

	} else {
		var zoom = 17;

		var info = $(this).data("info");
		add_marker(new_Latlng, info, opt_txt);

		$(".info_wrapper .info").hide();

		$(".store_info .store").removeClass("active");
		$(".store_info .store." + info).addClass("active");
		$(".s_filter.store.active").removeClass("active");
		$(this).parents(".s_filter").addClass("active");
		$(".store_info .confirmStore").show();

		$(".overlay.storePickup").addClass("selected");
		$(".overlay.storePickup .left .info").hide();

		if ($(".center").width() == 320) {
			var map_top = $(".s_selector.sucursal").offset().top;

			$("html, body").animate({
				scrollTop: map_top
			});
		}
	}

	map.panTo(new_Latlng);
	map.setZoom(zoom);
	if (w_map > 320) {
		map.setCenterWithOffset(new_Latlng, -130, 0);
	} else {
		map.setCenter(new_Latlng);
	}

});

$(document).on("mouseleave", ".s_filter", function() {
	$(this).find(".s_option_wrapper").hide();
});


$(document).on("click", ".storePickup > .close", function() {
	$(".overlay.storePickup, .overlay-layer").fadeOut(300);
	toggleSLA(100);
});

$(document).on("click", "label[for='seller-1-sla-Retiroensucursal']", function() {
	createSPOverlay($("#map-canvas").children().length == 0);
	$(".overlay.storePickup, .overlay-layer").fadeIn(300, function() {
		google.maps.event.trigger(map, 'resize');
		if (markers.length > 0) $.each(markers, function(i, marker) {
			marker.setMap(map);
		});
	});
});

$(document).on("click", "label.shipping-option-item", function() {
	setTimeout(function() {
		$("label[for='seller-1-sla-Retiroensucursal'] .shipping-option-item-text-wrapper").attr("title", "A partir de 48hs hábiles");
	}, 300);
});

$(document).on("click", ".confirmStore", function() {
	if ($(".s_filter.store.active .s_option.active").length == 1) {
		var storeID = $(".s_filter.store.active .s_option.active").data("id");
		if (typeof storeID !== "undefined") {
			pickupStoreID = storeID;


			var regex = new RegExp("Sucursal -.+- (" + pickupStoreID + ")$", "i");
			$("label[for^='seller-1-sla-Sucursal'] input").each(function(i, e) {
				var value = $.trim($(this).val());

				if (regex.test(value)) {
					$(this).parent().trigger("click");
				}
			});
			setTimeout(function() {
				$("label[for='seller-1-sla-Retiroensucursal']").addClass("active").find(".icon-circle-blank").removeClass("icon-circle-blank").addClass("icon-ok-circle");
			}, 200);
		}
	}
	$(".overlay.storePickup, .overlay-layer").fadeOut(300);

	if ($(".overlay_success").length == 0) {
		$("body").append('<div class="overlay_success"> <div class="success_wrapper"> <i class="icn_check"></i> <p> Datos guardados exitosamente! </p> </div> </div>');
	}
	$(".overlay_success").animate({
		"top": "50px",
		"filter": "alpha(opacity='100')",
		"opacity": "1"
	}, 300);
	setTimeout(function() {
		$(".overlay_success").animate({
			"top": "-100px",
			"filter": "alpha(opacity='0')",
			"opacity": "0"
		}, 200);
	}, 2000);
});

$(document).on("click", ".s_filter > .s_option", function() {
	$(this).next().show();
});