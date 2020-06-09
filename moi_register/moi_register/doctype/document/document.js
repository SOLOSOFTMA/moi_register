// Copyright (c) 2020, Dennis Tatila and contributors
// For license information, please see license.txt

frappe.ui.form.on('Document', {
	
	
	refresh: function(frm) {
		 
		
		
//		frm.set_query('document_to_employee', () => {
//			return {
//				filters: {
//					acting_ceo:  ["=", 1]
//				}
//			}
//		})
		 
		 
		 
		if (frm.doc.status == "Approved") {
            frm.add_custom_button(__('Assessment'), function() {
					cur_frm.set_df_property("assessment_section", "hidden", 0);
					frm.set_value("status", "Completed");
                }
            ).addClass("btn-primary");
			
			cur_frm.set_df_property("assessment_section", "hidden", 1);
        }
		if (frm.doc.status == "Completed") {
			cur_frm.set_df_property("assessment_section", "hidden", 0);
		}
		
	 },
	 internal_memo_type: function(frm){
		 frm.set_value("subject",frm.doc.internal_memo_type);
//		 frm.set_value("ref",frm.doc.name);
		 
		 if (frm.doc.internal_memo_type == "Request Transfer" || frm.doc.internal_memo_type == "Request for Procurement") {
			  frm.set_df_property('ref',  'read_only', 1);
		 } else {
			 frm.set_df_property('ref',  'read_only', 0);
		 }
		
				
	
		frappe.call({
			"method": "frappe.client.get",
				args: {
					doctype: "Employee",
					filters: {'acting_ceo': ["=", 1]},
					},
					callback: function (data) {
					frm.set_value("document_to_employee",data.message["employee_name"])
					}
				})	  
		 
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
