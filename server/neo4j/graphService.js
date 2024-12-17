import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const executeQuery = async (query, params = {}) => {
  const session = driver.session();
  try {
    const result = await session.run(query, params);
    return result.records.map(record => record.toObject());
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await session.close();
  }
};

const graphService = {
  createIngredient: async ({ name }) => {
    const query = `CREATE (i:Ingredient {name: $name}) RETURN i`;
    const [result] = await executeQuery(query, { name });
    return result?.i?.properties || null;
  },

  getRecipeById: async (id) => {
    const query = `
      MATCH (r:Recipe)-[:HAS_INGREDIENT]->(i:Ingredient)
      WHERE ID(r) = $id
      RETURN r, collect(i.name) AS ingredients
    `;
    const [result] = await executeQuery(query, { id: parseInt(id, 10) });
    if (!result) return null;

    return {
      recipe: result.r.properties,
      ingredients: result.ingredients,
    };
  },

  getAllIngredientsForRecipe: async (id) => {
    const query = `
      MATCH (r:Recipe)-[:HAS_INGREDIENT]->(i:Ingredient)
      WHERE ID(r) = $id
      RETURN collect(i.name) AS ingredients
    `;
    const [result] = await executeQuery(query, { id: parseInt(id, 10) });
    return result?.ingredients || [];
  },
  executeQuery,
};

export default graphService;
