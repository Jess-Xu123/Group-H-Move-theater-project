require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
})

app.use(cors())
app.use(express.json())

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')

    res.json({
      ok: true,
      dbTime: result.rows[0].now
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      ok: false,
      message: 'Database connection failed'
    })
  }
})

app.get('/api/movies/now-showing', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        movie_id,
        title,
        description,
        genre,
        duration_min,
        age_rating,
        release_date,
        status
      FROM movies
      WHERE status = 'now_showing'
      ORDER BY title
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch now showing movies'
    })
  }
})

app.get('/api/movies/upcoming', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        movie_id,
        title,
        description,
        genre,
        duration_min,
        age_rating,
        release_date,
        status
      FROM movies
      WHERE status = 'upcoming'
      ORDER BY release_date
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch upcoming movies'
    })
  }
})

app.get('/api/movies/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        movie_id,
        title,
        description,
        genre,
        duration_min,
        age_rating,
        release_date,
        status
      FROM movies
      WHERE movie_id = $1
    `, [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Movie not found'
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch movie details'
    })
  }
})

app.get('/api/movies/:id/showtimes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.showtime_id,
        s.show_date,
        s.show_time,
        s.format,
        s.language,
        h.name AS hall_name
      FROM showtimes s
      JOIN halls h
        ON h.hall_id = s.hall_id
      WHERE s.movie_id = $1
      ORDER BY s.show_date, s.show_time
    `, [req.params.id])

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch movie showtimes'
    })
  }
})

app.post('/api/bookings', async (req, res) => {
  try {
    const {
      showtime_id,
      customer_name,
      customer_email,
      ticket_count
    } = req.body

    const parsedShowtimeId = Number(showtime_id)
    const parsedTicketCount = Number(ticket_count)
    const trimmedName = customer_name ? customer_name.trim() : ''
    const trimmedEmail = customer_email ? customer_email.trim() : ''

    if (
      showtime_id === undefined ||
      showtime_id === null ||
      trimmedEmail === '' ||
      ticket_count === undefined ||
      ticket_count === null
    ) {
      return res.status(400).json({
        message: 'showtime_id, customer_email and ticket_count are required'
      })
    }

    if (!Number.isInteger(parsedShowtimeId) || parsedShowtimeId <= 0) {
      return res.status(400).json({
        message: 'showtime_id must be a positive integer'
      })
    }

    if (!Number.isInteger(parsedTicketCount) || parsedTicketCount <= 0) {
      return res.status(400).json({
        message: 'ticket_count must be a positive integer'
      })
    }

    const showtimeResult = await pool.query(
      `
        SELECT showtime_id
        FROM public.showtimes
        WHERE showtime_id = $1
      `,
      [parsedShowtimeId]
    )

    if (showtimeResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Showtime not found'
      })
    }

    const insertResult = await pool.query(
      `
        INSERT INTO public.bookings (
          showtime_id,
          customer_name,
          customer_email,
          ticket_count
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          booking_id,
          showtime_id,
          customer_name,
          customer_email,
          ticket_count,
          status,
          created_at
      `,
      [
        parsedShowtimeId,
        trimmedName === '' ? null : trimmedName,
        trimmedEmail,
        parsedTicketCount
      ]
    )

    res.status(201).json({
      message: 'Booking created successfully',
      booking: insertResult.rows[0]
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to create booking'
    })
  }
})

app.get('/api/foods', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        food_id,
        name,
        description,
        price,
        category
      FROM food_items
      ORDER BY name
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch food items'
    })
  }
})

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})