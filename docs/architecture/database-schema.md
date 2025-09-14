# Database Schema

As per the PRD, the only data persistence required for the MVP is for logging failed generation requests.

## MongoDB Collection: `generation_failures`

```json
{
  "_id": "ObjectId",
  "timestamp": "ISODate",
  "userInput": "string",
  "errorSource": "string",
  "errorMessage": "string",
  "llmResponseRaw": "object"
}
```
