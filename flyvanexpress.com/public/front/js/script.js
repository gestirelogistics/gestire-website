/*==================================================================================
    Custom scripts ( Any custom script you want to apply should be defined here ).
====================================================================================*/
$(document).ready(function() {

    if ($('#careerForm').length) {
        loadCountries(0);
        loadStates(0, 0)
    }


    $('input[type=radio][name=have_vehicle]').change(function() {

        if (this.value == '1') {
            $('.vehicle-info').show();
        } else {
            $('.vehicle-info').hide();
        }
    });
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        $('#sendBtn').prop('disabled', true);
        $('#sendBtn').html('<div class="spinner-border text-light" role="status">' +
            '<span class="visually-hidden">Loading...</span>' +
            '</div> Submit message');
        // var edata = new FormData();
        var edata = new FormData();
        edata.append("bname", $('#bname').val());
        edata.append("name", $('#name').val());
        edata.append("email", $('#email').val());
        edata.append("phone", $('#phone').val());
        edata.append("message", $('#message').val());

        $.ajax({
            url: $('#baseurl').val() + 'submit-conatct',
            type: 'POST',
            data: edata,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function(data) {
                console.log(data);
                if (data.res) {
                    alertify.success('Well done! ' + data.msg);
                    $('#contactForm').trigger('reset');
                } else {
                    if (data.validation) {
                        //$('.needs-validation').addClass('was-validated');
                        $.each(data.validation, function(i, msg) {
                            alertify.error(msg);
                            // $('.invalid-feedback').css('display','block !important');
                            // var cls = i+'-invalid-feedback';
                            // $('.'+cls).html(msg);
                            // console.log('class',cls);
                            // $('#'+i).addClass('is-invalid');
                        });
                    } else {
                        if (data.msg)
                            alertify.error(data.msg);
                    }
                }
                $('#sendBtn').removeAttr('disabled');
                $('#sendBtn').html('Submit');


            },
            error: function(data) {
                console.log(data);
            }
        });
        return false;
    });
    $('#careerForm').submit(function(e) {
        e.preventDefault();
        $('#submitBtn').prop('disabled', true);
        //    $('#submitBtn').hide();
        //     $('.submitbtnDiv').hide();
        $('#submitBtn').html('<div class="spinner-border text-light" role="status">' +
            '<span class="visually-hidden">Loading...</span>' +
            '</div> Submit');
        $('.feedback').html('');
        var have_vehicle = $('input[name="have_vehicle"]:checked').val();
        edata = new FormData();
        edata.append("fname", $('#fname').val());
        edata.append("lname", $('#lname').val());
        edata.append("mname", $('#mname').val());
        edata.append("dob", $('#dob').val());
        edata.append("phone", $('#phone').val());
        edata.append("email", $('#email').val());
        edata.append("address", $('#address').val());
        edata.append("country", $('#country').val());
        edata.append("state", $('#state').val());
        edata.append("city", $('#city').val());
        edata.append("zipcode", $('#zipcode').val());
        edata.append("licence", $('#licence').val());
        // var sval = new Array();
        // $.each($("input[name='station[]']:checked"), function() {
        //     sval.push($(this).val());

        // });
        console.log("have_vehicle", have_vehicle);
        edata.append("have_vehicle", have_vehicle);
        if (have_vehicle == "1") {
            edata.append("make", $('#make').val());
            edata.append("model", $('#model').val());
            edata.append("year", $('#year').val());
            edata.append("colour", $('#colour').val());
        } else {
            edata.append("make", "");
            edata.append("model", "");
            edata.append("year", "");
            edata.append("colour", "");
        }
        edata.append("station", '');
        edata.append("licencefront", $('input[name=licencefront]')[0].files[0]);
        edata.append("licenceback", $('input[name=licenceback]')[0].files[0]);
        edata.append("driverabstract", $('input[name=driverabstract]')[0].files[0]);
        $.ajax({
            url: $('#baseurl').val() + 'submit-career',
            type: 'POST',
            data: edata,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function(data) {
                console.log(data);
                if (data.res) {
                    alertify.success('Well done! ' + data.msg);
                    $('.vehicle-info').hide();
                    $('#careerForm').trigger('reset');
                } else {
                    console.log(data.validation);
                    if (data.validation) {
                        //$('.needs-validation').addClass('was-validated');
                        $.each(data.validation, function(i, msg) {
                            var cls = i + '-invalid-feedback';
                            $('.' + cls).html(msg);
                            console.log('class', cls);
                            $('#' + i).addClass('is-invalid');
                        });
                    } else {
                        if (data.msg)
                            alertify.error(data.msg);
                    }
                }
                $('#submitBtn').removeAttr('disabled');
                $('#submitBtn').html('Submit');


            },
            error: function(data) {
                console.log(data);
            }
        });
        return false;
    });
    $('#country').change(function() {
        var v = $(this).val();
        if (v) {
            loadStates(v, 0);
            $('#city').html('<option value="">Select City</option>');
        } else {
            $('#state').html('<option value="">Select State</option>');
            $('#city').html('<option value="">Select City</option>');
        }
    })
    $('#state').change(function() {
        var s = $(this).val();

        if (s > 0) {
            loadCities(s, 0);
        } else {
            $('#city').html('<option value="">Select City</option>');
        }

    })
});

function loadCountries(cid) {
    var base = $('#baseurl').val();


    $.ajax({
        url: base + 'getCountries',
        type: 'GET',
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function(data) {
            $('#country').html('<option value="">Select Country</option>');
            if (data.res) {

                $.each(data.countries, function(i, data) {
                    if (data.id == cid)
                        var div_data = "<option selected value=" + data.id + ">" + data.iso2 + "-" + data.name + "</option>";
                    else
                        var div_data = "<option value=" + data.id + ">" + data.iso2 + "-" + data.name + "</option>";
                    $(div_data).appendTo('#country');
                });

            }

        },
        error: function(data) {

        }
    });
}

function loadStates(v, sid) {

    var base = $('#baseurl').val();
    var lc = new FormData();
    lc.append("country", v);

    $.ajax({
        url: base + 'getStates',
        type: 'POST',
        data: lc,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function(data) {

            $('#state').html('<option value="">Select State</option>');
            if (data.res) {

                $.each(data.states, function(i, data) {

                    if (sid > 0 && sid == data.id)
                        var div_data = "<option selected value=" + data.id + ">" + data.iso2 + "-" + data.name + "</option>";
                    else
                        var div_data = "<option value=" + data.id + ">" + data.iso2 + "-" + data.name + "</option>";
                    $(div_data).appendTo('#state');
                });
            }

        },
        error: function(data) {

        }
    });

}

function loadCities(s, cid) {

    var base = $('#baseurl').val();
    var lc = new FormData();
    lc.append("state", s);

    $.ajax({
        url: base + 'getCities',
        type: 'POST',
        data: lc,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function(data) {

            $('#city').html('<option value="0">Select City</option>');
            if (data.res) {

                $.each(data.cities, function(i, data) {
                    if (cid > 0 && cid == data.id)
                        var div_data = "<option selected value=" + data.id + ">" + data.name + "</option>";
                    else
                        var div_data = "<option value=" + data.id + ">" + data.name + "</option>";
                    $(div_data).appendTo('#city');
                });
            }

        },
        error: function(data) {

        }
    });
}