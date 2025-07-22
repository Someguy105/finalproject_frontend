import { useAuth } from '../contexts/AuthContext';

export const useRoles = () => {
  const { user, isAdmin, isCustomer, hasRole } = useAuth();

  return {
    user,
    isAdmin: isAdmin(),
    isCustomer: isCustomer(),
    hasRole,
    canAccessAdmin: isAdmin(),
    canAccessCustomer: isCustomer() || isAdmin(), // Admin can access customer areas
    getCurrentRole: () => user?.role || null,
    hasPermission: (permission: string) => {
      // Define permission mappings
      const permissions: { [key: string]: boolean } = {
        'create:products': isAdmin(),
        'edit:products': isAdmin(),
        'delete:products': isAdmin(),
        'create:orders': isCustomer() || isAdmin(),
        'edit:orders': isAdmin(),
        'delete:orders': isAdmin(),
        'create:users': isAdmin(),
        'edit:users': isAdmin(),
        'delete:users': isAdmin(),
        'view:admin': isAdmin(),
        'create:reviews': isCustomer() || isAdmin(),
        'edit:reviews': isAdmin(),
        'delete:reviews': isAdmin(),
      };
      
      return permissions[permission] || false;
    }
  };
};

export default useRoles;
