export const PERMISSIONS = {
  MANAGE_USERS: 'Manage_Users',
  MANAGE_PERMISSIONS: 'Manage_Permissions',
  MANAGE_ROLES: 'Manage_Roles',
  MANAGE_WELCOME_PAGE: 'Manage_Welcome_Page',
  MANAGE_CONTACTS_PAGE: 'Manage_Contacts_Page',
  MANAGE_COMPANIES_PAGE: 'Manage_Companies_Page',
  MANAGE_AUDIT: 'Manage_Audit'
};

export const PERMISSION_GROUPS = {
  USER_MANAGEMENT: [PERMISSIONS.MANAGE_USERS],
  ROLE_MANAGEMENT: [PERMISSIONS.MANAGE_ROLES],
  PERMISSION_MANAGEMENT: [PERMISSIONS.MANAGE_PERMISSIONS],
  PAGE_MANAGEMENT: [
    PERMISSIONS.MANAGE_WELCOME_PAGE,
    PERMISSIONS.MANAGE_CONTACTS_PAGE,
    PERMISSIONS.MANAGE_COMPANIES_PAGE
  ],
  AUDIT_MANAGEMENT: [PERMISSIONS.MANAGE_AUDIT]
}; 