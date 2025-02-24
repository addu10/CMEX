import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

export const sellPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imagePreview: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: Colors.buttonText,
    textAlign: 'center',
    fontWeight: '600',
  },
  formContainer: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.inputBackground,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.inputBackground,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    marginVertical: 20,
  },
  submitButtonText: {
    color: Colors.buttonText,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  }
}); 