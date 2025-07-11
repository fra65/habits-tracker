# Habits Tracker
## **Author:** Francesco Villani

--- 

// Description

---

### API

- **Global prefix:** /api

#### Special API Routes

- **/api/auth:** Default configuration route API for AuthJS
- **/api/email/send:** API to send email
- **/api/test-connection:** API to check db connection
- **/api/admin/:** Under this URI all function for admin (all users, all profiles, ecc...) while in normal api route is access for users, who can access just to them profile (but this is not included in URL params)


---

// Scaffolding

- ./src

    - ./src/app
    - ./src/app/api --> public API
    - ./src/app/dirname --> pages
    - ./src/app/page.tsx --> entry point

    - ./src/components --> global components
    - ./src/emails --> email templates
    - ./src/generated --> prisma compiled elements
    - ./src/lib --> public external libraries (e.g. auth.ts to export AuthJS config)

    - ./src/modules --> modules which interact both with frontend and backend/db (e.g. profile to table 'user_profile')
        - ./src/modules/profile/api --> API client side which links modules components (e.g. forms) with public API (e.g. POST /api/profiles)
        - ./src/modules/profile/components --> local components about profile (forms, info container)
        - ./src/modules/profile/hooks --> local hooks about profile (useProfile)
        - ./src/modules/profile/schema --> validation schema with zod about profile (ProfileInput, ProfileOutput, ProfileUpdateInput, ProfileUpdateOutput)
        - ./src/modules/profile/services --> profile.service.ts --> this is the real backend file, which is called in public API methods and which interacts whith DB by using Prisma
        - ./src/modules/profile/utils --> local utils functions about profile (ageCalc)

    (THIS IS THE SAME STRUCT FOR ALL MODULES)

    - ./src/types --> global types (next-auth.d.ts using AuthJS)
    - ./src/utils --> global utilities (roleEnumHelper, prismaErrorHelper)

    - ./src/middleware.ts --> nextJS middleware file --> this file protect route server-side (before page it's loaded)
    - ./src/prisma.ts --> global Prisma Client initialization

---

// Technologies




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
