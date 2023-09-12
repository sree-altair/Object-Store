const setupVersionNavigation = async () => {
  // Feature is online only, so return immediately if not http/https
  const protocol = window.location.protocol;
  if (!protocol.includes("http")) {
    return;
  }

  (function () {
    window.onpageshow = function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    };
  })();


  const statuses = [];
  let versionNode,
    versionNodeSelector,
    versionSelector,
    currentVersion,
    production = false,
    latestVersion = localStorage.getItem("latest") ?? "";

  async function checkVersions() {
    // Populate the selector with all available verison options for the page
    selectActiveNode();
    setupVersionNode();
    // Pre-render the selector with the current version on initial render as a placeholder until fully populated
    const option = document.createElement("option");
    latestVersion === currentVersion.toString()
      ? (defaultOptionTextContent = `${currentVersion} (Latest)`)
      : (defaultOptionTextContent = currentVersion);
    option.setAttribute("value", currentVersion);
    option.classList.add("version-option");
    option.textContent = defaultOptionTextContent;
    versionSelector.append(option);
    versionNode.appendChild(versionSelector);

    const versionsToCheck = [];
    const currentYear = new Date().getFullYear() + 1;
    for (let i = 2021; i <= currentYear; i++) {
      versionsToCheck.push(i);
      versionsToCheck.push(i + 0.1);
      versionsToCheck.push(i + 0.2);
    }

    const fetches = [];
    let hostname = window.location.hostname;
    if (!hostname.includes("staging") && !hostname.includes("dev")) {
      production = true;
    }
    for (let i = 0; i < versionsToCheck.length; i++) {
      if (production) {
        hostname = `${versionsToCheck[i]
          .toString()
          .slice(0, 4)}.help.altair.com`;
      }
      fetches.push(
        fetch(
          `https://${hostname}${window.location.pathname.replace(
            currentVersion,
            versionsToCheck[i]
          )}`
        )
          .then((res) => {
            if (res.status === 200 && !res.url.includes('404.htm')) {
              // console.log(currentVersion, versionsToCheck[i]);
              // console.log(`Pushing ${versionsToCheck[i]}`);
              statuses.push([versionsToCheck[i]]);
            } else if (res.status === 404) {
              return Promise.reject(res.status);
            }
          })
          .catch((error) => {})
      );
    }
    Promise.allSettled(fetches).then(() => {
      // console.log("All statuses resolved");
      // console.log(statuses);
      statuses.sort((a, b) => b - a);
      setupVersionOptions();
    });
  }

  async function selectActiveNode() {
    //Select the active version node depending on context
    window.location.pathname.includes("/index.htm") ||
    window.location.pathname.includes("/search.htm")
      ? (versionNodeSelector = ".wh_version")
      : (versionNodeSelector = ".wh_content_area .wh_version");
    versionNode = document.querySelector(versionNodeSelector);
    currentVersion = versionNode.querySelector("p").textContent;
  }

  async function setupVersionNode() {
    majorVersion = currentVersion.slice(0, 4);
    versionNode.querySelector("p").remove();
    versionSelector = document.createElement("select");
    versionSelector.className = "version-selector";
    versionSelector.style.minWidth = "112.5px";
  }

  checkVersions();

  async function setupVersionOptions() {
    // Generate version options for all available pages
    for (let i = 0; i < statuses.length; i++) {
      const option = document.createElement("option");
      defaultOptionTextContent = statuses[i];
      if (i === 0 && parseFloat(currentVersion) !== statuses[0]) {
        versionSelector.options[0].value = defaultOptionTextContent;
        versionSelector.options[0].textContent = `${defaultOptionTextContent} (Latest)`;
      } else {
        if (i === 0) {
          defaultOptionTextContent += ` (Latest)`;
        }
        option.setAttribute("value", statuses[i]);
        option.textContent = defaultOptionTextContent;
        versionSelector.append(option);
        versionSelector.value = currentVersion;
      }
    }

    latestVersion =
      document.querySelector(".version-selector").children[0].value;
    localStorage.setItem("latest", latestVersion);
  }

  versionSelector.addEventListener("change", () => {
    console.log(versionSelector.value);
    let domain = `https://${window.location.hostname}`;
    if (production) {
      domain = `https://${versionSelector.value.slice(0, 4)}.help.altair.com`;
    }
    const newPathname = window.location.pathname.replace(
      currentVersion,
      versionSelector.value
    );
    window.location.href = `${domain}${newPathname}`;
  });
};

setupVersionNavigation();
