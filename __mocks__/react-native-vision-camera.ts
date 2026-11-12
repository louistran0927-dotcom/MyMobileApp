// Manual mock for react-native-vision-camera so the Jest test environment
// (which has no native modules) can import CameraScreen without loading the
// native camera module. Replace this with a real implementation when the app
// is built on a device/emulator.
import React from 'react';
import { View } from 'react-native';

export const CameraPermissionStatus = {
  authorized: 'authorized',
  not_determined: 'not-determined',
  denied: 'denied',
};

export function useCameraDevice() {
  return undefined;
}

const Camera = React.forwardRef(() => null);

(Camera as any).getCameraPermissionStatus = () => 'not-determined';
(Camera as any).requestCameraPermission = async () => 'authorized';

export { Camera };
export default Camera;
