$(function() {
	if (dataLayer[dataLayer.length - 1].orderFormShippingMethod[0] != "Envio a Domicilio") {
		if (typeof dataLayer[dataLayer.length - 2].vtexcarries != "undefined") {
			if (dataLayer[dataLayer.length - 1].orderFormShippingMethod[0] == "Retiro en Sucursal Andreani") {
				saveOBS(dataLayer[dataLayer.length - 2].vtexcarries);
			}
		} else {
			window.location.href = "#shipping";
		}
	} else if (dataLayer[dataLayer.length - 1].orderFormShippingMethod[0] == "Envio a Domicilio") {
		return true
	} else {
		window.location.href = "#shipping";
	}

	function saveOBS(argument) {
		vtexjs.checkout.getOrderForm().then(function(orderForm) {
			var obs = argument;
			return vtexjs.checkout.sendAttachment('openTextField', {
				value: obs
			});
		}).done(function(orderForm) {
			console.log("openTextField preenchido com: ", orderForm.openTextField);
		});
	}
});