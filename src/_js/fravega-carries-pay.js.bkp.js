var regex = new RegExp("sucursal -.+- ([0-9]+)$", "i");

function checkSLA() {

	if (regex.test($(".shipping-selected-sla .sla").text())) {
		$(".shipping-selected-sla .estimate").html("A partir de 48hs hábiles");
	}

	vtexjs.checkout.getOrderForm().then(function(orderForm) {
		var sla = typeof orderForm.shippingData.logisticsInfo[0].selectedSla !== "undefined" ? orderForm.shippingData.logisticsInfo[0].selectedSla : null;
		if (typeof sla == "string" && sla.toLowerCase() == "retiro en sucursal") {
			window.location.href = "#shipping";
		}

		if (typeof sla === "string" && regex.test(sla)) {
			$(".shipping-selected-sla .estimate").html("A partir de 48hs hábiles");
		}

	}).done(function(orderForm) {
		// console.log("El contenido del campo observaciones es: ", orderForm.openTextField);
	});
}

checkSLA();

setTimeout(checkSLA, 100);
setTimeout(checkSLA, 200);
setTimeout(checkSLA, 300);
setTimeout(checkSLA, 500);