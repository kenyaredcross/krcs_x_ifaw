import frappe

def after_migrate():
    """Create KRCS x IFAW role after migration"""
    create_krcs_ifaw_role()

def create_krcs_ifaw_role():
    """Create KRCS x IFAW role if it doesn't exist"""
    if not frappe.db.exists("Role", "KRCS x IFAW"):
        role = frappe.get_doc({
            "doctype": "Role",
            "role_name": "KRCS x IFAW",
            "desk_access": 1,
            "disabled": 0,
            "is_custom": 0
        })
        role.insert(ignore_permissions=True)
        frappe.db.commit()
        print("✓ Created role: KRCS x IFAW")
    else:
        print("Role 'KRCS x IFAW' already exists")
