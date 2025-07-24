const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://ecommerce-blog-backend.onrender.com';

// Generic API request function
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    // Registra información sobre la solicitud para ayudar en la depuración
    console.log(`Realizando solicitud ${options.method || 'GET'} a: ${url}`);
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Si es un error 404 en una solicitud GET para pedidos, podríamos manejarlo de forma especial
      if (response.status === 404 && options.method === 'GET' && 
         (endpoint.includes('/orders/me') || endpoint.includes('/my-orders') || endpoint.includes('/orden'))) {
        console.log(`Endpoint de pedidos no encontrado: ${endpoint}. Devolviendo array vacío.`);
        return [] as unknown as T; // Devolver array vacío para endpoints de pedidos que no existen
      }
      
      // Para otros errores, intentar obtener mensaje detallado del servidor
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorDetails = null;
      
      try {
        const errorBody = await response.clone().json();
        errorDetails = errorBody;
        
        if (errorBody.message) {
          errorMessage = `${errorMessage} - ${errorBody.message}`;
        } else if (errorBody.error) {
          errorMessage = `${errorMessage} - ${errorBody.error}`;
        }
        
        console.log('Respuesta de error del servidor:', errorBody);
      } catch (jsonError) {
        console.log('No se pudo parsear la respuesta de error como JSON', jsonError);
        
        // Si no es JSON, intenta obtener el texto del error
        try {
          const errorText = await response.clone().text();
          errorDetails = errorText;
          console.log('Texto de respuesta de error:', errorText);
        } catch (textError) {
          console.log('No se pudo obtener el texto de error', textError);
        }
      }
      
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).status = response.status;
      (enhancedError as any).details = errorDetails;
      (enhancedError as any).url = url;
      throw enhancedError;
    }
    
    const jsonResponse = await response.json();
    
    // Backend wraps responses in { success, statusCode, message, data, timestamp, path }
    // Extract the data property if it exists, otherwise return the full response
    if (jsonResponse && typeof jsonResponse === 'object' && 'data' in jsonResponse) {
      return jsonResponse.data;
    }
    
    return jsonResponse;
  } catch (error) {
    console.error('API request failed:', error);
    console.error('Request details:', { url, method: config.method });
    throw error;
  }
}

// GET request
export function get<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

// POST request
export function post<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PUT request
export function put<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// DELETE request
export function del<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}
