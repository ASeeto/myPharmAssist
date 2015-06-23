window.PrescriptionsDivsView = Backbone.View.extend({

    tagName:'div',

    className:'table-responsive',

    initialize:function () {
        var self = this;
        this.model.bind("reset", this.render, this);
        this.model.bind("add", function (prescription) {
            $(self.el).append(new PrescriptionDivView({model:prescription}).render().el);
        });
    },

    render:function () {
        $(this.el).empty();
        /** Initiailize table components */
        table = $('<table class="table table-striped table-hover"></table>');
        thead = $('<thead>' + 
                    '<th>Medication</th>' +
                    '<th>Strength</th>' +
                    '<th>Quantity</th>' +
                    '<th>Route</th>' +
                    '<th>Frequency</th>' +
                    '<th>Dispense</th>' +
                    '<th>Refills</th>' +
                    '<th></th>' +
                    '<th></th>' +
                    '<th></th>' +
                  '</thead>');
        tbody = $('<tbody></tbody>');
        /** Append table head */
        table.append(thead);
        /** Create table body */
        _.each(this.model.models, function (prescription) {
            tbody.append(new PrescriptionDivView({model:prescription}).render().el);
        }, this);
        /** Append table body */
        table.append(tbody);
        /** Append table to div */
        $(this.el).append(table);
        /** Return rendered prescriptions */
        return this;
    }
});

window.PrescriptionDivView = Backbone.View.extend({

    tagName:"tr",

    initialize:function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    events: {},

    render:function () {

        /** Convert model to JSON object to parse data into row */
        var prescription = this.model.toJSON();

        /** Form Inputs as Strings */
        medication =    '<input class="form-control" type="text" placeholder="Name">';
        strength   =    '<input class="form-control" type="text" placeholder="(in miligrams)">';
        quantity   =    '<select class="form-control">' +
                            '<option value="1">1</option>' +
                            '<option value="2">2</option>' +
                            '<option value="3">3</option>' +
                            '<option value="4">4</option>' +
                            '<option value="5">5</option>' +
                            '<option value="6">6</option>' +
                            '<option value="7">7</option>' +
                            '<option value="8">8</option>' +
                            '<option value="9">9</option>' +
                            '<option value="10">10</option>' +
                        '</select>';
        route      =    '<select class="form-control">' +
                            '<option value="PO">By Mouth (PO)</option>' +
                            '<option value="PR">Per Rectum (PR)</option>' +
                            '<option value="IM">Intramuscular (IM)</option>' +
                            '<option value="IV">Intravenous (IV)</option>' +
                            '<option value="ID">Intradermal (ID)</option>' +
                            '<option value="IN">Intranasal (IN)</option>' +
                            '<option value="TP">Topical (TP)</option>' +
                            '<option value="SL">Sublingually (SL)</option>' +
                            '<option value="BUCC">Buccal (BUCC)</option>' +
                            '<option value="IP">Intraperitoneal (IP)</option>' +
                        '</select>';
        frequency  =    '<select class="form-control">' +
                            '<option value="D">Daily</option>' +
                            '<option value="EOD">Every Other Day</option>' +
                            '<option value="BID">Twice a Day (BID/b.i.d.)</option>' +
                            '<option value="TID">Three Times a Day (TID/t.i.d.)</option>' +
                            '<option value="QID">Four Times a Day (QID/q.id.)</option>' +
                            '<option value="QHS">Every Bedtime (QHS)</option>' +
                            '<option value="Q4h">Every 4 Hours (Q4h)</option>' +
                            '<option value="Q4-6h">Every 4-6 hours (Q4-6h)</option>' +
                            '<option value="QWK">Every Week (QWK)</option>' +
                        '</select>';
        dispense   =    '<input class="form-control" type="text" placeholder="Dispense Amount">';
        refills    =    '<input class="form-control" type="text" placeholder="# of allowed refills">';

        /** Column Data for Current Prescription */
        medication = $(medication).val(prescription.medication);
        strength   = $(strength).val(prescription.strength);
        quantity   = $(quantity).val(prescription.quantity);
        route      = $(route).val(prescription.route);
        frequency  = $(frequency).val(prescription.frequency);
        dispense   = $(dispense).val(prescription.dispense);
        refills    = $(refills).val(prescription.refills);

        /** Create table body */
        $(this.el).append($('<td></td>').append(medication));
        $(this.el).append($('<td></td>').append(strength));
        $(this.el).append($('<td></td>').append(quantity));
        $(this.el).append($('<td></td>').append(route));
        $(this.el).append($('<td></td>').append(frequency));
        $(this.el).append($('<td></td>').append(dispense));
        $(this.el).append($('<td></td>').append(refills));
        $(this.el).append($('<td><button class="duplicatePrescription btn btn-primary glyphicon-duplicate"></button></td>'));
        $(this.el).append($('<td><button class="resetPrescription btn btn-warning glyphicon-refresh"></button></td>'));
        $(this.el).append($('<td><button class="deletePrescription btn btn-danger glyphicon-trash"></button></td>'));
        $(this.el).append($('<td><button class="updatePrescription btn btn-success glyphicon-floppy-disk"></button></td>'));

        /** Assign model id as row id */
        $(this.el).attr('id', prescription.id);
        /** Return rendered prescription row */
        return this;
    }
});