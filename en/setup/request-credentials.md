---
title: Request Credentials
description: How to request credentials to connect to CIP/INOV-Norte's server.
---

# Request Credentials

You do not need to self-host the Gami API and AI infrastructure of GamiBot. If you wish to use the services provided by CIP/INOV-Norte, please send us a request for credentials to our email: [cip@sc.ipp.pt](mailto:cip@sc.ipp.pt).

Please include the following information in your request:

- Your name
- Your email address
- Your institution name
- Your institution URL
- The URL of the Moodle instance where you want to use GamiBot
- A Moodle Web Service token (see [Moodle Web Service Token](#moodle-web-service-token)) with the following permissions:
  - moodle/course:view
- How many courses will use GamiBot
- How many users will use GamiBot (approximately)

We will respond to your request as soon as possible.

---

## Moodle Web Service Token

To create a Moodle Web Service token, follow these steps:

1. Log in to your Moodle site as an administrator.
2. Navigate to **Site administration** > **Server** > **Web services** > **Manage tokens**.
3. Click on **Create token**.
4. Fill in the form with the following information:
   - **Name**: Enter a name for the token.
   - **User**: Select the user that will be used to authenticate with the Moodle Web Service. It is recommended to create a new user for this purpose and grant it the permissions to view courses to be able to ingest the course content.
   - **IP restriction**: Leave this field empty. We will provide the IP address of the server after the request for credentials is approved.
   - **Valid until**: Select the date until which the token will be valid. It is recommended to disable this option.
5. Click on **Save changes**.
6. Copy the generated token and save it in a secure place. Then, send it to us in your request for credentials.
