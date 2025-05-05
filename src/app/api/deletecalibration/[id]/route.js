
import sql from '../../setcalibration/db'


export async function DELETE(request, { params }) {
 

  try {
    const { id } = params;
    // First check if the table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'soil_data'
      )
    `;
    
    if (!tableExists[0].exists) {
      return Response.json(
        { error: 'Table does not exist' },
        { status: 404 }
      );
    }



    if (!id) {
      return Response.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      );
    }

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

    // Delete the record
    await sql`
      DELETE FROM soil_data WHERE id = ${id}
    `;

    // Fetch all remaining records (or you could fetch based on some filter)
    const updatedData = await sql`
      SELECT * FROM soil_data ORDER BY id
    `;

    return Response.json(
      { 
        message: 'Record deleted successfully',
        data: updatedData 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Database operation failed:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}