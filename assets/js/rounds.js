$(document).ready(function() {

    // <% if (typeof userID == 'undefined'){ %>

    $('.checkloggedin').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        if ( $('.dropdown').find('.dropdown-menu').is(":hidden")) {
            $('.dropdown').find('[data-toggle=dropdown]').dropdown('toggle');
        }
    });

    //<% } %>

    // console.log($('#username').val());

    $("#login-form").on('submit',function(e) {

        if($("#username").val() == "" && $("#password").val() == "") {

            $("#username").attr('style', "border-radius: 5px; border:#FF0000 1px solid;");
            $("#password").attr('style', "border-radius: 5px; border:#FF0000 1px solid;");
            return false;

        } else if($("#username").val() == "" && $("#password").val() != "") {

            $("#username").attr('style', "border-radius: 5px; border:#FF0000 1px solid;");
            $("#password").removeAttr('style');
            return false;

        } else if ($("#password").val() == "" && $("#username").val() != "") {
            $("#password").attr('style', "border-radius: 5px; border:#FF0000 1px solid;");
            $("#username").removeAttr('style');
            return false;
        } else {
            return true;
        };
    });
});
