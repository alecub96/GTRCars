import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vaneando.app',
  appName: 'Vaneando',
  webDir: 'public',
  server: {
    url: 'https://vaneando.com',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
