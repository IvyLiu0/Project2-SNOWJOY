window.onload = () => {
  "use strict";

  // if ("serviceWorker" in navigator) {
  //   navigator.serviceWorker.register("./sw.js");
  // }
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/service-worker.js");
    });
  }
};

