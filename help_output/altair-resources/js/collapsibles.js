// Developer: Andrew Barbour
// Add support for collapsible section components

$(document).ready(function () {
  const collapsibleSections = document.querySelectorAll(".collapsible");
  collapsibleSections.forEach((section) => {
    const toggleButton = document.createElement("span");
    toggleButton.setAttribute("class", "toggle");
    toggleButton.innerHTML = "&#9662;";
    toggleButton.style.marginRight = "5px";
    toggleButton.style.color = "#00aae6";
    const sectionHeader =
      section.querySelector(".sectiontitle") ?? section.querySelector("h2");
    section.insertBefore(toggleButton, sectionHeader);
    sectionHeader.insertBefore(toggleButton, sectionHeader.firstChild);
    function toggle(fadeIn = true) {
      const expandedState =
        section.querySelector("div") ?? sectionHeader.nextElementSibling;
      let expanded = expandedState.style.display !== "none";
      expanded = !expanded;
      expanded
        ? (toggleButton.innerHTML = "&#9662;")
        : (toggleButton.innerHTML = "&#9656;");
      const descendants = section.querySelectorAll("*");
      descendants.forEach((child) => {
        if (
          !child.className.includes("sectiontitle") &&
          !child.className.includes("toggle") &&
          child.parentNode.tagName !== "H2"
        ) {
          if (child.style.display === "none") {
            $(child).fadeIn();
          } else {
            fadeIn ? $(child).fadeOut() : (child.style.display = "none");
          }
        }
      });
    }
    toggle((fadeIn = false));
    sectionHeader.addEventListener("click", toggle);
  });

  // Expand the section for any active page section in the hash on initial page load
  function expandCurrentHash() {
    const hash = window.location.hash.slice(1);
    const focusedSection = document.getElementById(hash)?.parentNode;
    const toggle = focusedSection.querySelector(".toggle");
    if (toggle) {
      toggle.innerHTML = "&#9662;";
      focusedSection.querySelectorAll("*").forEach((child) => {
        if (
          !child.className.includes("sectiontitle") &&
          !child.className.includes("toggle") &&
          child.parentNode.tagName !== "H2"
        ) {
          if (child.style.display === "none") {
            $(child).fadeIn();
          }
        }
      });
    }
  }

  if (window.location.hash) {
    expandCurrentHash();
  }

  window.addEventListener("hashchange", expandCurrentHash);

  // Expand any section navigated to with mini-toc links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((navLink) => {
    navLink.addEventListener("click", expandCurrentHash);
  });
});
