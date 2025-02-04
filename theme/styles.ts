import { StyleSheet } from 'react-native';
import { Colors } from './colors';
import { Fonts } from './fonts';

export const globalStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 130,
    paddingHorizontal: 20,
    gap: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdown: {
    height: 50,
    width: 200,
    borderColor: Colors.border, // Use your border color
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.titleText,
    marginVertical: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtitleText,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 8,
    backgroundColor: Colors.inputBackground,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.buttonText,
  },
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  }, 
  picker: {
    width: '90%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBackground,
    paddingLeft: 10,
  },
  pickerItem: {
    fontSize: 16,
    color: Colors.secondary,
  },
});
