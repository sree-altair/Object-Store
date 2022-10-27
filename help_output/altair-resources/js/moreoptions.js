function setAccessOptions() {
  //Exit immediately if not Altair Simulation help or not access options page
  let url = window.location.href;
  if (!url.match(/\/(hwsolvers|hwdesktop|hwcfdsolvers)\/[\S]*\//g)) {
    return;
  } else if (!url.includes("access_options.htm")) {
    return;
  }

  const cachedHelpName = sessionStorage.getItem("helpName") ?? "";
  const cachedInstallPackage = sessionStorage.getItem("installPackage") ?? "";
  const cachedVersion = sessionStorage.getItem("version") ?? "";
  const cachedMajorVersion = sessionStorage.getItem("majorVersion") ?? "";
  const cachedLocalPath = sessionStorage.getItem("localPath") ?? "";
  const cachedOnlinePath = sessionStorage.getItem("onlinePath") ?? "";
  const cachedAccessType = sessionStorage.getItem("accessType") ?? "";
  const cachedModelFileDirectory =
    sessionStorage.getItem("modelFileDirectory") ?? "";

  document.querySelector(".wh_version").textContent = cachedVersion;

  const accessSpecifier = document.querySelector(".access-specifier");
  const packageName = document.querySelector(".package-name");
  const downloadPackageLink = document.querySelector(".download-package-link");
  const marketplaceLink = document.querySelector(".marketplace-link");
  const communityLink = document.querySelector(".community-link");
  const backLink = document.querySelector(".backLink");
  let offlineLinks = [marketplaceLink, communityLink, downloadPackageLink];

  switch (cachedAccessType) {
    case "landing":
      backLink.href = "../../../altair_help/index.htm";
      accessSpecifier.textContent = `the ${cachedHelpName} help`;
      packageName.textContent = `${cachedInstallPackage} help`;
      downloadPackageLink.href = `http://${cachedMajorVersion}.help.altair.com/${cachedVersion}/offlinehelp/hw${cachedInstallPackage.toLowerCase()}_${cachedVersion}_offline_help.zip`;
      break;
    case "model":
      const fullPackageLink = `http://${cachedMajorVersion}.help.altair.com/${cachedVersion}/simulation/tutorials/hw${cachedInstallPackage.toLowerCase()}.zip`;
      const zippedProductLink = `http://${cachedMajorVersion}.help.altair.com/${cachedVersion}/simulation/tutorials/hw${cachedInstallPackage.toLowerCase()}/${cachedModelFileDirectory}.zip`;
      const downloadOption = document.querySelector(".download-option");
      downloadOption.innerHTML = `Download and extract a zipped <a href=${zippedProductLink} class="zippedProductLink">${cachedHelpName}</a> or full <a href=${fullPackageLink} class="fullPackageLink">${cachedInstallPackage}</a> model file package.`;
      backLink.href = cachedLocalPath;
      accessSpecifier.textContent = `model files`;
      packageName.textContent = `${cachedInstallPackage} model file`;
      document.querySelector(".marketplace-type").textContent = `model file`;
      let zippedLink = document.querySelector(".zippedProductLink");
      let packageLink = document.querySelector(".fullPackageLink");
      offlineLinks = [...offlineLinks, zippedLink, packageLink];
      break;
    case "product":
      sessionStorage.setItem("accessOptionsBackLink", true);
      backLink.href = cachedLocalPath;
      accessSpecifier.textContent = `the ${cachedHelpName} help`;
      packageName.textContent = `${cachedInstallPackage} help`;
      downloadPackageLink.href = `http://${cachedMajorVersion}.help.altair.com/${cachedVersion}/offlinehelp/hw${cachedInstallPackage.toLowerCase()}_${cachedVersion}_offline_help.zip`;
      break;
  }

  function generateModalUI() {
    //Setup modal and overlay UI
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.append(overlay);

    const modal = document.createElement("div");
    modal.innerHTML = `<div id="offline-modal-container" aria-label="Access Options Modal">
    <div id="offline-modal">
      <span id="modal-close-button" aria-label="Close modal"><img id="close-button-icon" aria-hidden="true" src="../img/unity_close.svg" /></span>
      <span id="modal-text">Go online to access this option.</span>
      <div id="modal-button-container">
        <button id="ok-button" aria-label="Close Modal">OK</button>
      </div>
    </div>
    </div>`;
    document.body.append(modal);
  }
  generateModalUI();

  function setupModalEventListeners() {
    //Setup main modal event listeners for triggering activation and button navigation

    const modalContainer = document.getElementById("offline-modal-container");
    modalContainer.addEventListener("click", function (event) {
      closeModal(event);
    });

    const offlineModal = document.getElementById("offline-modal");
    offlineModal.addEventListener(
      "click",
      function (event) {
        event.stopPropagation();
      },
      false
    );

    const modalCloseButton = document.getElementById("modal-close-button");
    modalCloseButton.addEventListener("click", function (event) {
      closeModal(event);
    });

    const okButton = document.getElementById("ok-button");
    okButton.addEventListener("click", () => {
      closeModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key == "Esc" || event.key == "Escape") {
        closeModal();
      }
    });
  }
  setupModalEventListeners();

  function closeModal() {
    const modal = document.getElementById("offline-modal-container");
    modal.style.display = "none";
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
  }

  function checkOfflineCallback(event) {
    !window.navigator.onLine ? checkOffline(event) : () => {};
  }

  offlineLinks.forEach((link) => {
    link.addEventListener("click", (event) => checkOfflineCallback(event));
  });

  function checkOffline(event) {
    event.preventDefault();
    const modal = document.getElementById("offline-modal-container");
    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";
    modal.style.display = "block";

    let errorScript = document.createElement("script");
    errorScript.onerror = function () {
      if (errorScript.onerror) {
        get_error(this.id);
      }
    };

    function get_error(x) {
      event.preventDefault();

      errorScript.onload = function () {
        window.location = event.target.href;
      };
      errorScript.src = event.target.href;

      document.body.appendChild(errorScript);
    }
  }
}

setAccessOptions();
