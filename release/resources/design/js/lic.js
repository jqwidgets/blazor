$(function () {

    var me = this;

    var prices = { 'website': 199, 'developer': 399, 'enterprise': 899 };

    $('#billingform').hide();
    updateTotal();

    // custom number input
    $('.input_number input').val(0);
    $('.input_number a').click(function () {
        var input = $(this).parent().find('input');
        var number_text = $(this).parent().find('.number').children('span');
        var number = parseInt($(this).parent().find('input').val());

        if ($(this).hasClass('up')) {
            number += 1;
        }
        else {
            number -= 1;
        }
        number = Math.max(0, number);
        number = Math.min(999, number);

        if (number > 0) {
            number_text.html(number);
        }
        else {
            number_text.html('');
        }

        input.val(number);

        var total = updateTotal();

        if (total == 0) {
            $('.discount_wrap input[type="button"]').attr('disabled', true);
            $('.discount_wrap input[type="button"]').addClass('disabled');

            $('#billingform').hide();
        }
        else {
            $('.discount_wrap input[type="button"]').removeAttr('disabled');
            $('.discount_wrap input[type="button"]').removeClass('disabled');
        }

        updateCountryFieldVisibility();
        validateForm();

        return false;
    });

    function updateTotal() {
        fetchDiscount();

        var sum = 0;

        $('.input_number input').each(function () {
            sum += $(this).val() * parseInt($(this).parent().parent().children('.price').text().substring(1));
        });

        if ($('#checkBoxExtendSubscription').is(':checked')) {
            sum *= 1.25;
        }

        var discount = 0;
        var total = sum;

        if (!isNaN(me.discount) && me.discount > 0) {
            discount = sum * me.discount;
            total = sum * (1 - me.discount);

            $('#trSubtotal').show();
            $('#trDiscount').show();
        }
        else {
            $('#trSubtotal').hide();
            $('#trDiscount').hide();
        }

        sum = new Number(sum).toFixed(2);
        discount = new Number(discount).toFixed(2);
        total = new Number(total).toFixed(2);

        var extensionCost = new Number(total * 0.25);
        var renewCost = new Number(extensionCost * 2);

        $('#subtotalText').html('$' + sum);
        $('#discountText').html('$' + discount);
        $('#totalText').html('$' + total);

        $('#extensionCost').html(extensionCost);
        $('#renewCost').html(renewCost);


        return sum;
    }

    var getquantity = function (element) {
        var value = $('#' + element).val();
        if (value == null || value.toString().length == 0)
            return 0;

        if (isNaN(parseInt(value)))
            return 0;

        return Math.abs(parseInt(value));
    }

    function updateCountryFieldVisibility() {
        if ($('#paypalradio').is(':checked')) {
            $("#countrypaypal").show();
            $("#countrymb").hide();
        }
        else {
            $("#countrypaypal").hide();
            $("#countrymb").show();
        }

        validateForm();
    }

    $("#paypalradio, #moneybookersradio").bind('change', function (event) {
        updateCountryFieldVisibility();
    });

    $('#btnCheckout').bind('click', function () {
        if ($('#paypalradio').is(':checked')) {
            submitPayPal();
        }
        else {
            submitSkrill();
        }
    });

    $('.input_number').click(function () {
        $(this).children('.up').trigger('click');
    })

    $('.discount_wrap .add_cart').click(function () {
        if (!$(this).hasClass('disabled')) {
            if (typeof ($(this).attr('disabled')) == 'undefined') {
                $('#billingform').slideDown('fast', function () {
                    var scrollY = $(this).offset().top;
                    $('body, html').animate({ scrollTop: scrollY }, 1000);
                });
            }
        }
    });

    $('#checkBoxExtendSubscription').change(function () {
        updateTotal();
    });

    $('input[name="paymentmethod"]').change(function () {
        if ($(this).attr('id') == 'paypalradio') {
            $('#countrymb').hide();
            $('#countrypaypal').show();
        }
        else {
            $('#countrymb').show();
            $('#countrypaypal').hide();
        }
    })


    $("#countrymbfield").bind('change', function () {
        validateForm();
    });
    $("#countrypaypalfield").bind('change', function () {
        validateForm();
    });
    $("#cityfield").bind('keyup.textchange', function () {
        validateForm();
    });
    $("#firstnamefield").bind('keyup.textchange', function () {
        validateForm();
    });
    $("#lastnamefield").bind('keyup.textchange', function () {
        validateForm();
    });
    $("#addressfield").bind('keyup.textchange', function () {
        validateForm();
    });
    $("#countryfield").bind('keyup.textchange', function () {
        validateForm();
    });
    $("#domainnamefield").bind('keyup.textchange', function () {
        validateForm();
    });
    $("#zipfield").bind('keyup.textchange', function () {
        validateForm();
    });
    $("#emailfield").bind('keyup.textchange', function () {
        validateForm();
    });

    $('#discountInput').bind('change keyup.textchange', function () {
        clearTimeout(this.discountFetchTimer);

        this.discountFetchTimer = setTimeout(function () {
            updateTotal();
        }, 30);
    });

    function fetchDiscount() {
        var data = $.trim($("#discountInput").val());

        if (!data || data == me.discountCode)
            return;

        me.discountCode = data;

        $.ajax({
            url: "/wp-content/scripts/discount.php",
            async: false,
            data: { discount: data },
            success: function (response) {
                me.discount = parseFloat(response);
            },
            error: function (response) {
            }
        });
    }

    var validateForm = function () {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        $('.price_wrap input[type="submit"]').attr('disabled', true);
        $('.price_wrap input[type="submit"]').addClass('disabled');
        var firstname = $("#firstnamefield").val();
        var lastname = $("#lastnamefield").val();
        var city = $("#cityfield").val();
        var state = $("#statefield").val();
        var address = $("#addressfield").val();
        var paypalradio = $('#paypalradio').is(':checked');
        var country = "";

        if (paypalradio) {
            country = $("#countrypaypalfield").val();
        }
        else {
            country = $("#countrymbfield").val();
        }

        var zipCode = $("#zipfield").val();
        var email = $("#emailfield").val();
        var domainname = $("#domainnamefield").val();
        var websitevalue = 0
        var sum = 0;
        $('.input_number input').each(function () {
            websitevalue += $(this).val();
            sum += $(this).val() * parseInt($(this).parent().parent().children('.price').text().substring(1));
        });

        if ($(this).is(':checked')) {
            sum *= 1.25;
        }

        fetchDiscount();

        if (!isNaN(me.discount) && me.discount > 0)
            sum *= me.discount;

        sum = Math.round(sum * 100) / 100;

        var webLicQnty = getquantity('inputQntyWebSiteLic');

        var validdomain = webLicQnty == 0 ? true : domainname.length > 0;
        if (webLicQnty > 0)
            $('#domainnamerow').show();
        else
            $('#domainnamerow').hide();


        $('#btnCheckout').attr('disabled', true);

        if (validdomain &&
            firstname.length > 0 &&
            lastname.length > 0 &&
            city.length > 0 &&
            address.length > 0 &&
            country.length > 0 &&
            country != "" &&
            zipCode.length > 0 &&
            email.length > 0 &&
            email.indexOf('@') != -1 &&
            email.indexOf('.') != -1 &&
            reg.test(email) &&
            sum > 0
        ) {
            $('.price_wrap input[type="submit"]').removeAttr('disabled');
            $('.price_wrap input[type="submit"]').removeClass('disabled');

            $('#btnCheckout').attr('disabled', false);
        }
    }


    var statecode = function (state) {
        switch (state) {
            case "Alberta":
            case "AB":
                return "AB";
            case "British Columbia":
            case "BC":
                return "BC";
            case "Manitoba":
            case "MB":
                return "MB";
            case "New Brunswick":
            case "NB":
                return "NB";
            case "Newfoundland and Labrador":
            case "NL":
                return "NL";
            case "Northwest Territories":
            case "NT":
                return "NT";
            case "Nova Scotia":
            case "NS":
                return "NS";
            case "Nunavut":
            case "NU":
                return "NU";
            case "Ontario":
            case "ON":
                return "ON";
            case "Prince Edward Island":
            case "PE":
                return "PE";
            case "Quebec":
            case "QC":
                return "QC";
            case "Saskatchewan":
            case "SK":
                return "SK";
            case "Yukon":
            case "YT":
                return "YT";
            case "Alabama":
            case "AL":
                return "AL";
            case "Alaska":
            case "AK":
                return "AK";
            case "American Samoa":
            case "AS":
                return "AS";
            case "Arizona":
            case "AZ":
                return "AZ";
            case "Arkansas":
            case "AR":
                return "AR";
            case "California":
            case "CA":
                return "CA";
            case "Colorado":
            case "CO":
                return "CO";
            case "Connecticut":
            case "CT":
                return "CT";
            case "Delaware":
            case "DE":
                return "DE";
            case "District of Columbia":
            case "DC":
                return "DC";
            case "Federated States of Micronesia":
            case "FM":
                return "FM";
            case "Florida":
            case "FL":
                return "FL";
            case "Georgia":
            case "GA":
                return "GA";
            case "Guam":
            case "GU":
                return "GU";
            case "Hawaii":
            case "HI":
                return "HI";
            case "Idaho":
            case "ID":
                return "ID";
            case "Illinois":
            case "IL":
                return "IL";
            case "Indiana":
            case "IN":
                return "IN";
            case "Iowa":
            case "IA":
                return "IA";
            case "Kansas":
            case "KS":
                return "KS";
            case "Kentucky":
            case "KY":
                return "KY";
            case "Louisiana":
            case "LA":
                return "LA";
            case "Maine":
            case "ME":
                return "ME";
            case "Marshall Islands":
            case "MH":
                return "MH";
            case "Maryland":
            case "MD":
                return "MD";
            case "Massachusetts":
            case "MA":
                return "MA";
            case "Michigan":
            case "MI":
                return "MI";
            case "Minnesota":
            case "MN":
                return "MN";
            case "Mississippi":
            case "MS":
                return "MS";
            case "Missouri":
            case "MO":
                return "MO";
            case "Montana":
            case "MT":
                return "MT";
            case "Nebraska":
            case "NE":
                return "NE";
            case "Nevada":
            case "NV":
                return "NV";
            case "New Hampshire":
            case "NH":
                return "NH";
            case "New Jersey":
            case "NJ":
                return "NJ";
            case "New Mexico":
            case "NM":
                return "NM";
            case "New York":
            case "NY":
                return "NY";
            case "North Carolina":
            case "NC":
                return "NC";
            case "North Dakota":
            case "ND":
                return "ND";
            case "Northern Mariana Islands":
            case "MP":
                return "MP";
            case "Ohio":
            case "OH":
                return "OH";
            case "Oklahoma":
            case "OK":
                return "OK";
            case "Oregon":
            case "OR":
                return "OR";
            case "Palau":
            case "PW":
                return "PW";
            case "Pennsylvania":
            case "PA":
                return "PA";
            case "Puerto Rico":
            case "PR":
                return "PR";
            case "Rhode Island":
            case "RI":
                return "RI";
            case "South Carolina":
            case "SC":
                return "SC";
            case "South Dakota":
            case "SD":
                return "SD";
            case "Tennessee":
            case "TN":
                return "TN";
            case "Texas":
            case "TX":
                return "TX";
            case "Utah":
            case "UT":
                return "UT";
            case "Vermont":
            case "VT":
                return "VT";
            case "Virgin Islands":
            case "VI":
                return "VI";
            case "Virginia":
            case "VA":
                return "VA";
            case "Washington":
            case "WA":
                return "WA";
            case "West Virginia":
            case "WV":
                return "WV";
            case "Wisconsin":
            case "WI":
                return "WI";
            case "Wyoming":
            case "WY":
                return "WY";
            case "Armed Forces Americas":
            case "AA":
                return "AA";
            case "Armed Forces":
            case "AE":
                return "AE";
            case "Armed Forces Pacific":
            case "AP":
                return "AP";
        }

        return state;
    };

    function submitSkrill() {
        var firstname = $("#firstnamefield").val();
        var lastname = $("#lastnamefield").val();
        var city = $("#cityfield").val();
        var address = $("#addressfield").val();
        var country = $("#countrymbfield").val();
        var company = $("#companyfield").val();
        var zipCode = $("#zipfield").val();
        var email = $("#emailfield").val();
        var vat = $("#vatfield").val();
        var company = $("#companyfield").val();
        var domainname = $("#domainnamefield").val();

        if (country == 'UNI') {
            $('#skrill_paytoemail').val('webstore@jqwidgets.com');
            $('#skrill_status_url').val('webstore@jqwidgets.com');
        }
        else {
            $('#skrill_paytoemail').val('payments@jqwidgets.com');
            $('#skrill_status_url').val('payments@jqwidgets.com');
        }

        var devLicQnty = getquantity('inputQntyDevLic');
        var webLicQnty = getquantity('inputQntyWebSiteLic');
        var entLicQnty = getquantity('inputQntyEntLic');
        if (isNaN(devLicQnty)) {
            devLicQnty = 0;
        }
        if (isNaN(webLicQnty)) {
            webLicQnty = 0;
        }
        if (isNaN(entLicQnty)) {
            entLicQnty = 0;
        }

        subscriptionYears = 1;
        if ($('#checkBoxExtendSubscription').is(':checked')) {
            webLicQnty = new Number(webLicQnty * 1.25 * 100) / 100;
            devLicQnty = Math.round(devLicQnty * 1.25 * 100) / 100;
            entLicQnty = Math.round(entLicQnty * 1.25 * 100) / 100;
            subscriptionYears = 2;
        }

        var webLicPrice = prices['website'];
        var devLicPrice = prices['developer'];
        var entLicPrice = prices['enterprise'];

        if (!isNaN(me.discount != 0) && me.discount > 0) {
            webLicPrice *= (1 - me.discount);
            devLicPrice *= (1 - me.discount);
            entLicPrice *= (1 - me.discount);
        }

        $('#m_details1_text').val("Commercial License" + ((webLicQnty + devLicQnty + entLicQnty > 1) ? "s" : "") + " with " + subscriptionYears + "year" + (subscriptionYears == 1 ? "" : "s") + " subscription");

        var total = webLicQnty * webLicPrice + devLicQnty * devLicPrice + entLicQnty * entLicPrice;
        $('#amount').val(total);

        if (isNaN(total) || total <= 0)
            return;

        var packagedetails = "\r\nWebsite License Volume:" + webLicQnty + "/" + domainname;
        packagedetails += "\r\nDeveloper License Volume:" + devLicQnty;
        packagedetails += "\r\Enterprise License Volume:" + entLicQnty;
        packagedetails += "\r\Subscription:" + subscriptionYears + " years";

        $('#customer_name').val("Customer: " + firstname + " " + lastname + " Purchase Details: " + packagedetails);
        $('#customer_address').val("Address: " + address + " City: " + city + " ZIP: " + zipCode);
        $('#customer_country').val("Country: " + country);
        $('#customer_company').val("Company: " + company);
        $('#customer_vat').val("VAT: " + vat);
        $('#m_firstname').val(firstname);
        $('#m_lastname').val(lastname);
        $('#m_country').val(country);
        $('#m_pay_from_email').val(email);

        var paymentinfourl = 'https://jqwidgets.com/service/paymentcheckout.php?email=' + email + '&firstname=' + firstname + '&lastname=' + lastname + '&city=' + city + '&address=' + address + '&country=' + country + '&company=' + company + '&vat=' + vat + '&domainname=' + domainname + '&packagedetails=' + packagedetails;

        alert(paymentinfourl);
        /*
        $.ajax({
        url: paymentinfourl,
        async: false,
        success: function (response) {
        },
        error: function (response) {
        }
        });*/

        $('#formSkrill').submit();
    }

    function submitPayPal() {
        var firstname = $("#firstnamefield").val();
        var lastname = $("#lastnamefield").val();
        var city = $("#cityfield").val();
        var state = $("#statefield").val();
        var address = $("#addressfield").val();
        var country = $("#countrypaypalfield").val();

        if (country == 'US') {
            $('#paypalbusinessemail').val('webstore@jqwidgets.com');
        }
        else {
            $('#paypalbusinessemail').val('info@jqwidgets.com');
        }

        var company = $("#companyfield").val();
        var zipCode = $("#zipfield").val();
        var email = $("#emailfield").val();
        var vat = $("#vatfield").val();
        var company = $("#companyfield").val();
        var domainname = $("#domainnamefield").val();

        var devLicQnty = getquantity('inputQntyDevLic');
        var webLicQnty = getquantity('inputQntyWebSiteLic');
        var entLicQnty = getquantity('inputQntyEntLic');
        if (isNaN(devLicQnty)) {
            devLicQnty = 0;
        }
        if (isNaN(webLicQnty)) {
            webLicQnty = 0;
        }
        if (isNaN(entLicQnty)) {
            entLicQnty = 0;
        }

        var webLicPrice = prices['website'];
        var devLicPrice = prices['developer'];
        var entLicPrice = prices['enterprise'];

        if (!isNaN(me.discount != 0) && me.discount > 0) {
            webLicPrice *= (1 - me.discount);
            devLicPrice *= (1 - me.discount);
            entLicPrice *= (1 - me.discount);
        }

        if ($('#checkBoxExtendSubscription').is(':checked')) {
            webLicPrice = Math.round(webLicPrice * 1.25 * 100) / 100;
            devLicPrice = Math.round(devLicPrice * 1.25 * 100) / 100;
            entLicPrice = Math.round(entLicPrice * 1.25 * 100) / 100;
        }

        webLicPrice = new Number(webLicPrice).toFixed(2);
        devLicPrice = new Number(devLicPrice).toFixed(2);
        entLicPrice = new Number(entLicPrice).toFixed(2);

        var clearPayPalFields = function () {
            $('#paypalitem')[0].name = "";
            $('#paypalquantity')[0].name = "";
            $('#paypalamount')[0].name = "";

            $('#paypalitem2')[0].name = "";
            $('#paypalquantity2')[0].name = "";
            $('#paypalamount2')[0].name = "";

            $('#paypalitem3')[0].name = "";
            $('#paypalquantity3')[0].name = "";
            $('#paypalamount3')[0].name = "";
        }

        var setPayPalFields = function (licenseType, fieldNumber, qnty, price) {
            var quantityInput = $('#paypalquantity' + fieldNumber);
            var amountInput = $('#paypalamount' + fieldNumber);
            var itemInput = $('#paypalitem' + fieldNumber);
            if (fieldNumber == 1) {
                var quantityInput = $('#paypalquantity');
                var amountInput = $('#paypalamount');
                var itemInput = $('#paypalitem');
            }

            quantityInput[0].name = "quantity_" + fieldNumber;
            amountInput[0].name = "amount_" + fieldNumber;
            itemInput[0].name = "item_name_" + fieldNumber;

            quantityInput.val(qnty);
            amountInput.val(price);

            switch (licenseType) {
                case 0:
                    itemInput.val("jQWidgets Website License with ");
                    break;
                case 1:
                    itemInput.val("jQWidgets Developer License with ");
                    break;
                case 2:
                    itemInput.val("jQWidgets Enterprise License with ");
                    break;
            }

            if ($('#checkBoxExtendSubscription').is(':checked'))
                itemInput.val(itemInput.val() + "2 years subscription");
            else
                itemInput.val(itemInput.val() + "1 year subscription");


            var summary = quantityInput.val() + " " + itemInput.val();

            return summary;
        }

        clearPayPalFields();

        var fieldNumber = 0;
        var packagedetails = "";
        if (webLicQnty != 0) {
            fieldNumber++;
            var result = setPayPalFields(0, fieldNumber, webLicQnty, webLicPrice);
            packagedetails += "_" + result;
        }

        if (devLicQnty != 0) {
            fieldNumber++;
            var result = setPayPalFields(1, fieldNumber, devLicQnty, devLicPrice);
            packagedetails += "_" + result;
        }

        if (entLicQnty != 0) {
            fieldNumber++;
            var result = setPayPalFields(2, fieldNumber, entLicQnty, entLicPrice);
            packagedetails += "_" + result;
        }

        $('#paypalcity').val(city);
        if (country == "US") {
            state = statecode(state);
        }

        $('#paypalstate').val(state);
        $('#paypalcountry').val(country);
        $('#paypalzip').val(zipCode);
        $('#paypaladdress').val(address);
        $('#paypalfirstname').val(firstname);
        $('#paypallastname').val(lastname);

        var paymentinfourl = 'https://jqwidgets.com/service/paymentcheckout.php?email=' + email + '&firstname=' + firstname + '&lastname=' + lastname + '&city=' + city + '&address=' + address + '&country=' + country + '&company=' + company + '&vat=' + vat + '&domainname=' + domainname + '&packagedetails=' + packagedetails;

        alert(paymentinfourl);
        /*
        $.ajax({
        url: paymentinfourl,
        async: false,
        success: function (response) {

        },
        error: function (response) {
        }
        });
        */
        $('#formPayPal').submit();
    }

});