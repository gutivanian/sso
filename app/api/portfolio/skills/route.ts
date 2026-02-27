import { NextResponse } from 'next/server';
import sql from '@/config/database';

export async function GET() {
  try {
    // Fetch skill categories with their skills
    const result = await sql`
      SELECT 
        sc.id as category_id,
        sc.name as category_name,
        sc.slug as category_slug,
        sc.order_index as category_order,
        json_agg(
          json_build_object(
            'id', s.id,
            'name', s.name,
            'icon_url', s.icon_url,
            'proficiency_level', s.proficiency_level,
            'order_index', s.order_index
          ) ORDER BY s.order_index
        ) FILTER (WHERE s.id IS NOT NULL) as skills
      FROM skill_categories sc
      LEFT JOIN skills s ON s.category_id = sc.id
      GROUP BY sc.id, sc.name, sc.slug, sc.order_index
      ORDER BY sc.order_index;
    `;

    // Transform data untuk frontend
    const skillsData = result.reduce((acc: any, row: any) => {
      acc[row.category_slug] = {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
        skills: row.skills || []
      };
      return acc;
    }, {});

    return NextResponse.json({ 
      success: true, 
      data: skillsData,
      categories: result.map((row: any) => ({
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug
      }))
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}
