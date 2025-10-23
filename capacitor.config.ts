import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wilayathub.app',
  appName: 'Wilayat Hub',
  webDir: 'out',
  // Optional: when testing on device/emulator you can point Capacitor to a running dev server
  // Set the environment variable CAPACITOR_SERVER_URL to your machine URL (for emulator use http://10.0.2.2:9002)
  // Example (PowerShell): $env:CAPACITOR_SERVER_URL = "http://10.0.2.2:9002"
  server: {
    url: process.env.CAPACITOR_SERVER_URL || undefined,
    cleartext: true,
  },
};

export default config;
