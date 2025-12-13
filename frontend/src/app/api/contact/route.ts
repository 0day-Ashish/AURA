import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(req: Request) {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    const body = await req.json();
    
    await client.connect();
    const database = client.db('au-bot');
    const collection = database.collection('contact-form');

    await collection.insertOne({
      ...body,
      createdAt: new Date()
    });

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Error saving contact' }, { status: 500 });
  } finally {
    await client.close();
  }
}
