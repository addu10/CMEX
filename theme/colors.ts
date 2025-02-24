import { StyleSheet } from 'react-native';

export const Colors = {
    primary: '#b1f03d',  // Light green for buttons
    secondary: '#333',    // Dark gray for text
    background: '#fff',   // White background
    inputBackground: '#f9f9f9', // Light gray for input fields
    border: '#ddd',       // Light border for inputs and picker
    buttonText: '#000',   // Text color for buttons
    titleText: '#333',    // Title text color
    subtitleText: '#777', // Subtitle text color
    gray: '#777',         // Gray color for empty text
  };
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: Colors.primary,
  },
  itemContainer: {
    flex: 1,
    padding: 16,
    margin: 8,
    backgroundColor: Colors.inputBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    color: Colors.secondary,
    fontWeight: 'bold',
  },
  row: {
    justifyContent: 'space-between',
  },
  horizontalList: {
    paddingBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Colors.gray,
  },
});
  