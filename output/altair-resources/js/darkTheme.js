function initializeDarkMode() {
  //Remove the toggle if using Firefox. Local storage is unreliable when working with local help.//
  if (navigator.userAgent.includes("Firefox") && window.location.protocol.includes("file")) {
    $(".darkModeToggle").remove();
    return;
  }

  // On page load, sets the checkbox state based on local storage//
  $(document).ready(function () {
    const toggle = document.querySelector(".darkModeToggle input");
    const onOff = toggle.parentNode.querySelector(".onoff");
    let isDarkThemeActive = localStorage.getItem("darkTheme") === "true";
    $("#toggleState").prop("checked", isDarkThemeActive);

    isDarkThemeActive
      ? (onOff.innerHTML = "&#9790")
      : (onOff.innerHTML = "&#9788");

    //To determine which CSS to display (light/dark), the script is placed at the beginning of the body element. This prevents the page from flickering
    //upon refresh. See com.altair.webhelp.responsive\oxygen-webhelp\page-templates.

    //When the button is clicked://
    const toggleCheckbox = document.querySelector("#toggleState");
    toggleCheckbox.addEventListener("change", function () {
      //Saves checkbox state to local storage//
      isDarkThemeActive = toggleCheckbox.checked;
      localStorage.setItem("darkTheme", isDarkThemeActive);
      //Button is off//
      if (!isDarkThemeActive) {
        //Sets button text and updates local storage//
        onOff.innerHTML = "&#9788";
        //Sets active CSS stylesheet and updates local storage//
        document.body.classList.toggle("dark-theme");
      }
      //Button is on//
      else {
        onOff.innerHTML = "&#9790";
        document.body.classList.toggle("dark-theme");
      }
    });
  });
}

initializeDarkMode();
