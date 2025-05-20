
import { Capacitor } from '@capacitor/core';

export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const getNativePlatform = (): string => {
  return Capacitor.getPlatform();
};

export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};

export const isWeb = (): boolean => {
  return Capacitor.getPlatform() === 'web';
};
