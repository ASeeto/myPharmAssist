# myPharmAssist
myPharmAssist is an open source web project purposed for easing communication between pharmacists and patients. The application provides a platform for creating and storing profiles where users can then record individual prescription data for themselves and their family members. An interactive calendar is also provided in order for users to create reminder events that can detail information such as which prescriptions should be taken on which days as well as dates and deadlines for refilling prescriptions. Please feel free to contribute by reporting issues and/or submitting pull requests.

## Initial Set-up
Download the repo  
```
git clone https://github.com/ASeeto/myPharmAssist.git
```

Install dependencies using Composer  
```
cd myPharmAssist/api && php composer.phar install && php composer.phar update
```

Create a database and import or execute ```api/tables.sql```  
```
mysql directory -uroot < tables.sql 
```

##User Guide
###Pharmacy  
Start by entering a local address to discover pharmacies nearby. Markers will populate on the provided map. By selecting a marker and clicking "Save as my Pharmacy" in the Details panel, you will have successfully stored your local pharmacy for your user account.
###Profiles  
Create a new profile using the provided button. A pop-up will appear where you can type in the name or label to identify the individual you'd like to create a prescription profile for. Then, select a color to better represent this profile. Following creation, you will see the new profile listed on the page. By hovering over the profile box, you will see two buttons appear. These buttons provide the option to edit the details you previously entered or to delete the profile entirely. By clicking on the profile box itself, you will be taken to the prescription profile's personal page.
###Prescription Profile  
You can modify or delete the profile by hoving over the box on this page, similar to the Profiles page. This page allows you to create new prescriptions with relevant data that you may have received from your local pharmacist. Fill in all of the fields in a new prescription form and click create. You will see the new prescription displayed and options to duplicate, reset, delete, or save a prescription.
###Calendar  
The calendar allows you to record events to better track prescription schedules.

## Resources
- [Backbone Directory](https://github.com/ccoenraets/backbone-directory) by [Christophe Coenraets](http://coenraets.org/)
- [Backbone Directory - Auth](https://github.com/clintberry/backbone-directory-auth) by [Clint Berry](http://clintberry.com/)
- [Bootstrap 3 Date/Time Picker](https://github.com/Eonasdan/bootstrap-datetimepicker) by [Eonasdan](https://github.com/Eonasdan)
- [Bootstrap Calendar](https://github.com/Serhioromano/bootstrap-calendar) by [Sergey Romanov](http://github.com/Serhioromano)
- [Bootstrap Colorpicker](https://github.com/mjolnic/bootstrap-colorpicker) by [Javier Aguilar](http://mjolnic.com/)
- [Font Awesome](http://fortawesome.github.io/Font-Awesome/)
- [jQuery](https://jquery.com/)
- [Prescription Writing 101](http://medicalschoolhq.net/prescription-writing-101/)
- [Moment.js](http://momentjs.com/)
- [Slim PHP Framework](https://github.com/slimphp/Slim)
- [Twitter Bootstrap 3](http://getbootstrap.com/)














