
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b52854401f0c4e0c9f617c8060830cb2',
  appName: 'zest-agenda-go',
  webDir: 'dist',
  server: {
    url: 'https://b5285440-1f0c-4e0c-9f61-7c8060830cb2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffffff",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#999999"
    }
  }
};

export default config;
