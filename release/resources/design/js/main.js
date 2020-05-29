$(function () {
    //align columns
    if ($('.doc_menu').length > 0) {
        if ($('.doc_menu').outerHeight() > $('.doc_content').height()) {
            $('.doc_content').height($('.doc_menu').outerHeight() + 100);
        }
    }

    //documentation menu
    $('.sub_menu > a').click(function () {
        $(this).parent().toggleClass('opened');
        if ($('.doc_menu').length > 0) {
            if ($('.doc_menu').outerHeight() > $('.doc_content').height()) {
                $('.doc_content').height($('.doc_menu').outerHeight() + 100);
            }
        }
        return false;
    })

    $(document).ready(function () {
        //slider home page
        var swipes = [];
        $('.swiper-container').not('.no-slider').each(function (index, e) {
            if (typeof Swiper != "undefined") {
                swipes[index] = new Swiper('.swiper-container', {
                    loop: true,
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev'
                });
            }
        });

        $('.slider-left').click(function () {
            swipes[$(this).index('.slider-left')].prev();
            return false;
        });

        $('.slider-right').click(function () {
            swipes[$(this).index('.slider-right')].next();
            return false;
        });

    });

    //Responsive big images
    $('img[src=""]').each(function () {
        ResponsiveImage($(this));
        ;
    });

    $('.menu_link').click(function () {
        $('body').toggleClass('menu_opened');
    });

    $('.dropdown > a').click(function () {
        if ($(window).width() < 1271) {
            $(this).toggleClass('active');
            $(this).next().toggleClass('show_sub_menu');
            return false;
        }
    });

	$(window).resize(function()
	{
        if ($(window).width() > 1110) {
            if ($('.doc_menu_title').parent().children('ul').css('display') == "none") {
                $('.doc_menu_title').removeClass('active');
                $('.doc_menu_title').parent().children('ul').css('display', 'block');
            }
		}
	});
	
    $('.doc_menu_title').click(function () {
        if ($(window).width() < 1110) {
            $(this).toggleClass('active');
            $(this).parent().children('ul').slideToggle('fast');
        }
    })

    $('.doc_content').click(function () {
        return;
        if ($(window).width() < 1110 && $('.doc_menu_title').hasClass('active'))
        {
            var scrollY = $(document).scrollTop();
            $('body, html').scrollTop(scrollY - $('.doc_menu > ul').height());
            $('.doc_menu_title').removeClass('active');
            $('.doc_menu_title').parent().children('ul').slideUp('fast');
        }
    })

    $('body').click(function (e) {
        if ($(this).hasClass('menu_opened')) {
            if ((!$('.header').is(e.target) && $('.header').has(e.target).length === 0)) {
                $(this).removeClass('menu_opened');
                return false;
            }
        }
    });

    CalculateColumns();
});

function ResponsiveImage(elem) {
    if ($(window).width() > 1023) {
        elem.attr('src', elem.attr('data-desktop'));
    }
    else if ($(window).width() > 1110) {
        if (typeof (elem.attr('data-tablet')) != 'undefined') {
            elem.attr('src', elem.attr('data-tablet'));
        } else {
            elem.attr('src', elem.attr('data-desktop'));
        }

    }
    else {
        if (typeof (elem.attr('data-mobile')) != 'undefined') {
            elem.attr('src', elem.attr('data-mobile'));
        } else {
            if (typeof (elem.attr('data-tablet')) != 'undefined') {
                elem.attr('src', elem.attr('data-tablet'));
            } else {
                elem.attr('src', elem.attr('data-desktop'));
            }
        }
    }
}

$(window).load(function () {
    if ($('.logo_wrap').length > 0) {
        SlideLogos();
    }
})

$(window).resize(function () {
    $('[data-desktop], [data-tablet], [data-mobile]').each(function () {
        ResponsiveImage($(this));
    });

    CalculateColumns();
})

function CalculateColumns() {
    if ($(window).width() > 1023) {
        $('.text_column').each(function (index, el) {
            if ($(this).next().hasClass('text_column')) {
                if ($(this).height() < $(this).next().height()) {
                    $(this).height($(this).next().height());
                }
            }
        });
    } else {
        $('.text_column').removeAttr('style');
    }
}

//floating header
var scrollY_prev = 0;
var scrollY_prev2 = 0;
var scrollY_prev3 = 0;
$(window).scroll(function () {
    var scrollY = $(document).scrollTop();
    if (!$('body').hasClass('menu_opened')) {
        if (scrollY > 320) {
            if (scrollY_prev > scrollY) {
                scrollY_prev2 += scrollY_prev - scrollY;
                scrollY_prev3 = 0;
                if (scrollY_prev2 > 300) {
                    $('body').addClass('header_fixed');
                }
            } else {
                scrollY_prev3 += scrollY - scrollY_prev;
                scrollY_prev2 = 0;
                if (scrollY_prev3 > 300) {
                    $('body').removeClass('header_fixed');
                }
            }
            $('body').addClass('header_is_fixed');
        }
        else if (scrollY == 0) {
            $('body').removeClass('header_fixed');
            $('body').removeClass('header_is_fixed');
        }
        scrollY_prev = scrollY;
    }
});



var logo_index = 2;
var logo_count = 3;
function SlideLogos() {
    setTimeout(function () {
        if (logo_index > logo_count) {
            logo_index = 1;
        }
        var img = $('.logo_wrap img');
        var src = img.attr('src');
        img.addClass('fadeout');
        setTimeout(function () {
            img.attr('src', src.substring(0, src.length - 10) + 'logos' + logo_index + '.png');
            img.load(function () {
                setTimeout(function () {
                    img.removeClass('fadeout');
                }, 200);
            });
        }, 200);
        SlideLogos();
    }, 5000);
}