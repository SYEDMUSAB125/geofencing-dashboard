import sql from "./db"

async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS soil_data (
        id SERIAL PRIMARY KEY,
        device_id VARCHAR(50) NOT NULL,
        username VARCHAR(100) NOT NULL,
        fieldname VARCHAR(100) NOT NULL,
        
        -- Least Threshold values
        ph_level_min DECIMAL(5,2),
        ec_min DECIMAL(5,2),
        moisture_min DECIMAL(5,2),
        nitrogen_min DECIMAL(5,2),
        phosphorous_min DECIMAL(5,2),
        potassium_min DECIMAL(5,2),
        
        -- Greater Threshold values
        ph_level_max DECIMAL(5,2),
        ec_max DECIMAL(5,2),
        moisture_max DECIMAL(5,2),
        nitrogen_max DECIMAL(5,2),
        phosphorous_max DECIMAL(5,2),
        potassium_max DECIMAL(5,2),
        
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(username, fieldname)
      )
    `;
   
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    // First check if table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'soil_data'
      )
    `;
    
    if (!tableExists[0].exists) {
      
      await initializeDatabase();
    }

    // Process request
    const data = await request.json();
    console.log('Received data:', data);
    
    const { 
      device_id, 
      username, 
      fieldname,
      ph_level_min,
      ec_min,
      moisture_min,
      nitrogen_min,
      phosphorous_min,
      potassium_min,
      ph_level_max,
      ec_max,
      moisture_max,
      nitrogen_max,
      phosphorous_max,
      potassium_max
    } = data;
    
    const value = {
      device_id,
      username,
      fieldname,
      ph_level_min: ph_level_min || null,
      ec_min: ec_min || null,
      moisture_min: moisture_min || null,
      nitrogen_min: nitrogen_min || null,
      phosphorous_min: phosphorous_min || null,
      potassium_min: potassium_min || null,
      ph_level_max: ph_level_max || null,
      ec_max: ec_max || null,
      moisture_max: moisture_max || null,
      nitrogen_max: nitrogen_max || null,
      phosphorous_max: phosphorous_max || null,
      potassium_max: potassium_max || null
    };
    
    const result = await sql`
      INSERT INTO soil_data ${sql(value, [
        'device_id',
        'username',
        'fieldname',
        'ph_level_min',
        'ec_min',
        'moisture_min',
        'nitrogen_min',
        'phosphorous_min',
        'potassium_min',
        'ph_level_max',
        'ec_max',
        'moisture_max',
        'nitrogen_max',
        'phosphorous_max',
        'potassium_max'
      ])}
      RETURNING *
    `;

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Database operation failed:', error);
    
    if (error.constraint === 'soil_data_username_fieldname_key') {
      return Response.json(
        { error: 'This username and fieldname combination already exists' },
        { status: 409 }
      );
    }
    
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}