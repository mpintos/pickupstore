$(function() {
	var _sla = dataLayer[dataLayer.length - 1].orderFormShippingMethod[0];
	var _carrie = dataLayer[0].vtexcarries;
	if (_sla == "Retiro en Sucursal") {
		if (_carrie == undefined) {
			window.location.href = "#shipping";
		} else {
			saveOBS(_carrie);
		}
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