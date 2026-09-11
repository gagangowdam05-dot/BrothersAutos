import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const status = searchParams.get('status');
    const make = searchParams.get('make');
    const fuelType = searchParams.get('fuelType');
    const transmission = searchParams.get('transmission');
    const bodyType = searchParams.get('bodyType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');

    const where: any = {};

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (make && make !== 'ALL') {
      where.make = { equals: make };
    }

    if (fuelType && fuelType !== 'ALL') {
      where.fuelType = { equals: fuelType };
    }

    if (transmission && transmission !== 'ALL') {
      where.transmission = { equals: transmission };
    }

    if (bodyType && bodyType !== 'ALL') {
      where.bodyType = { equals: bodyType };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { make: { contains: search } },
        { model: { contains: search } },
        { description: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'year_desc') orderBy = { year: 'desc' };
    if (sortBy === 'km_asc') orderBy = { mileageKm: 'asc' };

    const cars = await prisma.car.findMany({
      where,
      orderBy,
    });

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Failed to fetch cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      make,
      model,
      year,
      price,
      mileageKm,
      fuelType,
      transmission,
      ownership,
      bodyType,
      color,
      registrationCity,
      insuranceValidTill,
      description,
      features,
      images,
      status,
      isFeatured,
    } = body;

    if (!make || !model || !year || !price || !mileageKm) {
      return NextResponse.json(
        { error: 'Make, model, year, price, and mileage are required.' },
        { status: 400 }
      );
    }

    const newCar = await prisma.car.create({
      data: {
        make: String(make).trim(),
        model: String(model).trim(),
        year: Number(year),
        price: Number(price),
        mileageKm: Number(mileageKm),
        fuelType: fuelType || 'Petrol',
        transmission: transmission || 'Automatic',
        ownership: ownership || '1st Owner',
        bodyType: bodyType || 'SUV',
        color: color || 'White',
        registrationCity: registrationCity || 'Showroom RTO',
        insuranceValidTill: insuranceValidTill || 'Valid Comprehensive',
        description: description || `${year} ${make} ${model} certified by Brothers Autos.`,
        features: typeof features === 'string' ? features : JSON.stringify(features || []),
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        status: status || 'AVAILABLE',
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    console.error('Failed to create car:', error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}
