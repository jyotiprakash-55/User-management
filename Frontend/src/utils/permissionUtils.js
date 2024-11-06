export const hasPermission = (requiredPermission, userRoles, userPermissions) => {
  // Check direct user permissions first
  if (userPermissions?.includes(requiredPermission)) {
    return true;
  }

  // Check role-based permissions
  if (userRoles && userRoles.length > 0) {
    for (const role of userRoles) {
      if (role.permissions?.includes(requiredPermission)) {
        return true;
      }
    }
  }

  return false;
}; 