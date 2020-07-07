// Copyright (c) 2020, Dennis Tatila and contributors
// For license information, please see license.txt

frappe.ui.form.on('Document Register', {

//	setup: function(frm) {
//		frm.set_query("check_by", function() {
//			return {
//				filters: [
//					["User","role", "in", ["Document Approval"],
//					["User", 'name','=' ,frappe.db.get_value('Employee', frm.doc.head_of_department, 'user_id')]
//					]
//			}
//		});
//	},
	refresh: function(frm) {

		if (frm.doc.document_type == "Savingram"){
			cur_frm.set_df_property("document_type_section", "hidden", 1);
		}else{
			cur_frm.set_df_property("document_type_section", "hidden", 0);
		}
		 frappe.call({
            "method": "frappe.client.get",
            args: {
                   doctype: "Employee",
                    filters: {
                    user_id: frappe.session.user,
                      }
                    },
                    callback: function(data) {

						if (in_list(["F","G","H","I","J"], data.message["grade"])){
							if(frm.doc.hod_approval_status == "Approved" || frm.doc.hod_approval_status == "Decline"){
//								cur_frm.set_df_property("hod_approval_status", "read_only", 1);
								
								if(frm.doc.hod_approval_status == "Approved" && frm.doc.workflow_state == "HOD Approved"){
									frm.set_value("status", "HOD Approved")
								}else if (frm.doc.hod_approval_status == "Decline"){
									frm.set_value("status", "Decline")
								}
							}
							else{
//								cur_frm.set_df_property("hod_approval_status", "read_only", 0);
//								cur_frm.set_df_property("director_of_ssd_status", "read_only", 1);
							}
						}else {
//							cur_frm.set_df_property("hod_approval_status", "read_only", 1);
//							cur_frm.set_df_property("director_of_ssd_status", "read_only", 1);
						}

						if (in_list(["Manager Finance", "Director Co-oporative Services"], data.message["designation"])){
							if(frm.doc.director_of_ssd_status == "Endorsed" || frm.doc.director_of_ssd_status == "NOT Endorsed"){
//								cur_frm.set_df_property("director_of_ssd_status", "read_only", 1);
								
								if(frm.doc.director_of_ssd_status == "Endorsed" && frm.doc.workflow_state == "Endorsed"){
									frm.set_value("status", "Endorsed")
								}else if (frm.doc.director_of_ssd_status == "NOT Endorsed"){
									frm.set_value("status", "NOT Endorsed")
								}
								
							}else {
//								cur_frm.set_df_property("director_of_ssd_status", "read_only", 0);	
							}
						}else {
//							cur_frm.set_df_property("director_of_ssd_status", "read_only", 1);
						}

						if (in_list(["CEO"], data.message["designation"]) || data.message["acting_ceo"]=="1"){
							if(frm.doc.status == "Approved"){
								frm.set_value("ceo_status", "Approved")
							}else if (frm.doc.status == "Decline"){
								frm.set_value("ceo_status", "Decline")
							}
						}
					}
		 })
		
		if (frm.doc.docstatus == 1 && frm.doc.check_overtime_request == 0 && frappe.user.has_role("Document Approval")){
			frm.trigger('show_check_button')
			}
			else{

			}
		},
		show_check_button: function(frm){
			frappe.call({
				"method": "frappe.client.get",
				args: {
						doctype: "Employee",
						filters: { name: frm.doc.head_of_department }
					},
				callback: function (data) {
					if (frappe.session.user == data.message["user_id"]){
						frm.add_custom_button(__("Check"),function () {
						frm.trigger('check_overtime_request')
						}).addClass("btn-primary");
						}
					}
				})
		},
		check_overtime_request:function (frm) {
		var d = new frappe.ui.Dialog({
			title: __("Check Overtime Request"),
			fields: [
				{fieldname: "sec_break", fieldtype: "Section Break", label: __("Check Overtime Request")},
				{fieldname:'check_by', fieldtype:'Link', options: 'Employee', label: __('Check By')},
				{fieldname:'overtime_request_comment', fieldtype:'Small Text', label: __("Comments")}
			],
			primary_action: function() {
				var data = d.get_values();
				frappe.call({
					args: { docname: frm.doc.name,
							check_by :  data.check_by,
							overtime_request_comment : data.overtime_request_comment 
						},
					method: "moi_register.moi_register.doctype.document_register.document_register.update_document_register",
					callback: function(r) {
						if(!r.exc) {
							d.hide();
							frm.reload_doc();
							msgprint(r.exc)
						}
					}
				});
			},
			primary_action_label: __('Update')
		});
		d.show();
		},

	 document_type: function(frm){
//		if(in_list(["Savingram","Letter Head"],frm.doc.document_type)){
//			frm.set_df_property('subject',  'read_only', 0);
//		}
	 },
	 internal_memo_type: function(frm){
		 frm.set_value("subject",frm.doc.internal_memo_type);
		 
//		 if (frm.doc.internal_memo_type == "Request Transfer" || frm.doc.internal_memo_type == "Request for Procurement") {
//			  frm.set_df_property('ref',  'read_only', 1);
//		 } else {
//			 frm.set_df_property('ref',  'read_only', 0);
//		 }
	 }
});

frappe.ui.form.on("Estimated Cost Table", "rate", function(frm, cdt, cdn) {
    		
	var d = locals[cdt][cdn];
	frappe.model.set_value(d.doctype, d.name, "total", flt(d.qty * d.rate));
});

frappe.ui.form.on("Estimated Cost Table", "total", function(frm, cdt, cdn) {
	var d = locals[cdt][cdn];
    frappe.model.set_value(d.doctype, d.name, "total_fee", d.total);

    var total_fees = 0;
    frm.doc.estimated_cost_table.forEach(function(d) { total_fees += d.total; });

    frm.set_value("total_estimate", total_fees);
});


