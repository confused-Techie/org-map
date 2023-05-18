# Org Map

Easily organize and view the IT infrastructure in your organization!

Org Map aims to be the dead simple tool for IT administrators to achieve a clean layout of their organization. All you need is an image of your physical organization, and you can get started mapping the location of every MDF, IDF, Access Point, Printer, and more.

## Setup

1. The most challenging aspect of getting Org Map setup, is you do need a map of your organization. It's recommended to create this as an SVG to make sure it's highly scalable.

2. Create an `app.yaml` file. This will contain some simple configuration aspects needed for Org Map. An example of what this looks like is located in `app.example.yaml`, but otherwise you only need a few values:

  * `PORT`: This is the port the Org Map Server will be exposed on.
  * `TITLE`: This is the title of your Website that will show up in the browser.
  * `MAP`: This is the filename of your custom organization's map.

3. Now ensure your `app.yaml` is in the root directory of this repository. Then ensure your organization's map is located within the `data` folder.

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

### Editing Devices

If you need to edit an already existing device, simply right click on it to be greeted with the same modal you used to create it. And you can edit any values as needed the same exact way as you did to create the device.

### Backing Up

If you every want to backup your map (as is good practice), as soon as you start adding devices you'll find a `map.json` file within the `data` directory, this file is all that is needed to backup the content of your map. The `map.json`, `app.yaml`, and your custom organization's map SVG constitute all of the data that makes up your map, and is all that's needed to be kept safe.

## Supported Devices

The following is a list of all supported devices:

  * Cameras ![Camera](./static/assets/video.svg)
  * Access Points ![Access Points](./static/assets/wifi.svg)
  * MDFs ![MDF](./static/assets/server.svg)
  * IDFs ![IDF](./static/assets/hard-drive.svg)
  * Security ![Security](./static/assets/lock.svg)
  * Phones ![Phone](./static/assets/phone.svg)
  * Printers ![Printer](./static/assets/printer.svg)
  * Speakers ![Speaker](./static/assets/speaker.svg)
  * Thermometers ![Themometer](./static/assets/thermometer.svg)
  * TVs ![TV](./static/assets/tv.svg)
  * IP Speakers ![IP Speaker](./static/assets/volume-2.svg)

## Attributes

This project would not be possible without the fantastic following open source projects:

  * [Leaflet](https://leafletjs.com/)
  * [FeatherIcons](https://feathericons.com/)
