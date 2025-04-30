import sql from "../setcalibration/db";
export async function PUT(request) {
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
      const { id, device_id, username, ph_level, ec, moisture, nitrogen, phosphorous, potassium } = data;
  
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
          ph_level = ${ph_level || null},
          ec = ${ec || null},
          moisture = ${moisture || null},
          nitrogen = ${nitrogen || null},
          phosphorous = ${phosphorous || null},
          potassium = ${potassium || null}
        WHERE id = ${id}
        RETURNING *
      `;
  
      return Response.json(result[0], { status: 200 });
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