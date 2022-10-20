//Javascript used to change the splash screen that appears on the landing page
//function is dependant on the logo selected in the webhelp.logo.image parameter
$('.wh_logo img').each(function(i){
        var imgSrc = this.src;
        if(imgSrc.indexOf('_hw') >= 0){
            $(document.body).addClass('hyperworks');
        }
        if(imgSrc.indexOf('_st') >= 0){
            $(document.body).addClass('solidthinking');
        }
        if(imgSrc.indexOf('_cast') >= 0){
            $(document.body).addClass('cast');
        }
        if(imgSrc.indexOf('_form') >= 0){
            $(document.body).addClass('form');
        }
        if(imgSrc.indexOf('_extrudem') >= 0){
            $(document.body).addClass('extrudem');
        }
        if(imgSrc.indexOf('_extrudep') >= 0){
            $(document.body).addClass('extrudep');
        }
        if(imgSrc.indexOf('_inspire') >= 0){
            $(document.body).addClass('inspire');
        }
        if(imgSrc.indexOf('_studio') >= 0){
            $(document.body).addClass('studio');
        }
        if(imgSrc.indexOf('_activate') >= 0){
            $(document.body).addClass('activate');
        }
        if(imgSrc.indexOf('_compose') >= 0){
            $(document.body).addClass('compose');
        }
        if(imgSrc.indexOf('_embed') >= 0){
            $(document.body).addClass('embed');
        }
        if(imgSrc.indexOf('_mold') >= 0){
            $(document.body).addClass('mold');
        }
        if(imgSrc.indexOf('_oml') >= 0){
            $(document.body).addClass('oml');
        }
        else if(imgSrc.indexOf('_print') >= 0){
            $(document.body).addClass('print');
        }
});






