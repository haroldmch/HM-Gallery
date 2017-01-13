//HM-Gallery v 1.5
//By: Harold E. Muñoz
var HMGALLERY = {
    delay_click: true,
    delay_gallery:false,
    open_gallery: false,
    action_img: false,
    action_des: false,
    array_img: new Array(),
    array_thu: new Array(),
    array_des: new Array(),
    indexshow: 0,
    elements: undefined
};

$(function(){
    $('head').append('<link href="assets/css/hm-gallery.css" type="text/css" rel="stylesheet" />');

    HMGALLERY['array_img'] = getImages();
    if(text_hmg)
        HMGALLERY['array_des'] = getDescriptions();
    HMGALLERY['array_thu'] = HMGALLERY['array_img'].unique();
    
    preload(HMGALLERY['array_thu'],url_images);
    preload(HMGALLERY['array_thu'],url_thumbnails);
    
    $('.hmg_image_container').click(function(){
        if(HMGALLERY['delay_click']){
            HMGALLERY['delay_click'] = false;
            var strings = $(this).find('img').prop('src').split("/");
            openGallery(getIndex (strings[strings.length-1],HMGALLERY['array_img']));
        }else{
            HMGALLERY['delay_click'] = true;
        }
    }); 
    
    setTimeout(function() {
        showThumbnails($(".hmg_image_container"));
        $('.hmg_image_container').click(function(){
            if(HMGALLERY['delay_click']){
                HMGALLERY['delay_click'] = false;
                var strings = $(this).find('img').prop('src').split("/");
                openGallery(getIndex (strings[strings.length-1],HMGALLERY['array_img']));
            }else{
                HMGALLERY['delay_click'] = true;
            }
        });     
    }, 1000);
});

function getImages(){
    var images = new Array();
    var string;
	$.each( $('.hmg_image_container img'), function(i, val){
		string = $(this).prop("src").split("/");
		images[i] = string[string.length-1];
        //console.log(images[i]);
	});

	HMGALLERY['action_img'] = true;
    return images;
}  
function getDescriptions(){
    var descriptions = new Array();
    var string;
    $.each( $('.hmg_image_container span'), function(i, val){
		string = $(this).text();
		descriptions[i] = string;
        //console.log(descriptions[i]);
	});
    HMGALLERY['action_des'] = true;
    HMGALLERY['action_img'] = false;
    HMGALLERY['action_des'] = false;
    return descriptions;
}
function showThumbnails(_elementos){
    HMGALLERY['elements'] = _elementos;
    HMGALLERY['elements'].css("opacity", 0);
    HMGALLERY['elements'].css("visibility", "hidden");
    HMGALLERY['indexshow'] = 0;
    showNext();
}
function showNext(){
    HMGALLERY['elements'].eq(HMGALLERY['indexshow'])
        .css("visibility", "visible")
        .animate({
            opacity: 1,
          }, 500);

    HMGALLERY['indexshow'] ++;
    
    if(HMGALLERY['indexshow'] < HMGALLERY['elements'].length){
        setTimeout(showNext, 50);
    }
}
function getIndex(data,array){
    for(var i=0;i < array.length;i++)
		if(array[i] === data)
			return i;
}
function openGallery(data){
    if($(window).width() > 399 && $(window).height() > 399){
        if(!HMGALLERY['open_gallery']){
            HMGALLERY['open_gallery'] = true;
            generateFrame();
            var set_images = locateImages(data);
            changeSlide (set_images[1]);
            $('#hmg_background').css('visibility','visible').hide().fadeIn(transition_hmg,function(){
                $('#hmg_container').css('visibility','visible').hide().fadeIn(transition_hmg);
            });

            //Move imgs
            $('#hmg_image').on('click',function(){
                moveIMG(set_images[2],1);
                $('#hmg_slide').fadeIn(300,function(){
                    set_images = locateImages(set_images[2]);
                    HMGALLERY['delay_gallery'] = false;
                });
            });
            $('#hmg_left_button').click(function(){
                moveIMG(set_images[0],0);
                $('#hmg_slide').fadeIn(300,function(){
                    set_images = locateImages(set_images[0]);
                    HMGALLERY['delay_gallery'] = false;
                });
            });
            $('#hmg_right_button').click(function(){
                moveIMG(set_images[2],1);
                $('#hmg_slide').fadeIn(300,function(){
                    set_images = locateImages(set_images[2]);
                    HMGALLERY['delay_gallery'] = false;
                });
            });
            //Close
            $('#hmg_close_button').on('click',function(){
                closeGallery();
            });
            //Keyup
            $(document).keyup(function(event){
                if(event.which==27){
                    closeGallery();
                }
                if(event.which == 37){
                    moveIMG(set_images[0],0);
                    $('#hmg_slide').fadeIn(300,function(){
                        set_images = locateImages(set_images[0]);
                        HMGALLERY['delay_gallery'] = false;
                    });
                }
                if(event.which == 39){
                    moveIMG(set_images[2],1);
                    $('#hmg_slide').fadeIn(300,function(){
                        set_images = locateImages(set_images[2]);
                        HMGALLERY['delay_gallery'] = false;
                    });
                }
            });
        }  
    }
}
function locateImages(center){
	var left;
	var right;
	var imgs;
    
	if(center == HMGALLERY['array_img'].length-1)
		right = 0;
	else
		right = center+1;
	
	if(center == 0)
		left = HMGALLERY['array_img'].length-1;
	else
		left = center-1;
	
	imgs = [ left, center, right ];
    
	return imgs;
}
function changeSlide(local){
 //console.log(local);
    $('#hmg_image').attr("src","");
    $('#hmg_image').attr("src",url_images+HMGALLERY['array_img'][local]);
    $('#hmg_image').attr("ondragstart","return false");
    $('#hmg_text').text(HMGALLERY['array_des'][local]);
    var image = new Image();
    image.src = $('#hmg_image').attr("src");
}
function moveIMG(img,direction){
	if(!HMGALLERY['delay_gallery']){
		HMGALLERY['delay_gallery'] = true;
		if(direction>0){
			$('#hmg_slide').fadeOut(transition_hmg, function(){
				changeSlide(img);
			});
		}else{
			$('#hmg_slide').fadeOut(transition_hmg, function(){
				changeSlide(img);
			});
		}
	}	
}
function closeGallery(){
	$('#hmg_container').fadeOut(transition_hmg,function(){
        $('#hmg_background').fadeOut(transition_hmg);
        $('#hmg_background').remove();
        $('#hmg_container').remove();
    });
    HMGALLERY['open_gallery'] = false;
	HMGALLERY['delay_click'] = true;
}
function generateFrame(){
	var html='';
    var width = $(window).width();
    var height = $(window).height();
    
    html = html + '<div id="hmg_responsive">';
    html = html + '<div id="hmg_container">';
        html = html + '<div id="hmg_slide">';
            html = html+'<div id="hmg_close_button"><i class="fa fa-times-circle-o" aria-hidden="true"></i></div>';
            html = html + '<img id="hmg_image" src=""/>';
            if(text_hmg)
                html = html + '<span id="hmg_text"></span>';  
        html = html + '</div>';
        html = html+'<div id="hmg_left_button"><i class="fa fa-chevron-left" aria-hidden="true"></i></div>';
        html = html+'<div id="hmg_right_button"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>';
    html = html + '</div>';
    
    html = html + '<div id="hmg_background"></div>';
    html = html + '</div>';
    
    $('#hmg').append(html);
}

//****
Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

function preload(imageArray,url) {
    for (var i=0; i < imageArray.length; ++i) {
        var img = new Image();
        img.src = url+imageArray[i];
    }
}