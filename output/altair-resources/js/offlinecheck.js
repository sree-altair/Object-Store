let helpName,
  installPackage,
  version,
  majorVersion,
  localPath,
  onlinePath,
  backdoorPath,
  activeLink,
  scrollPosition,
  accessType,
  linkClass,
  folderDepthString;

function getModelFileBackdoorLink(onlinePath) {
  let backdoorBasePath = `https://${majorVersion}.help.altair.com/Help,356A192B7913B04C54574D18C66680D5703E51A277,${version},`;
  let backdoorEndPath = `,56AB4845.aspx`;
  let onlineEndPath = onlinePath.match(/simulation\/.*/g)[0];
  const lastFileSeparator = onlineEndPath.lastIndexOf("/");
  onlineEndPath =
    onlineEndPath.slice(0, lastFileSeparator) +
    "," +
    onlineEndPath.slice(lastFileSeparator + 1);
  onlineEndPath = onlineEndPath.replaceAll("/", "__");
  onlineEndPath = onlineEndPath.replace("__", ",");
  backdoorPath = backdoorBasePath + onlineEndPath + backdoorEndPath;
  sessionStorage.setItem("backdoorPath", backdoorPath);
  return backdoorPath;
}

function setupOfflineCheck() {
  //Return immediately if not Altair Simulation help, or if on access options page.
  //If online, return immediately after generating model file links
  let url = window.location.href;
  if (!url.match(/\/(hwsolvers|hwdesktop|hwcfdsolvers)\/[\S]*\//g)) {
    return;
  } else if (url.includes("access_options.htm")) {
    return;
  }

  //Retrieve and cache product verison for access_options page
  version = document.querySelector(".wh_version").firstChild.textContent;
  majorVersion = version.slice(0, 4);
  sessionStorage.setItem("version", version);
  sessionStorage.setItem("majorVersion", majorVersion);

  if (
    window.location.protocol == "https:" ||
    window.location.protocol == "http:"
  ) {
    const modelLinks = document.querySelectorAll(".model_link");
    console.log("Help is online.");
    if (modelLinks) {
      modelLinks.forEach((link) => {
        link.href = getModelFileBackdoorLink(link.href);
        // link.href = link.href
        //   .replace("majorv", majorVersion)
        //   .replace("minorv", version)
        //   .replace("http:", "https:");
        //Force links to open in the same tab
        if (link.hasAttribute("target")) {
          link.removeAttribute("target");
        }
      });
    }
    return;
  }

  sessionStorage.setItem("localPath", url);

  //Return user to cached scroll position when navigating back from access options page.
  let backLink = JSON.parse(sessionStorage.getItem("accessOptionsBackLink"));
  if (backLink) {
    scrollPosition = JSON.parse(sessionStorage.getItem("scrollPosition"));
    window.scrollTo(0, scrollPosition);
  }
  sessionStorage.setItem("accessOptionsBackLink", false);

  function setAccessType() {
    //Determine access type for component rendering purposes
    //Model file access type determined when clicking on model file
    if (window.location.href.match(/\/altair_help\/index.htm/g)) {
      accessType = "landing";
      sessionStorage.setItem("accessType", "landing");
    } else {
      accessType = "product";
      sessionStorage.setItem("accessType", "product");
    }
  }
  setAccessType();

  function generatePageElements() {
    //Adjust the path to logo depending on the page location
    let rawLinkPath = window.location.href;
    let baseLinkPath = rawLinkPath.match(/topics[\S]*/g);
    folderDepthString = "";
    if (accessType !== "landing" && baseLinkPath) {
      for (let char of baseLinkPath[0]) {
        if (char === "/") {
          folderDepthString = folderDepthString.replace(/^/, "../");
        }
      }
    }
    sessionStorage.setItem("folderDepthString", folderDepthString);
  }
  generatePageElements();

  function generateModalUI() {
    //Setup modal and overlay UI
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.append(overlay);

    const modal = document.createElement("div");
    modal.innerHTML = `<div id="offline-modal-container" aria-label="Access Options Modal">
    <div id="offline-modal">
      <span id="modal-close-button" aria-label="Close Modal"><img id="close-button-icon" aria-hidden="true" src="${folderDepthString}altair-resources/img/unity_close.svg" /></span>
      <span id="modal-text">Install the help to view this page.</span>
      <div id="modal-button-container">
        <button id="view-online-button" aria-label="View help online">View Online</button>
        <button id="modal-more-options-button" aria-label="Other help access options">Other Options</button>
      </div>
    </div>
    </div>`;
    document.body.append(modal);
  }
  generateModalUI();

  function setupModalEventListeners() {
    //Setup main modal event listeners for triggering activation and button navigation
    const moreOptionsButton = document.getElementById(
      "modal-more-options-button"
    );
    moreOptionsButton.addEventListener("click", function (event) {
      window.location.href = `${folderDepthString}altair-resources/html/access_options.htm`;
    });

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

    const viewOnlineButton = document.getElementById("view-online-button");
    viewOnlineButton.addEventListener("click", (event) => {
      if (linkClass?.includes("model_link")) {
        closeModal();
      } else {
        try {
          // Check if backdoor path is available. If not, load production path as fallback
          document.location.href = backdoorPath ?? onlinePath;
        } catch (error) {
          document.location.href = `https://${majorVersion}.help.altair.com/${version}/hwdesktop/altair_help/index.htm`;
        }
      }
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

  const getOnlinePath = (localPath) => {
    const basePath = localPath.match(/hw[\S]*/g)[0];
    onlinePath =
      `https://${majorVersion}.help.altair.com/${version}/` + basePath;
    sessionStorage.setItem("onlinePath", onlinePath);
  };

  const getBackdoorLink = (onlinePath) => {
    let backdoorBasePath = `https://${majorVersion}.help.altair.com/Help,356A192B7913B04C54574D18C66680D5703E51A277,${version},`;
    let backdoorEndPath = `,56AB4845.aspx`;
    let onlineEndPath = onlinePath.match(/hw[\S]*/g)[0];
    if (accessType === "model" && onlinePath.match(/simulation.*/g)) {
      onlineEndPath = onlinePath.match(/simulation.*/g)[0];
    }
    onlineEndPath = onlineEndPath.replaceAll("#", "|");
    const lastFileSeparator = onlineEndPath.lastIndexOf("/");
    onlineEndPath =
      onlineEndPath.slice(0, lastFileSeparator) +
      "," +
      onlineEndPath.slice(lastFileSeparator + 1);
    onlineEndPath = onlineEndPath.replaceAll("/", "__");
    onlineEndPath = onlineEndPath.replace("__", ",");
    if (onlineEndPath.includes("?")) {
      questionCharIndex = onlineEndPath.lastIndexOf("?");
      onlineEndPath = onlineEndPath.slice(0, questionCharIndex);
    }
    backdoorPath = backdoorBasePath + onlineEndPath + backdoorEndPath;
    sessionStorage.setItem("backdoorPath", backdoorPath);
  };

  const cacheModelFileDirectory = () => {
    //Retrieve model file staging server directory to generate corresponding product model zip file link
    const modelLink = document.querySelector(".model_link");
    if (modelLink) {
      const modelFileDirectory = modelLink.href
        .match(/(hwdesktop|hwsolvers|hwcfdsolvers)\/[\S^/]*\//g)[0]
        .split("/")[1];
      sessionStorage.setItem("modelFileDirectory", modelFileDirectory);
    }
  };
  cacheModelFileDirectory();

  const cachePackage = (onlinePath) => {
    if (onlinePath.match(/hwsolvers\/[\S]*\//g)) {
      installPackage = "Solvers";
    } else if (onlinePath.match(/hwdesktop\/[\S]*\//g)) {
      installPackage = "Desktop";
    } else if (onlinePath.match(/hwcfdsolvers\/[\S]*\//g)) {
      installPackage = "CFDSolvers";
    }
    sessionStorage.setItem("installPackage", installPackage);
  };

  const productInfos = document.querySelectorAll(".prodinfo");

  productInfos.forEach((product) => {
    const prodImage = product.parentNode.querySelector("a");
    prodImage.addEventListener(
      "click",
      function (event) {
        activeLink = prodImage.href;
        getOnlinePath(prodImage.href);
        getBackdoorLink(onlinePath);
        checkOffline(event);
        cachePackage(onlinePath);
      },
      false
    );
    product.addEventListener(
      "click",
      function (event) {
        activeLink = event.target.parentNode.href;
        getOnlinePath(event.target.parentNode.href);
        getBackdoorLink(onlinePath);
        checkOffline(event);
        cachePackage(onlinePath);
      },
      false
    );
  });

  if (!window.location.href.includes("altair_help/index.htm")) {
    const productPaths = {
      hwx: "HyperWorks",
      hm: "HyperMesh",
      hv: "HyperView",
      hwd: "HyperWorks Resources",
      hg: "HyperGraph",
      mv: "MotionView",
      cfd: "HyperWorks CFD",
      table: "TableView",
      text: "TextView",
      nvh: "HyperWorks NVH",
      media: "MediaView",
      hvp: "HyperView Player",
      hlife: "HyperLife",
      hlwc: "HyperLife Weld Certification",
      basic: "BasicFEA",
      hc: "HyperCrash",
      hst: "HyperStudy",
      os: "OptiStruct",
      rad: "Radioss",
      ms: "MotionSolve",
      acusolve: "AcuSolve",
      nfx: "nanoFluidX",
      ultraFluidX: "ultraFluidX",
    };
    const links = document.querySelectorAll("a");

    links.forEach((link) => {
      link.addEventListener(
        "click",
        function (event) {
          //Check three possible locations for url for nested elements
          let link = event.target;
          if (link.tagName !== "A") {
            if (link.parentNode.tagName === "A") {
              link = link.parentNode;
            } else if (link.parentNode.parentNode.tagName === "A") {
              link = link.parentNode.parentNode;
            }
          }
          linkClass = link.className;
          // console.log(link);
          currentLink = link.href;
          activeLink = currentLink;
          if (linkClass.includes("model_link")) {
            cachePackage(currentLink);
            accessType = "model";
            sessionStorage.setItem("accessType", "model");
            onlinePath = currentLink
              .replace("majorv", majorVersion)
              .replace("minorv", version);
            getBackdoorLink(onlinePath);
            if (!window.navigator.onLine) {
              checkOffline(event);
              let rawPath = window.location.href;
              let basePath = rawPath.match(
                /(hwsolvers|hwdesktop|hwcfdsolvers)\/[\S]*\/topics/g
              );
              let partialRawPath = rawPath.slice(rawPath.indexOf(basePath[0]));
              let onlineBasePath = `https://${majorVersion}.help.altair.com/${version}/`;
              onlinePath = onlineBasePath + partialRawPath;
              sessionStorage.setItem("onlinePath", onlinePath);
              getBackdoorLink(onlinePath);
              let activeProductPaths = basePath[0].match(/\/[\S]*\//g);
              productPath = activeProductPaths[0].replaceAll("/", "");
              if (productPath.toLowerCase().includes("snrdunity")) {
                productPath = "hwx";
              }
              helpName = productPaths[productPath];
              sessionStorage.setItem("helpName", helpName);
            } else {
              event.preventDefault();
              window.location.href = onlinePath;
            }
          } else {
            cachePackage(currentLink);
            // sessionStorage.setItem("accessType", "product");
            let rawPath = currentLink;
            // console.log(currentLink);
            let basePath = rawPath.match(
              /(hwsolvers|hwdesktop|hwcfdsolvers)\/[\S]*\/topics/g
            );
            let partialRawPath = rawPath.slice(rawPath.indexOf(basePath[0]));
            let onlineBasePath = `https://${majorVersion}.help.altair.com/${version}/`;
            onlinePath = onlineBasePath + partialRawPath;
            sessionStorage.setItem("onlinePath", onlinePath);
            getBackdoorLink(onlinePath);
            // console.log(onlinePath);
            let activeProductPaths = basePath[0].match(/\/[\S]*\//g);
            productPath = activeProductPaths[0].replaceAll("/", "");
            helpName = productPaths[productPath];
            sessionStorage.setItem("helpName", helpName);
            checkOffline(event);
          }
        },
        false
      );
    });
  }

  const getPackage = (link) => {
    let linkPackage;
    if (link.match(/hwsolvers\/[\S]*\//g)) {
      linkPackage = "Solvers";
    } else if (link.match(/hwdesktop\/[\S]*\//g)) {
      linkPackage = "Desktop";
    } else if (link.match(/hwcfdsolvers\/[\S]*\//g)) {
      linkPackage = "CFDSolvers";
    }
    return linkPackage;
  };

  function checkOffline(event) {
    event.preventDefault();
    scrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop;
    sessionStorage.setItem("scrollPosition", scrollPosition);
    const modal = document.getElementById("offline-modal-container");
    const overlay = document.getElementById("overlay");

    let errorScript = document.createElement("script");
    errorScript.onerror = function () {
      if (errorScript.onerror) {
        const currentPackage = getPackage(window.location.href);
        const linkPackage = getPackage(activeLink);
        /*If the product link to a file in the current package cannot be found, 
        then the 404 is not due to a non-install package and redirect to 404 page
        Model file 404 errors will be handled online rather than offline.
        */
        if (currentPackage === linkPackage && accessType === "product") {
          window.location.href = `${folderDepthString}altair-resources/html/404.htm`;
        } else {
          get_error(this.id);
        }
        //If disabling this feature, swap out the code above for the handler below
        // get_error(this.id);
      }
    };

    function get_error(x) {
      event.preventDefault();
      overlay.style.display = "block";
      modal.style.display = "block";
      if (accessType === "landing") {
        document.getElementById(
          "modal-text"
        ).textContent = `Access the help online to view the ${helpName ?? ""} ${
          helpName === "HyperWorks Resources" ? "reference " : "user"
        } guide.`;
        const modalTextHeight =
          document.getElementById("modal-text").clientHeight;
        if (modalTextHeight > 75) {
          document.getElementById("modal-button-container").style.marginTop =
            "0%";
        } else {
          document.getElementById("modal-button-container").style.marginTop =
            "3%";
        }
      } else {
        if (linkClass.includes("model_link")) {
          // modelFileName = event.target.textContent
          //   .match(/\\(\w)*.*(\w)*/g)[0]
          //   .slice(1);
          const modalText = document.getElementById("modal-text");
          modalText.textContent = ` Go online to download this model file.`;
          modalText.style.paddingTop = "12%";
          const viewOnline = document.getElementById("view-online-button");
          viewOnline.textContent = "OK";
          viewOnline.style.minWidth = "70px";
        } else {
          document.getElementById(
            "modal-text"
          ).textContent = `Access the help online to view the ${
            helpName ?? ""
          } ${
            helpName === "HyperWorks Resources" ? "reference " : "user"
          } guide.`;
        }
      }
    }

    if (accessType === "landing") {
      const tagType = event.target.tagName;
      if (tagType === "P" || tagType === "DIV") {
        return;
      }
      if (event.target.tagName === "A") {
        helpName = event.target.parentNode.querySelector("h4").textContent;
      } else {
        helpName = event.target.textContent;
      }
      sessionStorage.setItem("helpName", helpName);

      errorScript.onload = function () {
        if (tagType !== "A") {
          window.location = event.target.parentNode.href;
        } else {
          window.location = event.target.href;
        }
      };
      if (tagType !== "A") {
        errorScript.src = event.target.parentNode.href;
      } else {
        errorScript.src = event.target.href;
      }
    } else {
      errorScript.onload = function () {
        window.location =
          event.target.href ??
          event.target.parentNode.href ??
          event.target.parentNode.parentNode.href;
      };
      errorScript.src =
        event.target.href ??
        event.target.parentNode.href ??
        event.target.parentNode.parentNode.href;
    }

    document.body.appendChild(errorScript);
  }
}

setupOfflineCheck();
