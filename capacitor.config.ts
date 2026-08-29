// Mantener este tipo local evita que el build web dependa de @capacitor/cli,
// que solo es necesario al sincronizar/compilar la aplicación nativa.
type CapacitorConfig = {
  appId: string;
  appName: string;
  webDir: string;
  server?: { url: string; cleartext: boolean };
  android?: { allowMixedContent: boolean };
};

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
