jQuery(document).ready(function () {
    
	$("#btnFormDownload").jqxButton({
		disabled : true,
		width : '130',
		height : '32',
		theme : 'arctic',
		cursor : 'pointer'
	});
    
	$("#divDownloadWindow").css('visibility', 'hidden');
    
	$("#divDownloadWindow").jqxWindow({
		width : '325',
		height : '215',
		resizable : false,
		isModal : true,
		theme : 'arctic',
		autoOpen : false,
		draggable : false
	});
    
	var buttontype = 1;
    
	$("#btnDownloadCommercial").bind("click", function () {
		buttontype = 1;
		$("#divDownloadWindow").css('visibility', 'visible');
        /*
		var offset = $("#btnDownloadCommercial").offset();
		var leftoffset = -200 + $(document).width() / 2;
		$("#divDownloadWindow").jqxWindow({
			position : {
				x : leftoffset,
				y : offset.top + 30
			}
		});*/
		$("#divDownloadWindow").jqxWindow('show');
	});
    
	$("#btnDownload").bind("click", function () {
		buttontype = 2;
		$("#divDownloadWindow").css('visibility', 'visible');
		/*var offset = $("#btnDownloadCommercial").offset();
		var leftoffset = -200 + $(document).width() / 2;
		$("#divDownloadWindow").jqxWindow({
			position : {
				x : leftoffset,
				y : offset.top + 30
			}
		});*/
		$("#divDownloadWindow").jqxWindow('show');
	});
    
	var validateDownloadForm = function () {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		$("#btnFormDownload").jqxButton({
			disabled : true
		});
		var firstname = $("#download_firstnamefield").val();
		var lastname = $("#download_lastnamefield").val();
		var email = $("#download_emailfield").val();
		
		if (firstname.length > 0 &&
			lastname.length > 0 &&
			email.length > 0 &&
			email.indexOf('@') != -1 &&
			email.indexOf('.') != -1 &&
			reg.test(email)) {
		    $("#btnFormDownload").jqxButton({ disabled: false });
		}
	};
	
	$("#download_firstnamefield").bind('keyup.textchange', function () {
		validateDownloadForm();
	});
	
	$("#download_lastnamefield").bind('keyup.textchange', function () {
		validateDownloadForm();
	});
    
	$("#download_emailfield").bind('keyup.textchange', function () {
		validateDownloadForm();
	});

    $("#btnFormDownload").bind("click", function () {
		var firstname = $("#download_firstnamefield").val();
		var lastname = $("#download_lastnamefield").val();
		var email = $("#download_emailfield").val();
		if (email == $("#download_emailfield")[0].title || email.length > 255)
        {
			email = "anonymous";
        }
        
		$("#divDownloadWindow").jqxWindow('hide');
		var downloadURL = 'https://www.jqwidgets.com/builds/jqwidgets-ver3.9.1.zip';
		
		var data = {
			fn : firstname,
			ln : lastname,
			em : email,
			cp : '',
			cm : 1,
			build_path : downloadURL
		};
		if (buttontype == 2)
			data.cm = 0;
		
		$.ajax({
			dataType : 'json',
			url : 'https://www.jqwidgets.com/service/logdownload.php',
			data : data,
			type : 'POST',
			async : false,
			success : function (response) {},
			error : function (response) {}
		});
		location.href = downloadURL;
	});
});
