// Copyright (c) 2020, Dennis Tatila and contributors
// For license information, please see license.txt

frappe.ui.form.on('Document Register', {

	setup: function(frm) {
		frm.set_query("internal_memo_type", function() {
			return {
				filters: [
					["disable","=", 0,	]
				]
				}
		});
		frm.set_query("document_type", function() {
			return {
				filters: [
					["disable","=", 0,	]
				]
				}
		});
	},
	refresh: function(frm) {
//		msgprint("Check")
//		frappe.call({
//			args: { doc_creator: frm.doc.document_from_employee,
//					current_user : frappe.session.user
//				},
//			method: "moi_register.moi_register.doctype.document_register.document_register.get_user_permission",
//			callback: function(r) {
//				if(r.exc) {
//					d.hide();
//					frm.reload_doc();
//					msgprint(r.exc)
//				}
//			}
//		});

		if (frm.doc.document_type == "Savingram"){
			cur_frm.set_df_property("document_type_section", "hidden", 1);
		}else{
			cur_frm.set_df_property("document_type_section", "hidden", 0);
		}

		
		if (!frappe.user.has_role("CEO")){
	
			frappe.call({
				"method": "frappe.client.get",
				args: {
					doctype: "Employee",
						filters: {
						user_id: frappe.session.user,
						
						}
					},
						callback: function(data) {
							if (frappe.user.has_role("Document Approval") && !frappe.user.has_role("Document Approval SSD")){
								if (frm.doc.status == "HOD Approved"){
									frm.set_value("hod_approval_status", "Approved")
									frm.set_value("head_of_department",  data.message["name"])
									frm.set_value("head_of_department_name",  data.message["employee_name"])
								}
							}
							if (frappe.user.has_role("Document Approval") && frappe.user.has_role("Document Approval SSD")){
								if (frm.doc.status == "HOD Approved" && !frm.doc.hod_approval_status){
									frm.set_value("hod_approval_status", "Approved")
									frm.set_value("head_of_department",  data.message["name"])
									frm.set_value("head_of_department_name",  data.message["employee_name"])
								}
								if (frm.doc.status == "Endorsed"){
									frm.set_value("director_of_ssd_status", "Endorsed")
									frm.set_value("director_of_ssd",  data.message["name"])
									frm.set_value("director_of_ssd_name",  data.message["employee_name"])
								}
							}
						}
			
			})
		}
		if (frappe.user.has_role("CEO")){
		
			frappe.call({
				"method": "frappe.client.get",
				args: {
					doctype: "Employee",
						filters: {
						user_id: frappe.session.user,
						
						}
					},
						callback: function(data) {
							if (frm.doc.status == "Approved"){
								frm.set_value("ceo_status", "Approved")
								frm.set_value("document_to_employee",  data.message["name"])
								frm.set_value("document_to",  data.message["employee_name"])
							}
						}
			
			})
		}
			
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
	 },
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


