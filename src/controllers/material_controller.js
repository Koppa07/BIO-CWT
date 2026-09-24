const pool = require('../config/db');

exports.getMaterials = async (req, res) => {
    try {
        const materialsResult = await pool.query(`
            SELECT
                id,
                title,
                image_url,
                created_at
            FROM materials
            ORDER BY id
        `);

        const featuresResult = await pool.query(`
            SELECT
                id,
                material_id,
                feature,
                type,
                icon,
                created_at
            FROM material_features
            ORDER BY id
        `);

        const materials = materialsResult.rows;
        const features = featuresResult.rows;

        const result = materials.map((material) => {
            return {
                ...material,

                features: features.filter(
                    (feature) =>
                        feature.material_id === material.id
                )
            };
        });

        res.status(200).json(result);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to get materials'
        });
    }
};

exports.getMaterialById = async (req, res) => {
    const { id } = req.params;

    try {
        const materialResult = await pool.query(
            `
            SELECT
                id,
                title,
                image_url,
                created_at
            FROM materials
            WHERE id = $1
            `,
            [id]
        );

        if (materialResult.rows.length === 0) {
            return res.status(404).json({
                error: 'Material not found'
            });
        }

        const featuresResult = await pool.query(
            `
            SELECT
                id,
                material_id,
                feature,
                type,
                icon,
                created_at
            FROM material_features
            WHERE material_id = $1
            ORDER BY id
            `,
            [id]
        );

        const material = {
            ...materialResult.rows[0],
            features: featuresResult.rows
        };

        res.status(200).json(material);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to get material'
        });
    }
};


exports.createMaterial = async (req, res) => {
    const { title, image_url } = req.body;

    if (!title) {
        return res.status(400).json({
            error: 'Title is required'
        });
    }

    try {
        const result = await pool.query(
            `
            INSERT INTO materials
                (title, image_url)
            VALUES
                ($1, $2)
            RETURNING *
            `,
            [title, image_url || null]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to create material'
        });
    }
};

exports.updateMaterial = async (req, res) => {
    const { id } = req.params;
    const { title, image_url } = req.body;

    if (!title) {
        return res.status(400).json({
            error: 'Title is required'
        });
    }

    try {
        const result = await pool.query(
            `
            UPDATE materials
            SET
                title = $1,
                image_url = $2
            WHERE id = $3
            RETURNING *
            `,
            [title, image_url || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Material not found'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to update material'
        });
    }
};

exports.deleteMaterial = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `
            DELETE FROM materials
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Material not found'
            });
        }

        res.status(204).send();

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to delete material'
        });
    }
};

exports.createMaterialFeature = async (req, res) => {
    const { id } = req.params;

    const {
        feature,
        type,
        icon
    } = req.body;

    if (!feature || !type || !icon) {
        return res.status(400).json({
            error: 'Feature, type and icon are required'
        });
    }

    if (
        type !== 'advantage' &&
        type !== 'disadvantage'
    ) {
        return res.status(400).json({
            error: 'Type must be advantage or disadvantage'
        });
    }

    try {
        const materialResult = await pool.query(
            `
            SELECT id
            FROM materials
            WHERE id = $1
            `,
            [id]
        );

        if (materialResult.rows.length === 0) {
            return res.status(404).json({
                error: 'Material not found'
            });
        }


        const result = await pool.query(
            `
            INSERT INTO material_features
                (
                    material_id,
                    feature,
                    type,
                    icon
                )
            VALUES
                ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                id,
                feature,
                type,
                icon
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to create material feature'
        });
    }
};

exports.updateMaterialFeature = async (req, res) => {
    const { id } = req.params;

    const {
        feature,
        type,
        icon
    } = req.body;

    if (!feature || !type || !icon) {
        return res.status(400).json({
            error: 'Feature, type and icon are required'
        });
    }

    if (
        type !== 'advantage' &&
        type !== 'disadvantage'
    ) {
        return res.status(400).json({
            error: 'Type must be advantage or disadvantage'
        });
    }

    try {
        const result = await pool.query(
            `
            UPDATE material_features
            SET
                feature = $1,
                type = $2,
                icon = $3
            WHERE id = $4
            RETURNING *
            `,
            [
                feature,
                type,
                icon,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Material feature not found'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to update material feature'
        });
    }
};

exports.deleteMaterialFeature = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `
            DELETE FROM material_features
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Material feature not found'
            });
        }

        res.status(204).send();

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to delete material feature'
        });
    }
};
