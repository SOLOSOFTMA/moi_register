from __future__ import unicode_literals
import frappe
from frappe.utils import now
from frappe import _

no_cache = 1
no_sitemap = 1

def get_context(context):
#    if frappe.session.user == "Guest" and frappe.session.data.user_type !="System User":
#        frappe.local.flags.redirect_location = "/login"
#        raise frappe.Redirect
        
    context.slide_show_images = frappe.db.sql("select file_url, file_name from `tabFile` where image_for='Slide Show'", as_dict=True)
    context.icons = frappe.db.sql("select file_url, application_path from `tabFile` where image_for='Icon'", as_dict=True)