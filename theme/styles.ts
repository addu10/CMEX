import { StyleSheet } from 'react-native';
import { Colors } from './colors';
import { Fonts } from './fonts';

export const globalStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 150,
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 60,
    marginBottom: 50,

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
    height: 46,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: Colors.inputBackground,
    top: 1.5,
  },
  pickerItem: {
    fontSize: 13,
    color: Colors.secondary,
    backgroundColor: Colors.inputBackground,
  },
});

export const profileStyles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  email: {
    fontSize: 18,
    color: '#888',
  },
});
