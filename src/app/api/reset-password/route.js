// app/api/reset-password/route.js
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const { uid, newPassword } = await request.json();
    
    await adminAuth.updateUser(uid, {
      password: newPassword
    });
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error resetting password:', error);
    return Response.json(
      { error: 'Failed to reset password', details: error.message },
      { status: 500 }
    );
  }
}