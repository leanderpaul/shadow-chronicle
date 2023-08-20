/**
 * Importing npm packages.
 */
const { concatAST, Kind } = require('graphql');
const { ClientSideBaseVisitor } = require('@graphql-codegen/visitor-plugin-common');
const { oldVisit } = require('@graphql-codegen/plugin-helpers');

/**
 * Importing user defined packages.
 */

/**
 * Declaring the constants.
 */

const content = `
function gql(literals: string | readonly string[]): string {
  if (typeof literals === 'string') literals = [literals];
  const query = literals[0] ?? '';
  return query.replace(/([\\s,]|#[^\\n\\r]+)+/g, ' ').trim(); 
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface GraphQLOperation<TData, TVariables> {
  type: 'Query' | 'Mutation';
  name?: string;
  query: string;
}

export interface GraphQLError {
  message: string;
  locations: { line: number; column: number }[];
  path: string[];
  extensions?: Record<string, unknown>;
}
`;

class Visitor extends ClientSideBaseVisitor {
  buildOperation(node, documentVariableName, operationType, operationResultType, operationVariablesTypes) {
    const name = documentVariableName.replace(/Document$/, 'Operation');
    const operationName = node.name?.value ?? 'null';
    const type = `GraphQLOperation<${operationResultType}, ${operationVariablesTypes}>`;
    return `\nexport const ${name}: ${type} = { type: '${operationType}', name: '${operationName}', query: ${documentVariableName} }\n`;
  }
}

/**
 *
 * @param {import('graphql').GraphQLSchema} schema
 * @param {import('@graphql-codegen/plugin-helpers').Types.DocumentFile[]} documents
 * @param {*} config
 */
function plugin(schema, documents, config) {
  const asts = concatAST(documents.map(v => v.document));
  const operations = asts.definitions.filter(d => d.kind === Kind.OPERATION_DEFINITION);
  const fragments = asts.definitions
    .filter(d => d.kind === Kind.FRAGMENT_DEFINITION)
    .map(fragmentDef => ({ node: fragmentDef, name: fragmentDef.name.value, onType: fragmentDef.typeCondition.name.value, isExternal: false }));
  const visitor = new Visitor(schema, fragments, operations, config, documents);
  const visitorResult = oldVisit(asts, { leave: visitor });
  const operationDefinitions = visitorResult.definitions.map(d => d.substring(7));
  return { prepend: [content], content: operationDefinitions.join('\n') };
}

module.exports = { plugin };
