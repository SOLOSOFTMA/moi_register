# -*- coding: utf-8 -*-
# Copyright (c) 2020, Dennis Tatila and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class DocumentRegister(Document):

    def on_submit(self):
        if not self.ref:
            self.ref = self.name
        if not self.document_to_employee:self.get_document_to()
#            self.insert()
 #           self.submit()
        


    def validate(self):
        if not self.document_from:
            self.get_document_from()
        if self.hod_approval_status:
            if not self.head_of_department_name:
                self.get_department_approval()

#        if self.internal_memo_type == "Acting Appointment":
#            self.workflow_state = "Endorsed"
  
                
        if self.director_of_ssd_status:
            if not self.director_of_ssd_name:
                self.get_director_of_ssd()
    


    def get_document_to(self):
        user = frappe.session.user
        db_value = frappe.db.get_value("Employee", {"user_id": user}, ["name", "employee_name"], as_dict=1)   
        self.document_to_employee = db_value.name
        self.document_to = db_value.employee_name


    def get_document_from(self):
        user = frappe.session.user
        db_value = frappe.db.get_value("Employee", {"user_id": user}, ["name", "employee_name"], as_dict=1)   
        self.document_from_employee = db_value.name
        self.document_from = db_value.employee_name
        
    def get_department_approval(self):
        user = frappe.session.user
        db_value = frappe.db.get_value("Employee", {"user_id": user}, ["name", "employee_name"], as_dict=1)
        self.head_of_department = db_value.name
        self.head_of_department_name = db_value.employee_name

#        if self.internal_memo_type == "Acting Appointment" and self.workflow_state == "HOD Approved":
#            self.workflow_state = "Endorsed"
        
    def get_director_of_ssd(self):
        user = frappe.session.user
        db_value = frappe.db.get_value("Employee", {"user_id": user}, ["name", "employee_name"], as_dict=1)
        self.director_of_ssd = db_value.name
        self.director_of_ssd_name = db_value.employee_name
