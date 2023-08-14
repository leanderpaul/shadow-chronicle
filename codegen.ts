import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8080/graphql/chronicle',
  documents: 'src/app/graphql/operations/**.gql',
  generates: {
    'src/app/graphql/operations.graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular'],
      config: {
        addExplicitOverride: true,
        namingConvention: { enumValues: 'keep' },
        skipTypename: true,
        useTypeImports: true,
      },
    },
  },
};

export default config;
