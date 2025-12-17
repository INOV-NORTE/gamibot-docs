---
title: Moodle Plugin
description: Architecture and implementation of the GamiBot Moodle plugin for integration.
---

# Moodle Plugin Architecture

The GamiBot platform integrates with Moodle through a custom local plugin that handles webhook dispatch, event observation, and chat integration.

---

## Plugin: `local_gamibot_manager`

### Overview

| Property | Value |
|----------|-------|
| **Type** | Local plugin |
| **Location** | `local/gamibot_manager/` |
| **Purpose** | Webhook dispatcher for file events |

---

## Event Observers

The plugin registers observers for Moodle events to trigger AI processing.

### File Upload Observer

```php
// File: local/gamibot_manager/classes/observers.php

class event_observers {
    public static function file_uploaded(\core\event\content_uploaded $event) {
        $data = $event->get_data();
        $context = context::instance_by_id($data['contextid']);
        $course_id = $context->get_course_context()->instanceid;
        
        $webhook_payload = [
            'course_id' => $course_id,
            'module_id' => $data['objectid'],
            'filename' => $data['other']['filename'],
            'file_url' => $this->get_file_download_url($data),
            'mimetype' => $data['other']['mimetype'],
            'timestamp' => time()
        ];
        
        // Dispatch to LangFlow ingestion endpoint
        $this->dispatch_webhook('ingestion', $webhook_payload);
    }
}
```

### Registering Observers

```php
// File: local/gamibot_manager/db/events.php

$observers = [
    [
        'eventname' => '\core\event\content_uploaded',
        'callback' => 'local_gamibot_manager\event_observers::file_uploaded',
    ],
];
```

---

## Chat Integration Points

### JavaScript Binding

Custom JavaScript captures student messages from the Moodle chat module:

```javascript
// Capture chat input and send to GamiBot API
document.getElementById('chat-input').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = e.target.querySelector('input').value;
    const response = await fetch('/local/gamibot_manager/api/chat.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            course_id: COURSE_ID,
            user_id: USER_ID,
            message: message
        })
    });
    
    const data = await response.json();
    displayResponse(data.reply);
});
```

### LLM Agent Endpoint

RESTful API accepting chat payloads:

```
POST /local/gamibot_manager/api/chat.php
Content-Type: application/json

{
    "course_id": 123,
    "user_id": 456,
    "message": "Summarize topic: Neural Networks"
}
```

### Response Callback

Options for real-time responses:

| Method | Use Case |
|--------|----------|
| **WebSocket** | Real-time streaming responses |
| **Polling** | Simpler implementation, higher latency |
| **Server-Sent Events** | One-way real-time updates |

---

## Plugin Settings

Administrators can configure the plugin via Moodle settings:

```php
// File: local/gamibot_manager/settings.php

$settings->add(new admin_setting_configtext(
    'local_gamibot_manager/api_endpoint',
    get_string('api_endpoint', 'local_gamibot_manager'),
    get_string('api_endpoint_desc', 'local_gamibot_manager'),
    'https://langflow.example.com/api'
));

$settings->add(new admin_setting_configpasswordunmask(
    'local_gamibot_manager/api_key',
    get_string('api_key', 'local_gamibot_manager'),
    get_string('api_key_desc', 'local_gamibot_manager'),
    ''
));

$settings->add(new admin_setting_configpasswordunmask(
    'local_gamibot_manager/webhook_secret',
    get_string('webhook_secret', 'local_gamibot_manager'),
    get_string('webhook_secret_desc', 'local_gamibot_manager'),
    ''
));
```

---

## Webhook Security

All webhooks include HMAC signature validation:

```php
function validate_webhook_signature($payload, $signature) {
    $secret = get_config('local_gamibot_manager', 'webhook_secret');
    $expected = hash_hmac('sha256', $payload, $secret);
    
    return hash_equals($expected, $signature);
}
```

---

## API Authentication

The plugin uses Moodle's session tokens for API authentication:

```php
function require_api_authentication() {
    require_sesskey();
    require_login();
    
    $context = context_course::instance($course_id);
    require_capability('local/gamibot_manager:use_chat', $context);
}
```

---

## Capabilities

```php
// File: local/gamibot_manager/db/access.php

$capabilities = [
    'local/gamibot_manager:use_chat' => [
        'captype' => 'read',
        'contextlevel' => CONTEXT_COURSE,
        'archetypes' => [
            'student' => CAP_ALLOW,
            'teacher' => CAP_ALLOW,
            'editingteacher' => CAP_ALLOW,
            'manager' => CAP_ALLOW,
        ]
    ],
    'local/gamibot_manager:manage_ingestion' => [
        'captype' => 'write',
        'contextlevel' => CONTEXT_COURSE,
        'archetypes' => [
            'editingteacher' => CAP_ALLOW,
            'manager' => CAP_ALLOW,
        ]
    ],
];
```

---

## Next Steps

- [Database Schema](/en/integration/database) - Extended tables
- [LangFlow Workflows](/en/integration/langflow) - Workflow configuration
