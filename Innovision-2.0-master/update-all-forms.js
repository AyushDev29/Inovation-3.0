const fs = require('fs');
const path = require('path');

// List of all registration form files
const registrationFiles = [
    'src/pages/BGMIRegistration.jsx',
    'src/pages/FreeFireRegistration.jsx', 
    'src/pages/HackastraRegistration.jsx',
    'src/pages/FunFusionRegistration.jsx',
    'src/pages/FashionFlexRegistration.jsx',
    'src/pages/TechTriathlonRegistration.jsx'
];

// Function to update each file
function updateRegistrationFile(filePath) {
    console.log(`Updating ${filePath}...`);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add import for data cleaners if not already present
        if (!content.includes('cleanRegistrationData')) {
            content = content.replace(
                "import { supabase } from '../supabaseClient';",
                "import { supabase } from '../supabaseClient';\nimport { cleanRegistrationData, getPlaceholderExamples } from '../utils/dataCleaners';"
            );
        }
        
        // Update transaction ID placeholder if present
        content = content.replace(
            /placeholder="[^"]*Transaction[^"]*"/g,
            'placeholder={getPlaceholderExamples.transactionId}'
        );
        
        // Update payload creation to use cleaned data
        content = content.replace(
            /const payload = \{[\s\S]*?name: formData\.name,/,
            `const payload = {
                // Clean all form data before saving
                ...cleanRegistrationData(formData),
                name: cleanRegistrationData(formData).name,`
        );
        
        // Write updated content back
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${filePath}`);
        
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
    }
}

// Update all files
console.log('🔄 Starting bulk update of registration forms...');
registrationFiles.forEach(updateRegistrationFile);
console.log('🎉 Bulk update completed!');