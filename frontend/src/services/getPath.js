export const getPath = () => {
    
    const token = localStorage.getItem('access_token');
    if (!token) return '/auth';
    
    try {
      // JWT состоит из 3 частей: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) return '/auth';
      
      // Декодируем payload (вторая часть)
      const payload = JSON.parse(atob(parts[1]));
      
      // На бэкенде ты передаёшь "role", не "roles"
      const role = payload.role
      
      const paths = {
        'admin': '/admin/profile',
        'manager': '/manager/profile',
        'reader': '/reader/profile'
      };
      
      return paths[role] || '/auth';
    } catch (error) {
      console.error('Ошибка декодирования токена:', error);
      return '/auth';
    }
  }