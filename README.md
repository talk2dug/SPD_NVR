###
## Open Source MIT License
###

This is a compilation of NVR scripts to interact with the Amcrest API
Notes:
-	Camera: We are designing our own POE IP camera using a raspberry pi zero with a raspberry pi camera. The housing is a custom designed waterproof ABS case. The camera is powered vie the ethernet cable running at 48v. The camera has the option for WiFi or ethernet. If using WiFi a separate 12v power line needs to be used instead of the POE 48v. The camera can store videos locally. 
o	Future versions: The second version of the camera will add additional functionality that will increase its versatility. The Pi zero will be replaced with a compute module 4 attached to a custom designed PCP board. By moving to the compute module, we can add AI to the camera giving us smart cameras.  The first version of the board has been designed and is waiting to be printed at LSU
-	Main unit: The main unit of the NVR consists of 2 raspberry Pi4s, 2- 2TB hard drives, and access point and various hardware for power management. By using 2 Pi4s we increase the quality of video but we also allow for live streaming of the cameras. 
-	Touch screen: This is the unit the officer will interact with. It’s a 7” touchscreen with a raspberry pi4. It connects directly to the main unit and allows for full control via a web interface.

Parts:
-	Case
-	Raspberry pi4
-	2 TB SSD hard drive
-	SSDs
-	5v converter
-	48v converter
-	Raspberry pi zero
-	7” touch screen
-	Ethernet cable
-	GPS
-	Ethernet switch
-	POE injector
-	AP
Cost:

