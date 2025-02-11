

// Function to decode the JWT and check if userType is ADMIN
export const isAdminUser = (token: { split: (arg0: string) => [any, any]; }) => {
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


  // const token = localStorage.getItem("token")
  // const [isAdmin, setIsAdmin] = useState(false); // State to store whether the user is ADMIN

  // useEffect(() => {
  //   setIsAdmin(isAdminUser(token)); // Set the state based on the token
  // }, []);