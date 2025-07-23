import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRoles } from '../../hooks/useRoles';

export const AuthTest: React.FC = () => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  const { isAdmin, isCustomer, hasPermission, getCurrentRole } = useRoles();
  const [testResult, setTestResult] = useState<string>('');

  const testAdminLogin = async () => {
    setTestResult('Testing admin login...');
    try {
      await login('admin@test.com', 'admin123');
      setTestResult('✅ Admin login successful!');
    } catch (error: any) {
      setTestResult(`❌ Admin login failed: ${error.message}`);
    }
  };

  const testCustomerLogin = async () => {
    setTestResult('Testing customer login...');
    try {
      await login('customer@test.com', 'customer123');
      setTestResult('✅ Customer login successful!');
    } catch (error: any) {
      setTestResult(`❌ Customer login failed: ${error.message}`);
    }
  };

  const permissions = [
    'create:products',
    'edit:products', 
    'delete:products',
    'create:orders',
    'edit:orders',
    'delete:orders',
    'view:admin',
    'create:reviews',
    'edit:reviews',
    'delete:reviews'
  ];

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Authentication Test Component</h1>
      
      {/* Current Auth State */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Current Authentication State</h2>
        <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
        <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</p>
        <p><strong>Is Admin:</strong> {isAdmin ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Is Customer:</strong> {isCustomer ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Current Role:</strong> {getCurrentRole() || 'None'}</p>
      </div>

      {/* Login Tests */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Login Tests</h2>
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={testAdminLogin}
            style={{ marginRight: '10px', padding: '8px 16px' }}
            disabled={isLoading}
          >
            Test Admin Login
          </button>
          <button 
            onClick={testCustomerLogin}
            style={{ marginRight: '10px', padding: '8px 16px' }}
            disabled={isLoading}
          >
            Test Customer Login
          </button>
          <button 
            onClick={logout}
            style={{ padding: '8px 16px' }}
          >
            Logout
          </button>
        </div>
        {testResult && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: testResult.includes('✅') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${testResult.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px'
          }}>
            {testResult}
          </div>
        )}
      </div>

      {/* Permissions Test */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Permission Tests</h2>
        <p>Current user permissions for common actions:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {permissions.map((permission) => (
            <div 
              key={permission}
              style={{ 
                padding: '8px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                backgroundColor: hasPermission(permission) ? '#d4edda' : '#f8d7da'
              }}
            >
              <strong>{permission}:</strong> {hasPermission(permission) ? '✅' : '❌'}
            </div>
          ))}
        </div>
      </div>

      {/* Role-based Rendering Test */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Role-based Rendering Tests</h2>
        
        {isAdmin && (
          <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#ffeaa7', borderRadius: '4px' }}>
            🔧 <strong>Admin Only:</strong> You can see this because you're an admin!
          </div>
        )}
        
        {isCustomer && (
          <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#a8e6cf', borderRadius: '4px' }}>
            �️ <strong>Customer Only:</strong> You can see this because you're a customer!
          </div>
        )}
        
        {!isAuthenticated && (
          <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#ffb3ba', borderRadius: '4px' }}>
            🚫 <strong>Not Authenticated:</strong> Please log in to see role-specific content.
          </div>
        )}

        {isAuthenticated && (
          <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#bde7ff', borderRadius: '4px' }}>
            ✅ <strong>Authenticated Users:</strong> You can see this because you're logged in!
          </div>
        )}
      </div>

      {/* Debug Information */}
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
        <h2>Debug Information</h2>
        <pre style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
          {JSON.stringify({
            isAuthenticated,
            user,
            isAdmin: isAdmin,
            isCustomer: isCustomer,
            currentRole: getCurrentRole(),
            isLoading
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};
