<a href="https://jadebook.app"><img width="100%" src="https://9vszty501l7eweyc.public.blob.vercel-storage.com/github-cover-O31pMgYTFSd171nxNjsyEFylQdrKTR.png" alt="Jadebook - Journal Platform" /></a>
<br />
<br />

Jadebook is a journal platform, while we do have a proper SaaS platform, we wanted to commit to our mission about making mental health more accessible and private. That why we created an open-source version that lets you bring your own database and hosted the journal platform itself. 

> [!IMPORTANT]
> This is currently in `Beta` and may have bugs (although this should be rare). There also some features in the process of being developed.

<h3>Benefits</h3>
<ul>
  <li>Everything is held in Supabase, including auth, db and storage</li>
  <li>Get search, tags, covers, icons, transciption and uploading assets</li>
  <li>Mobile-responsive and available as a Progressive Web App (PWA)</li>
  <li>Comes with OpenAPI spec in-case you want to build something on top</li>
  <li>Uses NextJS so the code is fairly accessible and easy to work with</li>
  <li>Export/Import to and from the SaaS Jadebook platform</li>
  <li>You can one-click deploy it on Vercel for free</li>
  <li>Rich-text editor for entries</li>
</ul>

## Quickstart

You can click the button below. It'll take you through the steps to setting up Jadebook on Vercel and include the Supabase integration. The deployment should take around 3-5 minutes to complete.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftanvirbhachu%2Fjadebook-oss&&env=NEXT_PUBLIC_AUTH_IMAGE_URL,USER_EMAIL&envDescription=Auth%20image%20cannot%20be%20changed%20in%20app%2C%20this%20is%20where%20you%20can%20choose%20what%20to%20show%20for%20the%20auth%20layout.%20User%20email%20is%20the%20email%20you%20plan%20to%20use%20for%20your%20account%2C%20it%20prevents%20abuse%20from%20random%20people%20signing%20up.&project-name=jadebook-oss&repository-name=jadebook-oss&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6&external-id=https%3A%2F%2Fgithub.com%2Ftanvirbhachu%2Fjadebook-oss%2Ftree%2Fmain&root-directory=apps/platform)

> [!NOTE]
> Do not turn off the option to seed the database when setting up Supabase. This is required to step up the correct tables and RLS policies within Supabase.

You'll notice that you need to enter the email you'll be using for your account. Jadebook OSS is not intended or setup to be used for multiple people, thus to stop random people from signing up and using your resources, we only allow 1 email to create the account. You can change the email later.

### Environment Variables

- `USER_EMAIL` refers to the email that should be allowed to create the account. By default, only one person is allowed to sign-up to prevent abuse
- `NEXT_PUBLIC_AUTH_IMAGE_URL` refers to the image shown on auth screens such the sign-in and sign-up. Any image url is good, we recommend getting one from [Unsplash](https://unsplash.com/)


## Theming

You can setup themes, letting you change the look and feel of the entire platform in-app. 

- By default, we have around 24 themes for you to choose from
- Each theme has a different style for light and dark mode
- You can also change the font, letter spacing, spacing and rounding
- You can change data layout (i.e. list, grid, monthly view)
- Turn on/off sidebar features like the goals and search

## Goals

Jadebook has a unique view on goals. Rather than a todo list, we have a main generic goal (like `Make money`) and then an end date. You can then create mini journal entries as you experiment with different things, explore and basically work towards the direction of the goal. 

This is mainly for long-term (3 months plus) goals that are difficult quantify.

## Security

By default, we have included the following precautions:

- Supabase (DB) is never accessed on the client and is only accessible throught the API
- The API requires an user's session token which is periodically refreshed
- The API also handles CORS to deny unknown hosts
- Tables have an RLS policy to only allow Anon and Authenticated roles to access data
- Assests are loaded using signed-URLS and expire after a given time
- We only allow 1 email to sign-up to stop abuse from random people
- The Vercel Firewall (if hosting on Vercel) should also handle malicious traffic and DDOS protection
- We gather absolutely no telemetry

However, there are still some things to understand:

- We do not encrypt the journal entries. The main reason to allow full-text search to work.
- We do not handle rate-limiting
- We are not responsible for anything that happens (since the whole point of this is that you handle everything)

## Other Features

- Auth is setup by default, including password reset and email verification
- You can export or import all your content in JSON format
- Unlimited character count (although you should try not to beyond 20K)
- You can extend the TipTap v3 editor if you wish (however this might cause compatibility issues)
- Streak tracking

## Roadmap

These are features that we definitely want in the open-source version but are missing:

1. Upload images for covers and profile
2. Extending Prompts
3. Export individual entries and goals
4. Basic statistics

## Thanks and Attributions

We'd like to thank the following because they have helped make Jadebook really good:

- [shadcn/studio](https://github.com/themeselection/shadcn-studio) -> Our theming is mostly based on the implementation in shadcn/studio
- [Supabase](https://supabase.com/) - Supaase allows Jadebook to be possible and so easy to setup. Big thumbs up to them
- [Coolshapes](https://coolshap.es/) - These are the nice abstract shapes you see in Jadebook. Absolute amazing and adds so much life to the app
- [Hono Open API Starter](https://github.com/w3cj/hono-open-api-starter) - The way we setup our backend to use Hono and OpenAPI is heavily inspired by this starter app. Great resource.
- [Pawel Czerwinski](https://unsplash.com/@pawel_czerwinski) - We use his image from Unsplash for alot of Jadebook stuff. We love his images btw.

