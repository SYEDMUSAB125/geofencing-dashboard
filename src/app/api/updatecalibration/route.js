import sql from "../setcalibration/db";

export async function PUT(request) {
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
    } catch (error) {
      return Response.json(
        { error: 'Database initialization failed' },
        { status: 500 }
      );
    }
  
    // Process request
    try {
      const data = await request.json();
      console.log('Received update data:', data);
      
      const { 
        id,
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
  
      // First check if the record exists
      const existingRecord = await sql`
        SELECT * FROM soil_data WHERE id = ${id}
      `;
  
      if (existingRecord.length === 0) {
        return Response.json(
          { error: 'Record not found' },
          { status: 404 }
        );
      }
  
      // Update the record
      const result = await sql`
        UPDATE soil_data SET
          device_id = ${device_id},
          username = ${username},
          fieldname = ${fieldname},
          ph_level_min = ${ph_level_min || null},
          ec_min = ${ec_min || null},
          moisture_min = ${moisture_min || null},
          nitrogen_min = ${nitrogen_min || null},
          phosphorous_min = ${phosphorous_min || null},
          potassium_min = ${potassium_min || null},
          ph_level_max = ${ph_level_max || null},
          ec_max = ${ec_max || null},
          moisture_max = ${moisture_max || null},
          nitrogen_max = ${nitrogen_max || null},
          phosphorous_max = ${phosphorous_max || null},
          potassium_max = ${potassium_max || null}
        WHERE id = ${id}
        RETURNING *
      `;
  
      return Response.json(result[0], { status: 200 });
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