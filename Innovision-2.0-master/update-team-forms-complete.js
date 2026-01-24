// Complete update script for all team event forms
// This documents the changes needed for Fashion Flex and Hackastra

const updates = {
  "FashionFlexRegistration.jsx": {
    maxPhotos: 2,
    memberNames: ["formData.name || 'Partner 1'", "formData.player2_name || 'Partner 2'"],
    label: "Duo College ID Photos (2 Required)",
    validation: "files.collegeIdPhotos.length !== 2",
    validationMessage: "Please upload both partner college ID photos before registration"
  },
  
  "HackastraRegistration.jsx": {
    maxPhotos: 3,
    memberNames: [
      "formData.name || 'Team Leader'", 
      "formData.player2_name || 'Member 2'", 
      "formData.player3_name || 'Member 3'"
    ],
    label: "Team College ID Photos (2-3 Required)",
    validation: "files.collegeIdPhotos.length < 2 || files.collegeIdPhotos.length > 3",
    validationMessage: "Please upload 2-3 team member college ID photos"
  }
};

console.log('Updates needed for remaining team forms:', updates);

// Changes to apply to each form:
// 1. Add MultiplePhotoUpload import
// 2. Change files state to collegeIdPhotos: []
// 3. Replace handleFileChange with handlePhotosChange
// 4. Replace uploadFile with uploadMultipleFiles
// 5. Update validation logic
// 6. Update upload section in form submission
// 7. Update database payload with individual photo URLs
// 8. Replace form upload section with MultiplePhotoUpload component