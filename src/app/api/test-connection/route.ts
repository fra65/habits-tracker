/* eslint-disable @typescript-eslint/no-explicit-any */
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

interface VersionRow extends RowDataPacket {
  version: string;
}

export async function GET() {
  try {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('La variabile d\'ambiente DATABASE_URL non è definita');
    }

    const connection = await mysql.createConnection(connectionString);

    // Tipizziamo il risultato come array di VersionRow
    const [rows] = await connection.execute<VersionRow[]>('SELECT VERSION() AS version');

    await connection.end();

    return new Response(
      JSON.stringify({ success: true, mysqlVersion: rows[0].version }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
