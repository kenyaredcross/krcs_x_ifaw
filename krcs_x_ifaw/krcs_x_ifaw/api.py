import json

import frappe
from frappe import _
from frappe.utils import now_datetime


# ─── Permission helpers (not whitelisted) ────────────────────────────────────

def has_app_permission():
	return frappe.has_role(frappe.session.user, "KRCS x IFAW") or frappe.has_role(
		frappe.session.user, "System Manager"
	)


def has_session_permission(doc, ptype, user):
	return frappe.has_role(user, "KRCS x IFAW") or frappe.has_role(user, "System Manager")


# ─── User info ────────────────────────────────────────────────────────────────

@frappe.whitelist()
def get_current_user_info():
	user = frappe.session.user
	if user == "Guest":
		frappe.throw(_("Login required."), frappe.AuthenticationError)
	user_doc = frappe.get_doc("User", user)
	return {
		"email": user,
		"name": user_doc.full_name or user_doc.first_name or user,
		"frappe_user": user,
	}


WORKSPACE_CODE = "ONEHEALTH-MAIN"


def _ensure_workspace():
	"""Create the single shared workspace if it doesn't exist yet."""
	if not frappe.db.exists("OH Session", WORKSPACE_CODE):
		doc = frappe.get_doc({
			"doctype": "OH Session",
			"session_code": WORKSPACE_CODE,
			"title": "One Health Ideation — Main Workspace",
			"status": "Active",
			"created_by": frappe.session.user,
			"created_on": now_datetime(),
		})
		doc.insert(ignore_permissions=True)
		frappe.db.commit()


# ─── Session management ───────────────────────────────────────────────────────

@frappe.whitelist()
def get_session(session_code):
	if not frappe.db.exists("OH Session", session_code):
		frappe.throw(_("Session not found."), frappe.DoesNotExistError)
	doc = frappe.get_doc("OH Session", session_code)
	return {
		"session_code": doc.name,
		"title": doc.title,
		"status": doc.status,
		"created_by": doc.created_by,
		"created_on": str(doc.created_on),
	}


@frappe.whitelist()
def join_session(session_code, organisation=""):
	_ensure_workspace()
	user = frappe.session.user
	participant_name = f"{session_code}-{user}"
	if not frappe.db.exists("OH Session Participant", participant_name):
		p = frappe.get_doc({
			"doctype": "OH Session Participant",
			"session": session_code,
			"user": user,
			"organisation": organisation,
			"joined_on": now_datetime(),
		})
		p.insert(ignore_permissions=True)
		frappe.db.commit()
	user_doc = frappe.get_doc("User", user)
	frappe.publish_realtime(
		event="oh_participant_joined",
		message={
			"session_code": session_code,
			"user": user,
			"full_name": user_doc.full_name or user,
			"organisation": organisation,
		},
		doctype="OH Session",
		docname=session_code,
		after_commit=True,
	)
	return {"ok": True}


# ─── Entry read / write ───────────────────────────────────────────────────────

@frappe.whitelist()
def get_session_entries(session_code):
	if not frappe.db.exists("OH Session", session_code):
		frappe.throw(_("Session not found."))
	rows = frappe.get_all(
		"OH Session Entry",
		filters={"session": session_code},
		fields=[
			"name", "category_id", "sub_index",
			"drivers_legacy", "interventions_legacy",
			"drivers_list", "interventions_list",
			"levels", "other", "contributors",
		],
	)
	result = {}
	for row in rows:
		cat = row["category_id"]
		sub = str(row["sub_index"])
		result.setdefault(cat, {})
		result[cat][sub] = {
			"drivers": row["drivers_legacy"] or "",
			"interventions": row["interventions_legacy"] or "",
			"driversList": json.loads(row["drivers_list"] or "[]"),
			"interventionsList": json.loads(row["interventions_list"] or "[]"),
			"levels": json.loads(row["levels"] or "[]"),
			"other": row["other"] or "",
			"by": json.loads(row["contributors"] or "[]"),
		}
	return result


@frappe.whitelist()
def save_entry(session_code, cat_id, sub_index, entry):
	if not frappe.db.exists("OH Session", session_code):
		frappe.throw(_("Session not found."))
	entry_data = json.loads(entry) if isinstance(entry, str) else entry
	user = frappe.session.user
	contributors = entry_data.get("by", [])
	if user not in contributors:
		contributors.append(user)

	sub_index = int(sub_index)
	entry_name = f"{session_code}-{cat_id}-{sub_index}"

	if frappe.db.exists("OH Session Entry", entry_name):
		doc = frappe.get_doc("OH Session Entry", entry_name)
	else:
		doc = frappe.new_doc("OH Session Entry")
		doc.session = session_code
		doc.category_id = cat_id
		doc.sub_index = sub_index

	doc.drivers_legacy = entry_data.get("drivers", "")
	doc.interventions_legacy = entry_data.get("interventions", "")
	doc.drivers_list = json.dumps(entry_data.get("driversList", []))
	doc.interventions_list = json.dumps(entry_data.get("interventionsList", []))
	doc.levels = json.dumps(entry_data.get("levels", []))
	doc.other = entry_data.get("other", "")
	doc.contributors = json.dumps(contributors)
	doc.last_modified_by = user
	doc.last_modified_on = now_datetime()

	if doc.is_new():
		doc.insert(ignore_permissions=True)
	else:
		doc.save(ignore_permissions=True)
	frappe.db.commit()

	updated_entry = {
		"drivers": doc.drivers_legacy or "",
		"interventions": doc.interventions_legacy or "",
		"driversList": json.loads(doc.drivers_list or "[]"),
		"interventionsList": json.loads(doc.interventions_list or "[]"),
		"levels": json.loads(doc.levels or "[]"),
		"other": doc.other or "",
		"by": json.loads(doc.contributors or "[]"),
	}

	frappe.publish_realtime(
		event="oh_entry_updated",
		message={
			"session_code": session_code,
			"cat_id": cat_id,
			"sub_index": sub_index,
			"entry": updated_entry,
			"updated_by": user,
		},
		doctype="OH Session",
		docname=session_code,
		after_commit=True,
	)

	return {"ok": True, "entry_name": doc.name}
