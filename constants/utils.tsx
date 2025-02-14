export const isAdminUser = (token: string | null): boolean => {
  // Check if the token is provided
  if (!token) {
    console.error('No token found');
    return false;
  }

  try {
    const [, payload] = token.split('.'); // payload is the second part
    const decodedPayload = JSON.parse(atob(payload));
    const userType = decodedPayload.userType;

    // Return true if userType is ADMIN, otherwise return false
    return userType === 'ADMIN';
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};
