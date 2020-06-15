// Copyright (c) 2020, Dennis Tatila and contributors
// For license information, please see license.txt

frappe.ui.form.on('Document Register', {

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

						if (in_list(["F","G","H","I","J"], data.message["grade"])){
							if(frm.doc.hod_approval_status == "Approved" || frm.doc.hod_approval_status == "Decline"){
								cur_frm.set_df_property("hod_approval_status", "read_only", 1);
								
								if(frm.doc.hod_approval_status == "Approved" && frm.doc.workflow_state == "HOD Approved"){
									frm.set_value("status", "HOD Approved")
								}else if (frm.doc.hod_approval_status == "Decline"){
									frm.set_value("status", "Decline")
								}

								if(frm.doc.hod_approval_status == "Approved" && frm.doc.internal_memo_type == "Acting Appointment"){
									if (frm.doc.workflow_state == "HOD Approved"){
										frm.set_value("status", "Endorsed")
//										frm.set_value("workflow_state", "Endorsed")
										frm.set_value("director_of_ssd_status", "Endorsed")
									}
								}
							}
							else{
								cur_frm.set_df_property("hod_approval_status", "read_only", 0);
								cur_frm.set_df_property("director_of_ssd_status", "read_only", 1);
							}
						}else {
							cur_frm.set_df_property("hod_approval_status", "read_only", 1);
							cur_frm.set_df_property("director_of_ssd_status", "read_only", 1);
						}

						if (in_list(["Manager Finance", "Director Corp.Services"], data.message["designation"])){
							if(frm.doc.director_of_ssd_status == "Endorsed" || frm.doc.director_of_ssd_status == "NOT Endorsed"){
								cur_frm.set_df_property("director_of_ssd_status", "read_only", 1);
								
								if(frm.doc.director_of_ssd_status == "Endorsed" && frm.doc.workflow_state == "Endorsed"){
									frm.set_value("status", "Endorsed")
								}else if (frm.doc.director_of_ssd_status == "NOT Endorsed"){
									frm.set_value("status", "NOT Endorsed")
								}
								
							}else {
								cur_frm.set_df_property("director_of_ssd_status", "read_only", 0);	
							}
						}else {
							cur_frm.set_df_property("director_of_ssd_status", "read_only", 1);
						}

						if (in_list(["CEO"], data.message["designation"]) || data.message["acting_ceo"]=="1"){
							if(frm.doc.status == "Approved"){
								frm.set_value("ceo_status", "Approved")
							}else if (frm.doc.status == "Decline"){
								frm.set_value("ceo_status", "Decline")
							}
							if(frm.doc.internal_memo_type == "Acting Appointment"){
								if (frm.doc.workflow_state == "HOD Approved"){
									
										frm.set_value("workflow_state", "Endorsed")
									
								}
							}

						}
					}
		 })
			 
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
