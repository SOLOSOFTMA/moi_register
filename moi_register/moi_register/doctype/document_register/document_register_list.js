// Copyright (c) 2020, Dennis Tatila and contributors
// For license information, please see license.txt

frappe.listview_settings['Document Register'] = {
	hide_name_column: true,
	add_fields: ["status"],
	has_indicator_for_draft: 1,
	get_indicator: function(doc) {

		if(doc.docstatus==0){
			if(doc.status=="Pending"){
				return [__("Pending"), "red", "status,=,'Pending'"];
			} else if(doc.status=== "HOD Approved"){
				return [__("HOD Approval"), "orange", "status,=,'HOD Approved'"];
			} else if(doc.status=== "Endorsed"){
				return [__("Endorsed"), "blue", "status,=,'Endorsed'"];
			}
		} else if (doc.status === "Approved"){
			return [__("Approved"), "green", "status,=,'Approved'"];

		}
	}
};