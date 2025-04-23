import jwtDecode from 'jwt-decode';

// Decode the token and check for expiry
const decodeToken = (token: string) => jwtDecode(token);

export const checkTokenExpiry = (token: string): boolean => {
  try {
    const decoded: any = decodeToken(token);
    const expiryTime = decoded.exp * 1000; // JWT expiry time is in seconds
    return Date.now() > expiryTime; // Return true if expired
  } catch (err) {
    return false;
  }
};
