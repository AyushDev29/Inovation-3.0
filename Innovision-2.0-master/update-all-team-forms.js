// Script to update all team event registration forms with multiple photo upload
// This will be used to systematically update Free Fire, Fashion Flex, and Hackastra forms

const fs = require('fs');
const path = require('path');

const forms = [
    {
        file: 'src/pages/FreeFireRegistration.jsx',
        maxPhotos: 4,
        memberNames: ['Team Leader', 'Member 2', 'Member 3', 'Member 4']
    },
    {
        file: 'src/pages/FashionFlexRegistration.jsx', 
        maxPhotos: 2,
        memberNames: ['Partner 1', 'Partner 2']
    },
    {
        file: 'src/pages/HackastraRegistration.jsx',
        maxPhotos: 3, // 2-3 members, we'll handle dynamically
        memberNames: ['Team Leader', 'Member 2', 'Member 3']
    }
];

console.log('Team forms to update:', forms.map(f => f.file));
console.log('Run this after database update is complete');