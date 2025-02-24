import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from './colors';
import { Fonts } from '../fonts/fonts';

const { width } = Dimensions.get('window');

// Common styles that can be reused across components
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.inputBackground,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: Colors.buttonText,
    textAlign: 'center',
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


// All screen-specific styles
export const styles = {
  // Sell page styles
  sell: StyleSheet.create({
    container: {
      ...commonStyles.container,
      padding: 16,
    },
    scrollContainer: {
      ...commonStyles.scrollContainer,
      padding: 16,
    },
    imageContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    imagePreview: {
      width: width * 0.8,
      height: width * 0.8,
      borderRadius: 10,
      backgroundColor: Colors.inputBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    formContainer: {
      gap: 16,
    },
    input: {
      ...commonStyles.input,
    },
    descriptionInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: 8,
      backgroundColor: Colors.inputBackground,
    },
    submitButton: {
      ...commonStyles.button,
      marginVertical: 20,
    },
    submitButtonText: {
      ...commonStyles.buttonText,
    },
    loadingOverlay: {
      ...commonStyles.loadingOverlay,
    }
  }),

  // Saved screen styles
  saved: StyleSheet.create({
    container: {
      ...commonStyles.container,
    },
    scrollContainer: {
      ...commonStyles.scrollContainer,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyImage: {
      width: width * 0.7,
      height: width * 0.7,
      marginBottom: 20,
    },
    message: {
      fontSize: 16,
      color: Colors.gray,
      textAlign: 'center',
      marginBottom: 20,
    },
    button: {
      ...commonStyles.button,
      width: '100%',
    },
    buttonText: {
      ...commonStyles.buttonText,
    }
  }),

  // Profile screen styles
  profile: StyleSheet.create({
    container: {
      ...commonStyles.container,
      backgroundColor: '#f6f6f6',
      padding: 16,
      alignItems: 'center',
    },
    headerContainer: {
      width: '100%',
      marginBottom: 10,
    },
    profileSection: {
      alignItems: 'center',
      marginTop: 20,
    },
    imageContainer: {
      borderRadius: 60,
      overflow: 'hidden',
    },
    profilePicture: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 3,
      borderColor: Colors.border,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 10,
      fontFamily: Fonts.semiBold,
    },
    email: {
      fontSize: 16,
      color: Colors.gray,
      marginBottom: 20,
      fontFamily: Fonts.regular,
    },
    optionsContainer: {
      width: '100%',
      marginTop: 20,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    optionText: {
      fontSize: 16,
      marginLeft: 12,
      fontFamily: Fonts.regular,
    },
    logoutContainer: {
      marginTop: 30,
      width: '100%',
      alignItems: 'center',
    },
    logoutButton: {
      position: 'relative',
      height: 50,
      paddingHorizontal: 30,
      borderWidth: 2,
      borderColor: Colors.black,
      backgroundColor: '#e8e8e8',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoutButtonText: {
      fontSize: 15,
      fontWeight: '600',
    }
  }),

  // Home screen styles
  home: StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    container: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginVertical: 10,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: Fonts.regular,
      color: Colors.secondary,
    },
    actionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 15,
    },
    actionButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 12,
      marginHorizontal: 8,
      backgroundColor: Colors.inputBackground,
      borderRadius: 10,
      elevation: 3,
      shadowColor: Colors.black,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    actionText: {
      fontSize: 14,
      fontFamily: Fonts.semiBold,
      color: Colors.secondary,
      marginTop: 6,
    },
    salePlaceholder: {
      marginTop: 20,
      paddingHorizontal: 4,
    },
    saleText: {
      fontSize: 18,
      fontFamily: Fonts.semiBold,
      color: Colors.secondary,
      marginBottom: 8,
    },
    saleBox: {
      height: 150,
      backgroundColor: Colors.primary,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    salePlaceholderText: {
      fontSize: 16,
      color: Colors.gray,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: Fonts.semiBold,
      color: Colors.secondary,
      marginTop: 20,
      marginBottom: 10,
      paddingHorizontal: 4,
    },
    categoryList: {
      paddingVertical: 12,
      paddingHorizontal: 4,
    },
    categoryItem: {
      alignItems: 'center',
      marginRight: 16,
      padding: 12,
      backgroundColor: Colors.inputBackground,
      borderRadius: 10,
    },
    categoryText: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: Colors.secondary,
      marginTop: 6,
      textAlign: 'center',
    },
    continueSellingCard: {
      marginTop: 20,
      padding: 15,
      backgroundColor: Colors.white,
      borderRadius: 12,
      shadowColor: Colors.black,
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
    continueSellingTitle: {
      fontSize: 18,
      fontFamily: Fonts.semiBold,
      color: Colors.secondary,
      marginBottom: 5,
    },
    continueSellingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    continueSellingText: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: Colors.gray,
    },
  }),

  // Explore screen styles
  explore: StyleSheet.create({
    container: {
      ...commonStyles.container,
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
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
      color: Colors.error,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: Fonts.semiBold,
      color: Colors.secondary,
      marginVertical: 16,
      paddingHorizontal: 4,
    },
    horizontalList: {
      paddingHorizontal: 4,
    },
    itemContainer: {
      backgroundColor: Colors.inputBackground,
      borderRadius: 8,
      padding: 12,
      marginHorizontal: 8,
      marginBottom: 16,
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    itemTitle: {
      fontSize: 16,
      fontFamily: Fonts.regular,
      color: Colors.secondary,
    },
    row: {
      justifyContent: 'space-between',
      paddingHorizontal: 4,
    },
    emptyText: {
      textAlign: 'center',
      fontSize: 16,
      color: Colors.gray,
      marginTop: 20,
    }
  })
};

// Export individual screen styles for easier imports
export const sellPageStyles = styles.sell;
export const savedScreenStyles = styles.saved;
export const profileStyles = styles.profile;
export const homeStyles = styles.home;
export const exploreStyles = styles.explore; 