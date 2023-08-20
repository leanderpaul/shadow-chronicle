import type { CodegenConfig } from '@graphql-codegen/cli';

const GRAPHQL_BASE_DIR = 'src/app/shared/services/graphql';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8080/graphql/chronicle',
  documents: `${GRAPHQL_BASE_DIR}/**/*.gql`,
  generates: {
    [`${GRAPHQL_BASE_DIR}/graphql.generated.ts`]: {
      plugins: ['typescript', 'typescript-operations', 'scripts/codegen.plugin.js'],
      config: {
        namingConvention: { enumValues: 'keep' },
        skipTypename: true,
        useTypeImports: true,
      },
    },
  },
};

export default config;
