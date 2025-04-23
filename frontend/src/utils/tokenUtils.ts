/* eslint-disable @typescript-eslint/no-unused-vars */
import { jwtDecode } from 'jwt-decode';

// Checking token for expiry
const decodeToken = (token: string) => jwtDecode(token);

export const checkTokenExpiry = (token: string): boolean => {
  try {
    const decoded: any = decodeToken(token);
    const expiryTime = decoded.exp * 1000;
    return Date.now() > expiryTime; 
  } catch (error) {
    return false;
  }
};
