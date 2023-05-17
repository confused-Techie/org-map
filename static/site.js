let MAP; // Keeps our in memory instance of the map for this session
import COLLECTION from "./collection" assert { type: "json" };
// ^^ Tracks our custom objects to the map between sessions, saved server side
import DEVICES from "./supported_devices" assert { type: "json" };
// ^^ supplied server side, accounts for all supported devices
let mapAddModal = new bootstrap.Modal("#mapAddModal");

window.onload = (event) => {

  MAP = L.map("map", {
    fullscreenControl: {
      pseudoFullscreen: true
    },
    crs: L.CRS.Simple
  });

  let bounds = [[0, 0], [1000, 1000]];

  let image = L.imageOverlay("./default_map", bounds).addTo(MAP);

  MAP.fitBounds(bounds);

  for (let i = 0; i < DEVICES.length; i++) {
    DEVICES[i].icon = L.icon({
      iconUrl: DEVICES[i].iconUrl,
      iconSize: DEVICES[i].iconSize,
      iconAnchor: DEVICES[i].iconAnchor
    });
  }

  // Now lets add our device info to wherever needed
  addDevicesToDOM();

  // Add our saved collection to the map
  addDevicesToMAP();

  MAP.addEventListener("dblclick", mapDoubleClick);

  document.getElementById("mapFilter.camera.input").addEventListener("change", mapFilterFunc);
  document.getElementById("mapFilter.ap.input").addEventListener("change", mapFilterFunc);
};

function addDevicesToDOM() {
  let itemType = document.getElementById("mapAddModal.itemType.input");
  let itemIcon = document.getElementById("mapAddModal.itemIcon.input");

  // First lets add the default 'Choose...' text
  let default_itemType = document.createElement("option");
  default_itemType.text = "Choose...";
  default_itemType.selected = true;
  itemType.add(default_itemType);

  let default_itemIcon = document.createElement("option");
  default_itemIcon.text = "Choose...";
  default_itemIcon.selected = true;
  itemIcon.add(default_itemIcon);

  for (let i = 0; i < DEVICES.length; i++) {
    let el_itemType = document.createElement("option");
    el_itemType.text = DEVICES[i].type;
    el_itemType.value = DEVICES[i].type;
    itemType.add(el_itemType);

    let el_itemIcon = document.createElement("option");
    el_itemIcon.text = DEVICES[i].iconName;
    el_itemIcon.value = DEVICES[i].iconName;
    itemIcon.add(el_itemIcon);
  }
}

function addDevicesToMAP() {
  for (const type in COLLECTION) {
    for (const item of COLLECTION[type]) {
      item.instance = L.marker([item.lat, item.lng], {
        icon: findIconPointer(item.icon),
        title: item.name
      }).addTo(MAP);
    }
  }
}

function mapDoubleClick(event) {
  // Lets then setup our modal for usage here

  document.getElementById("mapAddModal.itemLat.input").value = event.latlng.lat;
  document.getElementById("mapAddModal.itemLng.input").value = event.latlng.lng;
  mapAddModal.show();

  document.getElementById("mapAddModal.Form").addEventListener("submit", (innerEvent) => {

    // Now we want to extract all relevant values,
    // apply them to the current map, and save them serverside
    let item = {
      lat: document.getElementById("mapAddModal.itemLat.input").value,
      lng: document.getElementById("mapAddModal.itemLng.input").value,
      icon: document.getElementById("mapAddModal.itemIcon.input").value,
      name: document.getElementById("mapAddModal.itemName.input").value,
      type: document.getElementById("mapAddModal.itemType.input").value
    };

    innerEvent.preventDefault();

    cleanupDOMmapAddModal();
    mapAddModal.hide();

    item.instance = L.marker([item.lat, item.lng], {
      icon: findIconPointer(item.icon),
      title: item.name
    }).addTo(MAP);

    item.instance.addEventListener("contextmenu", markerRightClick);

    // Now to save data to our local object
    if (!COLLECTION[item.type]) {
      COLLECTION[item.type] = [];
    }

    COLLECTION[item.type].push(item);

    saveCollectionPromise()
      .then((res) => {
        generateToast("Saved", "Map Successfully Saved", `toastMapSaved_${Math.random()}`)
          .then((toast) => {
            // Res is now an instance of toast to edit for success
            toast.show();
          })
          .catch((err) => {
            // This error isn't critical since it failed to send the toast
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
        generateToast("Error", "Failed to Save Map!", `toastMapFail_${Math.random()}`)
          .then((toast) => { toast.show(); })
          .catch((error) => { console.error(error); });
      });

  }, {once:true});

}

function mapFilterFunc(event) {

  let isChecked = event.srcElement.checked;
  let deviceClass;
  // TODO Hopefully make this dynamic somehow
  switch(event.srcElement.id) {
    case "mapFilter.camera.input":
      deviceClass = "cameras";
      break;
    case "mapFilter.ap.input":
      deviceClass = "access_points";
      break;
    default:
      deviceClass = "";
      break;
  }

  if (deviceClass.length > 1 && isChecked && COLLECTION[deviceClass]?.length > 0) {

    for (let i = 0; i < COLLECTION[deviceClass].length; i++) {
      let item = COLLECTION[deviceClass][i];
      item.instance = L.marker([item.lat, item.lng], {
        icon: findIconPointer(item.icon),
        title: item.name
      }).addTo(MAP);

      item.instance.addEventListener("contextmenu", markerRightClick);
    }

  } else if (deviceClass.length > 1 && !isChecked && COLLECTION[deviceClass]?.length > 0) {
    for (let i = 0; i < COLLECTION[deviceClass].length; i++) {
      let item = COLLECTION[deviceClass][i];
      if (item.instance) {
        item.instance.remove();
      }
    }
  }
}

function markerRightClick(event) {
  // This function handles the event when an existing icon
  // is right clicked. When that icon is right clicked it'll open our same icon
  // creation marker, but allows us to edit it's values
  let item = findItemByLatLng(event.latlng.lat, event.latlng.lng);

  document.getElementById("mapAddModal.itemLat.input").value = item.lat;
  document.getElementById("mapAddModal.itemLng.input").value = item.lng;
  document.getElementById("mapAddModal.itemIcon.input").value = item.icon;
  document.getElementById("mapAddModal.itemName.input").value = item.name;
  document.getElementById("mapAddModal.itemType.input").value = item.type;
  mapAddModal.show();

  document.getElementById("mapAddModal.Form").addEventListener("submit", (innerEvent) => {
    item.instance.remove();

    item = {
      lat: document.getElementById("mapAddModal.itemLat.input").value,
      lng: document.getElementById("mapAddModal.itemLng.input").value,
      icon: document.getElementById("mapAddModal.itemIcon.input").value,
      name: document.getElementById("mapAddModal.itemName.input").value,
      type: document.getElementById("mapAddModal.itemType.input").value
    };

    innerEvent.preventDefault();

    cleanupDOMmapAddModal();
    mapAddModal.hide();

    item.instance = L.marker([item.lat, item.lng], {
      icon: findIconPointer(item.icon),
      title: item.name
    }).addTo(MAP);

    saveCollectionPromise()
      .then((res) => {
        generateToast("Saved", "Map Successfully Saved", `toastMapSaved_${Math.random()}`)
          .then((toast) => {
            // Res is now an instance of a toast
            toast.show();
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
        generateToast("Error", "Failed to Save Map!", `toastMapFail_${Math.random()}`)
          .then((toast) => { toast.show(); })
          .catch((error) => { console.error(error); });
      });

    item.instance.addEventListener("contextmenu", markerRightClick);

  }, {once:true});
}

function findIconPointer(icon) {
  if (typeof icon !== "string") {
    return null;
  }

  for(let i = 0; i < DEVICES.length; i++) {
    if (DEVICES[i].iconName === icon) {
      return DEVICES[i].icon;
    }
  }

  return null;
}

function findItemByLatLng(lat, lng) {
  for (const type in COLLECTION) {
    for (const item of COLLECTION[type]) {
      if (parseFloat(item.lat) === lat && parseFloat(item.lng) === lng) {
        return item;
      }
    }
  }

  return -1;
}

function cleanupDOMmapAddModal() {
  document.getElementById("mapAddModal.itemLat.input").value = 0;
  document.getElementById("mapAddModal.itemLng.input").value = 0;
  document.getElementById("mapAddModal.itemName.input").value = "";
  document.getElementById("mapAddModal.itemIcon.input").value = "Choose...";
  document.getElementById("mapAddModal.itemType.input").value = "Choose...";
  return;
}

function saveCollectionPromise() {
  return new Promise((resolve, reject) => {
    const res = fetch("./collection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cleanCollection())
    }).then((res) => {
      if (res.status === 201) {
        resolve(res.status);
      } else {
        reject(res.status);
      }
    })
    .catch((err) => {
      reject(error);
    });
  });
}

function cleanCollection() {
  let out = {};

  for (const type in COLLECTION) {
    out[type] = [];
    for (const item of COLLECTION[type]) {
      out[type].push({
        lat: item.lat,
        lng: item.lng,
        icon: item.icon,
        name: item.name,
        type: item.type
        // purposefully don't copy instance
      });
    }
  }
  return out;
}

function retreiveToast(title, text, id) {
  return new Promise((resolve, reject) => {
    const res = fetch("./toast-generator?" + new URLSearchParams({
      title: title,
      text: text,
      id: id
    }), {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((res) => {
      resolve(res.json());
    }).catch((err) => {
      reject(err);
    });
  });
}

function generateToast(title, text, id) {
  return new Promise((resolve, reject) => {
    retreiveToast(title, text, id)
      .then((res) => {

        let node = new DOMParser().parseFromString(res.content, "text/html");
        document.getElementById("toastContainer").appendChild(node.body.firstChild);

        let toast = new bootstrap.Toast(document.getElementById(id));

        resolve(toast);
      })
      .catch((err) => {
        console.error(err);
        reject(false);
      });
  });
}
