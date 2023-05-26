# Org Map

Easily organize and view the IT infrastructure in your organization!

Org Map aims to be the dead simple tool for IT administrators to achieve a clean layout of their organization. All you need is an image of your physical organization, and you can get started mapping the location of every MDF, IDF, Access Point, Printer, and more.

## Setup Docker

TODO WIP::

```bash
docker run -p YOUR_PORT:8080 --name CONTAINER_NAME -v LOCAL_PATH:/usr/src/app/data ghcr.io/confused-Techie/org-map:latest
```

Then your `LOCAL_PATH` should contain your `app.yaml` file, organization map, and it will contain the `map.json` created automatically.

## Setup Manual

1. The most challenging aspect of getting Org Map setup, is you do need a map of your organization. It's recommended to create this as an SVG to make sure it's highly scalable.

2. Create an `app.yaml` file. This will contain some simple configuration aspects needed for Org Map. An example of what this looks like is located in `app.example.yaml`, but otherwise you only need a few values:

  * `PORT`: This is the port the Org Map Server will be exposed on.
  * `TITLE`: This is the title of your Website that will show up in the browser.
  * `MAP`: This is the filename of your custom organization's map.

3. Now ensure both you `app.yaml` and your organization's map is located within the `data` folder.

4. Now you'll need to run the following commands to install all dependencies, and start up the Org Map server.

```bash
> npm install
> npm run start
```

5. Visit `http://SERVER_IP:SERVER_PORT` and you should see your organization's map is live!

## Usage

Now that you can view a nifty map of your organization, how do you start adding in devices?

### Adding Devices

Double Click anywhere on the map to get a popup Modal that allows you to fill out details of the device you want to add.

You'll see in the modal the `Latitude` and `Longitude` are already filled out with where you clicked, this will be the location the device is added in, but you can adjust if you need with these values manually.

There's also a few more fields on this modal that are good to fill out:

  * Item's Name: This is the name of the item, something like `CAM_01` or whatever helps you to identify this device.
  * Item's Icon: This is a list of all available icons that can be used.
  * Item's Type: This is the classification of the device type. Usually this will match the Icon.
  * Item's Notes: This is a free form field where you can type any valid markdown, to include additional notes such as MAC address, IP, or even links.

### Editing Devices

If you need to edit an already existing device, simply right click on it to be greeted with the same modal you used to create it. And you can edit any values as needed the same exact way as you did to create the device.

### Deleting Devices

To delete any device, just double click the device itself to get a delete Modal for the device.

### Backing Up

If you every want to backup your map (as is good practice), as soon as you start adding devices you'll find a `map.json` file within the `data` directory, this file is all that is needed to backup the content of your map. The `map.json`, `app.yaml`, and your custom organization's map SVG constitute all of the data that makes up your map, and is all that's needed to be kept safe.

## Supported Devices / Icons

As of `1.0.1` devices and the icons they use are now independent of each other. This means that you can use whatever icon you feel is best for your devices! But for the use of filtering there are still built in device classes.

The following is a list of all supported device classes:

  * camera
  * access_point
  * mdf
  * idf
  * security_system
  * phone
  * printer
  * temperature
  * tv
  * ip-speaker

The following list covers other item classes that can be used on the map:

  * label: Can be used where the Item's Name becomes a text label on the map.
  * siteLabel: Can be used where the Item's Name becomes a text label on the map, onl if zoomed out nearly all the way.
  * signage: Can be used to attach any number of the following icon's to indicate parking lots, restrooms, etc.

The following is a list of all supported icons:

  * video ![video](./static/assets/video.svg)
  * wifi ![wifi](./static/assets/wifi.svg)
  * server ![server](./static/assets/server.svg)
  * hard-drive ![hard-drive](./static/assets/hard-drive.svg)
  * lock ![lock](./static/assets/lock.svg)
  * phone ![phone](./static/assets/phone.svg)
  * printer ![printer](./static/assets/printer.svg)
  * speaker ![speaker](./static/assets/speaker.svg)
  * thermometer ![thermometer](./static/assets/thermometer.svg)
  * tv ![tv](./static/assets/tv.svg)
  * volume ![volume](./static/assets/volume-2.svg)

## Attributes

This project would not be possible without the fantastic following open source projects:

  * [Leaflet](https://leafletjs.com/)
  * [FeatherIcons](https://feathericons.com/)
