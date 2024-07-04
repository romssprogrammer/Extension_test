// import { getActiveTab } from "../script/utils";

const linksContainer = document.querySelectorAll(".draggable-list")[0];
// const addCellBtn = document.getElementsByClassName("add_cell_folder_btn")[0];
const createFolderBtn = document.getElementsByClassName("create_folder_btn")[0];
const newFolderName = document.getElementById("new-folder-name");
const FolderlistContainer = document.getElementById("folder-list");
const subFileListContainer = document.getElementsByClassName(
  "sub_file_list_container"
);

const listItems = [];

let sFileListContainer;
let dragStartIndex;
let linkElement_to_drop;
let cellFileIndex;
let id = -1;

createFolderBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (newFolderName.value == "") {
    return;
  }

  id += 1;
  const folder = createFolderElement(newFolderName.value, id);
  FolderlistContainer.appendChild(folder);

  const addCellBtn = document.getElementsByClassName("add_cell_folder_btn")[0];
});

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTab();

  if (activeTab.url.includes("www.twitch.tv/")) {
    // viewSreamerList
    console.log("page loaded");
    fetchStreamerData();
  } else {
    const container = document.getElementsByClassName("container")[0];
    const notTwitchPageMessage = "This is not a Twitch page";
    try {
      warningMessageElement(notTwitchPageMessage, "not_twitch_page");
    } catch (e) {
      console.error(e);
    }
  }
});

async function getActiveTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

//MARK: fetch
function fetchStreamerData() {
  chrome.storage.sync.get(["streamersData"]).then((result) => {
    console.log(result);
    if (chrome.runtime.lastError) console.log("Error getting");
    let linksInStorage = result.length >= 0 ? result : [];
    console.log("linksIn Storage", linksInStorage);
    if (result != undefined) {
      Object.values(result).forEach((link, i) => {
        link.forEach((_link, index) => {
          console.log("link object", _link);
          linksContainer.appendChild(
            createStreamerElement(
              _link["link"],
              _link["avatarStreamer"],
              _link["status"],
              _link["streamerName"],
              _link["topic"],
              index
            )
          );
        });
      });
    } else {
      console.log("result undefined");
    }
  });
}

// MARK: createStreamerElement
function createStreamerElement(
  streamerLink,
  avatar,
  status = "",
  streamerName = "",
  topic = "",
  index
) {
  const liTag = document.createElement("li");
  liTag.classList.add("streamer_links");
  // element.classList.add("over");
  liTag.setAttribute("data-index", index);
  liTag.setAttribute("draggle", true);

  const inner_container = document.createElement("div");
  inner_container.classList.add("draggable");
  inner_container.setAttribute("draggable", true);
  // Listener on the Element that have to be draged
  liTag.addEventListener("dragstart", dragStart);
  // Listener on the Element that contain the item
  liTag.addEventListener("dragover", dragOver);
  liTag.addEventListener("drop", dragDrop);
  liTag.addEventListener("dragenter", dragEnter);
  liTag.addEventListener("dragleave", dragLeave);

  const link = document.createElement("a");
  link.classList.add("link_style");
  link.href = `${streamerLink}`;

  // link.textContent = streamerName;
  link.setAttribute("target", "_blank");

  const avatarElement = document.createElement("img");
  avatarElement.classList.add("streamer_avatar");
  avatarElement.setAttribute("src", avatar);

  const streamerNameElement = document.createElement("p");
  streamerNameElement.classList.add("streamer_name");
  streamerNameElement.textContent = streamerName;

  const statusContainer = document.createElement("div");
  statusContainer.classList.add("status_container");

  const statusElement = document.createElement("p");
  statusElement.classList.add("status");
  statusElement.textContent = status;

  const inner_status_container = document.createElement("div");
  inner_status_container.classList.add("inner_status_container");

  const statusDotElement = document.createElement("div");
  statusDotElement.classList.add("satus_dot");

  inner_status_container.appendChild(statusDotElement);
  inner_status_container.appendChild(statusElement);

  statusContainer.appendChild(inner_status_container);

  const topicElement = document.createElement("p");
  topicElement.classList.add("stream_topic");
  topicElement.textContent = topic;
  /*TODO: réduire les titres trop long */
  // if (topic.length >= 17) {
  //   topicElement.textContent = topic[];
  // }

  const streamerDetails = document.createElement("div");
  streamerDetails.classList.add("streamer_details");
  streamerDetails.appendChild(streamerNameElement);
  streamerDetails.appendChild(topicElement);

  link.appendChild(avatarElement);
  link.appendChild(streamerDetails);
  link.appendChild(statusContainer);
  inner_container.appendChild(link);
  liTag.appendChild(inner_container);
  listItems.push(liTag);
  return liTag;
}

function dragStart() {
  dragStartIndex = +this.getAttribute("data-index");
  // dragStartIndex = +this.closest("li").getAttribute("data-index");
  linkElement_to_drop = this;
  console.log("el to drop :", linkElement_to_drop);
  console.log(dragStartIndex);
}

function dragEnter(e) {
  this.classList.add("over");
  console.log("enter", this);
}
function dragOver(e) {
  e.preventDefault();
}
function dragEnd() {}

function dragLeave() {
  console.log("dragLeave");
  this.classList.remove("over");
}
function dragDrop() {
  const dragEndIndex = +this.getAttribute("data-index");
  console.log("drop drop : ", this);
  swapItems(dragStartIndex, dragEndIndex);
  this.classList.remove("over");
}

function swapItems(fromIndex, toIndex) {
  const itemOne = listItems[fromIndex].querySelector(".draggable"); //[fromIndex]
  const itemTwo = listItems[toIndex].querySelector(".draggable"); //[toIndex]
  listItems[fromIndex].appendChild(itemTwo);
  listItems[toIndex].appendChild(itemOne);
}

// TODO find the closest to streamer_links bubbling

// TODO check if streamer_list_container
//has already children (from the storage) before loading the list from the current

const removeChilds = (parent) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};
// MARK: createFolderElement
function createFolderElement(folderName, index) {
  const folder = document.createElement("li");
  folder.classList.add("folder");
  // folder.setAttribute("data-index",)
  folder.setAttribute("draggable", true);
  folder.setAttribute("data-set", index);
  folder.dataset.folderName = folderName;

  const innerContainerFolder = document.createElement("div");
  innerContainerFolder.classList.add("inner_container_folder");

  const folderIcon = document.createElement("img");
  folderIcon.setAttribute("src", "assets/folder_24px.png");
  folderIcon.classList.add("fa", "fa-folder");

  const folderNameElement = document.createElement("span");
  folderNameElement.classList.add("folder-name");
  folderNameElement.textContent = folderName;

  const folderActions = document.createElement("span");
  folderActions.classList.add("folder-actions");

  const renameButton = document.createElement("button");
  renameButton.textContent = "Renommer";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Supprimer";

  const subFileList = document.createElement("ul");
  subFileList.classList.add("sub_file_list_container");
  subFileList.setAttribute("sub_file_list-data-index", index);
  subFileList.addEventListener("dragenter", dragEnterFolderCell);
  subFileList.addEventListener("dragover", dragOverFolderCell);
  subFileList.addEventListener("drop", dragDropFolderCell);
  subFileList.addEventListener("dragleave", dragLeaveFolderCell);

  folderActions.appendChild(renameButton);
  folderActions.appendChild(deleteButton);
  innerContainerFolder.appendChild(folderIcon);
  innerContainerFolder.appendChild(folderNameElement);
  innerContainerFolder.appendChild(folderActions);
  folder.appendChild(innerContainerFolder);
  folder.appendChild(subFileList);
  return folder;
}

function dragEnterFolderCell() {
  console.log("enter in  :", this);
  cellFileIndex = +this.getAttribute("data-index");
  this.classList.add("over");
}

function dragOverFolderCell(e) {
  e.preventDefault();
  console.log("drag over folder");
}

let idxcell = 0;
function dragDropFolderCell() {
  // Si l'élément drag est déjà dans subfilecontainer  return nothing(ne pas créé de cellule li)
  // idxcell += 1;
  console.log("drop in", this);
  console.log("sub File", subFileListContainer.childNodes);
  // check si il y a des enfant vide et remove
  for (let i; i < subFileListContainer.childElementCount; i++) {
    if (subFileListContainer.childNodes[i].childElementCount == 0) {
      linksContainer.childNodes[i].removeChild(
        subFileListContainer.childNodes[i]
      );
    }
  }

  this.classList.remove("over");
  putLinkInFolder(this);
  console.log("childNodes", subFileListContainer.childNodes);
}
function dragLeaveFolderCell() {
  console.log("drag leave folder");
  this.classList.remove("over");
}

let subFileBtnIndex;
let idCell = -1;
// function createFolderCell() {
//   idCell += 1;
//   subFileBtnIndex = +this.getAttribute("data-index");

//   const folderCell = document.createElement("li");
//   folderCell.setAttribute("data-index", idCell);
//   folderCell.classList.add("folder_cell");
//   folderCell.addEventListener("dragenter", dragEnterFolderCell);
//   folderCell.addEventListener("dragover", dragOverFolderCell);
//   folderCell.addEventListener("drop", dragDropFolderCell);
//   folderCell.addEventListener("dragleave", dragLeaveFolderCell);

//   subFileListContainer[subFileBtnIndex].appendChild(folderCell);
// }

function putLinkInFolder(parent) {
  if (subFileListContainer) {
    parent.appendChild(linkElement_to_drop);
  }
}

function warningMessageElement(message = "", classeName = "") {
  if (message && classeName) {
    const container = document.createElement("div");
    const textContainer = document.createElement("p");
    textContainer.classList.add(classeName);
    const textNode = document.createTextNode(message);
    textContainer.appendChild(textNode);
    container.appendChild(textContainer);
  } else {
    throw new error("You have to  write a message and give a classe name ");
  }
}

//Observer of quick acces list
const config = { attributes: true, childList: true, subtree: true };
const quickAccessLinkListObserver = new MutationObserver(updateStorage);
quickAccessLinkListObserver.observe(linksContainer, config);

function updateStorage(mutationsList, observer) {
  let current_linksContainer;
  current_linksContainer = linksContainer;
  console.log("current list", current_linksContainer);
  for (let mutation of mutationsList) {
    // Check if an li element has been removed
    if (
      mutation.type === "childList" &&
      mutation.removedNodes.length > 0 &&
      mutation.removedNodes[0].nodeName === "LI"
    ) {
      console.log(
        "An li element has been removed from the quick acces link list!"
      );
    }
  }
}

const FolderlistObserver = new MutationObserver(saveCategoryFolderList);
FolderlistObserver.observe(FolderlistContainer, config);

// Au démarrage de l'application de comparer si le lien existe déjà dans un dossier
//et le supprimer de la liste quick acces
function saveCategoryFolderList(mutationsList) {
  let updateFolderlistContainer = FolderlistContainer;
  // Save folder list children
  if (FolderlistContainer.hasChildNodes()) {
    for (let mutation of mutationsList) {
      // Check if an li element has been removed

      if (
        mutation.type === "childList" &&
        mutation.removedNodes.length > 0 &&
        mutation.removedNodes[0].nodeName === "LI"
      ) {
        console.log("An li element has been removed from the ul element!");
      }
      if (
        mutation.type === "childList" &&
        mutation.addedNodes.length > 0 &&
        mutation.addedNodes[0].nodeName === "LI"
      ) {
        console.log("An li element has been added to the ul element!");
        console.log("updateFolder list Container ", updateFolderlistContainer);
      }
    }
  }
}
