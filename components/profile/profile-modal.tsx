// 'use client'
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { Edit, Loader2, Upload, X, User } from "lucide-react";
// import { GENDER } from "@/types/user";
// import { useState } from "react";

// export default function ProfileModal() {
//   const [isOpen, setIsOpen] = useState(false);

//   const {
//     isLoading,
//     error,
//     formData,
//     handleFormDataChange,
//     handleResetFormData,
//     handleAvatarAdd,
//     handleAvatarRemove,
//     handleSubmit,
//     clearError
//   } = useProfile();

//   const handleCancel = () => {
//     setIsOpen(false);
//     handleResetFormData();
//     if (error) clearError();
//   }

//   const handleOpenChange = () => {
//     setIsOpen(isOpen ? false : true);
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={handleOpenChange}>
//       <DialogContent size="lg" className="max-w-2xl w-[90vw] max-h-[90vh] overflow-y-scroll pr-2 -mr-2">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold text-gray-900">
//             Update Profile
//           </DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Username section */}
//           <div className="space-y-2">
//             <Label htmlFor="username" className="text-sm font-medium text-gray-700">
//               Username <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="username"
//               type="text"
//               placeholder="Enter username..."
//               value={formData.username}
//               onChange={(e) => handleFormDataChange("username", e.target.value)}
//               className="w-full"
//               disabled={isLoading}
//             />
//           </div>

//           {/* Avatar section */}
//           <div className="space-y-2">
//             <Label className="text-sm font-medium text-gray-700">
//               Avatar
//             </Label>
//             <div className="flex items-center gap-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={handleAvatarAdd}
//                 disabled={isLoading}
//                 className="flex items-center gap-2"
//               >
//                 <Upload className="h-4 w-4" />
//                 {formData.avatar ? 'Change Avatar' : 'Upload Avatar'}
//               </Button>
//               <span className="text-xs text-gray-500">
//                 (Max 1 image, 5MB)
//               </span>
//             </div>

//             {formData.avatar && (
//               <div className="mt-3">
//                 <div className="relative inline-block">
//                   <img
//                     src={formData.avatar}
//                     alt="Avatar preview"
//                     className="w-20 h-20 object-cover rounded-full border"
//                   />
//                   <Button
//                     type="button"
//                     onClick={handleAvatarRemove}
//                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                     disabled={isLoading}
//                   >
//                     <X className="h-3 w-3" />
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Phone section */}
//           <div className="space-y-2">
//             <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
//               Phone Number
//             </Label>
//             <Input
//               id="phone"
//               type="tel"
//               placeholder="Enter phone number..."
//               value={formData.phone}
//               onChange={(e) => handleFormDataChange("phone", e.target.value)}
//               className="w-full"
//               disabled={isLoading}
//             />
//           </div>

//           {/* Address section */}
//           <div className="space-y-2">
//             <Label htmlFor="address" className="text-sm font-medium text-gray-700">
//               Address
//             </Label>
//             <Input
//               id="address"
//               type="text"
//               placeholder="Enter address..."
//               value={formData.address}
//               onChange={(e) => handleFormDataChange("address", e.target.value)}
//               className="w-full"
//               disabled={isLoading}
//             />
//           </div>

//           {/* Gender section */}
//           <div className="space-y-2">
//             <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
//               Gender
//             </Label>
//             <Select
//               value={formData.gender}
//               onValueChange={(value) => handleFormDataChange("gender", value)}
//               disabled={isLoading}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select gender..." />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value={GENDER.MALE}>Male</SelectItem>
//                 <SelectItem value={GENDER.FEMALE}>Female</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-sm text-red-600">{error}</p>
//             </div>
//           )}

//           <div className="flex justify-end gap-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleCancel}
//               disabled={isLoading}
//               className="px-6"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={isLoading || !formData.username.trim()}
//               className="bg-black hover:bg-gray-800 text-white font-medium px-6"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <Edit className="h-4 w-4 mr-2" />
//                   Update Profile
//                 </>
//               )}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }