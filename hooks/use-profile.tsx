// import { useState, useCallback, useEffect } from 'react';
// import { User, GENDER } from '@/types/user';
// import { useProfileContext } from '@/contexts/profile-context';

// interface ProfileFormData {
//   username: string;
//   avatar: string;
//   phone: string;
//   address: string;
//   gender: keyof typeof GENDER | '';
// }

// const initialFormData: ProfileFormData = {
//   username: '',
//   avatar: '',
//   phone: '',
//   address: '',
//   gender: ''
// };

// export function useProfile() {
//   const { closeModal, currentUser, setCurrentUser } = useProfileContext();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState<ProfileFormData>(initialFormData);

//   // Initialize form data with current user data when modal opens
//   useEffect(() => {
//     if (currentUser) {
//       setFormData({
//         username: currentUser.username || '',
//         avatar: currentUser.avatar || '',
//         phone: currentUser.phone || '',
//         address: currentUser.address || '',
//         gender: currentUser.gender || ''
//       });
//     }
//   }, [currentUser]);

//   const handleFormDataChange = useCallback((field: keyof ProfileFormData, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     // Clear error when user starts typing
//     if (error) setError(null);
//   }, [error]);

//   const handleResetFormData = useCallback(() => {
//     if (currentUser) {
//       setFormData({
//         username: currentUser.username || '',
//         avatar: currentUser.avatar || '',
//         phone: currentUser.phone || '',
//         address: currentUser.address || '',
//         gender: currentUser.gender || ''
//       });
//     } else {
//       setFormData(initialFormData);
//     }
//     setError(null);
//   }, [currentUser]);

//   const handleAvatarAdd = useCallback(() => {
//     if (isLoading) return;

//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = 'image/*';
//     input.onchange = (e) => {
//       const file = (e.target as HTMLInputElement).files?.[0];
//       if (file) {
//         // Validate file size (5MB)
//         if (file.size > 5 * 1024 * 1024) {
//           setError('Avatar file size must be less than 5MB');
//           return;
//         }

//         // Validate file type
//         if (!file.type.startsWith('image/')) {
//           setError('Please select a valid image file');
//           return;
//         }

//         // Create preview URL
//         const url = URL.createObjectURL(file);
//         setFormData(prev => ({
//           ...prev,
//           avatar: url
//         }));
        
//         // Clear any previous errors
//         setError(null);
//       }
//     };
//     input.click();
//   }, [isLoading]);

//   const handleAvatarRemove = useCallback(() => {
//     if (isLoading) return;
    
//     // Revoke object URL to prevent memory leaks
//     if (formData.avatar && formData.avatar.startsWith('blob:')) {
//       URL.revokeObjectURL(formData.avatar);
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       avatar: ''
//     }));
//   }, [formData.avatar, isLoading]);

//   const validateForm = useCallback(() => {
//     if (!formData.username.trim()) {
//       setError('Username is required');
//       return false;
//     }

//     if (formData.username.trim().length < 3) {
//       setError('Username must be at least 3 characters long');
//       return false;
//     }

//     if (formData.username.trim().length > 50) {
//       setError('Username must be less than 50 characters');
//       return false;
//     }

//     // Validate phone number format if provided
//     if (formData.phone && !/^[\d\s\-\+\(\)]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
//       setError('Please enter a valid phone number');
//       return false;
//     }

//     return true;
//   }, [formData]);

//   const handleSubmit = useCallback(async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
//     if (isLoading) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       // Create FormData for file upload
//       const submitData = new FormData();
//       submitData.append('username', formData.username.trim());
//       submitData.append('phone', formData.phone.trim());
//       submitData.append('address', formData.address.trim());
//       submitData.append('gender', formData.gender);

//       // Handle avatar file upload
//       if (formData.avatar && formData.avatar.startsWith('blob:')) {
//         // Convert blob URL to file
//         const response = await fetch(formData.avatar);
//         const blob = await response.blob();
//         const file = new File([blob], 'avatar.jpg', { type: blob.type });
//         submitData.append('avatar', file);
//       } else if (formData.avatar && !formData.avatar.startsWith('blob:')) {
//         // Existing avatar URL
//         submitData.append('avatarUrl', formData.avatar);
//       }

//       // API call to update profile
//       const response = await fetch('/api/profile/update', {
//         method: 'PUT',
//         body: submitData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to update profile');
//       }

//       const updatedUser: User = await response.json();
      
//       // Update current user in context
//       setCurrentUser(updatedUser);
      
//       // Close modal and reset form
//       closeModal();
//       handleResetFormData();
      
//       // Optional: Show success message
//       // You might want to use a toast notification here
//       console.log('Profile updated successfully');

//     } catch (err) {
//       console.error('Error updating profile:', err);
//       setError(err instanceof Error ? err.message : 'Failed to update profile');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [formData, validateForm, isLoading, closeModal, handleResetFormData, setCurrentUser]);

//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   return {
//     isLoading,
//     error,
//     formData,
//     handleFormDataChange,
//     handleResetFormData,
//     handleAvatarAdd,
//     handleAvatarRemove,
//     handleSubmit,
//     clearError
//   };
// }