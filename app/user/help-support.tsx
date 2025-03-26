import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { AuthContext } from '@/app/_layout';

type FAQItem = {
  question: string;
  answer: string;
  isOpen: boolean;
};

export default function HelpSupport() {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: 'How do I list an item for sale?',
      answer: 'Go to the "Sell" tab at the bottom of the app, then fill in the required details about your item such as title, description, price, condition, and upload photos. Once submitted, your item will be listed for other students to see.',
      isOpen: false
    },
    {
      question: 'How do payments work?',
      answer: 'C-MEX facilitates in-person exchanges. We recommend meeting in public places on campus. The buyer can inspect the item and pay the seller directly through UPI, cash, or other agreed methods. C-MEX does not handle payments between users.',
      isOpen: false
    },
    {
      question: 'How can I contact a seller?',
      answer: 'When viewing an item listing, tap on the "Contact Seller" button to open a chat with the seller. You can discuss details, negotiate prices, and arrange a meeting time and place for the exchange.',
      isOpen: false
    },
    {
      question: 'Can I delete my listing?',
      answer: 'Yes, you can delete your listing by going to your profile, selecting "My Listings", finding the listing you want to remove, and tapping the "Delete" option. Once deleted, the listing will no longer be visible to other users.',
      isOpen: false
    },
    {
      question: 'Is there a return policy?',
      answer: 'As C-MEX is primarily a platform connecting buyers and sellers, return policies are at the discretion of individual sellers. We recommend discussing return conditions with the seller before completing a purchase.',
      isOpen: false
    },
    {
      question: 'How do I report inappropriate content or behavior?',
      answer: 'If you encounter inappropriate content or behavior, please use the "Report" button on the listing or profile in question. Alternatively, contact our support team through the form at the bottom of the Help & Support page with details.',
      isOpen: false
    }
  ]);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  
  const toggleFAQ = (index: number) => {
    setFaqs(faqs.map((faq, i) => 
      i === index ? { ...faq, isOpen: !faq.isOpen } : faq
    ));
  };

  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }

      // In a real app, you would send this to a Supabase table
      // For now, just simulate a successful submission
      setTimeout(() => {
        Alert.alert(
          'Message Sent',
          'Thank you for contacting us. We will get back to you within 24-48 hours.',
          [
            { 
              text: 'OK', 
              onPress: () => {
                setSubject('');
                setMessage('');
              }
            }
          ]
        );
        setSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending support message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again later.');
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholderIcon} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity 
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(index)}
              >
                <Text style={styles.questionText}>{faq.question}</Text>
                <Ionicons 
                  name={faq.isOpen ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color="#666" 
                />
              </TouchableOpacity>
              
              {faq.isOpen && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.answerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.contactDescription}>
            If you couldn't find an answer to your question, please feel free to contact our support team using the form below.
          </Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="What's your query about?"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              value={message}
              onChangeText={setMessage}
              placeholder="Please describe your issue in detail"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={handleSendMessage}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>SEND MESSAGE</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Other Ways to Reach Us</Text>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text style={styles.contactText}>support@c-mex.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.contactText}>+91 123-456-7890</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.contactText}>Room 101, Admin Building, Campus</Text>
          </View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  faqItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  answerText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  divider: {
    height: 10,
    backgroundColor: '#f0f0f0',
  },
  contactDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  messageInput: {
    minHeight: 120,
  },
  sendButton: {
    backgroundColor: '#b1f03d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  contactInfo: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 15,
    color: '#444',
    marginLeft: 10,
  },
}); 