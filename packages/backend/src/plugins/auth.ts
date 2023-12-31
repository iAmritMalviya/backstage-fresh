import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { stringifyEntityRef, DEFAULT_NAMESPACE } from '@backstage/catalog-model';

export default async function createPlugin(env:PluginEnvironment): Promise<Router> {

  

  return await createRouter({
    ...env,

    providerFactories: {
      google: providers.google.create({
        signIn: {
          resolver: async ({profile}, ctx) => {
            console.log("profile", profile);
            console.log('ctx', ctx)

            const [localPart, domain] = profile.email.split('@') || []

            console.log(localPart, domain)
            
            const userEntity = stringifyEntityRef({
              kind: 'user',
              name: localPart,
              namespace: DEFAULT_NAMESPACE
            });

            return ctx.issueToken({
              claims: {
                sub: userEntity,
                ent: [userEntity]
              }
            })
          }
        }
      })
    }
  })
}





// export default async function createPlugin(
//   env: PluginEnvironment,
// ): Promise<Router> {

//   console.log(env)
//   return await createRouter({
//     logger: env.logger,
//     config: env.config,
//     database: env.database,
//     discovery: env.discovery,
//     tokenManager: env.tokenManager,
//     providerFactories: {
//       ...defaultAuthProviderFactories,

//       // This replaces the default GitHub auth provider with a customized one.
//       // The `signIn` option enables sign-in for this provider, using the
//       // identity resolution logic that's provided in the `resolver` callback.
//       //
//       // This particular resolver makes all users share a single "guest" identity.
//       // It should only be used for testing and trying out Backstage.
//       //
//       // If you want to use a production ready resolver you can switch to
//       // the one that is commented out below, it looks up a user entity in the
//       // catalog using the GitHub username of the authenticated user.
//       // That resolver requires you to have user entities populated in the catalog,
//       // for example using https://backstage.io/docs/integrations/github/org
//       //
//       // There are other resolvers to choose from, and you can also create
//       // your own, see the auth documentation for more details:
//       //
//       //   https://backstage.io/docs/auth/identity-resolver
//       google: providers.google.create({
//         signIn: {
//           resolver: async (info, ctx) => {
//             const {
//               profile: { email },
//             } = info;
//             if (!email) {
//               throw new Error('User profile contained no email');
//             }
//             const [name] = email.split('@')
//             return ctx.signInWithCatalogUser({
//               entityRef: {name},
//             })
//           }
//           // resolver: providers.github.resolvers.usernameMatchingUserEntityName(),
//         },
//       }),
//     },
//   });
// }
