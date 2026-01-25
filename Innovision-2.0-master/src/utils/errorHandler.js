// User-friendly error message handler
export const getUserFriendlyError = (error) => {
    // Convert technical errors to user-friendly messages
    const errorMessage = error.message || error.toString();
    const errorCode = error.code || '';
    
    // Database constraint errors - Multiple ways Supabase can report duplicates
    if (errorMessage.includes('duplicate key value violates unique constraint') || 
        errorMessage.includes('duplicate') || 
        errorCode === '23505' ||
        errorMessage.includes('already exists') ||
        errorMessage.includes('unique constraint') ||
        errorMessage.includes('UNIQUE constraint failed')) {
        
        if (errorMessage.includes('email') || errorMessage.includes('registrations_email_event_id_key')) {
            return "You have already registered for this event with this email address. Each person can only register once per event.";
        }
        if (errorMessage.includes('phone') || errorMessage.includes('registrations_phone_event_id_key')) {
            return "This phone number is already registered for this event. Please use a different phone number.";
        }
        return "You have already registered for this event. Each person can only register once per event.";
    }
    
    // Network/connection errors
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
        return "Unable to connect to the server. Please check your internet connection and try again.";
    }
    
    // File upload errors
    if (errorMessage.includes('upload') || errorMessage.includes('storage')) {
        return "Failed to upload your photo. Please check your internet connection and try uploading again.";
    }
    
    // Authentication errors
    if (errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
        return "Session expired. Please refresh the page and try again.";
    }
    
    // Validation errors
    if (errorMessage.includes('invalid') || errorMessage.includes('validation')) {
        return "Please check your information and make sure all fields are filled correctly.";
    }
    
    // File size/type errors
    if (errorMessage.includes('file') && errorMessage.includes('size')) {
        return "Your photo file is too large. Please choose a smaller image (max 10MB).";
    }
    
    if (errorMessage.includes('file') && errorMessage.includes('type')) {
        return "Please upload a valid image file (JPG, PNG, or WEBP format only).";
    }
    
    // Event not found
    if (errorMessage.includes('Event not found')) {
        return "This event is currently unavailable. Please try again later or contact support.";
    }
    
    // Server errors
    if (errorMessage.includes('500') || errorMessage.includes('internal server error')) {
        return "Server is temporarily unavailable. Please try again in a few minutes.";
    }
    
    // Timeout errors
    if (errorMessage.includes('timeout')) {
        return "Request timed out. Please check your internet connection and try again.";
    }
    
    // Default fallback for unknown errors
    return "Something went wrong during registration. Please try again or contact support if the problem continues.";
};

// Additional helper for form validation
export const validateFormData = (formData, isTeamEvent = false) => {
    const errors = [];
    
    // Basic validation
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push("Please enter a valid full name (at least 2 characters).");
    }
    
    if (!formData.email || !formData.email.includes('@')) {
        errors.push("Please enter a valid email address.");
    }
    
    if (!formData.phone || formData.phone.length !== 10) {
        errors.push("Please enter a valid 10-digit phone number.");
    }
    
    if (!formData.college || formData.college.trim().length < 2) {
        errors.push("Please enter your college name.");
    }
    
    if (!formData.class || formData.class.trim().length < 1) {
        errors.push("Please enter your class/course.");
    }
    
    if (!formData.roll_no || formData.roll_no.trim().length < 1) {
        errors.push("Please enter your roll number.");
    }
    
    // Team event validation
    if (isTeamEvent) {
        if (!formData.team_name || formData.team_name.trim().length < 2) {
            errors.push("Please enter a team name (at least 2 characters).");
        }
    }
    
    return errors;
};