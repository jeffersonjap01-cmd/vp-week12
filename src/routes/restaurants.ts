import { Router } from 'express'
import { prisma } from '../utils/database-util'
import { validate } from '../middleware/validation'

const router = Router()

/**
 * @route   GET /api/restaurants
 * @desc    Get all restaurants with optional filtering
 * @access  Public
 * @query   ?status=open|closed - Filter by open/closed status
 */
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query
    const where: any = {}

    // Filter by open/closed status if provided
    if (status === 'open') {
      where.isOpen = true
    } else if (status === 'closed') {
      where.isOpen = false
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        customers: {
          include: {
            customer: true
          }
        },
        orders: {
          include: {
            customer: true
          },
          orderBy: {
            orderedAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.status(200).json({
      success: true,
      data: restaurants,
      count: restaurants.length,
      filters: status ? { status } : {}
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route   POST /api/restaurants
 * @desc    Create a new restaurant
 * @access  Public
 */
router.post('/',
  validate({
    body: [
      { field: 'name', required: true, type: 'string', minLength: 2, maxLength: 100 },
      { field: 'description', required: true, type: 'string', minLength: 10, maxLength: 500 },
      { field: 'isOpen', required: false, type: 'boolean' }
    ]
  }),
  async (req, res, next) => {
    try {
      const { name, description, isOpen = false } = req.body

      const restaurant = await prisma.restaurant.create({
        data: {
          name,
          description,
          isOpen
        }
      })

      res.status(201).json({
        success: true,
        data: restaurant,
        message: 'Restaurant created successfully'
      })
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @route   GET /api/restaurants/:id
 * @desc    Get restaurant by ID
 * @access  Public
 */
router.get('/:id',
  validate({
    params: [
      { field: 'id', required: true }
    ]
  }),
  async (req, res, next) => {
    try {
      const { id } = req.params

      const restaurant = await prisma.restaurant.findUnique({
        where: { id },
        include: {
          customers: {
            include: {
              customer: true
            }
          },
          orders: {
            include: {
              customer: true
            },
            orderBy: {
              orderedAt: 'desc'
            }
          }
        }
      })

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: 'Restaurant not found'
        })
      }

      res.status(200).json({
        success: true,
        data: restaurant
      })
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @route   PUT /api/restaurants/:id
 * @desc    Update restaurant
 * @access  Public
 */
router.put('/:id',
  validate({
    params: [
      { field: 'id', required: true }
    ],
    body: [
      { field: 'name', required: false, type: 'string', minLength: 2, maxLength: 100 },
      { field: 'description', required: false, type: 'string', minLength: 10, maxLength: 500 },
      { field: 'isOpen', required: false, type: 'boolean' }
    ]
  }),
  async (req, res, next) => {
    try {
      const { id } = req.params
      const { name, description, isOpen } = req.body

      // Check if restaurant exists
      const existingRestaurant = await prisma.restaurant.findUnique({
        where: { id }
      })

      if (!existingRestaurant) {
        return res.status(404).json({
          success: false,
          message: 'Restaurant not found'
        })
      }

      const updateData: any = {}
      if (name !== undefined) updateData.name = name
      if (description !== undefined) updateData.description = description
      if (isOpen !== undefined) updateData.isOpen = isOpen

      const restaurant = await prisma.restaurant.update({
        where: { id },
        data: updateData
      })

      res.status(200).json({
        success: true,
        data: restaurant,
        message: 'Restaurant updated successfully'
      })
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @route   DELETE /api/restaurants/:id
 * @desc    Delete restaurant
 * @access  Public
 */
router.delete('/:id',
  validate({
    params: [
      { field: 'id', required: true }
    ]
  }),
  async (req, res, next) => {
    try {
      const { id } = req.params

      // Check if restaurant exists
      const existingRestaurant = await prisma.restaurant.findUnique({
        where: { id }
      })

      if (!existingRestaurant) {
        return res.status(404).json({
          success: false,
          message: 'Restaurant not found'
        })
      }

      await prisma.restaurant.delete({
        where: { id }
      })

      res.status(200).json({
        success: true,
        message: 'Restaurant deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  }
)

export { router as restaurantRoutes }