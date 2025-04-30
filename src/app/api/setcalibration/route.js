// src/app/api/setcalibration/route.js
import sql from "./db"

async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS soil_data (
        id SERIAL PRIMARY KEY,
        device_id VARCHAR(50) NOT NULL,
        username VARCHAR(100) NOT NULL,
        ph_level DECIMAL(5,2),
        ec DECIMAL(5,2),
        moisture DECIMAL(5,2),
        nitrogen DECIMAL(5,2),
        phosphorous DECIMAL(5,2),
        potassium DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(username)
      )
    `;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export async function POST(request) {

  

  // Verify table exists (retry initialization if needed)
  try {
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'soil_data'
      )
    `;
    
    if (!tableExists[0].exists) {
      await initializeDatabase();
    }
  } catch (error) {
    return Response.json(
      { error: 'Database initialization failed' },
      { status: 500 }
    );
  }

  // Process request
  try {
    const data = await request.json();
    console.log(data)
    const { device_id, username, ph_level, ec, moisture, nitrogen, phosphorous, potassium } = data;
    const value = {
      device_id,
      username,
      ph_level: ph_level || null,
      ec: ec || null,
      moisture: moisture || null,
      nitrogen: nitrogen || null,
      phosphorous: phosphorous || null,
      potassium: potassium || null
    };
    const result = await sql`
      INSERT INTO soil_data ${sql(value, [
        'device_id',
        'username',
        'ph_level',
        'ec',
        'moisture',
        'nitrogen',
        'phosphorous',
        'potassium'
      ])}
      RETURNING *
    `;

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Database operation failed:', error);
    
    if (error.constraint === 'soil_data_username_key') {
      return Response.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }
    
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
