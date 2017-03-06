// <link rel="stylesheet" href="/files/carries.css" />
// <script async defer src="//maps.googleapis.com/maps/api/js?libraries=places&language=es&key=AIzaSyCnlvTckyK8CJlK6VmwBHARvJWnwy1TzN0"></script>
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
var _carrie= undefined;
var store_list_template = "{{#each this}}<li id='store-{{code}}' data-id='{{counter @index}}' data-name='{{sucursal}}' data-lat='{{latitud}}' data-log='{{longitud}}'><div class='check'></div><div class='info'><input type='hidden' value='{{code}}' name='branch-id' id='branch-id' /><h3 class='name'>{{sucursal}}</h3><address class='address'>{{address}}</address><p class='time'>{{#Time opening}}{{this}}{{/Time}}</p></div></li>{{/each}}";
var vtex_carries_html = "<div class='vtexcarries'><div class='prestigioweb-container'><div class='prestigioweb-content'><div class='prestigioweb-top'><h6 class='prestigioweb-title'>Elegí una sucursal para retirar tus productos</h6><span class='prestigioweb-close'><span class='close'></span></span></div><div class='prestigioweb-middle'><div class='prestigioweb-left'><div class='prestigioweb-container-box'><div class='prestigioweb-select'><ul class='prestigioweb-provincias'><li class='prestigioweb-provincia'><p>Seleccione provincia</p></li><li id='state-1' data-id='1'><div class='check'></div><div class='info'>Buenos Aires</div></li><li id='state-2' data-id='2'><div class='check'></div><div class='info'>Capital Federal</div></li><li id='state-3' data-id='3'><div class='check'></div><div class='info'>Mendoza</div></li></ul></div><div class='pulse-container'><div class='pin bounce'></div><div class='pulse'></div></div><ul class='prestigioweb-places'></ul></div></div><div class='prestigioweb-right'><div class='prestigioweb-back'><i class='fa fa-angle-left' aria-hidden='true'></i></div><div class='pulse-container'><div class='pin bounce'></div><div class='pulse'></div></div><div id='prestigioweb-map'></div><div class='prestigioweb-footer'><button class='prestigioweb-button'>Seleccionar sucursal</button></div></div></div></div></div></div>";
var buenosaires = [{"address":"Av. Mitre, 5899 - Wilde - Buenos Aires","city":"Wilde","code":4,"latitud":"-34.749944","longitud":"-58.222585","opening":"Lun/Vie 8 a 12:45 - 14:30 a 19, Sab 8:30 a 13:15","state":"Buenos Aires","sucursal":"004 - CONDARCO","zipcode":1875},{"address":"Av. Centenario, 2 - San Isidro - Buenos Aires","city":"San Isidro","code":5,"latitud":"-34.474422","longitud":"-58.51265","opening":"Lun/Vie 8 a 13 / 14 a 19:30, Sab 8:30 a 17","state":"Buenos Aires","sucursal":"005 - SAN ISIDRO","zipcode":1642},{"address":"Av. de Mayo, 402 - Ramos Mejía - Buenos Aires","city":"Ramos Mejía","code":6,"latitud":"-34.64458","longitud":"-58.564913","opening":"Lun/Vie 8 a 13 / 14:30 a 19:30, Sab 8:30 a 17","state":"Buenos Aires","sucursal":"006 - RAMOS MEJIA I","zipcode":1704},{"address":"12 de Octubre, 1301 - Quilmes - Buenos Aires","city":"Quilmes","code":7,"latitud":"-34.733411","longitud":"-58.271504","opening":"Lun/Vie 8:15 a 12:30 / 14:30 a 19:15, Sab 8:30 a 13:30 / 14:30 a 17","state":"Buenos Aires","sucursal":"007 - QUILMES I","zipcode":1878},{"address":"Av. Mitre, 750 - Quilmes - Buenos Aires","city":"Quilmes","code":8,"latitud":"-34.723099","longitud":"-58.252754","opening":"Lun/Vie 8:15 a 12:45 / 14:30 a 19:15, Sab 8:30 a 13:30 / 14:30 a 17","state":"Buenos Aires","sucursal":"008 - QUILMES II","zipcode":1878},{"address":"Av. Calchaqui, 6601 - Florencio Varela - Buenos Aires","city":"Florencio Varela","code":9,"latitud":"-34.785582","longitud":"-58.257254","opening":"Lun/Vie 8 a 12:30/ 14:30 a 19:15, Sab 8:30 a 14 / 15 a 17","state":"Buenos Aires","sucursal":"009 - FLORENCIO VARELA","zipcode":1888},{"address":"Av. Mitre, 1198 - Avellaneda - Buenos Aires","city":"Avellaneda","code":13,"latitud":"-34.664917","longitud":"-58.360534","opening":"Lun/Vie 8:15 a 12:45 / 14:30 a 19:30, Sab 8:30 a 14:15 / 15 a 17","state":"Buenos Aires","sucursal":"013 - LAMADRID","zipcode":1865},{"address":"Av. Maipú, 315 - Vicente López - Buenos Aires","city":"Vicente López","code":23,"latitud":"-34.535326","longitud":"-58.477616","opening":"Lun/Vie 8 a 13 / 14 a 19:30, Sab 8:30 a 17","state":"Buenos Aires","sucursal":"023 - VICENTE LOPEZ","zipcode":1638},{"address":"Av. H. Yrigoyen, 1288 - Adrogué - Buenos Aires","city":"Adrogué","code":27,"latitud":"-34.796534","longitud":"-58.371197","opening":"Lun/Vie 8 a 13 / 14:30 a 19:30, Sab 8:30 a 14 / 15 a 17","state":"Buenos Aires","sucursal":"027 - ADROGUE","zipcode":1836},{"address":"Presidente J.A. Roca, 391 - Pilar - Buenos Aires","city":"Pilar","code":29,"latitud":"-34.449961","longitud":"-58.904151","opening":"Lun/Vie 8 a 13 / 14:30 a 19:30, Sab 8:30 a 17","state":"Buenos Aires","sucursal":"029 - PILAR","zipcode":1629},{"address":"Fondo De La Legua, 15 - Boulogne - Buenos Aires","city":"Boulogne","code":32,"latitud":"-34.494339","longitud":"-58.551014","opening":"Lun/Vie 8 a 13 / 14 a 19:30, Sab 8:30 a 17","state":"Buenos Aires","sucursal":"032 - MARQUEZ","zipcode":1609},{"address":"Av. H. Yrigoyen, 8501 - Lomas de Zamora - Buenos Aires","city":"Lomas de Zamora","code":33,"latitud":"-34.755631","longitud":"-58.40152","opening":"Lun/Vie 8 a 13 / 14:30 a 19:30, Sab 8:30 a 17","state":"Buenos Aires","sucursal":"033 - LOMAS DE ZAMORA","zipcode":1832},{"address":"Santa Rosa, 1601 - Castelar - Buenos Aires","city":"Castelar","code":34,"latitud":"-34.641965","longitud":"-58.656412","opening":"Lun/Vie 8 a 13 / 14:30 a 19:30, Sab 8:30 a 14","state":"Buenos Aires","sucursal":"034 - CASTELAR","zipcode":1712},{"address":"Av. Santa Fé, 2149 - Martínez - Buenos Aires","city":"Martínez","code":35,"latitud":"-34.490734","longitud":"-58.49994","opening":"Lun/Vie 8 a 13 / 14 a 19:30, Sab 8:30 a 13:30","state":"Buenos Aires","sucursal":"035 - MARTINEZ","zipcode":1640},{"address":"Plaza H. Yrigoyen, 148 - La Plata - Buenos Aires","city":"La Plata","code":37,"latitud":"-34.932269","longitud":"-57.953722","opening":"Lun/Vie 8:15 a 12:30 / 14:30 a 19, Sab 8:30 a 14:15 / 15 a 17","state":"Buenos Aires","sucursal":"037 - LA PLATA II","zipcode":1902},{"address":"25 de Mayo, 407 - Morón - Buenos Aires","city":"Morón","code":40,"latitud":"-34.653097","longitud":"-58.619854","opening":"Lun/Vie 8:15 a 13 / 14:30 a 19:30, Sab 8:30 a 13:30","state":"Buenos Aires","sucursal":"040 - MORON","zipcode":1708},{"address":"12 de Octubre, 3197 - Del Viso - Buenos Aires","city":"Del Viso","code":43,"latitud":"-34.437259","longitud":"-58.806968","opening":"Lun/Vie 8 a 13 / 14:30 a 19:15, Sab 8:30 a 13:30","state":"Buenos Aires","sucursal":"043 - DEL VISO","zipcode":1669},{"address":"Calle 7, 555 - La Plata - Buenos Aires","city":"La Plata","code":47,"latitud":"-34.909946","longitud":"-57.956347","opening":"Lun/Vie 8 a 13 / 14:30 a 19:30, Sab 8:30 a 17","state":"Buenos Aires","sucursal":"047 - LA PLATA I","zipcode":1914},{"address":"Ruta Nro. 27 (M.Garcia), 8089 - Benavídez - Buenos Aires","city":"Benavídez","code":58,"latitud":"-34.398873","longitud":"-58.646035","opening":"Lun/Vie 8:30 a 13 / 14:30 a 19, Sab 8:30 a 17","state":"Buenos Aires","sucursal":"058 - NORDELTA","zipcode":1621},{"address":"Laprida, 248 - Escobar - Buenos Aires","city":"Escobar","code":61,"latitud":"-34.354298","longitud":"-58.803864","opening":"Lun/Vie 8 a 12:30 / 14:30 a 19, Sab 8:30 a 14","state":"Buenos Aires","sucursal":"061 - ESCOBAR","zipcode":1625},{"address":"Calle 137, 6309 - Hudson - Buenos Aires","city":"Hudson","code":62,"latitud":"-34.8137","longitud":"-58.170248","opening":"Lun/Vie 8 a 12:45 / 14:30 a 19, Sab 9 a 13:30","state":"Buenos Aires","sucursal":"062 - HUDSON","zipcode":1885},{"address":"Liniers, 2056 - Tigre - Buenos Aires","city":"Tigre","code":69,"latitud":"-34.428787","longitud":"-58.591789","opening":"Lun/Vie 8:30 a 13 / 14:30 a 19:30, Sab 8:30 a 14","state":"Buenos Aires","sucursal":"069 - PUNTO TIGRE","zipcode":1648},{"address":"Jupiter y Jason, S/N - Pinamar - Buenos Aires","city":"Pinamar","code":74,"latitud":"-37.107204","longitud":"-56.869152","opening":"Lun/Vie 8 a 12:30 y 14:30 a 19, Sab 8 a 12:30 y 14:30 a 19:30","state":"Buenos Aires","sucursal":"074 - PINAMAR","zipcode":7167},{"address":"Av. 3 y Paseo 111, S/N - Villa Gesell - Buenos Aires","city":"Villa Gesell","code":79,"latitud":"-37.263397","longitud":"-56.97327","opening":"Lun/Vie 8 a 12:30 / 14:30 a 19, Sab 8 a 12:30 / 14:30 a 19","state":"Buenos Aires","sucursal":"079 - VILLA GESELL","zipcode":7165},{"address":"Camino Gral. Belgrano Es 473B, S/N - La Plata - Buenos Aires","city":"La Plata","code":90,"latitud":"-34.881185","longitud":"-58.05571","opening":"Lun/Vie 8:30 a 13 / 14:30 a 19:30, Sab 8:30 a 17","state":"Buenos Aires","sucursal":"090 - CITY BELL","zipcode":1900},{"address":"Av.13 (Colectora) esq 530, S/N - La Plata - Buenos Aires","city":"La Plata","code":98,"latitud":"-34.915163","longitud":"-57.963035","opening":"Lun/Vie 8:30 a 13:00 / 14:30 a 19:00, Sab 8:30 a 13:30","state":"Buenos Aires","sucursal":"098 - LA PLATA IV","zipcode":1906},{"address":"Av. Mitre, 1213 - Berazategui - Buenos Aires","city":"Berazategui","code":100,"latitud":"-34.75784","longitud":"-58.206789","opening":"Lun/Vie 8:30 a 12:45 / 14:30 a 19:30, Sab 9:00 a 13:30 / 15:00 a 17:00","state":"Buenos Aires","sucursal":"100 - BERAZATEGUI","zipcode":1880},{"address":"Hipolito Yrigoyen, 3753 - Lanús - Buenos Aires","city":"Lanús","code":101,"latitud":"-34.698052","longitud":"-58.392058","opening":"Lun/Vie 8:15 a 12:30 / 14:00 a 19:00, Sab 8:30 a 13:30","state":"Buenos Aires","sucursal":"101 - LANUS","zipcode":1824},{"address":"Hipolito Yrigoyen, 7609 - Banfield - Buenos Aires","city":"Banfield","code":102,"latitud":"-34.744735","longitud":"-58.399352","opening":"Lun/Vie 8:15 a 12:30 / 14:00 a 19:00, Sab 8:30 a 13:31","state":"Buenos Aires","sucursal":"102 - BANFIELD","zipcode":1828},{"address":"Av. Independencia, 2226 - Mar del Plata - Buenos Aires","city":"Mar del Plata","code":103,"latitud":"-38.000655","longitud":"-57.556263","opening":"Lun/Vie 8 a 19:30, Sab 8 a 19:30","state":"Buenos Aires","sucursal":"103 - MAR DEL PLATA","zipcode":7600},{"address":"Olavarría, 3286 - Mar del Plata - Buenos Aires","city":"Mar del Plata","code":104,"latitud":"-38.018208","longitud":"-57.544864","opening":"Lun/Vie 8 a 19:30, Sab 8 a 19:30","state":"Buenos Aires","sucursal":"104 - OLAVARRIA","zipcode":7602},{"address":"Av. Castex (esquina Vidal), 1417 - Canning - Buenos Aires","city":"Canning","code":106,"latitud":"-34.859932","longitud":"-58.501887","opening":"Lun/Vie 8 a 19:00, Sab 8:30 a 13:30","state":"Buenos Aires","sucursal":"106 - CANNING","zipcode":1804}];
var capitalfederal = [{"address":"Av. J.B. Alberdi, 6000 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":2,"latitud":"-34.653059","longitud":"-58.503986","opening":"Lun/Vie 8:15 a 12:45 - 14:30 a 19:30, Sab 8:30 a 13:30","state":"CABA","sucursal":"002 - MATADEROS","zipcode":1440},{"address":"Av. Lima, 699 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":10,"latitud":"-34.622139","longitud":"-58.381062","opening":"Lun/Vie 8 a 19:15, Sab 8:30 a 13:00","state":"CABA","sucursal":"010 - LIMA","zipcode":1073},{"address":"Av. Cabildo, 901 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":15,"latitud":"-34.569533","longitud":"-58.445703","opening":"Lun/Vie 8 a 19:30, Sab 8:30 a 17","state":"CABA","sucursal":"015 - TEODORO GARCIA","zipcode":1426},{"address":"Av. Las Heras, 3591 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":16,"latitud":"-34.669013","longitud":"-58.529762","opening":"Lun/Vie 8 a 19:30, Sab 8:30 a 17","state":"CABA","sucursal":"016 - SALGUERO","zipcode":1425},{"address":"Paraguay, 1599 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":17,"latitud":"-34.598453","longitud":"-58.389737","opening":"Lun/Vie 8 a 19, Sab 8:30 a 13","state":"CABA","sucursal":"017 - PARAGUAY","zipcode":1061},{"address":"Av. Corrientes, 3672 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":18,"latitud":"-34.603686","longitud":"-58.416442","opening":"Lun/Vie 8 a 19:30, Sab 8:30 a 17","state":"CABA","sucursal":"018 - ALMAGRO","zipcode":1194},{"address":"Av. J.B. Justo, 4399 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":19,"latitud":"-34.607334","longitud":"-58.462705","opening":"Lun/Vie 8 a 13/ 14:30 a 19, Sab 8:30 a 13:30","state":"CABA","sucursal":"019 - J. B. JUSTO","zipcode":1407},{"address":"Av. Rivadavia, 4640 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":20,"latitud":"-34.615844","longitud":"-58.430938","opening":"Lun/Vie 8 a 19:30, Sab 8:30 a 17","state":"CABA","sucursal":"020 - CABALLITO","zipcode":1424},{"address":"Av. Callao, 1500 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":22,"latitud":"-34.591766","longitud":"-58.391915","opening":"Lun/Vie 8 a 19:30, Sab 8:30 a 17","state":"CABA","sucursal":"022 - CALLAO","zipcode":1024},{"address":"Av. Francisco Beiro, 3401 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":26,"latitud":"-34.599106","longitud":"-58.500906","opening":"Lun/Vie 8 a 13 / 14:30 a 19:30, Sab 8:30 a 17","state":"CABA","sucursal":"026 - DEVOTO","zipcode":1419},{"address":"Av. Cabildo, 2800 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":36,"latitud":"-34.556235","longitud":"-58.461877","opening":"Lun/Vie 8 a 19:30, Sab 8:30 a 17","state":"CABA","sucursal":"036 - UGARTE","zipcode":1428},{"address":"J.B. Justo, 797 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":41,"latitud":"-34.579947","longitud":"-58.428057","opening":"Lun/Vie 8 a 19:15, Sab 8:30 a 17","state":"CABA","sucursal":"041 - CHARCAS","zipcode":1425},{"address":"Av. Monroe, 4802 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":46,"latitud":"-34.572098","longitud":"-58.48249","opening":"Lun/Vie 8 a 13 / 14:30 a 19:30, Sab 8:30 a 13:30","state":"CABA","sucursal":"046 - MONROE","zipcode":1431},{"address":"Av. Libertador, 6100 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":48,"latitud":"-34.555763","longitud":"-58.448531","opening":"Lun/Vie 8:30 a 13 / 14 a 19:30, Sab 8:30 a 17","state":"CABA","sucursal":"048 - MENDOZA","zipcode":1428},{"address":"Carabobo, 209 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":59,"latitud":"-34.629408","longitud":"-58.455454","opening":"Lun/Vie 8:30 a 12:45 / 14:30 a 19:30, Sab 8:30 a 17","state":"CABA","sucursal":"059 - CARABOBO","zipcode":1406},{"address":"Av. Santa Fe, 2989 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":97,"latitud":"-34.590966","longitud":"-58.407827","opening":"Lun/Vie 8 a 19:30, Sab 8:30 a 17, Dom 9:300 a 13:30","state":"CABA","sucursal":"097 - AUSTRIA","zipcode":1425},{"address":"Av. Triunvirato, 4494 - Ciudad de Buenos Aires - CABA","city":"Ciudad de Buenos Aires","code":108,"latitud":"-34.576127","longitud":"-58.483894","opening":"Lun/Vie 8 a 19:00, Sab 8:30 a 19:30","state":"CABA","sucursal":"108 - TRIUNVIRATO","zipcode":1431}];
var mendoza = [{"address":"Av. S. Martin, 1236 - Mendoza - Mendoza","city":"Mendoza","code":52,"latitud":"-32.889167","longitud":"-68.839024","opening":"Lun/Vie 8 a 12:30 / 16 a 20:30, Sab 8 a 12:30","state":"Mendoza","sucursal":"052 - SAN MARTIN","zipcode":5501},{"address":"J. V. Zapata, 123 - Mendoza - Mendoza","city":"Mendoza","code":54,"latitud":"-32.847475","longitud":"-68.832866","opening":"Lun/Vie 8 a 12:45 / 16 a 20:30, Sab 8:15 a 12:45 / 16:30 a 20","state":"Mendoza","sucursal":"054 - ZAPATA","zipcode":5500},{"address":"Av. Champagnat s/n Esq Dr Leloir, Local 19 - Mendoza, El Challao - Buenos Aires","city":"Mendoza, El Challao","code":105,"latitud":"-32.890183","longitud":"-68.844049","opening":"Lun/Vie 8.30 a 12.30 y 16 a 20.30, Sab 8.30 a 12.30 y 16.30 a 20.30","state":"Buenos Aires","sucursal":"105 - SHOPPING MENDOZA","zipcode":5539}];
// start map
function initMap() {
	$("#prestigioweb-map").html("");
	map = new google.maps.Map(document.getElementById("prestigioweb-map"), {
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
function createListStore(id) {
	$(".prestigioweb-places").html("");
	switch(id){
		case 1:
			_carrie = buenosaires;
			break;
		case 2:
			_carrie = capitalfederal;
			break;
		case 3:
			_carrie = mendoza;
			break;
	}
	$(".prestigioweb-provincias [id^='state-']").slideUp();
	handlebars(store_list_template, _carrie, ".prestigioweb-places");
	// $.ajax({
	// 	"headers": {
	// 		"accept": "application/vnd.vtex.ds.v10+json",
	// 		"content-type": "application/vnd.vtex.ds.v10+json",
	// 		"REST-Range":"resources=0-999"
	// 	},
	// 	type: "GET",
	// 	url: "//api.vtex.com/lyracons/dataentities/PS/search/?_fields=address,city,code,latitud,longitud,opening,state,sucursal,zipcode&_sort=code&_where=stateid=" + id,
	// 	// url: "https://api.myjson.com/bins/1f8pnt",
	// 	success: function(result) {
	// 		$(".prestigioweb-provincias [id^='state-']").slideUp();
	// 		handlebars(store_list_template, result, ".prestigioweb-places");
	// 	},
	// 	error: function(err) {
	// 		$(".vtexcarries").hide();
	// 	}
	// });
	setTimeout(mobileCheck, 1000);
}
// close button
function closeButton() {
	$(document).on("click", ".prestigioweb-close", function() {
		deleteMarkers();
		$(".vtexcarries").hide();
		$(".prestigioweb-button").hide();
		$(".prestigioweb-footer .info").remove();
		$("label[for='seller-1-sla-EnvioaDomicilio']").trigger("click");
	});
}
// back button
function backButton() {
	$(document).on("click", ".prestigioweb-back", function() {
		deleteMarkers();
		$(".prestigioweb-left").show();
		$(".prestigioweb-right").hide();
		$(".prestigioweb-button").hide();
		$(".prestigioweb-footer .info").remove();
	});
}
// check sla
function checkSLA() {
	vtexjs.checkout.getOrderForm().done(function(orderForm) {});
}
// select SLA
function selectSLA() {
	$(document).on("click", ".prestigioweb-button", function() {
		deleteMarkers();
		var data_name = $(".prestigioweb-places .checked").data("name");
		$(this).hide();
		var attachments = data_name;
		dataLayer[0].vtexcarries = attachments;
		// sendAttachment(attachments);
		$(".vtexcarries").hide();
		$(".prestigioweb-button").hide();
		$(".prestigioweb-footer .info").remove();
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
	$(document).on("click", ".prestigioweb-places [id^='store-']", function() {
		deleteMarkers();
		var $lat = $(this).data("lat");
		var $log = $(this).data("log");
		var $id = "#" + $(this).attr("id");
		var $latitude = new google.maps.LatLng($lat, $log);
		var $info = $(this).find(".info").html();
		$(".prestigioweb-footer .info").remove();
		$("<div />").addClass("info").html($info).prependTo(".prestigioweb-footer");
		if ($(document).width() <= 680) {
			$(".prestigioweb-left").hide();
			$(".prestigioweb-right").show();
		}
		google.maps.event.trigger(map, "resize");
		$(".prestigioweb-button").fadeIn("slow");
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
// select state
function selectState() {
	$(document).on("click", ".prestigioweb-provincias [id^='state-']", function() {
		deleteMarkers();
		createListStore($(this).data("id"));
		$(this).addClass("checked");
		$(this).siblings().removeClass("checked");
		$(".prestigioweb-provincias .prestigioweb-provincia p").text($(this).text()).addClass("checked");
	});
	$(document).on("click", ".prestigioweb-provincias .prestigioweb-provincia", function() {
		$(".prestigioweb-provincias [id^='state-']").slideDown();
	});
}
// active map on click carrie andreani
function openModal() {
	$(document).on("click", "label[for^='seller-1-sla-RetiroenSucursal']", function() {
		$(".vtexcarries").show();
		initMap();
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
		$(".prestigioweb-left").show();
		$(".prestigioweb-right").show();
	} else if ($(document).width() <= 680) {
		if ($(".prestigioweb-places [id^=store-].checked").length > 0) {
			$(".prestigioweb-left").hide();
			$(".prestigioweb-right").show();
		} else {
			$(".prestigioweb-left").show();
			$(".prestigioweb-right").hide();
		}
	}
}
// document ready
$(document).ready(function() {
	loadHTML(), openModal(), closeButton(), selectSLA(), backButton(), selectState(), selectCarrie();
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