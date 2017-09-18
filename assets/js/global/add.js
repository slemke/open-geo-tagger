$(document).ready(function() {

    var latlng = {};
    var objectID = null;

    $("#beitrag_submit").on('click', function (e) {
        e.preventDefault();

        var data = {
            location: JSON.stringify(latlng),
            categories: JSON.stringify([$('#tagsinput').val()]),
            description: $('#textarea_infos').val(),
            userID : "<%= user._id %>",
            themeID : "<%= themeID %>"
        };

        $.ajax({
            type: "POST",
            url: "https://localhost:3000/objects/",
            data: data,
            success: function (response) {
                newObject = response;

                console.log(response);

                objectID = response._id;

                $('#modal_beitrag').modal('hide')

                marker.setIcon(greenIcon).dragging.disable();

            },
            error: function (err) {
                console.log(err);
            }
        });
    });

    var mymap = L.map('mymap');

    L.tileLayer( 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        maxZoom: 18, attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' }
    ).addTo( mymap );

    function onLocationError(e) {
        alert(e.message);
    }

    mymap.on('locationerror', onLocationError);
    mymap.locate({setView: true, maxZoom: 16});

    var geocodeService = L.esri.Geocoding.geocodeService();

    var marker = null;

    function onLocationFound(e) {
        marker = L.marker(e.latlng, {
            draggable: true
        }).addTo(mymap)
            .on('dragend', onDragEnd);

        var radius = e.accuracy / 2;

        latlng = e.latlng;

        geocodeService.reverse().latlng(e.latlng).run(function(error, result) {
            marker.bindPopup(result.address.Match_addr).openPopup();

            //L.circle(e.latlng, radius).addTo(mymap);

            $('#myposition').html(result.address.Match_addr);
        });
    }


    mymap.on('locationfound', onLocationFound);


    $.ajax({
        type: "GET",
        url: "https://localhost:3000/objects/",
        success: function (response) {

            //console.log(response);

            var markers = [];

            jQuery.map( response, function( val, i ) {
                markers[i] = L.marker(JSON.parse(val.location) , {
                    icon: greenIcon
                }).addTo(mymap);

                markers[i].on('click', function() {
                    geocodeService.reverse().latlng(JSON.parse(val.location)).run(function(error, result) {
                        markers[i].bindPopup(result.address.Match_addr).openPopup();

                        $('#myposition').html(result.address.Match_addr);
                    });

                    $("#marker_infos").html("Erstellt: "+val.createdAt +"<br>"+ "Zuletzt aktualisiert: "+val.updatedAt+"<br>"+"Kategorien: "+val.categories+"<br>"+"Beschreibung: "+val.description);
                    $("#modal_marker").modal("show");
                });
            });
        },
        error: function (err) {
            console.log(err);
        }
    });

    function onDragEnd(event) {
        var radius = event.target.accurancy / 2;
        var marker = event.target;
        var position = marker.getLatLng();

        marker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'});
        mymap.panTo(new L.LatLng(position.lat, position.lng))

        geocodeService.reverse().latlng(position).run(function(error, result) {
            marker.bindPopup(result.address.Match_addr).openPopup();

            latlng = position;
            $('#myposition').html(result.address.Match_addr);
        });
        mymap.addLayer(marker);

        marker.on('click', function() {

            $.ajax({
                type: "GET",
                url: "https://localhost:3000/objects/"+objectID,
                success: function (response) {
                    console.log(response.createdAt);
                    $("#marker_infos").html("Erstellt: "+response.createdAt +"<br>"+ "Zuletzt aktualisiert: "+response.updatedAt+"<br>"+"Kategorien: "+response.categories+"<br>"+"Beschreibung: "+response.description);
                    $("#modal_marker").modal("show");
                },
                error: function (err) {
                    console.log(err);
                }
            });
        });
    }
    //mymap.on('click', onMapClick);

    //getting click event to show modal
    $('#plusbutton').click(function () {
        $('#modal_beitrag').modal();

        //appending modal background inside the bigform-content
        $('.modal-backdrop').appendTo('#wrapper');
        //removing body classes to able click events
        $('body').removeClass();
    });


    //getting click event to show modal
    $('#settingsbutton').click(function () {
        $('#modal_settings').modal();

        //appending modal background inside the bigform-content
        $('.modal-backdrop').appendTo('#wrapper');

        //removing body classes to able click events
        $('body').removeClass();
    });

    //getting click event to show modal
    $('#myprofile').click(function (e) {
        e.preventDefault();

        $('#modal_profile').modal();

        //appending modal background inside the bigform-content
        $('.modal-backdrop').appendTo('#wrapper');
        //removing body classes to able click events
        $('body').removeClass();
    });

    var citynames = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: {
            url: '/static/citynames.json',
            filter: function(list) {
                return $.map(list, function(cityname) {
                    return { name: cityname };
                });
            }
        }
    });

    citynames.initialize();

    $('#tagsinput').tagsinput({
        typeaheadjs: {
            name: 'citynames',
            displayKey: 'name',
            valueKey: 'name',
            source: citynames.ttAdapter()
        },
        confirmKeys: [44,188,32]
    });
});
