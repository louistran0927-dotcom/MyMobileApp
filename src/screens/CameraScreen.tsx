import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevice,
} from 'react-native-vision-camera';
import { identifyImage, type Identification } from '../utils/identifyImage';
import { theme } from '../theme';

export function CameraScreen({ onBack }: { onBack: () => void }) {
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const [permission, setPermission] = useState<CameraPermissionStatus>(
    'not-determined',
  );
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [identification, setIdentification] = useState<Identification | null>(
    null,
  );
  const [isIdentifying, setIsIdentifying] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      setPermission(Camera.getCameraPermissionStatus());
    };
    checkPermission();
  }, []);

  const requestPermission = useCallback(async () => {
    const newStatus = await Camera.requestCameraPermission();
    setPermission(newStatus);
    return newStatus;
  }, []);

  const handleTakePicture = useCallback(async () => {
    if (!cameraRef.current || !device) {
      return;
    }
    const photo = await cameraRef.current.takePhoto();
    setPhotoPath(photo.path);
    setIdentification(null);
  }, [device]);

  const handleIdentify = useCallback(async () => {
    if (!photoPath) {
      return;
    }
    setIsIdentifying(true);
    try {
      const result = await identifyImage(photoPath);
      setIdentification(result);
    } finally {
      setIsIdentifying(false);
    }
  }, [photoPath]);

  const handleRetake = useCallback(() => {
    setPhotoPath(null);
    setIdentification(null);
  }, []);

  if (permission === 'denied') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Camera permission is needed to take photos.
        </Text>
        <TouchableOpacity
          testID="camera-request-permission"
          accessibilityLabel="Request camera permission"
          onPress={requestPermission}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device || permission === 'not-determined') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading camera…</Text>
        {permission === 'not-determined' && (
          <TouchableOpacity
            testID="camera-request-permission"
            accessibilityLabel="Request camera permission"
            onPress={requestPermission}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Grant permission</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (photoPath) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: `file://${photoPath}` }} style={styles.photo} />
        <View style={styles.controls}>
          <TouchableOpacity
            testID="camera-retake"
            accessibilityLabel="Take another photo"
            onPress={handleRetake}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Retake 🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="camera-identify"
            accessibilityLabel="Identify what is in the photo"
            disabled={isIdentifying}
            onPress={handleIdentify}
            style={[
              styles.button,
              isIdentifying && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>
              {isIdentifying ? 'Thinking…' : "What's this? 🤔"}
            </Text>
          </TouchableOpacity>
        </View>
        {identification && (
          <View style={styles.result}>
            <Text style={styles.resultLabel}>
              {identification.source === 'placeholder'
                ? 'Model not connected — placeholder:'
                : 'Looks like:'}
            </Text>
            <Text testID="camera-result" style={styles.resultText}>
              {identification.label}
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        ref={cameraRef}
      />
      <View style={styles.controls}>
        <TouchableOpacity
          testID="camera-back"
          accessibilityLabel="Go back"
          onPress={onBack}
          style={styles.button}
        >
          <Text style={styles.buttonText}>‹ Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="camera-capture"
          accessibilityLabel="Take a photo"
          onPress={handleTakePicture}
          style={styles.capture}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  text: {
    fontSize: theme.font.body,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  camera: {
    flex: 1,
  },
  photo: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  capture: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  button: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: theme.font.body,
    fontWeight: '800',
  },
  result: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    width: '85%',
  },
  resultLabel: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  resultText: {
    fontSize: theme.font.heading,
    fontWeight: '900',
    color: theme.colors.text,
    textAlign: 'center',
  },
});
