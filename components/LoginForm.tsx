// LoginForm.tsx
import React, { useState } from 'react';
import { View, } from 'react-native';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { globalStyles } from '../theme/styles';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login Details:', { username, password });
    // Here, you can call Firebase or an API to authenticate the user
  };

  return (
    <View style={globalStyles.stepContainer} >
      <InputField
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        secureTextEntry={false} // Not a secure field
      />
      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} // This is a secure field
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginForm;