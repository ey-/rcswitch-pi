## Docker compose based stack for switching Conrad RSL366 via Apple Home
 This project contains a stack to use with a Raspberry Pi.
 Use docker-compose to spin up containers switch & homebridge.
 Homebridge needs a proper config.json in config folder.
 
 ```json
 {
   "bridge": {
     "name": "YourBridgeName",
     "username": "AA:BB:CC:DD:EE:FF",
     "port": 1234,
     "pin": "123-45-678"
   },
 
   "description": "Describe your bridge",
 
   "accessories": [
     {
       "accessory": "eyRcSwitch",
       "name": "Name your switch",
       "host" : "http://switch",
       "port" : "9876",
       "systemCode": "SystemCodeForYourSwitch(1-4)",
       "id": "UnitOfYourSwitch(1.4)"
     }
   ]
 }
 ```
 

The switch container contains the implementation to control Conrad RSL366 switches via REST Interface.

The homebridge container contains additional plugin and homebridge built to communicate primarly with the switch container.
 
 Host needs to have avahi-daemon installed and running.
