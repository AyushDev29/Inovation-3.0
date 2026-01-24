import React, { useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

const MultiplePhotoUpload = ({ 
    maxPhotos, 
    onPhotosChange, 
    memberNames = [], 
    required = true,
    label = "College ID Photos",
    uploadMessage = null, // Custom upload message
    customInstructions = null // Custom instructions
}) => {
    const [photos, setPhotos] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const validateFile = (file) => {
        // Validate file type (Images only: JPEG, JPG, PNG, WEBP)
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return 'Please upload only image files (JPEG, JPG, PNG, WEBP)';
        }
        
        // Validate file size (max 10MB for images)
        if (file.size > 10 * 1024 * 1024) {
            return 'Image size must be less than 10MB';
        }
        
        return null;
    };

    const handleFiles = (files) => {
        const fileArray = Array.from(files);
        const validFiles = [];
        const errors = [];

        // Check if total files exceed limit
        if (photos.length + fileArray.length > maxPhotos) {
            alert(`You can only upload ${maxPhotos} photos maximum`);
            return;
        }

        fileArray.forEach((file, index) => {
            const error = validateFile(file);
            if (error) {
                errors.push(`File ${index + 1}: ${error}`);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        const newPhotos = [...photos, ...validFiles];
        setPhotos(newPhotos);
        onPhotosChange(newPhotos);
    };

    const handleFileInput = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFiles(files);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const removePhoto = (index) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        setPhotos(newPhotos);
        onPhotosChange(newPhotos);
    };

    const getPhotoPreview = (file) => {
        return URL.createObjectURL(file);
    };

    return (
        <div className="space-y-3">
            <label className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider ml-1 font-medium">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            
            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-300 ${
                    dragActive 
                        ? 'border-neon-purple bg-neon-purple/10' 
                        : 'border-white/20 hover:border-white/40'
                } ${photos.length >= maxPhotos ? 'opacity-50 pointer-events-none' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={photos.length >= maxPhotos}
                />
                
                <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-300 mb-1">
                        {photos.length >= maxPhotos 
                            ? `Maximum ${maxPhotos} photos uploaded`
                            : (uploadMessage || `Upload ${maxPhotos} College ID Photos`)
                        }
                    </p>
                    <p className="text-xs text-gray-500">
                        {photos.length >= maxPhotos 
                            ? 'Remove photos to upload new ones'
                            : `Select ${maxPhotos - photos.length} more photos (JPG, PNG, WEBP, max 10MB each)`
                        }
                    </p>
                </div>
            </div>

            {/* Photo Previews */}
            {photos.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs text-gray-400">
                        Uploaded Photos ({photos.length}/{maxPhotos})
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {photos.map((photo, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-white/10">
                                    <img
                                        src={getPhotoPreview(photo)}
                                        alt={`College ID ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => removePhoto(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                                
                                {/* Member Label */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
                                    {memberNames[index] || `Member ${index + 1}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3">
                <p className="text-xs sm:text-sm text-yellow-400 font-semibold mb-2">
                    ⚠️ IMPORTANT REQUIREMENTS:
                </p>
                <ul className="text-[11px] sm:text-xs text-yellow-300 space-y-1 ml-3 leading-relaxed">
                    {customInstructions ? (
                        customInstructions.map((instruction, index) => (
                            <li key={index}>• {instruction}</li>
                        ))
                    ) : (
                        <>
                            <li>• Upload {maxPhotos} separate college ID photos (one for each team member)</li>
                            <li>• Ensure all text and photos on IDs are clearly readable</li>
                            <li>• Poor quality/blurred photos may lead to disqualification</li>
                            <li>• Upload from gallery - no camera capture needed</li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default MultiplePhotoUpload;