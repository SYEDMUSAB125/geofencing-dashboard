// File: app/api/soil-data/route.js
import sql from '../setcalibration/db';

export async function GET(request) {
  
    try {
      const result = await sql`
        SELECT * FROM soil_data 
      `;

      if (result.length === 0) {
        return Response.json({ message: 'No soil data found' }, { status: 404 });
      }
  
    
      const serializedData = result.map(row => ({
        ...row,
        
      }));
  
      return Response.json(serializedData); // Return the first item only
    } catch (error) {
      console.error('Database error:', error);
      return Response.json({ message: 'Internal server error' }, { status: 500 });
    }
  }