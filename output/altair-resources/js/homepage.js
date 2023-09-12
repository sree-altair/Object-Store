/*Add Categories and Seperator to Index Page*/
var row_no = 1;
$(".wh_tile").each(function (index) {
  index = index + 1; //set index to 1 for simplicity

  /*for tiles 1 & 2 */
  if (index < 3) {
    /* $(this).prepend('<div class="col-md-4">'); */
    $(this).append(" ");
  } else if (index == 3) {
    /*first row only has 3 tiles so end the row, add a line, and start a new one*/
    $(
      '<p><div class="categories">Categories</div></p><div class="seperator"/>'
    ).insertAfter(this);
    row_no = row_no + 1;
  } else {
    /* $(this).prepend('<div class="col-md-3">');
        $(this).append('<p>THIS IS TILE '+index+' '+row_no+'</p></div>'); */
    /* at tiles 7, 11, 15, etc, end the row, add a line, and start a new one */
    if (index == row_no * 4 - 1) {
      $('<div class="seperator"/>').insertAfter(this);
      row_no = row_no + 1;
    }
  }
});

/*Add href to all elements inside main page tiles*/
var tilayNum = 0;
var topicRefLink = "declared";
var str1 = '<a href="';
var str2 = '"></a>';
$(".wh_tile").each(function () {
  switch (tilayNum) {
    case 0:
      var topicRefLink = $(this).find("a").attr("href");
      var imgLink = str1.concat(topicRefLink, str2);
      $(this).find(".wh_tile_image").wrap(imgLink);
      $(this).find(".wh_tile_shortdesc").wrap(imgLink);
      break;
    case 1:
      var topicRefLink = $(this).find("a").attr("href");
      var imgLink = str1.concat(topicRefLink, str2);
      $(this).find(".wh_tile_image").wrap(imgLink);
      $(this).find(".wh_tile_shortdesc").wrap(imgLink);
      break;
    case 2:
      var topicRefLink = $(this).find("a").attr("href");
      var imgLink = str1.concat(topicRefLink, str2);
      $(this).find(".wh_tile_image").wrap(imgLink);
      $(this).find(".wh_tile_shortdesc").wrap(imgLink);
      break;
    default:
      break;
  }
  tilayNum = tilayNum + 1;
});

$("div.wh_tiles > div.wh_tile:lt(3)").wrapAll('<div class="mainTiles"></div>');

//Conditionally render HyperWorks homepage if html parameter file is present and the current page is the home page
if (
  document.getElementById("hwpluginextension") &&
  window.location.href.includes("index.htm")
) {
  //Move product tiles underneath main tiles
  const homepageTiles = document.querySelector(".hwhomepage");
  const mainTiles = document.querySelector(".mainTiles");
  mainTiles.append(homepageTiles);

  // Remove default plugin tiles
  document.querySelector(".categories").remove();
  document.querySelectorAll(".wh_tile").forEach((tile) => {
    if (!tile.querySelector("div").children[0].href) {
      tile.remove();
    }
  });
}

//Remove help button from the DOM if Activate
if (
  window.location.href.includes("activate/business") ||
  window.location.href.includes("activate/personal")
) {
  const helpButton = document.querySelector(".helpHome");
  helpButton?.remove();
}
