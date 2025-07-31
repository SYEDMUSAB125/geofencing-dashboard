// app/api/users/route.js
import { adminAuth } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const userRecords = await adminAuth.listUsers();
    const users = userRecords.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      // Add other properties you need
    }));
    return Response.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}