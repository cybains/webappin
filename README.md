# webappin

## Environment variables

Configure the following variables for the Next.js client (e.g., in `client/.env.local` for local development or in your deployment platform settings):

| Variable | Required | Description |
| --- | --- | --- |
| `RESEND_API_KEY` | ✅ | API key used by the contact form endpoint to authenticate with Resend. |
| `RESEND_FROM_ADDRESS` | ⛔️ (optional) | Verified sender email address used for outbound messages. Defaults to `Sufoniq <no-reply@sufoniq.com>`. |

After setting or changing these values, restart the Next.js server so the environment is reloaded.
 
