$(document).ready(function() {

  // enthält alle Marker vom Server wenn die Karte geladen wurde
  var mapMarkers = [];
  // Zählt die Marker, die via AJAX lokal vom Nutzer gesetzt wurden
  var countMarkers = 0;
  // initiale Position des Users in Geokoordinaten
  var initialPosition = {};
  // initiale Adresse des Users als String
  var initialAddress = null;
  // aktuelle Position wenn der Marker verschoben wurde
  var currentPosition = {};
  // Geocoding Plugin
  var geocodeService = L.esri.Geocoding.geocodeService();
  // globale ID des Objektes um ein direktes PUT zu erlauben
  var objectID = null;
  // neue Objekte in einer Session werden hier abgelegt um sie den Markern zuordnen zu können
  var newObjects = [];
  // maximaler Abstand zwischen zwei Markern damit das Voting noch funktioniert
  var maxRadiusForVoting = 200;
  // deaktiviere Voting Buttons initial und aktiviere sie selektiv
  $('#btns_vote_up').prop('disabled', true);
  $('#btns_vote_down').prop('disabled', true);


  var mymap = L.map('mymap').locate({
    setView: true,
    maxZoom: 16
  }).on('locationfound', onLocationFound).on('locationerror', onLocationError);

  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mymap);


  function onLocationFound(e) {

    mapMarkers[countMarkers] = new L.marker(e.latlng, {
      draggable: true
    }).addTo(mymap).on('dragend', onDragEnd).on('click', onMarkerClick);


    var radius = e.accuracy / 2;

    // aktuelle Position auf die gefundene Position setzen
    currentPosition = e.latlng;

    // initiale Position auf die gefundene Position setzen
    initialPosition = e.latlng;

    geocodeService.reverse().latlng(initialPosition).run(function(error, result) {

      // initiale Adresse durch Geocoding
      initialAddress = result.address.Match_addr;

      mapMarkers[countMarkers].bindPopup(initialAddress).openPopup();

      //L.circle(e.latlng, radius).addTo(mymap);

      // initiale Adresse in HTML anzeigen (auch für spätere POSTS nötig)
      $('#myposition').html(initialAddress);


    });



  }

  $.ajax({
    type: "GET",
    url: "https://localhost:3000/theme/",
    success: function(response) {

    $.each(response, function(){
        $("#theme_select").append('<option value="'+ this._id +'">'+ this.name +'</option>')
        $("#theme_select_edit").append('<option value="'+ this._id +'">'+ this.name +'</option>')
    })

    },
    error: function(err) {
      console.log(err);
    }
});



  function onLocationError(e) {
    alert(e.message);
  }


  // wird nur ausgeführt bei Klick auf Marker, die in der Session vom User erstellt wurden
  function onMarkerClick(event) {


    $('#plusbutton').prop('disabled', false);

    mymap.closePopup();


    var reversedGeoAddress = null;

    // Logik um aus einem Marker die Adresse zu finden und daraus die ID zu erhalten für den
    // GET Request
    geocodeService.reverse().latlng(event.latlng).run(function(error, result) {

      reversedGeoAddress = result.address.Match_addr;

      jQuery.map(newObjects, function(val, i) {

        if (val.address == reversedGeoAddress) {

          objectID = val.id;

          $.ajax({
            type: "GET",
            url: "https://localhost:3000/objects/" + objectID,
            success: function(response) {

              checkCurrentPositionDistanceToMarker();

              var objectLocation = JSON.parse(response.location);

              geocodeService.reverse().latlng(objectLocation).run(function(error, result) {

                var reversedGeoAddress = result.address.Match_addr;

                $.ajax({
                  type: "GET",
                  url: "https://localhost:3000/theme/" + response.themeID,
                  success: function(theme) {

                $("#vote_text").text(response.votes);
                $("#objectPosition").text(reversedGeoAddress);
                $("#objectCreated").text(new Date(response.createdAt).toLocaleString());
                $("#objectUpdated").text(new Date(response.updatedAt).toLocaleString());
                $("#objectCategories").text(response.categories);
                $("#objectTheme").text(theme.name);
                $("#objectDescription").text(response.description);

              },
              error: function(err) {
                console.log(err);
              }
            });

                $("#modal_marker_edit #tagsinput_edit").tagsinput('removeAll');
                $("#modal_marker_edit #myposition_edit").html(reversedGeoAddress);

                jQuery.each(response.categories, function(i, cat) {
                  $("#modal_marker_edit #tagsinput_edit").tagsinput('add', cat);
                });


                $("#modal_marker_edit #textarea_infos_edit").val(response.description);

                $("#popup_link").on('click', function() {
                  mymap.closePopup();

                });

                $("#editbutton").on('click', function() {

                  $("#modal_marker").modal("hide");
                  $("#modal_marker_edit").modal("show");

                });

              });




            },
            error: function(err) {
              console.log(err);
            }




          });


        }



      });

    });

  }


  // wenn der initiale Positions-Marker verschoben wurde
  function onDragEnd(event) {


    $('#plusbutton').prop('disabled', false);

    var radius = event.target.accurancy / 2;
    var marker = event.target;
    var position = marker.getLatLng();
    marker.setLatLng(new L.LatLng(position.lat, position.lng), {
      draggable: 'true'
    });
    mymap.panTo(new L.LatLng(position.lat, position.lng))

    geocodeService.reverse().latlng(position).run(function(error, result) {

      marker.bindPopup(result.address.Match_addr).openPopup();

      currentPosition = position;
      $('#myposition').html(result.address.Match_addr);


    });
    mymap.addLayer(marker);

  }


  // Hole alle Objekte aus der Datenbank und setze entsprechende Marker
  $.ajax({
    type: "GET",
    url: "https://localhost:3000/objects/",
    success: function(response) {

      var markers = [];


      // Marker des Benutzers ROT, andere Marker GRÜN
      jQuery.map(response, function(val, i) {


        if (val.userID == '<%=user._id %>') {

          markers[i] = L.marker(JSON.parse(val.location), {
            icon: redIcon
          }).addTo(mymap);

        } else {
          markers[i] = L.marker(JSON.parse(val.location), {
            icon: greenIcon
          }).addTo(mymap);
        }

        markers[i].on('click', function() {


          $('#plusbutton').prop('disabled', true);

          // setze objectID für ein mögliches PUT
          objectID = val._id;

          // setze aktuelle Position auf die des Markers
          currentPosition = markers[i].getLatLng();
          checkCurrentPositionDistanceToMarker();
          geocodeService.reverse().latlng(JSON.parse(val.location)).run(function(error, result) {



            var reversedGeoAddress = result.address.Match_addr;


            markers[i].bindPopup(reversedGeoAddress + "<br>" + "<img id='markerImage' src='https://images-na.ssl-images-amazon.com/images/I/61vWHzU8L5L._SY355_.jpg'/>" + "<br>" +
              "<a id='popup_link' href='#modal_marker' data-toggle='modal'>Weitere Informationen</a>").openPopup();


            // GET Request falls der User das Objekt bearbeitet hat
            $.ajax({
              type: "GET",
              url: "https://localhost:3000/objects/" + objectID,
              success: function(response) {

                $.ajax({
                  type: "GET",
                  url: "https://localhost:3000/theme/" + response.themeID,
                  success: function(theme) {

                $("#vote_text").text(response.votes);
                $("#objectPosition").text(reversedGeoAddress);
                $("#objectCreated").text(new Date(response.createdAt).toLocaleString());
                $("#objectUpdated").text(new Date(response.updatedAt).toLocaleString());
                $("#objectCategories").text(response.categories);
                $("#objectTheme").text(theme.name);
                $("#objectDescription").text(response.description);

              },
              error: function(err) {
                console.log(err);
              }
            });

                $("#modal_marker_edit #tagsinput_edit").tagsinput('removeAll');
                $("#modal_marker_edit #myposition_edit").html(reversedGeoAddress);

                jQuery.each(response.categories, function(i, cat) {
                  $("#modal_marker_edit #tagsinput_edit").tagsinput('add', cat);
                });


                $("#modal_marker_edit #textarea_infos_edit").val(response.description);

              },
              error: function(err) {
                console.log(err);
              }
            });


            $("#popup_link").on('click', function() {
              mymap.closePopup();
            });

            $("#editbutton").on('click', function() {

              $("#modal_marker").modal("hide");
              $("#modal_marker_edit").modal("show");

            });



          });

        });
      })


    },
    error: function(err) {
      console.log(err);
    }
  });




  $("#beitrag_submit_edit").on('click', function(e) {
    e.preventDefault();


    if ($('#tagsinput_edit').val()) {

      var data = {

        location: JSON.stringify(currentPosition),
        categories: JSON.stringify($('#tagsinput_edit').tagsinput('items')),
        description: $('#textarea_infos_edit').val(),
        userID: "<%= user._id %>",
        themeID: $('#theme_select_edit option:selected').val(),
        picture: $("#file").prop("files")[0]

      }

      $.ajax({
        type: "PUT",
        url: "https://localhost:3000/objects/" + objectID,
        data: data,
        success: function(response) {
          geocodeService.reverse().latlng(JSON.parse(response.location)).run(function(error, result) {



            var reversedGeoAddress = result.address.Match_addr;

            $.ajax({
              type: "GET",
              url: "https://localhost:3000/theme/" + response.themeID,
              success: function(theme) {

            $("#vote_text").text(response.votes);
            $("#objectPosition").text(reversedGeoAddress);
            $("#objectCreated").text(new Date(response.createdAt).toLocaleString());
            $("#objectUpdated").text(new Date(response.updatedAt).toLocaleString());
            $("#objectCategories").text(response.categories);
            $("#objectTheme").text(theme.name);
            $("#objectDescription").text(response.description);

          },
          error: function(err) {
            console.log(err);
          }
        });

            $("#modal_marker_edit #tagsinput_edit").tagsinput('removeAll');
            $("#modal_marker_edit #myposition_edit").html(reversedGeoAddress);

            jQuery.each(response.categories, function(i, vale) {
              $("#modal_marker_edit #tagsinput_edit").tagsinput('add', vale);
            });


            $("#modal_marker_edit #textarea_infos_edit").val(response.description);



            $('#modal_marker_edit').modal('hide');
            $("#modal_marker").modal("show");

          });

        },
        error: function(err) {
          console.log(err);
        }
      });
    } else {
      alert("Felder ausfüllen");
    }
  });


  function checkCurrentPositionDistanceToMarker() {

    $('#btns_vote_up').removeAttr('style');
    $('#btns_vote_down').removeAttr('style');

    if (initialPosition.distanceTo(currentPosition) < maxRadiusForVoting) {

      $('#btns_vote_up').prop('disabled', false);
      $('#btns_vote_down').prop('disabled', false);

      return true;

    }


    $('#btns_vote_up').prop('disabled', true);
    $('#btns_vote_down').prop('disabled', true);
    return false;
  }

  $("#btns_vote_up").on('click', function() {


    var data = {

      vote: 1,
      userID: "<%= user._id %>",
      objectID: objectID

    }

    $.ajax({
      type: "POST",
      url: "https://localhost:3000/votes/",
      data: data,
      success: function(response) {

        $('#btns_vote_down').prop('disabled', true);
        $('#btns_vote_up').prop('disabled', true);

        $('#btns_vote_up').css({
          "opacity": 1
        })

        $.ajax({
          type: "GET",
          url: "https://localhost:3000/objects/" + objectID,
          success: function(response) {

            $("#vote_text").text(response.votes);

          },
          error: function(err) {
            console.log(err);
          }
        });

      },
      error: function(err) {
        console.log(err);
      }
    });

  });

  $("#btns_vote_down").on('click', function() {


    var data = {

      vote: 0,
      userID: "<%= user._id %>",
      objectID: objectID

    }

    $.ajax({
      type: "POST",
      url: "https://localhost:3000/votes/",
      data: data,
      success: function(response) {

        $('#btns_vote_up').prop('disabled', true);
        $('#btns_vote_down').prop('disabled', true);

        $('#btns_vote_down').css({
          "opacity": 1
        })

        $.ajax({
          type: "GET",
          url: "https://localhost:3000/objects/" + objectID,
          success: function(response) {

            $("#vote_text").text(response.votes);

          },
          error: function(err) {
            console.log(err);
          }
        });

      },
      error: function(err) {
        console.log(err);
      }
    });

  });



  $("#beitrag_submit").on('click', function(e) {
    e.preventDefault();


    if ($('#tagsinput').val()) {

      var data = {

        location: JSON.stringify(currentPosition),
        categories: JSON.stringify($('#tagsinput').tagsinput('items')),
        description: $('#textarea_infos').val(),
        userID: "<%= user._id %>",
        themeID: $('#theme_select option:selected').val(),
        picture: $("#file").prop("files")[0]

      }


      $.ajax({
        type: "POST",
        url: "https://localhost:3000/objects/",
        data: data,
        success: function(response) {


          $('#modal_beitrag').modal('hide')


          // setze den Marker auf der Karte fest
          mapMarkers[countMarkers].setIcon(redIcon).dragging.disable();

          geocodeService.reverse().latlng(currentPosition).run(function(error, result) {

            var reversedGeoAddress = result.address.Match_addr;

            // erzeuge ein neues Objekt für den Marker
            var object = {};
            object.id = response._id;
            object.address = reversedGeoAddress;

            newObjects.push(object);
            checkCurrentPositionDistanceToMarker();
            // binde ein Popup an den Marker
            mapMarkers[countMarkers - 1].bindPopup(reversedGeoAddress + "<br>" + "<img id='markerImage' src='https://images-na.ssl-images-amazon.com/images/I/61vWHzU8L5L._SY355_.jpg'/>" + "<br>" +
              "<a id='popup_link' href='#modal_marker' data-toggle='modal'>Weitere Informationen</a>").openPopup();

              $.ajax({
                type: "GET",
                url: "https://localhost:3000/theme/" + response.themeID,
                success: function(theme) {

              $("#vote_text").text(response.votes);
              $("#objectPosition").text(reversedGeoAddress);
              $("#objectCreated").text(new Date(response.createdAt).toLocaleString());
              $("#objectUpdated").text(new Date(response.updatedAt).toLocaleString());
              $("#objectCategories").text(response.categories);
              $("#objectTheme").text(theme.name);
              $("#objectDescription").text(response.description);

            },
            error: function(err) {
              console.log(err);
            }
          });

            $("#popup_link").on('click', function() {
              mymap.closePopup();



            });


            $("#modal_marker_edit #tagsinput_edit").tagsinput('removeAll');
            $("#modal_marker_edit #myposition_edit").html(reversedGeoAddress);


            jQuery.each(response.categories, function(i, cat) {
              $("#modal_marker_edit #tagsinput_edit").tagsinput('add', cat);
            });


            $("#modal_marker_edit #textarea_infos_edit").val(response.description);

            $("#editbutton").on('click', function() {

              $("#modal_marker").modal("hide");
              $("#modal_marker_edit").modal("show");

            });

          });

          // Resette das Formular für einen neuen Beitrag
          $('#beitrag_form')[0].reset();
          $("#tagsinput").tagsinput('removeAll');
          $("#myposition").html(initialAddress);

          // zähle Marker hoch um einen neuen zu erstellen
          countMarkers++;

          // neuer Marker für initiale Position
          mapMarkers[countMarkers] = new L.marker(initialPosition, {
            draggable: true
          }).addTo(mymap).on('dragend', onDragEnd).on('click', onMarkerClick);


          mapMarkers[countMarkers].bindPopup(initialAddress);



        },
        error: function(err) {
          console.log(err);
        }
      });
    } else {
      alert("Felder ausfüllen");
    }
  });



  //getting click event to show modal
  $('#plusbutton').on('click', function() {
    $('#modal_beitrag').modal();

    //appending modal background inside the bigform-content
    $('.modal-backdrop').appendTo('#wrapper');
    //removing body classes to able click events
    $('body').removeClass();
  });


  //getting click event to show modal
  $('#settingsbutton').click(function() {
    $('#modal_settings').modal();

    //appending modal background inside the bigform-content
    $('.modal-backdrop').appendTo('#wrapper');
    //removing body classes to able click events
    $('body').removeClass();
  });

  //getting click event to show modal
  $('#myprofile').click(function(e) {
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
          return {
            name: cityname
          };
        });
      }
    }
  });
  citynames.initialize();

  $('#tagsinput').tagsinput({
    //                typeaheadjs: {
    //                    name: 'citynames',
    //                    displayKey: 'name',
    //                    valueKey: 'name',
    //                    source: citynames.ttAdapter()
    //                }
    confirmKeys: [44, 188, 32],
    trimValue: true
  });

  $('#tagsinput_edit').tagsinput({
    //                typeaheadjs: {
    //                    name: 'citynames',
    //                    displayKey: 'name',
    //                    valueKey: 'name',
    //                    source: citynames.ttAdapter()
    //                }
    confirmKeys: [44, 188, 32],
    trimValue: true
  });

});
