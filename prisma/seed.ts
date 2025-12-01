import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  await prisma.order.deleteMany()
  await prisma.customerRestaurant.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.restaurant.deleteMany()

  console.log('🧹 Cleared existing data')

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Alice Johnson',
        phone: '+1-555-0101'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Bob Smith',
        phone: '+1-555-0102'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Carol Davis',
        phone: '+1-555-0103'
      }
    })
  ])

  console.log('👥 Created 3 customers')

  // Create restaurants
  const restaurants = await Promise.all([
    prisma.restaurant.create({
      data: {
        name: 'Pizza Palace',
        description: 'Authentic Italian pizzas with fresh ingredients and wood-fired ovens',
        isOpen: true
      }
    }),
    prisma.restaurant.create({
      data: {
        name: 'Sushi Express',
        description: 'Fresh sushi and Japanese cuisine made by expert chefs',
        isOpen: true
      }
    }),
    prisma.restaurant.create({
      data: {
        name: 'Burger Barn',
        description: 'Gourmet burgers made with locally sourced beef and organic ingredients',
        isOpen: false
      }
    })
  ])

  console.log('🍕 Created 3 restaurants')

  // Create customer-restaurant relationships (many-to-many)
  const relationships = [
    // Alice likes Pizza Palace and Sushi Express
    { customerId: customers[0].id, restaurantId: restaurants[0].id },
    { customerId: customers[0].id, restaurantId: restaurants[1].id },
    // Bob likes all restaurants
    { customerId: customers[1].id, restaurantId: restaurants[0].id },
    { customerId: customers[1].id, restaurantId: restaurants[1].id },
    { customerId: customers[1].id, restaurantId: restaurants[2].id },
    // Carol likes Sushi Express and Burger Barn
    { customerId: customers[2].id, restaurantId: restaurants[1].id },
    { customerId: customers[2].id, restaurantId: restaurants[2].id }
  ]

  await prisma.customerRestaurant.createMany({
    data: relationships
  })

  console.log('🔗 Created customer-restaurant relationships')

  // Helper function to calculate ETA
  function calculateETA(itemCount: number): Date {
    const baseTime = 10 // base 10 minutes for delivery
    const timePerItem = 10 // 10 minutes per item
    const totalMinutes = baseTime + (itemCount * timePerItem)
    
    const eta = new Date()
    eta.setMinutes(eta.getMinutes() + totalMinutes)
    return eta
  }

  // Create orders with proper timing
  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)

  const orders = [
    {
      customerId: customers[0].id,
      restaurantId: restaurants[0].id, // Alice ordering from Pizza Palace
      itemCount: 3,
      orderedAt: twoHoursAgo,
      eta: calculateETA(3)
    },
    {
      customerId: customers[1].id,
      restaurantId: restaurants[1].id, // Bob ordering from Sushi Express
      itemCount: 2,
      orderedAt: oneHourAgo,
      eta: calculateETA(2)
    },
    {
      customerId: customers[2].id,
      restaurantId: restaurants[1].id, // Carol ordering from Sushi Express
      itemCount: 5,
      orderedAt: thirtyMinutesAgo,
      eta: calculateETA(5)
    },
    {
      customerId: customers[0].id,
      restaurantId: restaurants[1].id, // Alice ordering from Sushi Express
      itemCount: 1,
      orderedAt: now,
      eta: calculateETA(1)
    },
    {
      customerId: customers[1].id,
      restaurantId: restaurants[2].id, // Bob ordering from Burger Barn
      itemCount: 4,
      orderedAt: now,
      eta: calculateETA(4)
    }
  ]

  for (const orderData of orders) {
    await prisma.order.create({
      data: orderData
    })
  }

  console.log('📦 Created 5 orders with ETA calculations')

  // Verify the data
  const totalCustomers = await prisma.customer.count()
  const totalRestaurants = await prisma.restaurant.count()
  const totalOrders = await prisma.order.count()
  const totalRelationships = await prisma.customerRestaurant.count()

  console.log('\n📊 Database seeded successfully!')
  console.log(`   Customers: ${totalCustomers}`)
  console.log(`   Restaurants: ${totalRestaurants}`)
  console.log(`   Orders: ${totalOrders}`)
  console.log(`   Customer-Restaurant relationships: ${totalRelationships}`)

  // Display some sample data
  console.log('\n👤 Sample Customers:')
  for (const customer of customers) {
    console.log(`   - ${customer.name} (${customer.phone})`)
  }

  console.log('\n🍽️ Sample Restaurants:')
  for (const restaurant of restaurants) {
    console.log(`   - ${restaurant.name} (${restaurant.isOpen ? 'Open' : 'Closed'})`)
  }

  console.log('\n🕒 Order Examples:')
  const sampleOrders = await prisma.order.findMany({
    include: {
      customer: true,
      restaurant: true
    },
    take: 3
  })
  
  for (const order of sampleOrders) {
    console.log(`   - ${order.customer.name} ordered ${order.itemCount} items from ${order.restaurant.name}`)
    console.log(`     Ordered at: ${order.orderedAt.toISOString()}`)
    console.log(`     ETA: ${order.eta.toISOString()}`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('✅ Seed completed successfully!')
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })