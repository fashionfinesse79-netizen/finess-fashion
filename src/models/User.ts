export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  phone?: string;
  addresses?: any[];
  savedWishlistIds?: string[];
  isAdmin?: boolean;
  resetToken?: string;
  resetTokenExpiry?: Date;
}
