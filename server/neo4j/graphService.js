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

// Generalized method to create nodes dynamically
const createNode = async (label, properties) => {
  const query = `CREATE (n:${label} $properties) RETURN n`;
  const [result] = await executeQuery(query, { properties });
  return result?.n?.properties || null;
};

// Generalized method to create relationships between nodes
const createRelationship = async (startNode, endNode, relationshipType, params = {}) => {
  const query = `
    MATCH (start:${startNode.label} {${startNode.key}: $startValue}),
          (end:${endNode.label} {${endNode.key}: $endValue})
    CREATE (start)-[:${relationshipType}]->(end)
  `;
  await executeQuery(query, {
    startValue: startNode.value,
    endValue: endNode.value,
    ...params,
  });
};

const graphService = {
  createIngredient: async ({ name }) => {
    return await createNode('Ingredient', { name });
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

  // Reusable executeQuery method for custom queries
  executeQuery,
    // New methods for creating relationships and nodes dynamically
  createRelationship,
  createNode,

  close: async () => {
    try {
      console.log('Closing Neo4j driver...');
      await driver.close();
    } catch (error) {
      console.error('Error closing Neo4j driver:', error);
    }
  },
};

export default graphService;
