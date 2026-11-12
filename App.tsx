import { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { HomeScreen, type ToolId } from './src/screens/HomeScreen';
import { AlphabetScreen } from './src/screens/AlphabetScreen';
import { NumbersScreen } from './src/screens/NumbersScreen';
import { ColorsShapesScreen } from './src/screens/ColorsShapesScreen';
import { AnimalsScreen } from './src/screens/AnimalsScreen';
import { DinosaursScreen } from './src/screens/DinosaursScreen';
import { CameraScreen } from './src/screens/CameraScreen';

export default function App() {
  const [tool, setTool] = useState<ToolId | null>(null);
  const goHome = useCallback(() => setTool(null), []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (tool !== null) {
          goHome();
          return true;
        }
        return false;
      },
    );
    return () => subscription.remove();
  }, [tool, goHome]);

  if (tool === 'alphabet') {
    return <AlphabetScreen onBack={goHome} />;
  }
  if (tool === 'numbers') {
    return <NumbersScreen onBack={goHome} />;
  }
  if (tool === 'colors') {
    return <ColorsShapesScreen onBack={goHome} />;
  }
  if (tool === 'animals') {
    return <AnimalsScreen onBack={goHome} />;
  }
  if (tool === 'dinosaurs') {
    return <DinosaursScreen onBack={goHome} />;
  }
  if (tool === 'camera') {
    return <CameraScreen onBack={goHome} />;
  }
  return <HomeScreen onSelect={setTool} />;
}
