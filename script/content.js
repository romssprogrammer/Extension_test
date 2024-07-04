// check si on est sur une page twitch
// - sinon afficher à l'utilisateur message ce n'est pas une page twitch

// check si on est connecter on regardant si il y a les chaînes suivies dans la side bar

//   -Si connecté
//     afficher à la liste des

//   - sinon afficher à l'utilisateur message vous n'êtes pas connecté

/// problem : doesn't load

// Selectors

let linksCopy;
let currentStreamerLink = "";
const streamersLinkArray = [];
const userFolderList = {};
const streamersDataArray = [];

(() => {
  console.log("hey");
  // const displaymoreBtn = document.getElementsByClassName(
  //   "ScCoreLink-sc-16kq0mq-0 "
  // )[6];

  // displaymoreBtn.click();

  function clickDisplaymore() {
    const displayMoreBtn = document.getElementsByClassName(
      "ScCoreLink-sc-16kq0mq-0 "
    )[6];
    if (displayMoreBtn) {
      displayMoreBtn.click();
    }
  }
  // if (
  //   displaymoreBtn.getAttribute("data-a-target") === "side-nav-show-more-button"
  // ) {
  //   displaymoreBtn.click();
  // }

  chrome.runtime.onMessage.addListener(async (obj, sender, Response) => {
    const { pageType, url } = obj;
    if (pageType === "twitch") {
      // clickDisplaymore();
      getFollowedStreamers();

      chrome.runtime.sendMessage({ streamersDataArray }, function () {});
    } else {
      console.log("ce n'est pas une page twitch");
    }
  });

  //MARK: getFollowedStreamers
  function getFollowedStreamers() {
    const followLabel = document.getElementsByClassName(
      "CoreText-sc-1txzju1-0"
    );
    //is the user connected?
    const followLabelTextContent = followLabel[5].textContent; // return chaine suivie si connecté

    // check if the user is connected
    if (followLabelTextContent === "Chaînes suivies" || "Followed Channels") {
      const followedChannelSideBar = document.getElementsByClassName(
        "Layout-sc-1xcs6mc-0"
      )[79];

      const ariaLabel = followedChannelSideBar.getAttribute("aria-label");
      if (ariaLabel === "Chaînes suivies" || "Followed Channels") {
        const navCard = document.getElementsByClassName(
          "InjectLayout-sc-1i43xsx-0"
        )[15];
        const link = navCard.getElementsByClassName("side-nav-card__link");
        const ListStreamerLink = getListStreamerLink(link);

        ListStreamerLink.then((streamerLinksArrayRetrieved) => {
          streamerLinksArrayRetrieved.forEach((streamerLink, i) => {
            const streamersDataObj = {
              streamerName: "",
              link: "",
              status: "",
              topic: "",
              avatarStreamer: "",
            };

            const streamerNameElement = document.getElementsByClassName(
              "CoreText-sc-1txzju1-0 iQYdBM InjectLayout-sc-1i43xsx-0 gaLyxR"
            )[i];
            const streamerName = streamerNameElement.textContent;

            const avatarStreamer = getFollowedStreamersAvatar(i + 1);
            const streamerStatusElement = document.getElementsByClassName(
              "CoreText-sc-1txzju1-0 grGUPN"
            )[i];

            const streamerStatus = streamerStatusElement.textContent;

            const currentTopicElement = document.getElementsByClassName(
              "CoreText-sc-1txzju1-0 bApHMU"
            )[i];
            const currentTopic = currentTopicElement.textContent;
            streamersDataObj["streamerName"] = streamerName;
            streamersDataObj["link"] = streamerLink;
            streamersDataObj["status"] = streamerStatus;
            streamersDataObj["avatarStreamer"] = avatarStreamer;
            streamersDataObj["topic"] = currentTopic;
            streamersDataArray.push(streamersDataObj);
          });
          linksCopy = [...new Set(streamerLinksArrayRetrieved)];
        });
      }
      console.log("data", streamersDataArray);
      console.log(linksCopy);
      // get streamerLink DOM element
      // get streamerLink list
    } else {
      // témoin visuel d'alerte
      const connectionAlertContainer = document.createElement("div");
      const messageAlert = document.createElement("span");
      messageAlert.textContent = "vous n'êtes pas connecté à votre compte";
      connectionAlertContainer.appendChild(messageAlert);
      console.log("vous n'êtes pas connecté à votre compte");
    }
  }

  function getFollowedStreamersAvatar(id) {
    let streamersAvatar = document.getElementsByClassName(
      "InjectLayout-sc-1i43xsx-0 bEwPpb tw-image tw-image-avatar"
    )[id].currentSrc;
    return streamersAvatar;
  }

  async function getListStreamerLink(linkElement) {
    const streamerLinks = [];
    for (let i = 0; i < linkElement.length; i++) {
      streamerLinks.push(linkElement[i].href);
    }
    return streamerLinks;
  }

  // O(n)?
  function assignKeyValueInObject(element) {
    const obj = {};
    const arrayObject = [];
    arrayObject.push(element);

    if (!Object.keys(obj).length) {
      for (let i = 0; i < element.length(); i++) {
        Object.assign(obj, { name: "xxx", age: "0" });
      }
      return obj;
    }
  }
  // async function fetchStreamerData() {
  //   chrome.storage.local.get(["streamersData"]).then((result) => {
  //     if (chrome.runtime.lastError) console.log("Error getting");
  //     let linksInStorage = result.length >= 0 ? result : [];
  //     console.log("links In Storage", linksInStorage);
  //     if (result != undefined) {
  //       Object.values(result).forEach((link, i) => {
  //         console.log("link object", link);
  //         link.forEach((_link, index) => {
  //           linksContainer.appendChild(createStreamerElement(_link, index));
  //         });
  //       });
  //     } else {
  //       console.log("result undefined");
  //     }
  //   });
  // }
})();

// Voir pour gérer quand un élément nouveau s'ajoute sur le site

function clearArray(array) {
  if (array.length > 0) {
    array.length = 0;
  }
}

function save() {
  //save the streamer link  data in local storage
}
