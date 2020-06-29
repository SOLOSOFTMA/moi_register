from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
			{
				"label": _("Document Setting"),
				"items": [
						{
							"type": "doctype",
							"name": "Document Type",
							"onboard": 1,
						},
                        {
							"type": "doctype",
							"name": "Internal Memo Type",
							"onboard": 1,
						},
				]
			},
				{
				"label": _("Register Document"),
				"items": [
						{
							"type": "doctype",
							"name": "Document Register",
							"onboard": 1,
						},
				]
			},

	]