switch(window.location.protocol) {
   case 'http:':
   case 'https:':
         //Google Tag Manager
         var gt = document.createElement("script");
         gt.async = "async";
         gt.type = "text/javascript";
         gt.src = "https://www.googletagmanager.com/gtag/js?id=UA-4424669-1";
         $('head').append(gt);

     break;
   case 'file:':
         console.log('Help is local. Google Analytics is not available.');

     break;
   default: 
         console.log('Help is local. Google Analytics is not available.');
}