# -*- coding: utf-8 -*-
# Copyright (c) 2020, Dennis Tatila and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

from frappe.utils import flt, cint, cstr
from frappe import _
from frappe.model.mapper import get_mapped_doc
from frappe.model.document import Document

class DocumentRegister(Document):

    def on_submit(self):
        if not self.ref:
            self.ref = self.name
        if not self.document_to_employee:
            self.get_document_to()        


    def validate(self):
        if self.document_type != "Savingram":
            if not self.document_from:
                self.get_document_from()
        if self.hod_approval_status:
            if not self.head_of_department_name:
                self.get_department_approval() 
                
        if self.director_of_ssd_status:
            if self.document_type != "Savingram" or self.document_type != "Vehicle Permit":
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
        if self.document_type == "Savingram":
            self.get_department_approval()
        if self.document_type != "Savingram":
            self.document_from_employee = db_value.name
            self.document_from = db_value.employee_name
        
    def get_department_approval(self):
        user = frappe.session.user
        db_value = frappe.db.get_value("Employee", {"user_id": user}, ["name", "employee_name"], as_dict=1)
        self.head_of_department = db_value.name
        self.head_of_department_name = db_value.employee_name
        
    def get_director_of_ssd(self):
        user = frappe.session.user
        db_value = frappe.db.get_value("Employee", {"user_id": user}, ["name", "employee_name"], as_dict=1)
        self.director_of_ssd = db_value.name
        self.director_of_ssd_name = db_value.employee_name


@frappe.whitelist()
def update_document_register(docname, check_by, overtime_request_comment):
    emp = frappe.db.get_value("Employee", {"name": check_by}, ["employee_name"], as_dict=1)
    todaydate = frappe.utils.nowdate()
    frappe.db.sql("""Update `tabDocument Register` set check_by=%s, employee_check_name=%s, overtime_request_comment=%s, check_overtime_request = 1, check_date=%s where name=%s""", (check_by, emp.employee_name, overtime_request_comment, todaydate, docname))
#    frappe.db.sql("""Update `tabDocument Register` set check_by=%s, overtime_request_comment=%s where name=%s""", (employee, overtime_request_comment, docname))
    frappe.msgprint(_("Overtime Form Updated"))
#        frappe.throw(_("There's no Employee with Salary Structure: {0}. Assign {1} to an Employee to preview Salary Slip").format(salary_structure, salary_structure))


