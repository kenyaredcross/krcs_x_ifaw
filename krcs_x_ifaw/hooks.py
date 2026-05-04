app_name = "krcs_x_ifaw"
app_title = "Krcs X Ifaw"
app_publisher = "krcs"
app_description = "collaboaration tool for krcs and ifaw"
app_email = "volunteer.ict@redcross.or.ke"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Website Route Rules
# ------------------
website_route_rules = [
	{"from_route": "/krcs-x-ifaw/<path:app_path>", "to_route": "krcs-x-ifaw"},
]

# Fixtures
# --------
fixtures = [
	{"dt": "Role", "filters": [["name", "in", ["KRCS x IFAW"]]]},
]

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "krcs_x_ifaw",
# 		"logo": "/assets/krcs_x_ifaw/logo.png",
# 		"title": "Krcs X Ifaw",
# 		"route": "/krcs_x_ifaw",
# 		"has_permission": "krcs_x_ifaw.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/krcs_x_ifaw/css/krcs_x_ifaw.css"
# app_include_js = "/assets/krcs_x_ifaw/js/krcs_x_ifaw.js"

# include js, css files in header of web template
# web_include_css = "/assets/krcs_x_ifaw/css/krcs_x_ifaw.css"
# web_include_js = "/assets/krcs_x_ifaw/js/krcs_x_ifaw.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "krcs_x_ifaw/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "krcs_x_ifaw/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# automatically load and sync documents of this doctype from downstream apps
# importable_doctypes = [doctype_1]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "krcs_x_ifaw.utils.jinja_methods",
# 	"filters": "krcs_x_ifaw.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "krcs_x_ifaw.install.before_install"
# after_install = "krcs_x_ifaw.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "krcs_x_ifaw.uninstall.before_uninstall"
# after_uninstall = "krcs_x_ifaw.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "krcs_x_ifaw.utils.before_app_install"
# after_app_install = "krcs_x_ifaw.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "krcs_x_ifaw.utils.before_app_uninstall"
# after_app_uninstall = "krcs_x_ifaw.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "krcs_x_ifaw.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"krcs_x_ifaw.tasks.all"
# 	],
# 	"daily": [
# 		"krcs_x_ifaw.tasks.daily"
# 	],
# 	"hourly": [
# 		"krcs_x_ifaw.tasks.hourly"
# 	],
# 	"weekly": [
# 		"krcs_x_ifaw.tasks.weekly"
# 	],
# 	"monthly": [
# 		"krcs_x_ifaw.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "krcs_x_ifaw.install.before_tests"

# Extend DocType Class
# ------------------------------
#
# Specify custom mixins to extend the standard doctype controller.
# extend_doctype_class = {
# 	"Task": "krcs_x_ifaw.custom.task.CustomTaskMixin"
# }

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "krcs_x_ifaw.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "krcs_x_ifaw.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["krcs_x_ifaw.utils.before_request"]
# after_request = ["krcs_x_ifaw.utils.after_request"]

# Job Events
# ----------
# before_job = ["krcs_x_ifaw.utils.before_job"]
# after_job = ["krcs_x_ifaw.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"krcs_x_ifaw.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

# Translation
# ------------
# List of apps whose translatable strings should be excluded from this app's translations.
# ignore_translatable_strings_from = []

