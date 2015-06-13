/**
 *  DEFAULT variables for my personal directory hierarchy
 */
var BASEURL = '/projects/';
var PROJECT = 'myPharmAssist';
var SLIMLOC = BASEURL+PROJECT+'/api';

window.Employee = Backbone.Model.extend({

    urlRoot:SLIMLOC+"/employees",

    initialize:function () {
        this.reports = new EmployeeCollection();
        this.reports.url = SLIMLOC+'/employees/' + this.id + '/reports';
    }

});

window.EmployeeCollection = Backbone.Collection.extend({

    model: Employee,

    url:"../../api/employees",

    findByName:function (key) {
        var url = (key == '') ? SLIMLOC+'/employees' : SLIMLOC+'/employees/search/' + key;
        console.log('findByName: ' + key);
        var self = this;
        $.ajax({
            url:url,
            dataType:"json",
            success:function (data) {
                console.log("search success: " + data.length);
                self.reset(data);
            }
        });
    }

});