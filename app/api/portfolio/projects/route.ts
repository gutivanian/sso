import { NextResponse } from 'next/server';

// Mock data - in production, this would come from database
const projects = [
  {
    id: 1,
    title: 'Shopify',
    description: 'An e-commerce platform that allows anyone to set up an online store and sell their products.',
    program: 'React, Node.js, GraphQL',
    image_url: 'https://images.ctfassets.net/lh3zuq09vnm2/6FdHOZHJKvrlc1dAWXdqlu/2e83c3b20cb1af6f42d99b4b8439d5eb/05_Shopify.jpg',
    demo_url: 'https://shopify-demo.com',
    source_url: 'https://github.com/user/shopify',
    is_featured: true,
    order_index: 1
  },
  {
    id: 2,
    title: 'Weather App',
    description: 'A web application that provides weather forecasts for different locations.',
    program: 'React, OpenWeather API',
    image_url: 'https://images.ctfassets.net/lh3zuq09vnm2/6v6hASKYhu8sohkJgIUIMW/bd0f0f28e9313f8945fd50474513c08a/03_Freshbooks.jpg',
    demo_url: 'https://weatherapp-demo.com',
    is_featured: true,
    order_index: 2
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description: 'A personal portfolio website to showcase projects and skills.',
    program: 'HTML, CSS, JavaScript',
    image_url: 'https://www.wordstream.com/wp-content/uploads/2022/07/nonprofit-website-examples-iwmf.png',
    source_url: 'https://github.com/user/portfolio',
    is_featured: true,
    order_index: 3
  },
  {
    id: 4,
    title: 'Task Manager',
    description: 'A task management app to keep track of daily tasks and to-dos.',
    program: 'React, Redux, Node.js',
    image_url: 'https://cdn.sanity.io/images/v6oximkk/production/0ea037e387443a2c4601ef99fa2882343d2cf73b-1600x900.jpg',
    demo_url: 'https://taskmanager-demo.com',
    source_url: 'https://github.com/user/taskmanager',
    is_featured: false,
    order_index: 4
  },
  {
    id: 5,
    title: 'Blog Platform',
    description: 'A blogging platform where users can write and share their thoughts.',
    program: 'React, Node.js, MongoDB',
    image_url: 'https://www.ideamotive.co/hs-fs/hubfs/10%20Irresistible%20Examples%20of%20Web%20Design%20Best%20Practices%20for%202022%20-%20Wild%20Souls.png',
    source_url: 'https://github.com/user/blogplatform',
    is_featured: false,
    order_index: 5
  },
  {
    id: 6,
    title: 'Social Media App',
    description: 'A social media application to connect with friends and share updates.',
    program: 'React, Firebase',
    image_url: 'https://archive.smashing.media/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/c849fc6d-e62d-4ebd-9ba1-f238cebc28cb/hardboiled2.jpg',
    demo_url: 'https://socialmediaapp-demo.com',
    is_featured: false,
    order_index: 6
  },
  {
    id: 7,
    title: 'E-commerce Store',
    description: 'An online store for selling products with a shopping cart feature.',
    program: 'React, Redux, Stripe',
    image_url: 'https://activebusinessgrowth.ca/wp-content/uploads/website-types.png',
    source_url: 'https://github.com/user/ecommercestore',
    is_featured: false,
    order_index: 7
  },
  {
    id: 8,
    title: 'Fitness Tracker',
    description: 'A fitness tracking app to log workouts and monitor progress.',
    program: 'React, Node.js, Express',
    image_url: 'https://cdn.sanity.io/images/v6oximkk/production/0b7a852c2c407b5a95c887a181a0310646edeaff-1000x667.jpg',
    demo_url: 'https://fitnesstracker-demo.com',
    source_url: 'https://github.com/user/fitnesstracker',
    is_featured: false,
    order_index: 8
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    let filteredProjects = projects;

    if (featured === 'true') {
      filteredProjects = projects.filter(p => p.is_featured);
    }

    // Sort by order_index
    filteredProjects.sort((a, b) => a.order_index - b.order_index);

    return NextResponse.json({
      success: true,
      projects: filteredProjects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
