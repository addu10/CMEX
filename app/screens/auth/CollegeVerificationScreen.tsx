import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation, RouteProp } from '@react-navigation/native';

export default function CollegeVerificationScreen({ route }: any) {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  
  const { formData } = route.params; // Get FormData from route params

  // Access FormData values
  const username = formData.get('username');
  const password = formData.get('password');
  const department = formData.get('department');
  const regNumber = formData.get('regNumber');

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    try {
      const qrData = JSON.parse(data);
      setScannedData(qrData);

      if (qrData.department === department && qrData.regNumber === regNumber) {
        Alert.alert('Verification successful', 'Your college credentials have been verified successfully');
        navigation.navigate('Home');
      } else {
        Alert.alert('Invalid QR code', 'The QR code does not match your details. Please try again.');
        setScanned(false);
      }
    } catch (error) {
      Alert.alert('Invalid QR Code', 'Please scan a valid college ID QR code');
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!scannedData ? (
        <>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.scanner}
          />
          <Text style={styles.description}>Scan your student ID QR Code to verify</Text>
          {scanned && (
            <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
          )}
        </>
      ) : (
        <View style={styles.resultContainer}>
          <Text>Scanned Data: {JSON.stringify(scannedData, null, 2)}</Text>
          <Button title="Proceed" onPress={() => navigation.navigate('Home')} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scanner: {
    width: '100%',
    height: '70%',
  },
  description: {
    fontSize: 16,
    margin: 20,
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
