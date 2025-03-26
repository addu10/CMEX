import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function TermsConditions() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.placeholderIcon} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.lastUpdated}>Last Updated: March 25, 2025</Text>
          
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to C-MEX, a marketplace app exclusively for university students to buy, sell, and exchange educational items and resources. These Terms and Conditions govern your use of the C-MEX application and all related services. By accessing or using C-MEX, you agree to be bound by these Terms.
          </Text>
          
          <Text style={styles.sectionTitle}>2. User Eligibility</Text>
          <Text style={styles.paragraph}>
            2.1. To use C-MEX, you must be a currently enrolled student at a recognized educational institution.
          </Text>
          <Text style={styles.paragraph}>
            2.2. You must be at least 18 years of age, or the legal age of majority in your jurisdiction, whichever is greater.
          </Text>
          <Text style={styles.paragraph}>
            2.3. You must provide accurate, current, and complete information during the registration process and keep your information updated.
          </Text>
          
          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.paragraph}>
            3.1. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </Text>
          <Text style={styles.paragraph}>
            3.2. You agree to notify C-MEX immediately of any unauthorized use of your account or any other breach of security.
          </Text>
          <Text style={styles.paragraph}>
            3.3. C-MEX reserves the right to disable any user account if we believe you have violated these Terms.
          </Text>
          
          <Text style={styles.sectionTitle}>4. Listings and Transactions</Text>
          <Text style={styles.paragraph}>
            4.1. All listings must be for educational items or services appropriate for university students.
          </Text>
          <Text style={styles.paragraph}>
            4.2. Prohibited items include but are not limited to: illegal items, weapons, alcohol, tobacco, drugs, plagiarized materials, counterfeit items, and items that infringe on intellectual property rights.
          </Text>
          <Text style={styles.paragraph}>
            4.3. C-MEX is a platform that connects buyers and sellers. All transactions are between users, and C-MEX is not a party to any transaction.
          </Text>
          <Text style={styles.paragraph}>
            4.4. Users are responsible for ensuring the accuracy of their listings and the quality of items being sold.
          </Text>
          
          <Text style={styles.sectionTitle}>5. User Conduct</Text>
          <Text style={styles.paragraph}>
            5.1. You agree not to use C-MEX for any illegal or unauthorized purpose.
          </Text>
          <Text style={styles.paragraph}>
            5.2. You will not engage in any activity that could disable, overburden, or impair the proper functioning of C-MEX.
          </Text>
          <Text style={styles.paragraph}>
            5.3. You will not harass, threaten, or intimidate other users of the platform.
          </Text>
          <Text style={styles.paragraph}>
            5.4. You will not post false, misleading, or fraudulent content.
          </Text>
          
          <Text style={styles.sectionTitle}>6. Privacy and Data</Text>
          <Text style={styles.paragraph}>
            6.1. C-MEX collects and processes personal data as described in our Privacy Policy.
          </Text>
          <Text style={styles.paragraph}>
            6.2. By using C-MEX, you consent to the collection, processing, and storage of your personal data as described in our Privacy Policy.
          </Text>
          
          <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            7.1. C-MEX is provided "as is" without any warranties, expressed or implied.
          </Text>
          <Text style={styles.paragraph}>
            7.2. C-MEX will not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the platform.
          </Text>
          <Text style={styles.paragraph}>
            7.3. C-MEX is not responsible for the conduct of users or the quality, safety, or legality of items listed or sold on the platform.
          </Text>
          
          <Text style={styles.sectionTitle}>8. Modifications to Terms</Text>
          <Text style={styles.paragraph}>
            8.1. C-MEX reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting on the platform.
          </Text>
          <Text style={styles.paragraph}>
            8.2. Your continued use of C-MEX after the posting of modified Terms constitutes your agreement to the modified Terms.
          </Text>
          
          <Text style={styles.sectionTitle}>9. Termination</Text>
          <Text style={styles.paragraph}>
            9.1. C-MEX may terminate or suspend your account and access to the platform at any time, for any reason, without notice.
          </Text>
          <Text style={styles.paragraph}>
            9.2. You may terminate your account at any time by following the instructions on the platform.
          </Text>
          
          <Text style={styles.sectionTitle}>10. Contact Information</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>
            support@c-mex.com{'\n'}
            +91 123-456-7890{'\n'}
            Room 101, Admin Building, University Campus
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  placeholderIcon: {
    width: 34,
    height: 34,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
    marginBottom: 10,
    textAlign: 'justify',
  },
  contactInfo: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
    marginTop: 10,
    paddingLeft: 15,
  },
}); 