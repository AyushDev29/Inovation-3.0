// TEST DATA CLEANING FUNCTIONS
// Run this to verify data cleaning is working correctly

import { 
    cleanName, 
    cleanEmail, 
    cleanPhone, 
    cleanRollNo, 
    cleanClass, 
    cleanCollege, 
    cleanTeamName, 
    cleanTransactionId,
    cleanRegistrationData,
    getPlaceholderExamples 
} from './src/utils/dataCleaners.js';

console.log('🧹 TESTING DATA CLEANING FUNCTIONS\n');

// Test 1: Name Cleaning
console.log('1. NAME CLEANING:');
console.log('Input: "john DOE smith" → Output:', cleanName("john DOE smith"));
console.log('Input: "  MARY jane  " → Output:', cleanName("  MARY jane  "));
console.log('');

// Test 2: Email Cleaning
console.log('2. EMAIL CLEANING:');
console.log('Input: "  JOHN@GMAIL.COM  " → Output:', cleanEmail("  JOHN@GMAIL.COM  "));
console.log('Input: "Test@Example.COM" → Output:', cleanEmail("Test@Example.COM"));
console.log('');

// Test 3: Phone Cleaning
console.log('3. PHONE CLEANING:');
console.log('Input: "+91-98765 43210" → Output:', cleanPhone("+91-98765 43210"));
console.log('Input: "9876543210" → Output:', cleanPhone("9876543210"));
console.log('');

// Test 4: Roll Number Cleaning
console.log('4. ROLL NUMBER CLEANING:');
console.log('Input: "21cs 001" → Output:', cleanRollNo("21cs 001"));
console.log('Input: "  2021BCA123  " → Output:', cleanRollNo("  2021BCA123  "));
console.log('');

// Test 5: Class Cleaning
console.log('5. CLASS CLEANING:');
console.log('Input: "computer  SCIENCE" → Output:', cleanClass("computer  SCIENCE"));
console.log('Input: "bca THIRD year" → Output:', cleanClass("bca THIRD year"));
console.log('');

// Test 6: College Cleaning
console.log('6. COLLEGE CLEANING:');
console.log('Input: "abc COLLEGE of engineering" → Output:', cleanCollege("abc COLLEGE of engineering"));
console.log('Input: "  xyz  UNIVERSITY  " → Output:', cleanCollege("  xyz  UNIVERSITY  "));
console.log('');

// Test 7: Team Name Cleaning
console.log('7. TEAM NAME CLEANING:');
console.log('Input: "TEAM alpha" → Output:', cleanTeamName("TEAM alpha"));
console.log('Input: "  fire  SQUAD  " → Output:', cleanTeamName("  fire  SQUAD  "));
console.log('');

// Test 8: Transaction ID Cleaning
console.log('8. TRANSACTION ID CLEANING:');
console.log('Input: "upi 123456789" → Output:', cleanTransactionId("upi 123456789"));
console.log('Input: "  PAYTM987654321  " → Output:', cleanTransactionId("  PAYTM987654321  "));
console.log('');

// Test 9: Complete Registration Data Cleaning
console.log('9. COMPLETE REGISTRATION DATA CLEANING:');
const testData = {
    name: "john DOE",
    email: "  JOHN@GMAIL.COM  ",
    phone: "+91-98765 43210",
    roll_no: "21cs 001",
    class: "computer  SCIENCE",
    college: "abc COLLEGE of engineering",
    team_name: "TEAM alpha",
    player2_name: "mary JANE",
    player2_roll_no: "21cs 002",
    player2_class: "computer  SCIENCE"
};

console.log('Input Data:', testData);
console.log('Cleaned Data:', cleanRegistrationData(testData));
console.log('');

// Test 10: Placeholder Examples
console.log('10. PLACEHOLDER EXAMPLES:');
console.log('Transaction ID:', getPlaceholderExamples.transactionId);
console.log('Roll Number:', getPlaceholderExamples.rollNo);
console.log('Phone:', getPlaceholderExamples.phone);
console.log('');

console.log('✅ ALL DATA CLEANING TESTS COMPLETED!');