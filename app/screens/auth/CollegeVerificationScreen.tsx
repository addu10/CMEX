import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { BarCodeReadEvent } from 'react-native-camera';
// import { addUserToFirebase } from '../../services/auth'; // Firebase service for adding user
import { useNavigation, RouteProp } from '@react-navigation/native';

const CollegeVerificationScreen = ({ route }: any) => {
  const navigation = useNavigation();
  
  const { formData } = route.params; // Get FormData from route params

  const [scannedData, setScannedData] = useState<string | null>(null);

  // Access FormData values
  const username = formData.get('username');
  const password = formData.get('password');
  const department = formData.get('department');
  const regNumber = formData.get('regNumber');

  // Handle QR code scanning
  const onScanSuccess = (e: BarCodeReadEvent) => {
    const qrData = JSON.parse(e.data); // Assuming QR code data is in JSON format

    setScannedData(qrData);

    if (qrData.department === department && qrData.regNumber === regNumber) {
      // Proceed to add user to Firebase
      addUserToFirebase(username, password, department, regNumber)
        .then(() => {
          Alert.alert('Verification successful', 'Your college credentials have been verified successfully');
          navigation.navigate('Home'); // Navigate to Home after successful verification
        })
        .catch((error) => {
          Alert.alert('Verification failed', 'There was an error verifying your credentials');
          console.error(error);
        });
    } else {
      Alert.alert('Invalid QR code', 'The QR code does not match your details. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!scannedData ? (
        <QRCodeScanner
          onRead={onScanSuccess}
          topContent={<Text style={{ fontSize: 18, padding: 10 }}>Scan your student ID QR Code to verify</Text>}
          bottomContent={<Text style={{ fontSize: 16 }}>Please ensure your ID is clear for scanning.</Text>}
        />
      ) : (
        <View>
          <Text>Scanned Data: {JSON.stringify(scannedData, null, 2)}</Text>
          <Button title="Proceed" onPress={() => navigation.navigate('Home')} />
        </View>
      )}
    </View>
  );
};

export default CollegeVerificationScreen;
