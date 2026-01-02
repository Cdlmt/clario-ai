// API base URL - uses env variable or defaults to local network IP for development
// Note: Use your machine's local IP for testing on physical devices
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.40:3000';
