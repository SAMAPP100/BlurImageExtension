const imgs = document.querySelectorAll("img");
const bgImages = getBgImgs(document);
const ifr = searchIframes(document);

let clickedEl = null;

document.addEventListener(
  "contextmenu",
  function (event) {
    debugger;
    clickedEl = event.target;
  },
  true
);

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message == "toggleMask") toggleMask(clickedEl);
});

function toggleMask(el) {
  if (el.classList.contains("blurimage")) {
    el.classList.remove("blurimage");
  } else {
    el.classList.add("blurimage");
  }
}

function blur(imgArray) {
  imgArray.forEach((t) => {
    t.classList.add("blurimage");
    t.addEventListener("dblclick", (e) => {
      toggleMask(e.target);
    });
  });
}

function getBgImgs(doc) {
  const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i;
  return Array.from(
    Array.from(doc.querySelectorAll("*")).reduce((collection, node) => {
      let prop = window
        .getComputedStyle(node, null)
        .getPropertyValue("background-image");
      // match `url(...)`
      let match = srcChecker.exec(prop);
      if (match) {
        collection.add(node);
      }
      return collection;
    }, new Set())
  );
}

function searchIframes(doc) {
  let imgList = [];
  doc.querySelectorAll("iframe").forEach((iframe) => {
    try {
      iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      imgList = [...iframe.querySelectorAll("img"), ...getBgImgs(iframe)];
      imgList = imgList.concat(searchIframes(iframe) || []);
    } catch (e) {
      // simply ignore errors (e.g. cross-origin)
    }
  });
  return imgList;
}

blur(imgs);
blur(ifr);
blur(bgImages);
console.log("hi");
