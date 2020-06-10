// Copyright (c) 2020, Dennis Tatila and contributors
// For license information, please see license.txt

frappe.ui.form.on('Document', {
	

	
	refresh: function(frm) {
		
		 frappe.call({
            "method": "frappe.client.get",
            args: {
                   doctype: "Employee",
                    filters: {
                    user_id: frappe.session.user,
                      }
                    },
                    callback: function(data) {
						console.log(data.message("grade"));
						if (data.message["grade"] == "I"){
							cur_frm.set_df_property("assessment_section", "hidden", 0);
						}else {
							cur_frm.set_df_property("assessment_section", "hidden", 1);
						}
					}
		 })
//		console.log(frappe.user_roles)
//		 if (frappe.user_has_roles in ("Document Approval")) {
//			frappe.msgprint("Hello");
//			cur_frm.set_df_property("department_approval_section", "hidden", 0);
//		}else {
//			
//			cur_frm.set_df_property("department_approval_section", "hidden", 1);
//		}
		
			 
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
		 
		 if (frm.doc.internal_memo_type == "Request Transfer" || frm.doc.internal_memo_type == "Request for Procurement") {
			  frm.set_df_property('ref',  'read_only', 1);
		 } else {
			 frm.set_df_property('ref',  'read_only', 0);
		 }
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
