const pool = require('../config/db');

exports.getConsultaionRequests = async (req, res) => {
  try {
    const result = await pool.query(
            'SELECT * FROM consultation_requests ORDER BY created_at DESC'
        );

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createConsultaionRequest = async (req, res) => {
  const { name, phone, question } = req.body;
  if (!name || !phone || !question) {
        return res.status(400).json({
            error: 'Name, phone and question are required'
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO consultation_requests
            (name, phone, question)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [name, phone, question]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to create consultation request'
        });
    }
};

exports.updateConsultaionRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
        return res.status(400).json({
            error: 'Status is required'
        });
    }

    try {
        const result = await pool.query(
            `UPDATE consultation_requests
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Consultation request not found'
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to update consultation request'
        });
    }
};