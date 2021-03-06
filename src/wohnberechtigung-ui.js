function einkommenInEuro(value) {
	var f = parseInt(value);
	return f + " €";
}

$( function() {
	var plotSelector = null;

	// calculator
	function presentResults() {
		var anzahlPersonen = parseInt( $( "#anzahlPersonen" ).val() );
		var einkommen = parseInt( $( "#einkommen" ).val() );

		if (isNaN(anzahlPersonen) || isNaN(einkommen))
			return;

		var sozialWohnung = new SozialWohnung2020(anzahlPersonen, einkommen);
		var wohnungMittleresEinkommen = new WohnungMittleresEinkommen2020(anzahlPersonen, einkommen);

		// update checkboxes according to result
		if (sozialWohnung.istBerechtigt())
			$( "#sozialWohnung" ).text("Ja");
		else
			$( "#sozialWohnung" ).text("Nein");
			
		if (wohnungMittleresEinkommen.istBerechtigt())
			$( "#wohnungMittleresEinkommen" ).text("Ja");
		else
			$( "#wohnungMittleresEinkommen" ).text("Nein");
	}

	// plot
	function presentPlot() {
		var statistik = new WohnungStatistiken();
		
		var jqplotOptions = {
			seriesDefaults:	{
				renderer: $.jqplot.BarRenderer,
				pointLabels: { show: true }
			},
			axes: {
				xaxis: {
					tickRenderer: $.jqplot.CanvasAxisTickRenderer,
					renderer: $.jqplot.CategoryAxisRenderer,
					tickOptions: {
					}
				}
			}
		};

		var mediaQuery = window.matchMedia('(max-width: 520px)');
		if (mediaQuery.matches) {
			statistik.auffuellenAufKWerte(8);
			jqplotOptions.axes.xaxis.ticks = statistik.titelMobil;
			jqplotOptions.axes.xaxis.tickOptions.angle = 35;
		} else {
			statistik.auffuellenAufKWerte(6);
			jqplotOptions.axes.xaxis.ticks = statistik.titel;
			jqplotOptions.axes.xaxis.tickOptions.angle = 20;
		}

		if (plotSelector)
			plotSelector.destroy();

		$.jqplot.config.enablePlugins = true;
		plotSelector = $.jqplot('plot', [statistik.anzahl], jqplotOptions);
	}

	// tab 1 controls
	function linkInputToSlider(inputId, sliderId, defaultValue, formatValue = (v) => v) {
		$( "#" + sliderId ).slider( "option", "slide", function( event, ui ) {
			// apply slider value to input
			$( "#" + inputId ).val( formatValue(ui.value) );
		});

		// initialize slider with input value
		$( "#" + sliderId ).slider( "option", "value", parseInt( $( "#" + inputId ).val() ) );

		$( "#" + inputId ).change( function( event ) {
			// parse and validate value
			var value = parseInt( $( "#" + inputId ).val() )
			if (isNaN(value) || value < 0)
				value = defaultValue;

			// apply value to input and slider
			$( "#" + inputId ).val( formatValue(value) )
			$( "#" + sliderId ).slider( "option", "value", value );
		} );

	}

	$( "#anzahlPersonenSlider" ).slider({
		value:	1,
		min:	1,
		max:	5,
		step:	1
	});
	$( "#anzahlPersonenSlider .ui-slider.handle" ).draggable();
	linkInputToSlider("anzahlPersonen", "anzahlPersonenSlider", 1);

	$( "#einkommenSlider" ).slider({
		value:	0,
		min:	0,
		max:	100000,
		step:	100,
	});
	$( "#einkommenSlider .ui-slider.handle" ).draggable();
	linkInputToSlider("einkommen", "einkommenSlider", 0, (v) => v + " €");

	// tabs and buttons
	$( "#tabs" ).tabs();
	$( "#tabs" ).on( "tabsactivate", function( event, ui ) {
		if (ui.newPanel[0].id == "tabs-2")
			presentResults();
		if (ui.newPanel[0].id == "tabs-3")
			presentPlot();
	});
	$( "#weiter-1" ).click( function() {
		$( "#tabs" ).tabs( "option", "active", 1 );
	});
	$( "#weiter-2" ).click( function() {
		$( "#tabs" ).tabs( "option", "active", 2 );
	});
} );

