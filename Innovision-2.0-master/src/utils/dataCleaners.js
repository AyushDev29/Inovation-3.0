// DATA CLEANING UTILITIES
// This file contains all data cleaning and formatting functions

/**
 * DATA CLEANING FUNCTIONS USED:
 * 
 * 1. cleanName() - Proper Case (First Letter Capital)
 * 2. cleanEmail() - Lowercase + Trim
 * 3. cleanPhone() - Remove spaces, keep only digits
 * 4. cleanRollNo() - Uppercase + Remove spaces
 * 5. cleanClass() - UPPERCASE + Remove extra spaces
 * 6. cleanCollege() - Proper Case + Remove extra spaces
 * 7. cleanTeamName() - Proper Case + Remove extra spaces
 * 8. cleanTransactionId() - Uppercase + Remove spaces
 * 9. cleanGameId() - Remove spaces + Keep original case
 * 10. cleanDiscordId() - Remove spaces + Keep original case
 */

// 1. Clean Name - Convert to Proper Case (First Letter Capital)
export const cleanName = (name) => {
    if (!name) return '';
    return name
        .trim()
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/\s+/g, ' '); // Remove extra spaces
};

// 2. Clean Email - Convert to lowercase and trim
export const cleanEmail = (email) => {
    if (!email) return '';
    return email.trim().toLowerCase();
};

// 3. Clean Phone - Remove all non-digit characters
export const cleanPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/\D/g, ''); // Keep only digits
};

// 4. Clean Roll Number - Convert to uppercase and remove spaces
export const cleanRollNo = (rollNo) => {
    if (!rollNo) return '';
    return rollNo.trim().toUpperCase().replace(/\s+/g, '');
};

// 5. Clean Class - Convert to UPPERCASE and remove extra spaces
export const cleanClass = (className) => {
    if (!className) return '';
    return className
        .trim()
        .toUpperCase()
        .replace(/\s+/g, ' '); // Remove extra spaces but keep single spaces
};

// 6. Clean College - Proper case and remove extra spaces
export const cleanCollege = (college) => {
    if (!college) return '';
    return college
        .trim()
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/\s+/g, ' ');
};

// 7. Clean Team Name - Proper case and remove extra spaces
export const cleanTeamName = (teamName) => {
    if (!teamName) return '';
    return teamName
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .replace(/\s+/g, ' ');
};

// 8. Clean Transaction ID - Uppercase and remove spaces
export const cleanTransactionId = (transactionId) => {
    if (!transactionId) return '';
    return transactionId.trim().toUpperCase().replace(/\s+/g, '');
};

// 9. Clean Game ID - Remove spaces but keep original case
export const cleanGameId = (gameId) => {
    if (!gameId) return '';
    return gameId.trim().replace(/\s+/g, '');
};

// 10. Clean Discord ID - Remove spaces but keep original case
export const cleanDiscordId = (discordId) => {
    if (!discordId) return '';
    return discordId.trim().replace(/\s+/g, '');
};

// Master function to clean all registration data
export const cleanRegistrationData = (data) => {
    const cleaned = { ...data };
    
    // Clean basic fields
    if (cleaned.name) cleaned.name = cleanName(cleaned.name);
    if (cleaned.email) cleaned.email = cleanEmail(cleaned.email);
    if (cleaned.phone) cleaned.phone = cleanPhone(cleaned.phone);
    if (cleaned.roll_no) cleaned.roll_no = cleanRollNo(cleaned.roll_no);
    if (cleaned.class) cleaned.class = cleanClass(cleaned.class);
    if (cleaned.college) cleaned.college = cleanCollege(cleaned.college);
    
    // Clean team fields
    if (cleaned.team_name) cleaned.team_name = cleanTeamName(cleaned.team_name);
    if (cleaned.player2_name) cleaned.player2_name = cleanName(cleaned.player2_name);
    if (cleaned.player3_name) cleaned.player3_name = cleanName(cleaned.player3_name);
    if (cleaned.player4_name) cleaned.player4_name = cleanName(cleaned.player4_name);
    if (cleaned.player2_roll_no) cleaned.player2_roll_no = cleanRollNo(cleaned.player2_roll_no);
    if (cleaned.player3_roll_no) cleaned.player3_roll_no = cleanRollNo(cleaned.player3_roll_no);
    if (cleaned.player4_roll_no) cleaned.player4_roll_no = cleanRollNo(cleaned.player4_roll_no);
    if (cleaned.player2_class) cleaned.player2_class = cleanClass(cleaned.player2_class);
    if (cleaned.player3_class) cleaned.player3_class = cleanClass(cleaned.player3_class);
    if (cleaned.player4_class) cleaned.player4_class = cleanClass(cleaned.player4_class);
    
    // Clean game-specific fields
    if (cleaned.bgmi_id) cleaned.bgmi_id = cleanGameId(cleaned.bgmi_id);
    if (cleaned.free_fire_id) cleaned.free_fire_id = cleanGameId(cleaned.free_fire_id);
    if (cleaned.discord_id) cleaned.discord_id = cleanDiscordId(cleaned.discord_id);
    
    // Clean payment fields
    if (cleaned.payment_transaction_id) cleaned.payment_transaction_id = cleanTransactionId(cleaned.payment_transaction_id);
    
    return cleaned;
};

// Get placeholder examples for different fields
export const getPlaceholderExamples = {
    transactionId: "Example: UPI123456789 or PAYTM987654321",
    bgmiId: "Example: 123456789",
    freeFireId: "Example: 987654321",
    discordId: "Example: username#1234",
    rollNo: "Example: 21CS001 or 2021BCA123",
    phone: "Example: 9876543210",
    name: "Example: John Doe",
    teamName: "Example: Team Alpha",
    college: "Example: ABC College of Engineering"
};