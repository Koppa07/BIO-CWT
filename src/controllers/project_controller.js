const pool = require('../config/db');

exports.getProjects = async (req, res) => {
  try {
    const result = await pool.query(
            'SELECT * FROM projects ORDER BY created_at DESC'
        );

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProject = async (req, res) => {
  const { title, description, image_url, material_id } = req.body;
  if (!title) {
        return res.status(400).json({
            error: 'Title is required'
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO projects
            (title, description, image_url, material_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [title, description, image_url, material_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to create project'
        });
    }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, image_url, material_id } = req.body;
    try {
        const result = await pool.query(
            `UPDATE projects
                SET title = $1, description = $2, image_url = $3, material_id = $4
                WHERE id = $5
                RETURNING *`,
            [title, description, image_url, material_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to update project'
        });
    }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
    try {
        const result = await pool.query(
            `DELETE from projects
                WHERE id = $1
                RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }

        res.status(204).json(result.rows[0]);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to delete project'
        });
    }
};